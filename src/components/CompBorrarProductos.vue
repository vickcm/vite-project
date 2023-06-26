<template>
  <div>
    <button class="px-4 py-2 my-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700" @click="showModal = true">
      Borrar Producto
    </button>

    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75" v-if="showModal">
      <div class="bg-white w-1/2 p-6">
        <div class="flex justify-end">
          <button class="text-gray-500 hover:text-gray-700" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h1 class="text-3xl font-bold mb-4">Borrar Producto</h1>

        <form @submit.prevent="handleDeleteProduct" class="mt-4">
          <div class="mb-4">
            <CompLabel for="id">Id</CompLabel>
            <CompInput type="text" name="id" id="id" v-model="form.id" />
          </div>
          <div class="mb-4">
            <CompLabel for="titulo">Nombre del Producto</CompLabel>
            <CompInput type="text" name="titulo" id="titulo" v-model="form.titulo" />
          </div>

          <div class="mb-4">
            <CompLabel for="descripcion">Descripción del producto</CompLabel>
            <CompTextarea id="descripcion" v-model="form.descripcion" />
          </div>

          <div class="mb-4">
            <CompLabel for="precio">Precio del Producto</CompLabel>
            <CompInput type="number" name="precio" id="precio" v-model="form.precio" />
          </div>

          <CompButton class="bg-red-500 hover:bg-red-700"  type="submit">Borrar Definitivamente</CompButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, defineEmits } from 'vue';
import CompButton from "./CompButton.vue";
import CompLabel from "./CompLabel.vue";
import CompInput from "./CompInput.vue";
import CompTextarea from "./CompTextarea.vue";
import { updateProduct } from '../services/product.js';
import { notificationProvider } from "../symbols/symbols.js";
import { deleteProduct } from "../services/product.js";

const props = defineProps(["product"]);
console.log(props.product);

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);

const form = ref({
  id: props.product ? props.product.id : "",
  titulo: props.product ? props.product.titulo : "",
  descripcion: props.product ? props.product.descripcion : "",
  precio: props.product ? props.product.precio : "",
});

const product = ref(props.product);




const showModal = ref(false);
const formLoading = ref(false);
const emits = defineEmits(["productDeleted"]);

const closeModal = () => {
  showModal.value = false;
};

const handleDeleteProduct = async () => {
 
  
  formLoading.value = true;

  clearFeedbackMessage();
 
  try {
    await deleteProduct(product.value.id,  );
    form.value.titulo = "";
    form.value.descripcion = "";
    form.value.precio = "";

    setFeedbackMessage({
      type: "success",
      message: "¡El producto se ha borrado con éxito!",
    });
    showModal.value = false;

    emits("productDeleted");
  } catch (error) {
    formLoading.value = false;
    console.log(error);
    setFeedbackMessage({
      type: "error",
      message: "No se ha podido borrar el producto",
    });
  }
};
</script>
