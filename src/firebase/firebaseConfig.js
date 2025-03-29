// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
// Importa los servicios de Firebase que vayas a usar
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getDatabase } from 'firebase/database';
// import { getStorage } from 'firebase/storage';
// import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Exporta la instancia de la aplicación y los servicios que necesites
export default app;
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const database = getDatabase(app);
// export const storage = getStorage(app);
// export const messaging = getMessaging(app);