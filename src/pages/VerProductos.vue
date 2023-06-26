<template>
  <div class="container mx-auto">
    <h1 class="hidden"> Nuestros Servicios</h1>
    <CompBanner title="Nuestros servicios"
      description="Descubre nuestro servicio de mailing, una poderosa herramienta que te permite llegar directamente a tus clientes de manera efectiva y personalizada. Aprovecha esta poderosa estrategia de marketing para fortalecer tu presencia en línea, aumentar la fidelidad de tus clientes y potenciar el crecimiento de tu negocio."
      imageSrc="/img/enviodemails.png" imageAlt="Email Marketing" :showButton="false" />
    <hr class="my-8 border-t-2 border-gray-300" />

    <CompLoading v-if="initialLoading">Cargando...</CompLoading>

    <p class="mb-4 text-sm text-gray-700">Para poder reservar los productos es necesario haber iniciado la sesión.</p>


    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <li v-for="product in products" :key="product.id"
        class="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
        <div class="relative">
          <img v-if="product.img" :src="'/img/' + product.img" :alt="'Imagen de ' + product.titulo"
            class="h-52 object-cover" />
          <img v-else src="/img/default-image.jpg" alt="Imagen por defecto" class="h-52 object-cover" />
          <div class="absolute top-2 right-8 bg-white px-2 py-1 rounded font-semibold text-gray-800">
            {{ product.titulo }}
          </div>
        </div>
        <div class="p-4">
          <p class="text-gray-700 text-end">{{ product.descripcion }}</p>
          <p class="text-gray-900 text-end font-bold mt-2">${{ product.precio }}</p>
          <a v-if="user.email"
            :class="['bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded', { 'opacity-50': !user }]"
            :disabled="!user" @click="reserveProductHandler(product)">
            Reservar
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { getProducts, subscribeToProductChanges, reserveProduct } from '../services/product.js';
import CompLoading from '../components/CompLoading.vue';
import CompBanner from '../components/CompBanner.vue';
import useAuth from '../composition/useAuth.js';
import { notificationProvider } from "../symbols/symbols.js";
import { useRouter } from 'vue-router';

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);
const router = useRouter();


const initialLoading = ref(true);
const products = ref([]);
const { user } = useAuth();

const fetchProducts = async () => {
  products.value = await getProducts();
  initialLoading.value = false;
  console.log('products', products.value);
};

const subscribeToProductChange = () => {
  subscribeToProductChanges((newProducts) => {
    products.value = newProducts;
  });
};

const reserveProductHandler = async (product) => {
  clearFeedbackMessage();
  const productData = product;
  console.log('product', productData);

  console.log('user', user.value.id);


  const response = await reserveProduct(productData, user.value.id);
  setFeedbackMessage({
    type: 'success',
    message: '¡Gracias por reservar. Próximamente recibirás un mail con las indicaciones para activar el servicio!',
  });

  // Redirigir a la página de perfil
  router.push('/perfil');

  console.log('response', response);
};









onMounted(() => {
  fetchProducts();
  subscribeToProductChange();
});
</script>
