<template>
    <main>
        <h1 class="mb-3 text-2xl">Chat de asesoramiento con especialistas</h1>

        <div class="grid grid-cols-4 gap-4">
            <div id="chat" class="col-span-3 justify-self-center ">
                <CompLoading v-if="initialLoading">Cargando...</CompLoading>

                <ul v-else class="space-y-4">


                    <li v-for="message in messages" :key="message.id" class="flex space-x-4">
                        <div class="flex-shrink-0">
                            <img :src="message.avatar ? message.avatar : defaultAvatar" alt="Avatar"
                                class="h-8 w-8 rounded-full" />
                        </div>
                        <div>
                            <template v-if="message.userId === user.id">
                                {{ message.nombre }}
                            </template>
                            <template v-else>
                                <router-link :to="`/usuario/${message.userId}`"
                                    class="text-blue-500 hover:text-blue-800 underline  ">
                                    {{ message.nombre }}
                                </router-link>
                            </template>
                            <p class="bg-blue-500 text-white rounded-lg p-2 mt-2">{{ message.mensaje }}</p>
                            <div class="text-sm text-gray-500 flex items-center mt-1">
                                <img src="/img/reloj.png" alt="Icono de Reloj" class="mr-2 h-4 w-4">
                                {{ dateToString(message.hora_creacion) }}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="mb-3 col-span-1">
                <form action="#" method="post" id="form-message" @submit.prevent="sendMessage">
                    <div class="mb-2">
                        <div>
                            Usuario:
                            <span class="text-xs text-mylogo bg-slate-600 px-2 py-1 rounded">
                                {{ user.email }}
                            </span>
                        </div>
                    </div>
                    <div class="mb-2">
                        <CompLabel for="mensaje">Mensaje</CompLabel>
                        <CompTextarea id="mensaje" v-model="form.mensaje" class="w-full px-2 py-1"></CompTextarea>
                    </div>
                    <CompButton class="px-4 py-2">Enviar</CompButton>
                </form>

                <CompLoading v-if="formLoading"></CompLoading>
            </div>
        </div>
    </main>
</template>

<script>
import { subscribeToChatMessages, sendMessage } from '../services/chat.js';
import { dateToString } from "../helpers/date.js";
import CompButton from "../components/CompButton.vue";
import CompLoading from "../components/CompLoading.vue";
import CompLabel from "../components/CompLabel.vue";
import CompInput from "../components/CompInput.vue";
import CompTextarea from "../components/CompTextarea.vue";
import { subscribeAuth } from '../services/auth';



export default {
    name: "Chat",
    components: { CompButton, CompLoading, CompLabel, CompInput, CompTextarea },


    data: () => ({
        initialLoading: true,
        messages: [],
        form: {

            mensaje: '',
        },
        formLoading: false,
        user: {
            id: null,
            email: null,
        },
        defaultAvatar: '/img/defaultavatar.png',
    }),

    methods: {
        sendMessage() {
            this.formLoading = true;
            sendMessage({
                nombre: this.user.email,
                mensaje: this.form.mensaje,
                userId: this.user.id,

            })
                .then(() => {
                    this.formLoading = false;
                    this.form.mensaje = '';
                });
        },

        dateToString(date) {
            return dateToString(date);
        }
    },

    mounted() {
        subscribeToChatMessages(messages => {
            this.initialLoading = false;
            this.messages = messages;
        });

        subscribeAuth(newUser => this.user = newUser);
    },
};


</script>


