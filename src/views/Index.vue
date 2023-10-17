<script setup>
import {db} from "@/firebase/init";
import {collection, updateDoc, doc, getDocs, query} from "firebase/firestore";
import {onMounted, reactive, ref} from "vue";
import LoadingAnimation from "../components/LoadingAnimation.vue";
import {createToaster} from "@meforma/vue-toaster";

const toaster = createToaster({});
const allImages = reactive([]);
const loading = ref(false);
const imageDetails = ref({
  image_name: "",
  image: "",
  resolution: ""
});

async function getImages() {
  loading.value = true;

  allImages.splice(0);

  const querySnap = await getDocs(query(collection(db, 'dimages')));
  await Promise.all(querySnap.docs.map(async (doc) => {
    allImages.push(doc);
  }));

  loading.value = false;
}

async function updateImage(image, event) {
  console.log("image Id: ", image.id);
  console.log("image Name: ", image.data().image_name);
  loading.value = true;
  const updatedImageFile = event.target.files[0];
  const imageId = image.id;

  if (!updatedImageFile) {
    toaster.error('No file selected for update.');
    return;
  }

  if (!updatedImageFile.type.startsWith('image/')) {
    toaster.error('The selected file for update is not an image.');
    return;
  }

  imageDetails.value.image_name = updatedImageFile.name;

  const imageResolutionPromise = new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        imageDetails.value.resolution = `${img.width}x${img.height}`;
        imageDetails.value.image = event.target.result;

        resolve();
      };

      img.onerror = (error) => {
        toaster.error("Error loading image:", error);
        reject(error);
      };
    };

    reader.readAsDataURL(updatedImageFile);
  });

  try {
    await imageResolutionPromise;

    const imageRef = doc(db, 'dimages', imageId);

    await updateDoc(imageRef, {
      image_name: imageDetails.value.image_name,
      image: imageDetails.value.image,
      resolution: imageDetails.value.resolution,
    });
    await getImages();
    toaster.success("Image updated successfully");
  } catch (error) {
    toaster.error("Error updating image or refreshing data:", error);
  }
  loading.value = false;
}

onMounted(() => {
  getImages();
})
</script>

<template>
  <title>Dynamo Images</title>
  <div class="h-full flex items-center justify-center bg-gray-400">
    <div v-if="loading" class="absolute inset-0 z-50 w-full h-full">
      <LoadingAnimation/>
    </div>
    <div class="w-1/2 p-4 bg-white rounded-xl shadow-2xl h-full">


      <div class="flex justify-center m-2">
        <h3 class="w-56 text-center text-2xl bg-sky-300 rounded-full p-3 text-white">Dynamo Images</h3>
      </div>

<!--            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">-->
<!--              <div class="group relative"-->
<!--                   v-for="image in allImages"-->
<!--                   :key="image.id"-->
<!--              >-->
<!--                <img class="h-auto max-w-full rounded-lg" :src="image.data().image" :alt="image.data().image_name">-->
<!--                <div class="w-full absolute bottom-0 right-0 end-0 hidden group-hover:block">-->
<!--                  <label for="dropzone-file"-->
<!--                         class="flex flex-col opacity-80 w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">-->
<!--                    <div class="flex flex-col items-center justify-center pt-5 pb-6">-->
<!--                      <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"-->
<!--                           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">-->
<!--                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"-->
<!--                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>-->
<!--                      </svg>-->
<!--                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span-->
<!--                          class="font-semibold">Click to upload</span> or drag and drop</p>-->
<!--                      <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>-->
<!--                    </div>-->
<!--                    <input id="dropzone-file" type="file" @change="updateImage(image, $event)" class="hidden"/>-->
<!--                  </label>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->


      <div class="grid grid-cols-3 gap-8 mt-4">
        <div
            class="bg-gray-600 h-48 rounded-lg hover:bg-amber-200 flex items-center justify-center hover:shadow-md hover:shadow-blue-300"
            v-for="(image, index) in allImages"
            :key="index"
        >
          <div class="p-6">
            <img :src="image.data().image" :alt="image.data().image_name">

            <input @change="updateImage(image, $event)" class="mt-2 rounded-md w-28" type="file">
          </div>


        </div>
      </div>

    </div>
  </div>
</template>
