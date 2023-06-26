<script setup>
import { login } from "../services/auth.js";
import { useRouter } from 'vue-router';
import CompButton from "../components/CompButton.vue";
import CompInput from "../components/CompInput.vue";
import CompLabel from "../components/CompLabel.vue";
import { getCurrentUser } from "../services/users.js";
import { ref, inject } from "vue";
import { notificationProvider } from "../symbols/symbols.js";

const { feedback, setFeedbackMessage, clearFeedbackMessage } = inject(notificationProvider);
const router = useRouter();
const { user, handleSubmit, showPassword } = useLoginForm();

function useLoginForm() {
  const user = ref({
    email: '',
    password: '',
    role: '',
  });

  const showPassword = ref(false);

  async function handleSubmit() {
    clearFeedbackMessage();

    try {
      await login({ ...user.value });
      const currentUser = await getCurrentUser();
      setFeedbackMessage({
        type: 'success',
        message: '¡Bienvenido a Mailing Colour!',
      });

      if (currentUser && currentUser.role === 'admin') {
        router.push({ path: '/perfiladmin' });
      } else if (currentUser && currentUser.role === 'user') {
        router.push({ path: '/perfil' });
      }
    } catch (error) {
      console.log('Error al iniciar sesión', error);
      setFeedbackMessage({
        type: 'error',
        message: error,
      });
    }
  }

  return {
    user,
    handleSubmit,
    showPassword,
  };
}
</script>

<template>
  <div class="flex justify-center h-screen">
    <div class="w-full sm:w-1/2 p-6 rounded-lg">
      <h1 class="text-3xl font-bold">
        Iniciar Sesión
      </h1>

      <form action="#" method="post" @submit.prevent="handleSubmit" class="mt-4 p-4 border rounded-lg bg-gray-100">
        <div class="mb-4">
          <CompLabel for="email">
            Mail
          </CompLabel>
          <CompInput type="email" name="email" id="email" v-model="user.email" />
        </div>

        <div class="mb-4">
          <CompLabel for="password">
            Password
          </CompLabel>
          <div class="relative">
            <CompInput :type="showPassword ? 'text' : 'password'" name="password" id="password" v-model="user.password"
              :inputClass="{ 'pr-10': !showPassword }" />
            <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs cursor-pointer text-gray-400"
              @click="showPassword = !showPassword">
              {{ showPassword ? 'Ocultar' : 'Ver' }}
            </span>
          </div>
        </div>

        <CompButton type="submit">
          Login
        </CompButton>
      </form>
    </div>
  </div>
</template>
