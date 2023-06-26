import { db } from "./firebase.js";
import {
  setDoc,
  doc,
  getDoc,
  query,
  getDocs,
  where,
  collection,
  updateDoc,
} from "firebase/firestore";
import { auth } from "./firebase.js";
import { checkUserRole } from "./auth.js";

export async function createUser(userData) {
  try {
    // Crear un documento en Firestore con información adicional
    const { id, email, role, displayName } = userData;
    console.log("userData", userData);

    console.log(
      "[users.js createUser()] Creando usuario con id:",
      id,
      email,
      role,
      displayName
    );

    const userRef = doc(db, "usuarios", id);
    const userDataFirestore = {
      email: email,
      role: role,
      displayName: displayName,
    };

    await setDoc(userRef, userDataFirestore);

    return {
      id,
      email,
      role,
      displayName,
    };
  } catch (err) {
    console.error(
      "[userService.js createUser()] Error al crear los datos del usuario:",
      err
    );
    throw err;
  }
}

export async function getUserById(id) {
  const userRef = doc(db, "usuarios", id);

  const user = await getDoc(userRef);

  if (!user.exists()) {
    throw new Error("[users.js getUserById] El usuario no existe");
  }

  return {
    id: user.id,
    ...user.data(),
  };
}

export async function getUsersByRole(role) {
  try {
    console.log("Obteniendo usuarios por rol:", role);

    const usersRef = collection(db, "usuarios");

    // Crea una consulta para obtener los usuarios por rol
    const q = query(usersRef, where("role", "==", role.role));

    const querySnapshot = await getDocs(q); // Obtiene el snapshot de los usuarios que coinciden con la consulta

    // Mapea los datos de los usuarios
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios por rol:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  const user = auth.currentUser;
  const role = await checkUserRole(user.id);
  console.log("role", role);

  if (user) {
    return {
      id: user.uid,
      email: user.email,
      role: role,
    };
  } else {
    return null;
  }
}

/**
 *
 * @param {string} id
 * @returns {Promise<{displayName: string, photoURL: string, email: string, id: string}>}
 */

export async function getUserProfile(id) {
  const userData = await getDoc(doc(db, `usuarios/${id}`));
  return {
    id,
    ...userData.data(),
  };
}

export async function updateUser(id, { displayName = null, photoURL = null }) {
  return updateDoc(doc(db, "usuarios", id), {
    displayName,
    photoURL,
  });
}
