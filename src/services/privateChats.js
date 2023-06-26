import { db } from "./firebase";
import { getUserById } from "./users";

import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    where,
    limit,
    getDocs,
    orderBy,
    onSnapshot,
    doc,
    
} from "firebase/firestore";

/**
 * @param {string} from
 * @param {string} to
 * @param {string} message
 * @return {Promise<boolean>}
 */

export async function sendPrivateMessages(from, to, message) {

 console.log ('estoy en linea 27 de private-chats.js')  

  const docRef = await getPrivateChatRef(from, to);

  const messagesRef = collection(db, "chats-privados", docRef.id, "messages");

  const messageRef = await addDoc(messagesRef, {
    userId: from,
    message,
    created_at: serverTimestamp(),
  });

  return true;
}

/**
 *
 * @param {string } userFrom from
 * @param {string} userTo to
 * @returns {Promise<QueryDocumentSnapshot<DocumentData>|DocumentReference<{users: {} | {}}>>}
 */

async function getPrivateChatRef(userFrom, userTo) {

  console.log("[private-chats.js getPrivateChatRef] userFrom: ", userFrom, "userTo: ", userTo);
  const chatRef = collection(db, "chats-privados");

  const users = {
    [userFrom]: true,
    [userTo]: true,
  };

  const q = query(chatRef, where("users", "==", users), limit(1));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        const newRef = await addDoc(chatRef, { users: {
            [userFrom]: true,
            [userTo]: true,
        } });

        return newRef;

    }

    return querySnapshot.docs[0];



}

export async function getChatMessages(chatId) {
  const chatDocRef = doc(db, "chats-privados", chatId);
  const messagesCollectionRef = collection(chatDocRef, "messages");

  const querySnapshot = await getDocs(messagesCollectionRef);
  const messages = [];

  for (const doc of querySnapshot.docs) {
    const messageData = doc.data();

    // Obtener el usuario correspondiente al mensaje
    const userData = await getUserById(messageData.userId);

    // Agregar la información del usuario al mensaje
    const messageWithUser = {
      ...messageData,
      user: userData,
    };

    messages.push(messageWithUser);
  }

  return messages;
}



export async function subscribeToPrivateChat(from, to, callback) {
    
  const docRef = await getPrivateChatRef(from, to);
    console.log(from, to);

    const messagesCollection = collection(db, 'chats-privados', docRef.id, 'messages');

    const q = query(messagesCollection, orderBy('created_at'), limit(50));
  
    return onSnapshot(q, (querySnapshot) => {
  
  
      const docs = querySnapshot.docs.map(doc => {
        return {
            userId: doc.data().userId,
            message: doc.data().message,
            created_at: doc.data().created_at?.toDate(),
        }
    });
  
      callback(docs);
    });
  }


 export async function getPrivateChatsByAdvisor(advisorId) {
    console.log("[private-chats.js getPrivateChatsByAdvisor] advisorId: ", advisorId);
    const chatRef = collection(db, "chats-privados");
  
    const q = query(chatRef, where(`users.${advisorId}`, "==", true));
  
    const querySnapshot = await getDocs(q);
    const chatRefs = querySnapshot.docs.map((doc) => doc.ref);
    console.log("chatRefs", chatRefs)
  
    return chatRefs;
  }

  