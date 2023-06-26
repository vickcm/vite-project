<script setup>
import { logout } from './services/auth.js';
import { useRouter } from 'vue-router';
import useAuth from './composition/useAuth.js'
import { provide, ref } from 'vue';
import CompAlert from './components/CompAlert.vue';
import { notificationProvider } from "./symbols/symbols.js";



const { user } = useAuth();

const router = useRouter();

const feedback = ref({
    message: '',
    type: '',
    closable: true,

});

function setFeedbackMessage({ message, type = 'success', }) {
    feedback.value = {
        ...feedback.value,
        message,
        type,
    }
}

function clearFeedbackMessage() {
    feedback.value = {
        ...feedback.value,
        message: '',
        type: '',

    };
}

provide(notificationProvider, {
    feedback,
    setFeedbackMessage,
    clearFeedbackMessage,
});

const handleLogout = () => {
    logout();

    setFeedbackMessage({ message: '¡Has cerrado sesión correctamente!', type: 'success' });

    router.push({ path: '/iniciar-sesion' });
};


</script>



<template class="container-fluid">
   
    <nav class="flex justify-between items-center p-4 bg-gray-800 text-gray-200">
        <router-link to="/" class="flex items-center">
            <img src="/img/logo-verde-horizontal.png" alt="Logo" class="w-28 ">
        </router-link>

        <div class="flex  md:hidden">
            <button type="button" class="block text-gray-500 hover:text-white focus:text-white focus:outline-none">
                <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>Mobile menu icon</title>
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>
        </div>
        <ul id="menu" class="hidden md:flex gap-4">
            <li>
                <router-link class="hover:text-white" v-if="user.role !== 'admin'" to="/">Home</router-link>
            </li>

            <li>
                <router-link class="hover:text-white" v-if="user.role !== 'admin'" to="/productos">Productos</router-link>
            </li>


            <li>
                <router-link v-if="user.id === null" class="hover:text-white" to="/iniciar-sesion">Iniciar
                    Sesión</router-link>
            </li>


            <li>
                <router-link v-if="user.id === null" class="hover:text-white" to="/registro">Registro</router-link>
            </li>


            <li>
                <router-link v-if="user.role === 'admin'" class="hover:text-white" to="/productos/administrar">Administrar
                    Productos</router-link>
            </li>
            <li>
                <router-link v-if="user.role === 'admin'" class="hover:text-white" to="/productos/vendidos">Ventas
                </router-link>
            </li>


            <li>
                <router-link v-if="user.id !== null && user.role !== 'admin'" class="hover:text-white" to="/perfil">Mi
                    Perfil</router-link>
            </li>

            <li>
                <router-link v-if="user.id !== null && user.role === 'admin'" class="hover:text-white" to="/perfiladmin">Mi
                    Perfil Administrador </router-link>
            </li>

            <li v-if="user.id !== null" class="hover:text-white">
                <div class="text-xs italic text-mylogo ">
                    Bienvenido <div v-if="user.role === 'admin'"> {{ user.role }}

                    </div>
                </div>
                <div class="text-xs text-green">{{ user.email }}</div>
            </li>

            <li v-if="user.id !== null">
                <form action="#" method="post" @submit.prevent="handleLogout">
                    <button type="submit" class="text-xs text-mylogo">Cerrar Sesión</button>
                </form>
            </li>
        </ul>
    </nav>



    <main class="container mx-auto mt-5">
        <CompAlert :data="feedback" @close="clearFeedbackMessage" />
        <router-view />


    </main>

    <div class="container-fluid mt-5">
        <footer class="px-3 py-8  transition-colors duration-200 bg-gray-800 text-2 text-gray-200">
            <div class="flex flex-col">
                <div class="h-px mx-auto rounded-full md:hidden mt-7 w-11">
                </div>
                <div class="flex flex-col mt-4 md:mt-0 md:flex-row">
                    <nav
                        class="flex flex-col items-center justify-center flex-1 border-gray-100 md:items-end md:border-r md:pr-5">
                        <a aria-current="page" href="#" class="hover:text-white">
                            Chat
                        </a>
                        <a aria-current="page" href="#" class="hover:text-white">
                            Iniciar Sesión
                        </a>

                    </nav>
                    <div class="h-px mx-auto mt-4 rounded-full md:hidden w-11">
                    </div>
                    <div class="flex items-center justify-center flex-1 mt-4 border-gray-100 md:mt-0 md:border-r">
                        <a class="hover:text-primary-gray-20" href="https://github.com/vickcm">
                            <span class="sr-only">
                                View on GitHub
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                                class="text-xl transition-colors duration-200 hover:text-white" viewBox="0 0 1792 1792">
                                <path
                                    d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z">
                                </path>
                            </svg>
                        </a>
                        <a class="ml-4 hover:text-primary-gray-20" href="#">
                            <span class="sr-only">
                                Settings
                            </span>
                            <svg width="30" height="30" fill="currentColor"
                                class="text-xl transition-colors duration-200 hover:text-white" viewBox="0 0 2048 1792"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M960 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm768 512q0-52-38-90t-90-38-90 38-38 90q0 53 37.5 90.5t90.5 37.5 90.5-37.5 37.5-90.5zm0-1024q0-52-38-90t-90-38-90 38-38 90q0 53 37.5 90.5t90.5 37.5 90.5-37.5 37.5-90.5zm-384 421v185q0 10-7 19.5t-16 10.5l-155 24q-11 35-32 76 34 48 90 115 7 11 7 20 0 12-7 19-23 30-82.5 89.5t-78.5 59.5q-11 0-21-7l-115-90q-37 19-77 31-11 108-23 155-7 24-30 24h-186q-11 0-20-7.5t-10-17.5l-23-153q-34-10-75-31l-118 89q-7 7-20 7-11 0-21-8-144-133-144-160 0-9 7-19 10-14 41-53t47-61q-23-44-35-82l-152-24q-10-1-17-9.5t-7-19.5v-185q0-10 7-19.5t16-10.5l155-24q11-35 32-76-34-48-90-115-7-11-7-20 0-12 7-20 22-30 82-89t79-59q11 0 21 7l115 90q34-18 77-32 11-108 23-154 7-24 30-24h186q11 0 20 7.5t10 17.5l23 153q34 10 75 31l118-89q8-7 20-7 11 0 21 8 144 133 144 160 0 8-7 19-12 16-42 54t-45 60q23 48 34 82l152 23q10 2 17 10.5t7 19.5zm640 533v140q0 16-149 31-12 27-30 52 51 113 51 138 0 4-4 7-122 71-124 71-8 0-46-47t-52-68q-20 2-30 2t-30-2q-14 21-52 68t-46 47q-2 0-124-71-4-3-4-7 0-25 51-138-18-25-30-52-149-15-149-31v-140q0-16 149-31 13-29 30-52-51-113-51-138 0-4 4-7 4-2 35-20t59-34 30-16q8 0 46 46.5t52 67.5q20-2 30-2t30 2q51-71 92-112l6-2q4 0 124 70 4 3 4 7 0 25-51 138 17 23 30 52 149 15 149 31zm0-1024v140q0 16-149 31-12 27-30 52 51 113 51 138 0 4-4 7-122 71-124 71-8 0-46-47t-52-68q-20 2-30 2t-30-2q-14 21-52 68t-46 47q-2 0-124-71-4-3-4-7 0-25 51-138-18-25-30-52-149-15-149-31v-140q0-16 149-31 13-29 30-52-51-113-51-138 0-4 4-7 4-2 35-20t59-34 30-16q8 0 46 46.5t52 67.5q20-2 30-2t30 2q51-71 92-112l6-2q4 0 124 70 4 3 4 7 0 25-51 138 17 23 30 52 149 15 149 31z">
                                </path>
                            </svg>
                        </a>
                    </div>
                    <div class="h-px mx-auto mt-4 rounded-full md:hidden w-11 ">
                    </div>
                    <div class="flex flex-col items-center justify-center flex-1 mt-7 md:mt-0 md:items-start md:pl-5">
                        <span class="">
                            © 2023
                        </span>
                        <span class="mt-7 md:mt-1">
                            Created by
                            <a class="underline hover:text-primary-gray-20" href="https://github.com/vickcm">
                                Victoria
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>

    </div>
</template>