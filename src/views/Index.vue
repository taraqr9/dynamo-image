<script setup>
import {db} from "@/firebase/init";
import {collection, updateDoc, doc, getDocs, query} from "firebase/firestore";
import {onMounted, reactive, ref} from "vue";
import LoadingAnimation from "../components/LoadingAnimation.vue";

const allImages = reactive([]);
const loading = ref(false);
const imageDetails = ref({
  image_name: "",
  image: "",
  resolution: ""
});

async function getImages() {
  loading.value = true;

  allImages.splice(0, allImages.length);

  const querySnap = await getDocs(query(collection(db, 'dimages')));
  await Promise.all(querySnap.docs.map(async (doc) => {
    allImages.push(doc);
  }));

  loading.value = false;
}

async function updateImage(image, event) {
  const updatedImageFile = event.target.files[0];
  const imageId = image.id;

  if (!updatedImageFile) {
    console.error('No file selected for update.');
    return;
  }

  if (!updatedImageFile.type.startsWith('image/')) {
    console.error('The selected file for update is not an image.');
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
        console.error("Error loading image:", error);
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
    console.log("Image updated successfully");
    await getImages();

    console.log("Image updated and data refreshed successfully!");
  } catch (error) {
    console.error("Error updating image or refreshing data:", error);
  }
}

onMounted(() => {
  getImages();
})
</script>

<template>
  <title>Dynamo Images</title>
  <div class="h-screen flex items-center justify-center bg-gray-400">
    <div class="w-1/2 p-8 bg-white rounded-xl shadow-2xl h-full">
      <div v-if="loading" class="absolute inset-0 z-50">
        <LoadingAnimation/>
      </div>

      <div class="flex justify-center">
        <h3 class="w-56 text-center text-2xl bg-sky-300 rounded-full p-3 text-white">Dynamo Images</h3>
      </div>

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
      <input type="file" @change="uploadImage">

    </div>
  </div>
</template>
