import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

function getCollection(name: string) {
  if (!db) return null;
  return collection(db, name);
}

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export interface TeamMemberData {
  id?: string;
  name: string;
  role: string;
  avatar: string;
}

export interface MessageData {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

async function getProjects(): Promise<ProjectData[]> {
  const col = getCollection('projects');
  if (!col) return [];
  const q = query(col, orderBy('title'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectData));
}

async function addProject(data: Omit<ProjectData, 'id'>): Promise<string | null> {
  const col = getCollection('projects');
  if (!col) return null;
  const ref = await addDoc(col, data);
  return ref.id;
}

async function updateProject(id: string, data: Partial<ProjectData>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'projects', id), data);
}

async function deleteProject(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'projects', id));
}

async function getTeamMembers(): Promise<TeamMemberData[]> {
  const col = getCollection('team');
  if (!col) return [];
  const q = query(col, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMemberData));
}

async function addTeamMember(data: Omit<TeamMemberData, 'id'>): Promise<string | null> {
  const col = getCollection('team');
  if (!col) return null;
  const ref = await addDoc(col, data);
  return ref.id;
}

async function updateTeamMember(id: string, data: Partial<TeamMemberData>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'team', id), data);
}

async function deleteTeamMember(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'team', id));
}

async function getMessages(): Promise<MessageData[]> {
  const col = getCollection('messages');
  if (!col) return [];
  const q = query(col, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as MessageData));
}

async function addMessage(data: Omit<MessageData, 'id'>): Promise<string | null> {
  const col = getCollection('messages');
  if (!col) return null;
  const ref = await addDoc(col, data);
  return ref.id;
}

async function markMessageRead(id: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'messages', id), { read: true });
}

async function deleteMessage(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'messages', id));
}

export const firestoreService = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getMessages,
  addMessage,
  markMessageRead,
  deleteMessage,
};
