<script setup>
defineProps(['weatherDetails'])
</script>

<template>
  <div class="px-4 sm:px-0 flex justify-center">
    <h3 class="text-base font-semibold leading-7 text-gray-900 border-2 border-b-green-400 w-48 text-center rounded-2xl p-2 shadow-lg">Weather Details</h3>
  </div>
  <div class="mt-4 h-80 border-2 rounded-xl p-4">
    <div class="flex items-center justify-center">
      <img class="shadow-lg ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-2xl" :src="weatherDetails.data.current.condition.icon" alt="weather"/>
    </div>
    <dl class="divide-y divide-gray-100">
      <div class="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-900">Condition</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ weatherDetails.data.current.condition.text }}
        </dd>
      </div>
      <div class="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-900">Temperature</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ weatherDetails.data.current.temp_c }}
        </dd>
      </div>
      <div class="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-900">Day/Night</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ weatherDetails.data.current.is_day === 1 ? "Day" : "Night" }}
        </dd>
      </div>
      <div class="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-900">Cloud</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ weatherDetails.data.current.cloud }}
        </dd>
      </div>
      <div class="px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-900">Feels-like</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
          {{ weatherDetails.data.current.feelslike_c }}
        </dd>
      </div>
    </dl>
  </div>
</template>
