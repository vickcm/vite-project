<script setup>
import { logout } from './services/auth.js';
import { useRouter } from 'vue-router';
import useAuth from './composition/useAuth.js'
import { provide, ref, computed } from 'vue';
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

const mobileMenuOpen = ref(false);

function toggleMobileMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value;
}

const mobileMenuClass = computed(() => {
    return {
        'hidden': !mobileMenuOpen.value,
        'block': mobileMenuOpen.value,
        'sm:hidden': true,
        'px-2 pt-2 pb-3 space-y-1 sm:px-3': true,
    };
});



</script>



<template class="container-fluid">
    <nav class="bg-gray-800">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div class="relative flex items-center justify-center h-16">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <!-- Icono de menú en dispositivos móviles -->
                    <button @click="toggleMobileMenu"
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span class="sr-only">Open main menu</span>
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                    <!-- Logo o título del sitio -->
                    <!-- Reemplaza el siguiente código con tu logo o título -->
                    <div class="flex-shrink-0 flex items-center">
                        <router-link to="/">
                            <img src="/img/logo-verde-horizontal.png" alt="Logo" class="w-28 ">
                        </router-link>


                    </div>
                    <!-- Menú de navegación principal -->
                    <div class="hidden sm:block sm:ml-6">
                        <div class="flex space-x-4">
                            <!-- Enlaces de navegación -->

                            <router-link
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                v-if="user.role !== 'admin'" to="/">Home</router-link>
                            <router-link
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                v-if="user.role !== 'admin'" to="/productos">Productos</router-link>
                            <router-link v-if="user.id === null"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                to="/iniciar-sesion">Iniciar
                                Sesión</router-link>
                            <router-link v-if="user.id === null"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                to="/registro">Registro</router-link>
                            <router-link v-if="user.role === 'admin'"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                to="/productos/administrar">Administrar
                                Productos</router-link>
                            <router-link v-if="user.role === 'admin'"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                to="/productos/vendidos">Ventas
                            </router-link>
                            <router-link v-if="user.id !== null && user.role !== 'admin'"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                to="/perfil">Mi
                                Perfil
                            </router-link>
                            <router-link v-if="user.id !== null && user.role === 'admin'"
                                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                to="/perfiladmin">Mi
                                Perfil Administrador
                            </router-link>
                            <div v-if="user.id !== null" class="ml-3">
                                <div class="text-base font-medium text-mylogo">
                                    Bienvenido {{ user.displayName || user.email }}
                                </div>
                            </div>

                            <div v-if="user.id !== null">
                                <form action="#" method="post" @submit.prevent="handleLogout">
                                    <button type="submit"
                                        class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        Cerrar Sesión
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Menú de navegación en dispositivos móviles -->
        <div :class="mobileMenuClass">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <!-- Enlaces de navegación -->
                <router-link
                    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    v-if="user.role !== 'admin'" to="/">Home</router-link>
                <router-link
                    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    v-if="user.role !== 'admin'" to="/productos">Productos</router-link>
                <router-link v-if="user.id === null"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    to="/iniciar-sesion">Iniciar
                    Sesión</router-link>
                <router-link v-if="user.id === null"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    to="/registro">Registro</router-link>
                <router-link v-if="user.role === 'admin'"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    to="/productos/administrar">Administrar
                    Productos</router-link>
                <router-link v-if="user.role === 'admin'"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    to="/productos/vendidos">Ventas
                </router-link>
                <router-link v-if="user.id !== null && user.role !== 'admin'"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    to="/perfil">Mi
                    Perfil
                </router-link>
                <router-link v-if="user.id !== null && user.role === 'admin'"
                    class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    to="/perfiladmin">Mi
                    Perfil Administrador
                </router-link>

                <div v-if="user.id !== null" class="ml-3">
                    <div class="text-base font-medium text-mylogo">
                        Bienvenido {{ user.displayName || user.email }}
                    </div>
                </div>
                <div v-if="user.id !== null">
                    <form action="#" method="post" @submit.prevent="handleLogout">
                        <button type="submit"
                            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                            Cerrar Sesión
                        </button>
                    </form>
                </div>


            </div>
        </div>
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
                        class="flex flex-col items-center justify-center flex-1 hover:text-white border-gray-100 md:items-end md:border-r md:pr-5">
                        <router-link class="hover:text-white" to="/productos">Productos</router-link>
                        <router-link class="hover:text-white" to="/">Home</router-link>
                        <router-link v-if="user.id === null" class="hover:text-white" to="/iniciar-sesion">Iniciar
                            Sesión</router-link>
                        <router-link v-if="user.id === null" class="hover:text-white" to="/registro">Registro</router-link>

                    </nav>
                    <div class="h-px mx-auto mt-4 rounded-full md:hidden w-11">
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
