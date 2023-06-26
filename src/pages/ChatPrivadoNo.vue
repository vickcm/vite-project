<template>
    <section>
  
      <h1 class="mb-3">Chat privado con {{ chattingUser.displayName || chattingUser.email }}</h1>
      <h2 class="visually-hidden">Mensajes</h2>
  
      <div class="chat mb-3">
        <ul>
          <li v-for="message in messages" :key="message.created_at">
            <span>
              ({{ dateToString(message.created_at) }})
              {{
                message.from === user.id ?
                  user.displayName || user.email :
                  chattingUser.displayName || chattingUser.email
              }}
              dijo
            </span>:
            <div>{{ message.text }}</div>
          </li>
        </ul>
      </div>
  
      <h2 class="visually-hidden">Enviar mensaje</h2>
      <form action="#" method="post" @submit.prevent="handleSubmit">
        <CompLabel for="message" class="visually-hidden">Mensajes</CompLabel>
        <CompTextArea id="message" class="form-control resize-none" v-model="formMessage"></CompTextArea>
        <CompButton type="submit" class="btn btn-primary">Enviar</CompButton>
      </form>
  
    </section>
  </template>
  
<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import useAuth from "../composition/useAuth.js";
import {useUserProfile} from "../composition/useUserProfile.js";
import {sendPrivateMessages, subscribeToPrivateChat} from "../services/privateChats.js";
import {useRoute} from "vue-router";
import {dateToString} from "../helpers/date.js";
import CompTextArea from "../components/CompTextArea.vue";
import CompLabel from "../components/CompLabel.vue";
import CompButton from '../components/CompButton.vue';

const {
    user,
    chattingUser,
    message: formMessage,
    handleSubmit,
} = usePrivateChatForm();

const {messages} = usePrivateChat();

function usePrivateChatForm() {
  const {user} = useAuth();
  const {user: chattingUser} = useUserProfile();
  const message = ref('');

  function handleSubmit() {

    console.log( 'from', user.value.id, 'to', chattingUser.value.id, 'messageText:',  message.value,)
    sendPrivateMessages( {
      from: user.value.id,
      to: chattingUser.value.id,
      messageText: message.value,
    });
    message.value = '';
  }

  return {
    user,
    chattingUser,
    message,
    handleSubmit,
  }
}

function usePrivateChat() {
  const messages = ref([]);
  const {user} = useAuth();
  const route = useRoute();
  let unsubscribe;

  onMounted(async () => {
    unsubscribe = await subscribeToPrivateChat({
      from: user.value.id,
      to: route.params.id,
    }, newMessages => messages.value = newMessages);
  });

  onUnmounted(() => {
    if(typeof unsubscribe !== 'function') return;
    unsubscribe();
  });
  return {
    messages,
  }
}

</script>
  