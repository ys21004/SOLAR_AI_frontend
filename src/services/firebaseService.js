import { auth, db, storage } from '../config/firebase';

// Authentication functions
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    throw error;
  }
};

// Firestore functions
export const addMaintenanceRecord = async (record) => {
  try {
    const docRef = await db.collection('maintenance').add({
      ...record,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getMaintenanceRecords = async () => {
  try {
    const snapshot = await db.collection('maintenance').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw error;
  }
};

// Storage functions
export const uploadImage = async (file, path) => {
  try {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(path);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
  } catch (error) {
    throw error;
  }
}; 