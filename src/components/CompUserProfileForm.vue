<template>
  <CompButton @click="showModal = true">Editar Perfil</CompButton>

  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75" v-if="showModal">
    <div class="bg-white w-full max-w-md p-6 mx-auto">
      <div class="flex justify-end">
        <button class="text-gray-500 hover:text-gray-700" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h1 class="text-3xl font-bold mb-4">Editar Perfil</h1>

      <form action="#" method="post" @submit.prevent="handleSubmit">
        <div class="mb-4">
          <CompLabel for="displayName">Nombre de usuario </CompLabel>
          <CompInput id="displayName" v-model="form.displayName" />
        </div>

        <div class="mb-4">
          <CompLabel for="photoURL">Foto de Perfil</CompLabel>
          <CompInput type="file" id="photoURL" @change="handleFile" />
        </div>

        <div v-if="form.photoURL !== null" class="mb-4">
          <p class="mb-1">Previsualización de la imagen</p>
          <img :src="form.photoURL" alt="">
        </div>

        <CompButton>Actualizar mis datos</CompButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';
import CompButton from "./CompButton.vue";
import CompInput from "./CompInput.vue";
import CompLabel from "./CompLabel.vue";
import CompImage from "./CompImage.vue";
import useAuth from '../composition/useAuth.js';
import { updateUserProfile } from "../services/auth.js";
import { notificationProvider } from "../symbols/symbols.js";

const { user } = useAuth();

const { form, loading, handleSubmit, handleFile } = useEditProfile(user);
const showModal = ref(false);
const formLoading = ref(false);
const emits = defineEmits(["userEdited"]);

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);

const closeModal = () => {
  showModal.value = false;
};


function useEditProfile(user) {
  const form = ref({
    displayName: user?.value?.displayName || '',
    photoURL: user?.value?.photoURL || null,
  });

  watch(user, newUser => {
    form.value.displayName = newUser.displayName;

  });

  const loading = ref(false);

  async function handleSubmit() {
    loading.value = true;

    try {
      // feedback.value.message = '';
      clearFeedbackMessage();

      await updateUserProfile(user.value.id, {
        ...form.value,
      });
      loading.value = false;
      form.value.photoURL = null;

      setFeedbackMessage({
        type: 'success',
        message: 'La información de tu perfil fue actualizada con éxito.',
      });
      showModal.value = false;
    } catch (err) {
      console.error('[MyProfile handleSubmit] ', err);

      setFeedbackMessage({
        type: 'error',
        message: 'Ocurrió un error inesperado al tratar de actualizar la información de tu perfil.',
      });
    }
  }

  async function handleFile(ev) {
    const file = ev.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      form.value.photoURL = reader.result;
    });

    reader.readAsDataURL(file);
  }

  return {
    form,
    loading,
    handleSubmit,
    handleFile,
  }
}
</script>

