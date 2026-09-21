import React, { useState, useEffect } from "react";
import { MOCK_STUDENTS } from "./data/mockStudents";
import { StudentProfile } from "./types";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { MainHeader } from "./components/MainHeader";

export default function App() {
  // Global state for students to allow reactive live scoring
  const [studentsMap, setStudentsMap] =
    useState<Record<string, StudentProfile>>(MOCK_STUDENTS);

  // Helper to get initial route
  const getInitialRoute = (): "student" | "admin" => {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/admin")) {
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
    window.history.pushState({ route: "admin" }, "", "/admin/dashboard");
  };

  const handleNavigateToStudent = (slug?: string) => {
    const targetSlug = slug || currentStudentSlug;
    setCurrentRoute("student");
    setCurrentStudentSlug(targetSlug);
    window.history.pushState(
      { route: "student", slug: targetSlug },
      "",
      `/student/${targetSlug}`
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
  const handleUpdateStudentTokens = (
    studentSlug: string,
    tokensToAdd: number,
    reason: string
  ) => {
    setStudentsMap((prev) => {
      const student = prev[studentSlug];
      if (!student) return prev;

      const newTokens = Math.min(
        student.gamification.maxTokens,
        student.gamification.currentTokens + tokensToAdd
      );

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

      const updatedStudent: StudentProfile = {
        ...student,
        gamification: {
          ...student.gamification,
          currentTokens: newTokens,
        },
        tokenHistory: [newHistoryItem, ...(student.tokenHistory || [])],
      };

      return {
        ...prev,
        [studentSlug]: updatedStudent,
      };
    });
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
    <div className="min-h-screen bg-slate-100/70 text-slate-800 antialiased font-sans flex flex-col selection:bg-amber-400 selection:text-slate-900">
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
            onViewStudentPortal={(slug) => handleNavigateToStudent(slug)}
          />
        ) : (
          <StudentDashboard student={currentStudent} />
        )}
      </main>
    </div>
  );
}
