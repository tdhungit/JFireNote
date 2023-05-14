import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DbCollections } from './../config/firebase';

export function createResponse(document: DocumentData) {
  return { ...document.data() };
}

export async function addGroupNote(db: Firestore, name: string) {
  return await addDoc(collection(db, DbCollections.category), {
    createdAt: serverTimestamp(),
    name,
  });
}

export async function updateGroup(db: Firestore, id: string, name: string) {
  const ref = doc(db, DbCollections.category, id);
  const result: any = await updateDoc(ref, { name });
  return { id: id, ...result };
}

export function getGroups(db: Firestore, callback: (data: any) => void) {
  const q = query(
    collection(db, DbCollections.category),
    orderBy('createdAt'),
    limit(100)
  );

  return onSnapshot(q, (QuerySnapshot) => {
    let groups: any = [];
    QuerySnapshot.forEach((doc) => {
      groups.push({ ...doc.data(), id: doc.id });
    });
    callback(groups);
  });
}

export async function addNote(db: Firestore, name: string, groupId: string) {
  return await addDoc(collection(db, DbCollections.note), {
    createdAt: serverTimestamp(),
    name,
    groupId,
    content: '',
  });
}

export async function getNotes(
  db: Firestore,
  groupId: string,
  callback: (data: any, err: any) => void
) {
  const q = query(
    collection(db, DbCollections.note),
    where('groupId', '==', groupId),
    orderBy('createdAt'),
    limit(100)
  );

  onSnapshot(
    q,
    (QuerySnapshot) => {
      let notes: any = [];
      QuerySnapshot.forEach((doc) => {
        notes.push({ ...doc.data(), id: doc.id });
      });
      callback(notes, null);
    },
    (error) => {
      callback(null, error);
    }
  );
}

export async function getNote(db: Firestore, id: string) {
  const docRef = doc(db, DbCollections.note, id);
  const document = await getDoc(docRef);
  return { ...document.data(), id };
}

export async function saveNote(
  db: Firestore,
  id: string,
  name?: any,
  content?: any,
  groupId?: string
) {
  const ref = doc(db, DbCollections.note, id);

  let data: any = {};
  if (name) {
    data.name = name;
  }

  if (content) {
    data.content = content;
  }

  if (groupId) {
    data.groupId = groupId;
  }

  const result: any = await updateDoc(ref, data);
  return { id: id, ...data, ...result };
}

export async function deleteNote(db: Firestore, noteId: string) {
  const ref = doc(db, DbCollections.note, noteId);
  await deleteDoc(ref);
}

export async function deleteGroup(
  db: Firestore,
  groupId: string,
  moveNoteTo: string,
  callback: () => void
) {
  const ref = doc(db, DbCollections.category, groupId);
  await deleteDoc(ref);
  getNotes(db, groupId, async (notes: any) => {
    for await (const note of notes) {
      if (moveNoteTo) {
        await saveNote(db, note.id, null, null, moveNoteTo);
      } else {
        await deleteNote(db, note.id);
      }
    }
    callback();
  });
}
