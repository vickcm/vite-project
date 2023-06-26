import { auth } from "./firebase.js";
import { createUser } from "./users.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "./firebase.js";
import { getFileURL, uploadFileUsingString } from "./storage.js";
import { getUserById, updateUser } from "./users.js";

import { doc, getDoc } from "firebase/firestore";

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 */

let user = {
  id: null,
  email: null,
  role: null,
  displayName: null,
  photoURL: null,
};

export const checkUserRole = async () => {
  if (user.id && user.role) {
    // El rol del usuario ya está almacenado en la variable global
    return user.role;
  }

  if (user.id) {
    const userDocRef = doc(db, "usuarios", user.id);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      user.role = userData.role;
    }
  }

  notifyAll();

  return user.role;
};

// Cargamos los datos de localStorage, si los hay.
if (localStorage.getItem("user")) {
  user = JSON.parse(localStorage.getItem("user"));
}

onAuthStateChanged(auth, (newUser) => {
  if (newUser) {
    // el rol desde un principio ya lo había manejado por separado. Por cuestiones de tiempo y de testeos, no lo uní con el resto de los datos del usuario.
    /*     checkUserRole();
     */
    setUser({
      id: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      photoURL: newUser.photoURL,
    });

    if (newUser.photoURL) {
      getFileURL(newUser.photoURL).then((url) => {
        setUser({ photoURL: url });
      });
    }

    getUserById(newUser.uid).then((userData) => {
      setUser({ role: userData.role });
    });
  } else {
    clearUser();
  }

  notifyAll();

  console.log("[auth.js] onAuthStateChanged() user:", user);
});

function setUser(newData) {
  user = {
    ...user,
    ...newData,
  };
  localStorage.setItem("user", JSON.stringify(user));
  notifyAll();
}

function clearUser() {
  user = {
    id: null,
    email: null,
    displayName: null,
    photoURL: null,
  };
  localStorage.removeItem("user");
  notifyAll();
}
export const isAdmin = () => {
  return user.role === "admin";
};

/**
 * Iniciar Sesión
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{id: string, email: string}>
 */

export async function login({ email, password }) {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const user = credentials.user;
    console.log("user", user);

    // Obtener el documento de usuario desde Firestore
    const userDocRef = doc(db, "usuarios", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // El documento de usuario existe, obtener los datos adicionales
      const userData = userDocSnapshot.data();
      console.log("El documento de usuario existe.", userData);

      return {
        id: user.uid,
        email: user.email,
        role: userData.role,
        displayName: userData.displayName,
      };
    } else {
      // El documento de usuario no existe
      console.log("El documento de usuario no existe.");
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.log("[auth.js] Error de autenticación del usuario.", error);
    throw error;
  }
}

export async function register({ email, password, role, displayName }) {
  try {
    // Crear el usuario en Firebase Authentication
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { user } = credentials;

    await updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then(() => {
        console.log("user", user);
      })
      .catch((error) => {
        console.log("error", error);
      });

    console.log("user", user);

    // Crear un documento en Firestore con información adicional
    const userData = {
      id: user.uid,
      email: user.email,
      role: role,
      displayName: displayName,
    };

    await createUser(userData);

    return {
      id: user.uid,
      email: user.email,
      role: role,
      displayName: user.displayName,
    };
  } catch (err) {
    console.error("[auth.js register()] Error al registrar el usuario:", err);
    throw err;
  }
}

/**
 * Cerrar Sesión
 *
 * @returns {Promise<void>}
 *
 */

export function logout() {
  return signOut(auth);
}

let observers = []; // array de observadores

/**
 *
 * @param {user} callback
 * @returns {()=> {}} función para desuscribirse
 *
 */

export function subscribeAuth(callback) {
  observers.push(callback);
  notify(callback);
  return () => {
    observers = observers.filter((obs) => obs !== callback);
  };
}

/**
 * Notificar a todos los observers
 * @returns {void}
 */

export function notifyAll() {
  console.log("[auth.js notifyAll] Notificando a los observers: ", observers);
  observers.forEach((callback) => notify(callback));
}

/**
 * * @param {user} callback
 */

export function notify(callback) {
  callback({ ...user });
}

export async function updateUserProfile(id, { displayName, photoURL }) {
  const promises = [];
  // Por defecto, vamos a manejar que la foto que se guarda es la que está actualmente.
  let photoPath = user.photoURL;

  // Si nos pasan una imagen, entonces vamos a definir un "nuevo" nombre de imagen, y pedir que se
  // suba.
  if (photoURL) {
    photoPath = user.id + "/avatar.jpg"; // TODO: Manejar diferentes tipos de imagen.
    promises.push(uploadFileUsingString(photoPath, photoURL));
  }

  promises.push(
    updateProfile(auth.currentUser, { displayName, photoURL: photoPath })
  );
  promises.push(updateUser(id, { displayName, photoURL: photoPath }));

  return Promise.all(promises).then(() => {
    setUser({
      displayName,
    });

    if (photoURL)
      getFileURL(photoPath).then((url) => setUser({ photoURL: url }));
  });
}
