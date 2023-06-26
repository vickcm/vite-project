// aca la lógica del chat de firebase
import { db } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

/**
 * 
 * @param {displayname} data 
 * @returns 
 */

export function sendMessage(data) {
  const chatRef = collection(db, "minichat");

  return addDoc(chatRef, {

    ...data,
    hora_creacion: serverTimestamp(),
  })
    .then(() => null)
    .catch((error) => {
      console.log("[chat.js sendMessage] Error al enviar el mensaje. ", error);
      throw error;
    });
}

export function subscribeToChatMessages(callback) {
  const chatRef = collection(db, "minichat");
  const q = query(chatRef, orderBy("hora_creacion"));
  onSnapshot(q, (snapshot) => {
    const output = [];
    snapshot.forEach((doc) => {
      output.push({
        userId: doc.data().userId,
        nombre: doc.data().nombre,
        mensaje: doc.data().mensaje,
        hora_creacion: doc.data().hora_creacion?.toDate(),
      });
    });
    callback(output);
  });

  // Invocamos la función de callback que nos pasaron como argumento y le proveemos con los mensajes
  // parseados.
}
