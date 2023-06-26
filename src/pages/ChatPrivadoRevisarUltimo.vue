<template>
   <CompLoadingContext :loading="loading"> 
  <main>
    <div class="mb-3 col-span-1">
      <form action="#" method="post" id="form-message" @submit.prevent="sendMessages">
        <div class="mb-2">
          <div>
            Usuario:
            <span class="text-xs text-mylogo bg-slate-600 px-2 py-1 rounded">{{ fromUser.email }}</span>
          </div>
        </div>
        <div class="mb-2">
          <CompLabel for="mensaje">Mensaje</CompLabel>
          <CompTextarea id="mensaje" v-model="form.mensaje" class="w-full px-2 py-1"></CompTextarea>
        </div>
        <CompButton class="px-4 py-2">Enviar</CompButton>
      </form>

      <!-- <CompLoading v-if="formLoading"></CompLoading> -->

      <h2 class="mb-3 text-2xl" v-if="toUser">Iniciando Chat con {{ toUser.email }} </h2>

    </div>

    <div v-if="messages.length > 0">
      <h3>Mensajes:</h3>
      <ul>
        <li v-for="message in messages" :key="message.created_at">
          <span class="font-bold">{{ message.user }}</span>: {{ message.message }}
          {{ dateToString(message.created_at) }}
        </li>
      </ul>
    </div>

  </main>
</CompLoadingContext>
</template>

<script setup>
import CompLoading from "../components/CompLoading.vue";
import CompLabel from "../components/CompLabel.vue";
import CompTextarea from "../components/CompTextarea.vue";
import CompButton from "../components/CompButton.vue";
import { ref, watch, onUnmounted } from "vue";
import { sendPrivateMessages, subscribeToPrivateChat } from '../services/privateChats.js';
import { dateToString } from "../helpers/date.js";
import { useRouter } from "vue-router";
import { useUserProfile } from "../composition/useUserProfile.js";
import CompLoadingContext from "../components/CompLoadingContext.vue";
import useAuth from "../composition/useAuth";
const route = useRouter();


const { user: toUser, loading } = useUserProfile(route.params.id);
const { user: fromUser } = useAuth();


const { sendMessages, form, formLoading  } = privateChatForm(toUser, fromUser);
const { messages, loading: loadingMessages} = privateChat(toUser, fromUser);
console.log('fromUser:', fromUser, 'toUser:', toUser);



function privateChat(toUser, fromUser) {

  const form = ref({
    mensaje: '',
  });
  const loading = ref(false);

  let unsubscribe = () => {};

  watch(toUser, (newtoUser) => {
  // Si hay un id en este caso, entonces seteamos la suscripción.
  if (newtoUser.id != null) {
    sendMessagesSuscription();
  }
});

    async function sendMessagesSuscription(){
      unsubscribe = await subscribeToPrivateChat(
        fromUser.value.id, 
        toUser.value.id, 
        newMessages => {
                messages.value = newMessages;
              }
        );
    }

    // Al desmontar el componente, nos aseguramos de cancelar la suscripción.
    onUnmounted(() => {
        unsubscribe();
    });

  return {
    messages,
  loading

  }


}

function privateChatForm (toUser, fromUser) {

  formLoading.value = false;
  const form = ref({
    mensaje: '',
  });

  async function sendMessages() {
    formLoading.value = true;

    await sendPrivateMessages(
      fromUser.value.id, 
      toUser.value.id, 
      form.value.mensaje
    );
    formLoading.value = false;
    form.value.mensaje = '';
  }

  return {
    form,
    formLoading,
    sendMessages
  }


}





</script>
