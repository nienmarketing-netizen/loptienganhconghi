import React from "react";
import { MOCK_STUDENTS } from "../../../data/mockStudents";
import { StudentDashboard } from "../../../pages/StudentDashboard";

interface PageProps {
  params: {
    studentId: string;
  };
}

export default function StudentPage({ params }: PageProps) {
  // Support slug or ID lookup
  const studentSlug = params?.studentId || "hoang-nam";
  const student =
    MOCK_STUDENTS[studentSlug] ||
    Object.values(MOCK_STUDENTS).find((s) => s.id === studentSlug) ||
    MOCK_STUDENTS["hoang-nam"];

  return <StudentDashboard student={student} />;
}
