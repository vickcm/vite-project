<template>
  <div class="flex-1">
    <div class="bg-gradient-to-b from-transparent to-gray-100 p-8 rounded-lg">
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-1/2">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">{{ title }}</h2>
          <p class="mt-3 max-w-3xl text-lg text-gray-500">{{ description }}</p>
          <div v-if="showButton">
            <router-link class="w-1/3 flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 mt-4" :to="link">{{ buttonText }}</router-link>
          </div>
        </div>
        <div class="w-full md:w-1/2 mt-4 md:mt-0 hidden md:block">
          <img :src="imageSrc" :alt="imageAlt" class="sm:mx-auto max-w-full">
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
 defineProps({
   
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      link: {
        type: String,
        default: null
      },
      buttonText: {
        type: String,
        default: null
      },
      imageSrc: {
        type: String,
        required: true
      },
      imageAlt: {
        type: String,
        required: true
      },
      showButton: {
        type: Boolean,
        default: true
      }
    }
  )
  </script>
  