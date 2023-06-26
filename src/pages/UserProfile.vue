<script setup>
import { useRoute } from "vue-router";
import { useUser } from "../composition/useUser.js";
import LoadingContext from "../components/LoadingContext.vue";

const route = useRoute();
const { user, loading } = useUser(route.params.id);
</script>

<template>
    <LoadingContext :loading="loading">
        <h1 class="mb-4 text-4xl">Perfil de {{ user.email }}</h1>

        <h2 class="mb-4 text-3xl">Chat privado</h2>
        <router-link :to="`/usuario/${user.id}/chat`" class="text-blue-400 underline">Iniciar chat privado con {{ user.email
        }}</router-link>
    </LoadingContext>
</template>
