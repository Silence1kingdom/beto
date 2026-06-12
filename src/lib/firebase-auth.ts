import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

export async function firebaseLogin(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Firebase not configured');
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function firebaseRegister(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Firebase not configured');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function firebaseLogout(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function firebaseOnAuth(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  const unsubscribe = onAuthStateChanged(auth, callback);
  return unsubscribe;
}
