import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  // Only throw if missing/insufficient permissions so diagnosing tools can capture permission errors,
  // while allowing transient offline connectivity warnings to fall back gracefully without crashing UI
  if (errMessage.toLowerCase().includes("permission") || (error as any)?.code === "permission-denied") {
    console.error("Firestore Permission Error: ", JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn("Firestore Operation Notice: ", JSON.stringify(errInfo));
  }
}

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
    handleFirestoreError(error, OperationType.LIST, STUDENTS_COLLECTION);
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
      handleFirestoreError(error, OperationType.GET, STUDENTS_COLLECTION);
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
    handleFirestoreError(error, OperationType.WRITE, `${STUDENTS_COLLECTION}/${student.slug}`);
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
    handleFirestoreError(error, OperationType.WRITE, STUDENTS_COLLECTION);
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
    handleFirestoreError(error, OperationType.DELETE, `${STUDENTS_COLLECTION}/${slug}`);
  }
}

