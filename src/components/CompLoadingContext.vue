<template>
    <template v-if="!loading">
      <slot />
    </template>
    <template v-else>
      <div class="flex items-center justify-center h-32">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
      </div>
    </template>
  </template>
  
  <script setup>
  
  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });
  </script>
  
  <style>
  .spinner-border {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border 0.75s linear infinite;
  }
  
  @keyframes spinner-border {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  
