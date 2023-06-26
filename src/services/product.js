// aca la lógica del chat de firebase
import { db } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  orderBy,
  getDoc,
  getDocs,
  query,
  updateDoc,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";

export async function createProduct(product) {
  try {
    const docRef = await addDoc(collection(db, "productos"), {
      ...product,
      createdAt: serverTimestamp(),
    });

    const productId = docRef.id;
    console.log("Document written with ID:", productId);

    // Agregar el ID al objeto de producto
    const productWithId = { id: productId, ...product };
    console.log("productWithId", productWithId);
    return productWithId;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error; // O maneja el error de alguna otra manera
  }
}

// servicio para manejar todas las funcionalidades de productos
export async function getProducts() {
  const productRef = collection(db, "productos");
  const firestoreQuery = query(productRef, orderBy("createdAt"));
  const snapshot = await getDocs(firestoreQuery);
  const products = snapshot.docs.map((doc) => {
    const productData = doc.data();
    const productId = doc.id;
    return { id: productId, ...productData };
  });
  console.log(products);
  return products;
}

export function subscribeToProductChanges(callback) {
  const productRef = collection(db, "productos");

  const unsubscribe = onSnapshot(productRef, (snapshot) => {
    const updatedProducts = snapshot.docs.map((doc) => doc.data());
    callback(updatedProducts);
  });

  // Devuelve una función para cancelar la suscripción
  return unsubscribe;
}

export async function deleteProduct(id) {
  const productRef = doc(db, "productos", id);
  await deleteDoc(productRef);
}

export async function updateProduct(id, product) {
  console.log("product", product);
  console.log("id", id);
  const productRef = doc(db, "productos", id);
  await updateDoc(productRef, product);
}

export async function getProductById(id) {
  const productRef = doc(db, "productos", id);
  const product = await getDoc(productRef);
  if (!product.exists()) {
    throw new Error("[productService.js getProductById] El producto no existe");
  }
  return {
    id: product.id,
    ...product.data(),
  };
}

export async function reserveProduct(product, userId) {
  console.log("product", product);
  try {
    const reservationData = {
      product: product,
      userId: userId,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "reservas"), reservationData);
    const reservationId = docRef.id;
    console.log("Reservation created with ID:", reservationId);
    return reservationId;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
}

export async function getPurchasedProductsByUser(userId) {
  const reservationsRef = collection(db, "reservas");
  const reservationsSnapshot = await getDocs(
    query(reservationsRef, where("userId", "==", userId))
  );
  const reservations = reservationsSnapshot.docs.map((doc) => {
    const reservationData = doc.data();
    const reservationId = doc.id;
    return { id: reservationId, ...reservationData };
  });
  console.log("fc getPurchasedProductByUser", reservations);
  return reservations;
}

export async function getAllSoldProducts() {
  const reservationsRef = collection(db, "reservas");
  const reservationsSnapshot = await getDocs(reservationsRef);
  const reservations = [];

  for (const docRef of reservationsSnapshot.docs) {
    const reservationData = docRef.data();
    const reservationId = docRef.id;

    // Obtener el nombre del usuario de la compra
    const userSnapshot = await getDoc(
      doc(db, "usuarios", reservationData.userId)
    );
    const userData = userSnapshot.data();

    reservations.push({
      id: reservationId,
      ...reservationData,
      userName: userData?.displayName || "Nombre de usuario desconocido",
    });
  }

  console.log("getAllSoldProducts", reservations);
  return reservations;
}
