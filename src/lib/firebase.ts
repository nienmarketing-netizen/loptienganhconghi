import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { StudentProfile } from "../types";
import { MOCK_STUDENTS } from "../data/mockStudents";

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const STUDENTS_COLLECTION = "students";

/**
 * Seed initial students into Firestore if empty
 */
export async function seedInitialStudentsIfEmpty(): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    if (querySnapshot.empty) {
      // Seed default students
      for (const [key, student] of Object.entries(MOCK_STUDENTS)) {
        const docRef = doc(db, STUDENTS_COLLECTION, student.slug || key);
        await setDoc(docRef, {
          ...student,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  } catch (error) {
    console.error("Error seeding initial students to Firestore:", error);
  }
}

/**
 * Real-time listener for all students
 */
export function subscribeToStudents(
  callback: (students: Record<string, StudentProfile>) => void
): () => void {
  const colRef = collection(db, STUDENTS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        callback(MOCK_STUDENTS);
        return;
      }
      const data: Record<string, StudentProfile> = {};
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as StudentProfile;
        data[item.slug || docSnap.id] = item;
      });
      callback(data);
    },
    (error) => {
      console.error("Firestore snapshot error:", error);
      // Fallback to mock data if offline or error
      callback(MOCK_STUDENTS);
    }
  );
}

/**
 * Save or update a single student record
 */
export async function saveStudentToFirebase(student: StudentProfile): Promise<void> {
  const docRef = doc(db, STUDENTS_COLLECTION, student.slug);
  await setDoc(
    docRef,
    {
      ...student,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Delete a student record
 */
export async function deleteStudentFromFirebase(slug: string): Promise<void> {
  const docRef = doc(db, STUDENTS_COLLECTION, slug);
  await deleteDoc(docRef);
}
