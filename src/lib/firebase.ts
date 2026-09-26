import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  memoryLocalCache,
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

// Initialize Firestore with robust memory cache that gracefully works in offline and restricted iframe environments
export const db = initializeFirestore(
  app,
  {
    localCache: memoryLocalCache(),
  },
  firebaseConfig.firestoreDatabaseId
);

const STUDENTS_COLLECTION = "students";
const LOCAL_STORAGE_KEY = "conghi_students_cache";

// Helper to get cached students from localStorage as instantaneous fallback
function getLocalFallbackStudents(): Record<string, StudentProfile> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }
  return MOCK_STUDENTS;
}

// Helper to save to local cache
function saveLocalFallbackStudents(students: Record<string, StudentProfile>): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  } catch {
    // Ignore storage quota errors
  }
}

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
    // Graceful silent fallback in offline/preview environments
  }
}

/**
 * Real-time listener for all students
 */
export function subscribeToStudents(
  callback: (students: Record<string, StudentProfile>) => void
): () => void {
  const colRef = collection(db, STUDENTS_COLLECTION);
  let hasReceivedSnapshot = false;

  const unsubscribe = onSnapshot(
    colRef,
    { includeMetadataChanges: true },
    (snapshot) => {
      hasReceivedSnapshot = true;
      if (snapshot.empty) {
        callback(getLocalFallbackStudents());
        return;
      }
      const data: Record<string, StudentProfile> = {};
      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as StudentProfile;
        data[item.slug || docSnap.id] = item;
      });
      saveLocalFallbackStudents(data);
      callback(data);
    },
    (error) => {
      // Handle offline or backend timeout gracefully without breaking application
      if (!hasReceivedSnapshot) {
        callback(getLocalFallbackStudents());
      }
    }
  );

  return unsubscribe;
}

/**
 * Save or update a single student record
 */
export async function saveStudentToFirebase(student: StudentProfile): Promise<void> {
  // Update local fallback immediately for seamless UX
  try {
    const current = getLocalFallbackStudents();
    current[student.slug] = student;
    saveLocalFallbackStudents(current);
  } catch {
    // Ignore local save error
  }

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
  } catch (error) {
    // Handled via local fallback
  }
}

/**
 * Save or update multiple student records at once (for class-wide synchronization)
 */
export async function saveMultipleStudentsToFirebase(students: StudentProfile[]): Promise<void> {
  // Update local fallback immediately
  try {
    const current = getLocalFallbackStudents();
    students.forEach((s) => {
      current[s.slug] = s;
    });
    saveLocalFallbackStudents(current);
  } catch {
    // Ignore local save error
  }

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
  } catch (error) {
    // Handled via local fallback
  }
}

/**
 * Delete a student record
 */
export async function deleteStudentFromFirebase(slug: string): Promise<void> {
  try {
    const current = getLocalFallbackStudents();
    delete current[slug];
    saveLocalFallbackStudents(current);
  } catch {
    // Ignore local save error
  }

  try {
    const docRef = doc(db, STUDENTS_COLLECTION, slug);
    await deleteDoc(docRef);
  } catch (error) {
    // Handled via local fallback
  }
}

