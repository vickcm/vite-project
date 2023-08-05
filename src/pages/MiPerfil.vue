<template>
  <div class="flex flex-col justify-center min-h-screen sm:flex-row">
    <div class="w-full sm:w-1/2 bg-white rounded-lg shadow p-6 mb-4 sm:mb-0">
      <h1 class="text-3xl font-bold mb-6">Mi Perfil</h1>
      <div class="mb-4 flex items-center">
        <CompLabel class="mr-4 hidden">Mi Imagen</CompLabel>
        <CompImage :src="user.photoURL" />
      </div>
      <div class="mb-4">
        <CompLabel>Nombre de Usuario</CompLabel>
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
      <h1 class="text-3xl font-bold mb-6">Asesores disponibles para chatear</h1>
      <ul>
        <li v-for="admin in adminUsers" :key="admin.id">
          <span v-if="admin.displayName" class="ml-2 text-gray-500">{{ admin.displayName }}: </span>
          <a @click="startChatWithAdmin(admin)" class="cursor-pointer hover:underline text-blue-600 underline">
            <span>{{ admin.email }}</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="w-full bg-white rounded-lg shadow p-6 mt-4">
      <h1 class="text-3xl font-bold mb-6">Productos reservados</h1>
      <ul class="space-y-4">
        <li v-for="(product, index) in purchasedProducts" :key="product.id" :class="{
          'bg-blue-100': index % 2 === 0,
          'bg-gray-100': index % 2 !== 0
        }" class="border border-gray-200 p-4 rounded">
          <div>
            <span class="font-semibold">Producto reservado: </span>
            <span>{{ product.product.titulo }}</span>
          </div>
          <div>
            <span class="font-semibold">Fecha de reserva: </span>
            <span>{{ formatCreatedAt(product.createdAt) }}</span>
          </div>
          <div>
            <span class="font-semibold">Detalle reserva: </span>
            <span>{{ product.product.descripcion }}</span>
          </div>
          <div>
            <span class="font-semibold">Valor del producto: </span>
            <span>${{ product.product.precio }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CompLabel from "../components/CompLabel.vue";
import CompInput from "../components/CompInput.vue";
import CompImage from "../components/CompImage.vue";
import { getUsersByRole } from '../services/users.js';
import { getPurchasedProductsByUser } from '../services/product.js'; // Necesitarás el servicio correspondiente para obtener los productos comprados por el usuario
import { useRouter } from 'vue-router';
import useAuth from '../composition/useAuth.js';
import CompUserProfileForm from '../components/CompUserProfileForm.vue';

const router = useRouter();
const { user } = useAuth();

const adminUsers = ref([]);
const purchasedProducts = ref([]);

const loadAdminUsers = async () => {
  try {
    adminUsers.value = await getUsersByRole({ role: 'admin' });
  } catch (error) {
    console.error('Error al obtener los usuarios administradores:', error);
  }
};

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt.seconds * 1000);
  const formattedDate = date.toLocaleDateString();
  return formattedDate;
};
const loadPurchasedProducts = async () => {
  try {
    purchasedProducts.value = await getPurchasedProductsByUser(user.value.id);
  } catch (error) {
    console.error('Error al obtener los productos comprados por el usuario:', error);
  }
};

const startChatWithAdmin = (admin) => {
  router.push({ path: `/usuario/${admin.id}/chat` });
};

onMounted(async () => {
  await Promise.all([loadAdminUsers(), loadPurchasedProducts()]);
});

const handleEditUser = () => {
  watch(() => auth.user, (newUser) => {
    // Se ejecutará cada vez que cambie el objeto `user` en el módulo `auth`
    console.log('Datos del usuario actualizados:', newUser);

  });
};
</script>
