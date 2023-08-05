import Chat from "../pages/Chat.vue";
import Home from "../pages/Home.vue";
import Register from "../pages/Register.vue";
import Login from "../pages/Login.vue";
import VerProductos from "../pages/VerProductos.vue";
import AdministrarProductos from "../pages/AdministrarProductos.vue";
import MiPerfil from "../pages/MiPerfil.vue";
import PerfilAdmin from "../pages/PerfilAdmin.vue";
import PerfilUsuario from "../pages/PerfilUsuario.vue";
import ChatPrivado from "../pages/ChatPrivado.vue";
import VerProductosVendidos from "../pages/VerProductosVendidos.vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { subscribeAuth, isAdmin } from "../services/auth.js";

let user = {
  id: null,
  email: null,
};

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/chat",
    component: Chat,
    meta: { requiresAuth: true },
  },

  {
    path: "/iniciar-sesion",
    component: Login,
  },
  {
    path: "/registro",
    component: Register,
  },
  {
    path: "/productos",
    component: VerProductos,
  },
  {
    path: "/perfil",
    component: MiPerfil,
    meta: { requiresAuth: true },
  },
  {
    path: "/usuario/:id",
    component: PerfilUsuario,
    meta: { requiresAuth: true },
  },

  {
    path: "/usuario/:id/chat",
    component: ChatPrivado,
    meta: { requiresAuth: true },
  },

  {
    path: "/productos/administrar",
    component: AdministrarProductos,
    meta: { requiresAuth: true, requiresAdmin: true }, // Agrega la propiedad "requiresAdmin" a la ruta
  },

  {
    path: "/productos/vendidos",
    component: VerProductosVendidos,
    meta: { requiresAuth: true, requiresAdmin: true }, // Agrega la propiedad "requiresAdmin" a la ruta
  },

  {
    path: "/perfiladmin",
    name: "perfilAdmin",
    component: PerfilAdmin,
    meta: { requiresAuth: true, requiresAdmin: true }, // Agrega la propiedad "requiresAdmin" a la ruta
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

subscribeAuth((newUser) => (user = newUser));

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && user.id === null) {
    return {
      path: "/iniciar-sesion",
    };
  }

  if (to.meta.requiresAdmin && !isAdmin()) {
    return {
      path: "/",
    };
  }
});

export default router;
