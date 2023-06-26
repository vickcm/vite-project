<template>
  <div>

    <div class="mb-3 col-span-1">
      <h1 class="hidden">Perfil para envío de mensajes</h1>
      <form action="#" method="post" id="form-message" @submit.prevent="sendPrivateMessages">

        <div class="mb-2">
          <CompLabel for="mensaje">Mensaje</CompLabel>
          <CompTextarea id="mensaje" v-model="form.mensaje" class="w-full px-2 py-1"></CompTextarea>
        </div>
        <CompButton class="px-4 py-2">Enviar</CompButton>
      </form>
    </div>



    <CompLoading v-if="formLoading"></CompLoading>
    <h2>Chat Asesores</h2>


    <div v-if="loading">
      Cargando mensajes...
    </div>
    <div v-else>
      <div v-for="message in messages" :key="message.id">
        <div>{{ message.user.email }}</div>
        <div>{{ message.message }}</div>
        <hr>
      </div>
    </div>
  </div>
</template>
  
<script>
import { getChatMessages } from '../services/privateChats.js';
import CompLoading from '../components/CompLoading.vue';
import CompLabel from '../components/CompLabel.vue';
import CompInput from '../components/CompInput.vue';
import CompTextarea from '../components/CompTextarea.vue';
import CompButton from '../components/CompButton.vue';


export default {
  name: 'ChatAsesores',
  components: { CompLoading, CompLabel, CompInput, CompTextarea, CompButton },
  data() {
    return {

      loading: true,
      messages: [],
      form: {
        mensaje: '',
      },
      formLoading: false,

    };
  },
  async mounted() {

    try {
      const chatId = this.$route.params.id;
      this.messages = await getChatMessages(chatId);
      this.loading = false;
    } catch (error) {
      console.log('Error al obtener los mensajes del chat:', error);
    }
  },
};
</script>
  