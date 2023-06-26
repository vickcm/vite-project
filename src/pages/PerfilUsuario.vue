<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Inicia chat con el usuario seleccionado</h1>
    <CompLoading v-if="loading">Cargando datos...</CompLoading>
    <template v-else-if="user && user.id">
      <p class="mb-2">Email: {{ user.email }}</p>
      <template v-if="user.id">
        <router-link :to="`/usuario/${user.id}/chat`" class="text-blue-500 hover:text-blue-700 hover:underline">Iniciar
          chat privado</router-link>
      </template>
    </template>
    <p v-if="error" class="text-red-500">Error al obtener los datos del usuario.</p>
  </div>
</template>

<script setup>

import CompLoading from '../components/CompLoading.vue';
import { useRouter } from 'vue-router';
import { useUserProfile } from '../composition/useUserProfile.js';
import { ref } from 'vue';

const route = useRouter();
const error = ref('');

if (!route.currentRoute.value.params.id) {
  error.value = 'No se ha especificado el id del usuario.';
}

const { user, loading } = useUserProfile(route.currentRoute.value.params.id);
</script>
