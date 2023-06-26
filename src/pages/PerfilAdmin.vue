<template>
  <div class="flex flex-col justify-center min-h-screen sm:flex-row">
    <div class="w-full sm:w-1/2 bg-white rounded-lg shadow p-6 mb-4 sm:mb-0">
      <h1 class="text-3xl font-bold mb-6">Perfil Administrador</h1>


      <div class="mb-4 flex items-center">
        <CompLabel class="mr-4 hidden">Mi Imagen</CompLabel>
        <CompImage :src="user.photoURL" />
      </div>
      <div class="mb-4">
        <CompLabel>Nombre del Administrador</CompLabel>
        <CompInput v-model="user.displayName" :disabled="true" />
      </div>
      <div class="mb-4">
        <CompLabel>Email</CompLabel>
        <CompInput v-model="user.email" :disabled="true" />
      </div>
      <div class="mb-4">
        <CompLabel>Rol</CompLabel>
        <CompInput v-model="user.role" :disabled="true" />
      </div>

      <CompUserProfileForm @userEdited="handleEditUser"></CompUserProfileForm>
    </div>
    <div class="w-full sm:w-1/2 bg-white rounded-lg shadow p-6">
      <h1 class="text-3xl font-bold mb-6">Clientes Disponibles para chatear</h1>
      <template v-if="isLoading">
        <!-- Mostrar el componente de loading mientras se cargan los productos -->
        <CompLoading class="my-4">Cargando</CompLoading>
      </template>

      <ul>
        <li v-for="rolUser in listUsers" :key="rolUser.id">
          <span> {{ rolUser.displayName || "" }}: </span>
          <a @click="startChatWithUsers(rolUser)" class="cursor-pointer hover:underline text-blue-600 underline">{{
            rolUser.email }}</a>
        </li>
      </ul>

    </div>
  </div>
</template>
    
     
 

<script setup>
import CompLabel from "../components/CompLabel.vue";
import CompInput from "../components/CompInput.vue";
import CompImage from "../components/CompImage.vue";
import CompLoading from "../components/CompLoading.vue";

import { ref, onMounted } from 'vue';
import { getUsersByRole } from '../services/users.js';
import useAuth from '../composition/useAuth.js';
import { useRouter } from 'vue-router';
import CompUserProfileForm from '../components/CompUserProfileForm.vue';
const router = useRouter();

const { user } = useAuth();
const isLoading = ref(false);


const defaultAvatar = '/img/defaultavatar.png';
const listUsers = ref([]);

const loadUsers = async () => {
  isLoading.value = true;

  try {
    listUsers.value = await getUsersByRole({ role: 'user' });
    isLoading.value = false;
  } catch (error) {
    console.error('Error al obtener los usuarios administradores:', error);
  }
};

const startChatWithUsers = (rolUser) => {
  router.push({
    path: `/usuario/${rolUser.id}`
  });
};

onMounted(() => {

  loadUsers();

});

const handleEditUser = () => {
  watch(() => auth.user, (newUser) => {
    // Se ejecutará cada vez que cambie el objeto `user` en el módulo `auth`
    console.log('Datos del usuario actualizados:', newUser);
    
  });

};

</script>
