import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
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

// Initialize Firestore with robust local cache & multiple tab support
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
}, firebaseConfig.firestoreDatabaseId);

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
    } else {
      // Update default students with refreshed tokenHistory if exists
      for (const [key, student] of Object.entries(MOCK_STUDENTS)) {
        const docRef = doc(db, STUDENTS_COLLECTION, student.slug || key);
        await setDoc(
          docRef,
          {
            ...student,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
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
    { includeMetadataChanges: true },
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
      // If offline/unavailable, gracefully fallback to local mock data without breaking
      if (error?.code !== "unavailable") {
        console.warn("Firestore snapshot info:", error.message);
      }
      callback(MOCK_STUDENTS);
    }
  );
}

/**
 * Save or update a single student record
 */
export async function saveStudentToFirebase(student: StudentProfile): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.slug);
    await setDoc(
      docRef,
      {
        ...student,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error: any) {
    if (error?.code !== "unavailable") {
      console.warn("Firestore write notice:", error?.message || error);
    }
  }
}

/**
 * Save or update multiple student records at once (for class-wide synchronization)
 */
export async function saveMultipleStudentsToFirebase(students: StudentProfile[]): Promise<void> {
  try {
    await Promise.all(
      students.map((student) =>
        setDoc(
          doc(db, STUDENTS_COLLECTION, student.slug),
          {
            ...student,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        )
      )
    );
  } catch (error: any) {
    if (error?.code !== "unavailable") {
      console.warn("Firestore batch write notice:", error?.message || error);
    }
  }
}

/**
 * Delete a student record
 */
export async function deleteStudentFromFirebase(slug: string): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, slug);
    await deleteDoc(docRef);
  } catch (error: any) {
    if (error?.code !== "unavailable") {
      console.warn("Firestore delete notice:", error?.message || error);
    }
  }
}
