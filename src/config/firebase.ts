import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore using provisioned database ID
export const db = 
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Connection check
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system', 'ping'));
    console.log('Firebase Firestore connection verified successfully');
    return true;
  } catch (error: any) {
    // If permission or document not found, it still reached Firestore server
    if (error?.code === 'unavailable' || error?.message?.includes('the client is offline')) {
      console.warn('Firestore is currently offline or unreachable:', error);
      return false;
    }
    console.log('Firestore connection verified with server response');
    return true;
  }
}
