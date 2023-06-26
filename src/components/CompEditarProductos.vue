<template>
  <div>
    <button class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" @click="showModal = true">
      Editar Producto
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

        <h1 class="text-3xl font-bold mb-4">Editar Producto</h1>

        <form @submit.prevent="handleEditProduct" class="mt-4">
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

          <CompButton type="submit">Guardar Cambios</CompButton>
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

const props = defineProps(["product"]);
console.log(props.product);

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);

const form = ref({
  titulo: props.product ? props.product.titulo : "",
  descripcion: props.product ? props.product.descripcion : "",
  precio: props.product ? props.product.precio : "",
});

const product = ref(props.product);





const showModal = ref(false);
const formLoading = ref(false);
const emits = defineEmits(["productEdited"]);

const closeModal = () => {
  showModal.value = false;
};

const handleEditProduct = async () => {
 
  
  formLoading.value = true;
  const { titulo, descripcion, precio } = form.value;
  clearFeedbackMessage();

  // Validar campos obligatorios
  if (!titulo || !descripcion || !precio) {
    setFeedbackMessage({
      type: "error",
      message: "Por favor, complete todos los campos obligatorios.",
    });
    return;
  }

  try {
    await updateProduct(product.value.id, form.value );

    form.value.titulo = "";
    form.value.descripcion = "";
    form.value.precio = "";

    setFeedbackMessage({
      type: "success",
      message: "¡El producto se ha editado con éxito!",
    });
    showModal.value = false;

    emits("productEdited");
  } catch (error) {
    formLoading.value = false;
    console.log(error);
    setFeedbackMessage({
      type: "error",
      message: "No se ha podido editar el producto",
    });
  }
};
</script>
