<script setup>
import {db} from "@/firebase/init";
import {addDoc, collection, deleteDoc, doc, getDocs, query} from "firebase/firestore";
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

  // Clear the allImages array by splicing it
  allImages.splice(0, allImages.length);

  const querySnap = await getDocs(query(collection(db, 'dimages')));
  await Promise.all(querySnap.docs.map(async (doc) => {
    allImages.push(doc);
  }));

  loading.value = false;
}

async function uploadImage(e) {
  // const image = e.target.files[0]; // if direct use upload image function then;
  const image = e;
  imageDetails.value.image_name = image.name;

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

    reader.readAsDataURL(image);
  });

  try {
    await imageResolutionPromise;

    const colRef = collection(db, 'dimages');

    await addDoc(colRef, imageDetails.value);

    console.log("Uploaded and created successfully!");
  } catch (error) {
    console.error("Error uploading image or creating document:", error);
  }
}

async function updateImage(image, event) {
  const imageRef = doc(db, 'dimages', image.id);
  await deleteDoc(imageRef)
      .then(() => {
        uploadImage(event.target.files[0]);
        console.log("Image update successfully from Firestore");
        getImages();
      })
      .catch((error) => {
        console.error("Error updating image from Firebase Storage:", error);
      });
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

      <div class="grid grid-cols-3 gap-3 mt-4">
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
