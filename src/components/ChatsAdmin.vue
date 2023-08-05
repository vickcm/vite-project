<template>
  <div>
    <h2>Mis Chats</h2>
    <ul>
      <li v-for="chat in chats" :key="chat.id">
        <router-link :to="`/usuario/${user.id}/chat`">{{ chat.id }}</router-link>
      </li>
    </ul>
  </div>
</template>
  
  
<script>
import { getPrivateChatsByAdvisor } from '../services/privateChats.js';
import { subscribeAuth } from '../services/auth.js';

export default {
  name: 'ChatsAdmin',
  data() {
    return {
      chats: [],
      user: {
        id: null,
        email: null,
      },
    };
  },
  mounted() {
    subscribeAuth(newUser => {
      this.user.id = newUser.id; // Asigna el ID del usuario al campo "id" de "user"
      this.user.email = newUser.email; // Asigna el email del usuario al campo "email" de "user"
      console.log(this.user); // Verificar si contiene el ID del asesor
      this.fetchChats();
    });
  },

  methods: {
    async fetchChats() {
      try {
        const advisorId = this.user.id; // Reemplaza por el ID del asesor actualmente logueado
        const chatRefs = await getPrivateChatsByAdvisor(advisorId);
        this.chats = chatRefs;

        // TRAER EL ID USUARIO COMUN Y ESO PASARLO EN LA URL. 

        console.log(this.chats);
      } catch (error) {
        console.log('Error al obtener los chats del usuario admin:', error);
      }
    },
  },
};
</script>
  