import { StudentProfile } from "../types";

/**
 * Xuất danh sách học sinh ra file CSV (UTF-8 BOM hỗ trợ 100% tiếng Việt trên Excel & Google Sheets)
 */
export function exportStudentsToCSV(students: Record<string, StudentProfile>) {
  const studentList = Object.values(students);
  if (studentList.length === 0) return;

  const headers = [
    "Mã Học Sinh",
    "Họ Và Tên",
    "Khối Lớp",
    "Trường Học",
    "Phụ Huynh (Danh xưng)",
    "Họ Tên Phụ Huynh",
    "Số Điện Thoại Zalo",
    "Tokens Hiện Tại",
    "Mục Tiêu Quà Tặng",
    "Điểm Chuẩn Đầu Vào",
    "Điểm Đánh Giá Gần Nhất",
    "Bài Chưa Nộp",
    "Bài Đã Chấm",
    "Thái Độ Học Tập",
  ];

  const rows = studentList.map((s) => {
    const unsubmitted = (s.assignments || []).filter((a) => a.status === "not_done").length;
    const graded = (s.assignments || []).filter((a) => a.status === "graded").length;
    const latestScore =
      s.recentLesson?.score?.value ??
      s.teacherDiagnosis?.currentOverallScore ??
      s.growthHistory?.slice(-1)[0]?.classScore ??
      "N/A";
    const baselineScore =
      s.teacherDiagnosis?.baselineOverallScore ??
      s.growthHistory?.[0]?.classScore ??
      "N/A";

    return [
      `"${s.id}"`,
      `"${s.fullName}"`,
      `"${s.grade}"`,
      `"${s.school}"`,
      `"${s.parentSalutation}"`,
      `"${s.parentName}"`,
      `"${s.teacherDiagnosis?.messageToParents ? "Có thông tin" : ""}"`,
      s.gamification?.currentTokens ?? 0,
      `"${s.gamification?.targetRewardName ?? "Chưa đặt"}"`,
      baselineScore,
      latestScore,
      unsubmitted,
      graded,
      `"${s.attitudeBadge?.label ?? "Bình thường"}"`,
    ];
  });

  // UTF-8 BOM
  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `Danh_Sach_Hoc_Sinh_Co_Nghi_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
