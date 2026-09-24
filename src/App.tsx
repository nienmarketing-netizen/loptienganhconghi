import React, { useState, useEffect } from "react";
import { MOCK_STUDENTS } from "./data/mockStudents";
import { StudentProfile } from "./types";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MainHeader } from "./components/MainHeader";
import {
  seedInitialStudentsIfEmpty,
  subscribeToStudents,
  saveStudentToFirebase,
  saveMultipleStudentsToFirebase,
  deleteStudentFromFirebase,
} from "./lib/firebase";
import { getStudentTokenBalance } from "./lib/studentUtils";

export default function App() {
  // Global state for students to allow reactive live scoring
  const [studentsMap, setStudentsMap] =
    useState<Record<string, StudentProfile>>(MOCK_STUDENTS);

  // Initialize and subscribe to Firebase Firestore
  useEffect(() => {
    seedInitialStudentsIfEmpty();
    const unsubscribe = subscribeToStudents((data) => {
      if (data && Object.keys(data).length > 0) {
        const normalizedData: Record<string, StudentProfile> = {};
        for (const [key, stu] of Object.entries(data)) {
          normalizedData[key] = {
            ...stu,
            gamification: {
              ...stu.gamification,
              currentTokens: getStudentTokenBalance(stu),
            },
          };
        }
        setStudentsMap(normalizedData);
      }
    });
    return () => unsubscribe();
  }, []);

  // Helper to get initial route
  const getInitialRoute = (): "student" | "admin" => {
    const pathname = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (
      pathname.startsWith("/giao-vien") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/teacher") ||
      search.includes("portal=giao-vien") ||
      search.includes("portal=admin") ||
      search.includes("portal=teacher") ||
      hash.includes("giao-vien") ||
      hash.includes("admin")
    ) {
      return "admin";
    }
    return "student";
  };

  // Helper to extract student slug from pathname
  const getInitialStudentSlug = (): string => {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/student\/([^/?#]+)/);
    const targetSlug = match ? match[1] : null;

    if (targetSlug) {
      if (MOCK_STUDENTS[targetSlug]) {
        return targetSlug;
      }
      const foundById = Object.values(MOCK_STUDENTS).find(
        (s) => s.id.toLowerCase() === targetSlug.toLowerCase()
      );
      if (foundById) return foundById.slug;
    }

    return "hoang-nam";
  };

  const [currentRoute, setCurrentRoute] = useState<"student" | "admin">(getInitialRoute);
  const [currentStudentSlug, setCurrentStudentSlug] = useState<string>(getInitialStudentSlug);

  const currentStudent =
    studentsMap[currentStudentSlug] || studentsMap["hoang-nam"];

  // Navigation handlers
  const handleNavigateToAdmin = () => {
    setCurrentRoute("admin");
    window.history.pushState({ route: "admin" }, "", "/giao-vien");
  };

  const handleNavigateToStudent = (slug?: string) => {
    const targetSlug = slug || currentStudentSlug;
    setCurrentRoute("student");
    setCurrentStudentSlug(targetSlug);
    window.history.pushState(
      { route: "student", slug: targetSlug },
      "",
      targetSlug ? `/student/${targetSlug}` : "/"
    );
  };

  const handleSelectStudent = (slug: string) => {
    if (studentsMap[slug]) {
      setCurrentStudentSlug(slug);
      if (currentRoute === "student") {
        window.history.pushState({ route: "student", slug }, "", `/student/${slug}`);
      }
    }
  };

  // Quick 1-touch scoring function
  const handleUpdateStudentTokens = async (
    studentSlug: string,
    tokensToAdd: number,
    reason: string
  ) => {
    const student = studentsMap[studentSlug];
    if (!student) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dayStr = String(now.getDate()).padStart(2, "0");
    const monthStr = String(now.getMonth() + 1).padStart(2, "0");
    const dateStr = `${timeStr}, ${dayStr}/${monthStr}/2026`;

    const newHistoryItem = {
      id: `tk-${Date.now()}`,
      date: dateStr,
      reason,
      tokens: tokensToAdd,
      type: "earned" as const,
      category: "bonus" as const,
    };

    const newHistory = [newHistoryItem, ...(student.tokenHistory || [])];
    const newTokens = newHistory.reduce((sum, item) => sum + item.tokens, 0);

    const updatedStudent: StudentProfile = {
      ...student,
      gamification: {
        ...student.gamification,
        currentTokens: newTokens,
      },
      tokenHistory: newHistory,
    };

    setStudentsMap((prev) => ({
      ...prev,
      [studentSlug]: updatedStudent,
    }));

    await saveStudentToFirebase(updatedStudent);
  };

  // Batch students profile save handler
  const handleSaveMultipleStudents = async (updatedList: StudentProfile[]) => {
    setStudentsMap((prev) => {
      const copy = { ...prev };
      updatedList.forEach((s) => {
        copy[s.slug] = s;
      });
      return copy;
    });
    await saveMultipleStudentsToFirebase(updatedList);
  };

  // Full student profile save handler (persisting to Firebase Firestore)
  const handleSaveStudent = async (student: StudentProfile) => {
    setStudentsMap((prev) => ({
      ...prev,
      [student.slug]: student,
    }));
    await saveStudentToFirebase(student);
  };

  // Delete student profile handler
  const handleDeleteStudent = async (slug: string) => {
    setStudentsMap((prev) => {
      const copy = { ...prev };
      delete copy[slug];
      return copy;
    });
    await deleteStudentFromFirebase(slug);
  };

  // Listen to popstate (browser back/forward navigation)
  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(getInitialRoute());
      setCurrentStudentSlug(getInitialStudentSlug());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="min-h-screen bg-[#d2dbe7] text-[#1e293b] antialiased font-sans flex flex-col selection:bg-[#ff4757] selection:text-white">
      {/* Main Header with Logo, Portal Switcher, and Section Navigation */}
      <MainHeader
        currentRoute={currentRoute}
        currentStudent={currentStudent}
        studentsMap={studentsMap}
        onSelectStudent={handleSelectStudent}
        onNavigateToAdmin={handleNavigateToAdmin}
        onNavigateToStudent={handleNavigateToStudent}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-2 sm:pb-4">
        {currentRoute === "admin" ? (
          <AdminDashboard
            students={studentsMap}
            onUpdateStudentTokens={handleUpdateStudentTokens}
            onSaveStudent={handleSaveStudent}
            onSaveMultipleStudents={handleSaveMultipleStudents}
            onDeleteStudent={handleDeleteStudent}
            onViewStudentPortal={(slug) => handleNavigateToStudent(slug)}
          />
        ) : (
          <StudentDashboard
            student={currentStudent}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        )}
      </main>
    </div>
  );
}
