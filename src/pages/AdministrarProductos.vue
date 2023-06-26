<template>
  <div>
    <h1 class="text-3xl font-bold mb-2">Lista de productos</h1>
    <p class="text-xs text-gray-500 mb-2">*Es posible que la visualización de la tabla en dispositivos pequeños se vea
      afectada. Se sugiere la vista en computadoras de escritorio o laptops.</p>

    <CompCrearProductos @productCreated="handleCreateProduct"></CompCrearProductos>

    <template v-if="isLoading">
      <!-- Mostrar el componente de loading mientras se cargan los productos -->
      <CompLoading class="my-4">Cargando</CompLoading>
    </template>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 mt-4">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Id
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titulo
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm">{{ product.id }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm">{{ product.titulo }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-xs md:text-sm">{{ product.precio }}</td>
            <td class="px-4 py-2 whitespace-nowrap">
              <CompEditarProductos :product="product" @productEdited="handleEditProduct" />
              <CompBorrarProductos :product="product" @productDeleted="handleDeleteProduct" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { getProducts, deleteProduct } from '../services/product.js';
import CompCrearProductos from '../components/CompCrearProductos.vue';
import CompEditarProductos from '../components/CompEditarProductos.vue';
import CompBorrarProductos from '../components/CompBorrarProductos.vue';
import CompLoading from '../components/CompLoading.vue';

const products = ref([]);
const showModal = ref(false);
const editedProduct = ref(null);
const isLoading = ref(false);

const loadProducts = async () => {
  isLoading.value = true;

  try {
    products.value = await getProducts();
    console.log(products.value);
    isLoading.value = false;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
};

const removeProduct = async (productId) => {
  try {
    await deleteProduct(productId);
    await loadProducts();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
};

onMounted(loadProducts);

const handleCreateProduct = () => {
  loadProducts();
};

const handleEditProduct = () => {
  loadProducts();
};

const handleDeleteProduct = () => {
  loadProducts();
};
</script>
  