<template>
  <CompLoadingContext :loading="loading">
    <h1 class="mb-4 text-4xl">Chat privado con {{ toUser.displayName || toUser.email }}</h1>

    <div class="mb-3">
      <CompLoadingContext :loading="loadingMessages">
        <ul>
          <li v-for="message in messages" :key="message.created_at" class="mb-3">
            <b>
              <template v-if="message.userId !== fromUser.id">
                <router-link :to="`/usuario/${message.userId}`" class="text-blue-400 underline">{{ message.userName ||
                  message.userEmail }}</router-link>
              </template>
              <template v-else>
                {{ message.userName || message.userEmail }}
              </template>
              dijo:
            </b>
            {{ message.message }}
            <div v-if="message.created_at" class="text-sm">{{ dateToString(message.created_at) }}</div>
          </li>
        </ul>
      </CompLoadingContext>
    </div>
    <div class="mb-2">
      <form action="#" method="post" id="form-message" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <CompLabel for="message">Mensaje</CompLabel>
          <CompTextarea id="message" v-model="form.message"></CompTextarea>
        </div>
        <CompButton full />
      </form>

      <div v-if="formLoading" class="mb-3 flex items-center">
        <div class="mr-2">
          <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-4 w-4"></div>
        </div>
        <div class="text-sm">Enviando mensaje<span class="animate-pulse">...</span></div>
      </div>
    </div>
  </CompLoadingContext>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useUserProfile } from "../composition/useUserProfile.js";
import CompLoadingContext from "../components/CompLoadingContext.vue";
import { dateToString } from "../helpers/date.js";
import CompLabel from "../components/CompLabel.vue";
import CompButton from "../components/CompButton.vue";
import CompTextarea from "../components/CompTextarea.vue";
import useAuth from "../composition/useAuth.js";
import { onUnmounted, ref, watch } from "vue";
import { sendPrivateMessages, subscribeToPrivateChat } from "../services/privateChats.js";
import { getUserById } from "../services/users";

const route = useRoute();
const { user: toUser, loading } = useUserProfile(route.params.id);
const { user: fromUser } = useAuth();
const { handleSubmit, form, formLoading } = usePrivateChatForm(fromUser, toUser);
const { messages, loading: loadingMessages } = usePrivateChat(fromUser, toUser);

function usePrivateChat(fromUser, toUser) {
  const loading = ref(true);
  const messages = ref([]);
  let unsubscribe = () => { };

  watch(toUser, newtoUser => {
    if (newtoUser.id != null) {
      setSubscription();
    }
  });

  async function setSubscription() {
    unsubscribe = await subscribeToPrivateChat(fromUser.value.id, toUser.value.id, async newMessages => {
      const updatedMessages = await Promise.all(
        newMessages.map(async message => {
          const user = await getUserById(message.userId);
          return {
            ...message,
            userName: user.displayName,
            userEmail: user.email
          };
        })
      );

      messages.value = updatedMessages;
      loading.value = false;
    });
  }

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    loading,
    messages
  };
}

function usePrivateChatForm(fromUser, toUser) {
  const formLoading = ref(false);
  const form = ref({
    message: ""
  });

  async function handleSubmit() {
    formLoading.value = true;
    await sendPrivateMessages(fromUser.value.id, toUser.value.id, form.value.message);
    formLoading.value = false;
    form.value.message = "";
  }

  return {
    formLoading,
    form,
    handleSubmit
  };
}
</script>
