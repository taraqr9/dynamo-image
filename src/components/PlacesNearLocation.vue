<script setup>
defineProps(['placesNearLocation'])
</script>

<template>
  <div>
    <div class="px-4 sm:px-0 flex justify-center">
      <h3 class="text-base font-semibold leading-7 text-gray-900 border-2 border-b-green-400 w-48 text-center rounded-2xl p-2 shadow-lg">Places Near By</h3>
    </div>
    <div class="mt-4 h-80  border-2 rounded-xl p-4">
      <dl class="divide-y divide-gray-100">
        <dt class="text-sm font-medium leading-6 text-gray-900">Name</dt>
        <div class="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" v-for="place in placesNearLocation.data.data"
             :key="place">
          <ul>
            <li class="mt-1 w-36 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {{ place.name }}
            </li>
          </ul>
          <ul>
            <li class="mt-1 ml-10 border-2 w-36 text-center rounded-2xl text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              Distance : {{ place.distance }}
            </li>
          </ul>
        </div>
      </dl>
    </div>
  </div>
</template>
