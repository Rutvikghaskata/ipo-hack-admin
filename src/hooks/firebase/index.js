import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useCallback } from "react";
import { db } from "../../firebase";

function useFirebaseContext() {
  const addDocument = useCallback(async (collectionName, collectionData) => {
    return await addDoc(collection(db, collectionName), collectionData);
  }, []);

  const updateDocument = useCallback(
    async (collectionName, collectionId, updatedFields) => {
      return await updateDoc(
        doc(db, collectionName, collectionId),
        updatedFields
      );
    },
    []
  );

  const deleteDocument = useCallback(async (collectionName, collectionId) => {
    return await deleteDoc(doc(db, collectionName, collectionId));
  }, []);

  const addRecentActivity = useCallback(
    async (title, collectionName, docsId, type, redirectUrl) => {
      return await addDoc(collection(db, "recent_activity"), {
        title,
        collection: collectionName,
        docsId,
        createdAt: Timestamp.fromDate(new Date()),
        createdBy: "Super Admin",
        type,
        redirectUrl: redirectUrl || false,
      });
    },
    []
  );

  const getDocuments = useCallback(async (collectionName) => {
    return await getDocs(collection(db, collectionName));
  }, []);

  return {
    addDocument,
    addRecentActivity,
    getDocuments,
    updateDocument,
    deleteDocument,
  };
}

export default useFirebaseContext;
