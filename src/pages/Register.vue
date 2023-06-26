<template>
  <div class="flex justify-center h-screen">
    <div class="w-1/2 bg-white p-6 rounded-lg">
      <h1 class="text-3xl font-bold">
        Registrarse
      </h1>
      <p class="text-xs text-gray-400 my-2">Una vez registrado podrás hacer consultas con el chat y reservar productos.
      </p>


      <CompLoading v-if="formLoading" />

      <form @submit.prevent="handleSubmit" class="mt-4 p-4 border rounded-lg bg-gray-100" v-if="!formLoading">
        <div class="text-xs text-gray-400 my-2">Todos los campos son obligatorios</div>
        <div class="mb-4">
          <CompLabel for="displayName">
            Nombre de Usuario*
          </CompLabel>
          <CompInput v-model="form.displayName" />
        </div>
        <div class="mb-4">
          <CompLabel for="email">
            Mail*
          </CompLabel>
          <CompInput type="email" v-model="form.email" />
        </div>
        <div class="mb-4">
          <CompLabel for="password">
            Password*
          </CompLabel>
          <div class="text-xs text-gray-400 my-2">La contraseña debe contener por lo menos 6 caracteres.</div>

          <div class="relative">
            <CompInput :type="showPassword.password ? 'text' : 'password'" v-model="form.password"
              :inputClass="{ 'pr-10': !showPassword.password }" />
            <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs cursor-pointer text-gray-400"
              @click="togglePasswordVisibility('password')">
              {{ showPassword.password ? 'Ocultar' : 'Ver' }}
            </span>
          </div>
        </div>
        <div class="mb-4">
          <CompLabel for="confirmPassword">
            Confirmar Password*
          </CompLabel>
          <div class="relative">
            <CompInput :type="showPassword.confirmPassword ? 'text' : 'password'" v-model="form.confirmPassword"
              :inputClass="{ 'pr-10': !showPassword.confirmPassword }" />
            <span class="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-xs text-gray-400"
              @click="togglePasswordVisibility('confirmPassword')">
              {{ showPassword.confirmPassword ? 'Ocultar' : 'Ver' }}
            </span>
          </div>
        </div>

        <CompButton type="submit">
          Crear Usuario
        </CompButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import CompLabel from "../components/CompLabel.vue";
import CompInput from "../components/CompInput.vue";
import CompButton from "../components/CompButton.vue";
import CompLoading from '../components/CompLoading.vue';
import { register } from '../services/auth.js';
import { useRouter } from "vue-router";
import { notificationProvider } from "../symbols/symbols.js";

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);

const useRegister = () => {
  const router = useRouter();

  const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    displayName: '',
  });

  const formLoading = ref(false);
  const showPassword = ref({
    password: false,
    confirmPassword: false,
  });

  const handleSubmit = async () => {
    formLoading.value = true;
    clearFeedbackMessage();

    // Validar campos obligatorios
    const { email, password, confirmPassword, role, displayName } = form.value;

    if (!email || !password || !confirmPassword || !role || !displayName) {
      setFeedbackMessage({
        type: 'error',
        message: 'Por favor, complete todos los campos obligatorios.',
      });
      formLoading.value = false;
      return;
    }

    if (password !== confirmPassword) {
      setFeedbackMessage({
        type: 'error',
        message: 'Las contraseñas no coinciden.',
      });
      formLoading.value = false;
      return;
    }

    console.log(form.value);

    try {
      await register({
        ...form.value,
      });

      formLoading.value = false;
      setFeedbackMessage({
        type: 'success',
        message: '¡Bienvenido a Mailing Colour!',
      });
      router.push('/perfil');
    } catch (error) {
      formLoading.value = false;
      setFeedbackMessage({
        type: 'error',
        message: error,
      });
      console.log(error);
    }
  };

  const togglePasswordVisibility = (field) => {
    showPassword.value[field] = !showPassword.value[field];
  };

  return {
    form,
    formLoading,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
  };
};

const { form, formLoading, handleSubmit, showPassword, togglePasswordVisibility } = useRegister();
</script>
