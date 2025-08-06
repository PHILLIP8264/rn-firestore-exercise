import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_NAME = "Items";

export const createNewBucketItem = async (item) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getAllBucketItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return items;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

export const getBucketItemById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Document not found");
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
};

export const updateBucketItem = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const deleteBucketItem = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

export const markItemCompleted = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      isCompleted: true,
      completedAt: new Date(),
      updatedAt: new Date(),
    });
    return true;
  } catch (e) {
    console.error("Error marking item as completed: ", e);
    throw e;
  }
};
