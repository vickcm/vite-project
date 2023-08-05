<template>
  <div class="overflow-x-auto">
    <h1 class="text-2xl font-bold mb-4">Productos Vendidos</h1>
    <p class="text-gray-500">*Es posible que la visualización de la tabla en dispositivos pequeños se vea
      afectada. Se sugiere la vista en computadoras de escritorio o laptops.</p>

    <template v-if="isLoading">
      <!-- Mostrar el componente de loading mientras se cargan los productos -->
      <CompLoading class="my-4">Cargando</CompLoading>
    </template>
    <template v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 mt-4">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprador por:
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Venta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>

            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in soldProducts" :key="product.id" class="hover:bg-gray-100">
              <td class="px-6 py-4 whitespace-nowrap text-sm md:text-base">{{ product.userName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm md:text-base">{{ product.product.titulo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm md:text-base">{{ timestampToDate(product.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm md:text-base">${{ product.product.precio }}</td>
            </tr>
          </tbody>
        </table>

        <p v-if="soldProducts.length === 0" class="mt-4">No hay productos vendidos disponibles.</p>
      </div>
    </template>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { getAllSoldProducts } from '../services/product'; // Asegúrate de importar correctamente tus funciones
import CompLoading from '../components/CompLoading.vue'; // Importa tu componente de loading
import { timestampToDate } from '../helpers/date';

const soldProducts = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;

  // Obtener todos los productos vendidos
  soldProducts.value = await getAllSoldProducts();

  isLoading.value = false;
});


</script>
  