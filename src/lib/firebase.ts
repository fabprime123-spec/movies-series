import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot,
  Firestore 
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { WatchlistItem, UserProfile } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || '',
  authDomain: firebaseConfigData.authDomain || '',
  projectId: firebaseConfigData.projectId || '',
  storageBucket: firebaseConfigData.storageBucket || '',
  messagingSenderId: firebaseConfigData.messagingSenderId || '',
  appId: firebaseConfigData.appId || '',
};

// Initialize Firebase App safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Use custom firestore database ID if specified in config
export const db: Firestore = (firebaseConfigData as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfigData as any).firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-in Error:', error);
    throw error;
  }
};

export const signInAsGuest = async (): Promise<FirebaseUser> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error: any) {
    console.error('Guest Sign-in Error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

// Map Firebase user to clean UserProfile
export const mapFirebaseUser = (user: FirebaseUser | null): UserProfile | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.isAnonymous ? 'Guest Cinephile' : 'MovieAce Explorer'),
    photoURL: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
    isAnonymous: user.isAnonymous,
  };
};

// Sync Watchlist with Firestore
export const saveWatchlistItemToFirestore = async (userId: string, item: WatchlistItem): Promise<void> => {
  if (!userId) return;
  try {
    const userDocRef = doc(db, 'users', userId);
    const itemDocRef = doc(collection(userDocRef, 'watchlist'), item.id);
    await setDoc(itemDocRef, item, { merge: true });
  } catch (err) {
    console.warn('Could not sync item to Firestore (offline or rules):', err);
  }
};

export const deleteWatchlistItemFromFirestore = async (userId: string, itemId: string): Promise<void> => {
  if (!userId) return;
  try {
    const userDocRef = doc(db, 'users', userId);
    const itemDocRef = doc(collection(userDocRef, 'watchlist'), itemId);
    await deleteDoc(itemDocRef);
  } catch (err) {
    console.warn('Could not delete item from Firestore:', err);
  }
};

export const fetchWatchlistFromFirestore = async (userId: string): Promise<WatchlistItem[]> => {
  if (!userId) return [];
  try {
    const userDocRef = doc(db, 'users', userId);
    const watchlistCol = collection(userDocRef, 'watchlist');
    const snapshot = await getDocs(watchlistCol);
    const items: WatchlistItem[] = [];
    snapshot.forEach((docSnapshot) => {
      items.push(docSnapshot.data() as WatchlistItem);
    });
    return items;
  } catch (err) {
    console.warn('Failed to fetch from Firestore, relying on local storage:', err);
    return [];
  }
};
