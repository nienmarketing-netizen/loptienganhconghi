import React, { useState } from "react";
import {
  Coins,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Plus,
  Send,
  Sparkles,
  Users,
  GraduationCap,
  Calendar,
  MessageCircle,
  X,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Award,
  Copy,
  Download,
  Database,
} from "lucide-react";
import { StudentProfile, Assignment } from "../types";
import { NewStudentModal } from "../components/NewStudentModal";
import { GradingModal } from "../components/GradingModal";
import { TokenManagerModal } from "../components/TokenManagerModal";
import { exportStudentsToCSV } from "../lib/exportUtils";
import { DAYS_MAPPING, SHIFT_MAPPING } from "../lib/studentUtils";
import { ClassLessonEditor } from "../components/ClassLessonEditor";

interface AdminDashboardProps {
  students: Record<string, StudentProfile>;
  onUpdateStudentTokens: (
    studentSlug: string,
    tokensToAdd: number,
    reason: string
  ) => void;
  onSaveStudent?: (student: StudentProfile) => Promise<void> | void;
  onSaveMultipleStudents?: (students: StudentProfile[]) => Promise<void> | void;
  onDeleteStudent?: (slug: string) => Promise<void> | void;
  onViewStudentPortal: (slug: string) => void;
}

interface ToastMessage {
  id: string;
  type: "success" | "info" | "token";
  title: string;
  description: string;
  timestamp: Date;
}

interface ScoringOption {
  points: number;
  label: string;
  reason: string;
  icon: string;
  group: string;
}

const PRESET_SCORING_OPTIONS: ScoringOption[] = [
  // Nhóm 1: Chuyên cần & Kỷ luật
  {
    points: 1,
    label: "+1 Đi học đúng giờ & đủ",
    reason: "Đi học đúng giờ và đầy đủ",
    icon: "⏰",
    group: "Chuyên cần & Kỷ luật",
  },
  {
    points: 1,
    label: "+1 Làm đầy đủ bài tập",
    reason: "Làm đầy đủ bài tập được giao",
    icon: "📝",
    group: "Chuyên cần & Kỷ luật",
  },
  {
    points: -1,
    label: "-1 Nghỉ học 1 buổi",
    reason: "Nghỉ học 1 buổi (không lý do/nghỉ học)",
    icon: "⚠️",
    group: "Chuyên cần & Kỷ luật",
  },
  // Nhóm 2: Tương tác & Học tập
  {
    points: 3,
    label: "+3 Quizizz - Top 1",
    reason: "Quizizz - Nhanh & đúng nhất (Top 1)",
    icon: "🥇",
    group: "Tương tác & Học tập",
  },
  {
    points: 2,
    label: "+2 Quizizz - Top 2",
    reason: "Quizizz - Nhanh & đúng nhì (Top 2)",
    icon: "🥈",
    group: "Tương tác & Học tập",
  },
  {
    points: 1,
    label: "+1 Quizizz - Top 3",
    reason: "Quizizz - Nhanh & đúng ba (Top 3)",
    icon: "🥉",
    group: "Tương tác & Học tập",
  },
  {
    points: 1,
    label: "+1 Cold Call tốt",
    reason: "Trả lời tốt khi bị gọi ngẫu nhiên (Cold Call)",
    icon: "🎯",
    group: "Tương tác & Học tập",
  },
  // Nhóm 3: Thưởng/Trừ Cột Mốc (Milestones)
  {
    points: 5,
    label: "+5 Kickstart Bonus",
    reason: "Kickstart Bonus (Thưởng đăng ký học)",
    icon: "🚀",
    group: "Cột mốc",
  },
  {
    points: 5,
    label: "+5 Tăng điểm thi Giữa kỳ",
    reason: "Tăng điểm thi Giữa kỳ trên trường",
    icon: "📈",
    group: "Cột mốc",
  },
  {
    points: -5,
    label: "-5 Giảm điểm thi Giữa kỳ",
    reason: "Giảm điểm thi Giữa kỳ trên trường",
    icon: "📉",
    group: "Cột mốc",
  },
  {
    points: 10,
    label: "+10 Tăng điểm thi Cuối kỳ",
    reason: "Tăng điểm thi Cuối kỳ trên trường",
    icon: "⭐",
    group: "Cột mốc",
  },
  {
    points: -10,
    label: "-10 Giảm điểm thi Cuối kỳ",
    reason: "Giảm điểm thi Cuối kỳ trên trường",
    icon: "🔻",
    group: "Cột mốc",
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  onUpdateStudentTokens,
  onSaveStudent,
  onSaveMultipleStudents,
  onDeleteStudent,
  onViewStudentPortal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<
    "all" | "has_unsubmitted" | "ready_for_reward" | "has_pending_grading"
  >("all");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [activeScoringStudentSlug, setActiveScoringStudentSlug] = useState<
    string | null
  >(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [customAmount, setCustomAmount] = useState<string>("");

  // Modals for Data Entry (Giai đoạn 1, 2, 3)
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [gradingStudent, setGradingStudent] = useState<StudentProfile | null>(null);
  const [classLessonName, setClassLessonName] = useState<string>("");
  const [classLessonDate, setClassLessonDate] = useState<string>("");

  const studentList = Object.values(students);

  // Helper to extract student's class code: [KHỐI]-[NGÀY][CA] (VD: K7-T24C1, K8-T35C1, K6-T7CC1)
  const getStudentClassInfo = (student: StudentProfile) => {
    // 1. Try matching student ID formatted like G7-T24C1-01 or K7-T24C1-01
    const idMatch = student.id?.match(/^(?:G|K)?(\d+)[-_]?(T\w+?)(C\d+)(?:-\d+)?$/i);
    if (idMatch) {
      const [, gradeNum, daysCode, shiftCode] = idMatch;
      const upperDays = daysCode.toUpperCase();
      const upperShift = shiftCode.toUpperCase();
      const code = `K${gradeNum}-${upperDays}${upperShift}`;
      const daysName =
        DAYS_MAPPING[upperDays] || (upperDays === "T7C" ? "Thứ 7-Chủ Nhật" : upperDays);
      const shiftName =
        upperShift === "C1"
          ? "Ca 1 (17h30)"
          : upperShift === "C2"
          ? "Ca 2 (19h30)"
          : upperShift === "C3"
          ? "Ca 3 (14h00)"
          : upperShift;
      return {
        code,
        gradeLabel: `Khối ${gradeNum}`,
        daysLabel: daysName,
        shiftLabel: shiftName,
        subLabel: `${daysName} • ${upperShift}`,
      };
    }

    // 2. Fallback: Parse from student.grade string if present
    const gradeNumMatch = student.grade?.match(/(?:Lớp|Khối|K)\s*(\d+)/i);
    const gradeNum = gradeNumMatch ? gradeNumMatch[1] : "7";
    return {
      code: `K${gradeNum}-CHUNG`,
      gradeLabel: `Khối ${gradeNum}`,
      daysLabel: "Lớp chung",
      shiftLabel: "Chung",
      subLabel: `Khối ${gradeNum} • Lịch học chung`,
    };
  };

  // Available classes dynamically extracted from registered students
  const availableClasses = React.useMemo(() => {
    const classMap = new Map<
      string,
      {
        code: string;
        gradeLabel: string;
        subLabel: string;
        count: number;
      }
    >();

    studentList.forEach((student) => {
      const info = getStudentClassInfo(student);
      if (!classMap.has(info.code)) {
        classMap.set(info.code, {
          code: info.code,
          gradeLabel: info.gradeLabel,
          subLabel: info.subLabel,
          count: 1,
        });
      } else {
        classMap.get(info.code)!.count += 1;
      }
    });

    return Array.from(classMap.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [studentList]);

  // Helper toast dispatcher
  const addToast = (
    type: "success" | "info" | "token",
    title: string,
    description: string
  ) => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast: ToastMessage = {
      id,
      type,
      title,
      description,
      timestamp: new Date(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 3.8s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Quick 1-touch scoring action
  const handleQuickScore = (
    student: StudentProfile,
    points: number,
    reason: string
  ) => {
    onUpdateStudentTokens(student.slug, points, reason);
    setActiveScoringStudentSlug(null);

    const sign = points > 0 ? `+${points}` : `${points}`;
    addToast(
      "token",
      `${sign} Tokens cho ${student.fullName}!`,
      `Lý do: ${reason}. Tổng hiện tại: ${
        student.gamification.currentTokens + points
      }/100T`
    );
  };

  // Custom token submit
  const handleCustomScore = (student: StudentProfile) => {
    const pts = parseInt(customAmount, 10);
    if (!isNaN(pts) && pts > 0) {
      handleQuickScore(student, pts, "Điểm thưởng bổ sung của Cô Nghi");
      setCustomAmount("");
    }
  };

  // Quick Zalo reminder action
  const handleSendZaloReminder = (student: StudentProfile) => {
    const unsubmitted = (student.assignments || []).filter(
      (a) => a.status === "not_done"
    );
    const assignmentNote =
      unsubmitted.length > 0
        ? `còn ${unsubmitted.length} bài tập chưa nộp`
        : "nhắc con chuẩn bị bài trước giờ học";

    addToast(
      "success",
      `Đã gửi lời nhắc Zalo đến phụ huynh!`,
      `Gửi tới ${student.parentName} (${student.parentSalutation}) - Nhắc bé ${student.fullName} ${assignmentNote}.`
    );
  };

  // Batch reminder for unsubmitted in current class filter
  const handleBatchZaloReminder = () => {
    const studentsWithUnsubmitted = classFilteredStudents.filter((s) =>
      (s.assignments || []).some((a) => a.status === "not_done")
    );

    addToast(
      "info",
      `Đã gửi lời nhắc Zalo đồng loạt!`,
      `Đã gửi tin nhắn tự động đến phụ huynh của ${studentsWithUnsubmitted.length} học sinh chưa nộp bài tập (${
        selectedClass === "ALL" ? "Toàn bộ các lớp" : `Lớp ${selectedClass}`
      }).`
    );
  };

  // 1. Filter students by selected class [KHỐI]-[NGÀY][CA]
  const classFilteredStudents = React.useMemo(() => {
    if (selectedClass === "ALL") return studentList;
    return studentList.filter(
      (s) => getStudentClassInfo(s).code === selectedClass
    );
  }, [studentList, selectedClass]);

  // 2. Filter students by search and filterMode
  const filteredStudents = classFilteredStudents.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === "has_unsubmitted") {
      return (student.assignments || []).some((a) => a.status === "not_done");
    }
    if (filterMode === "has_pending_grading") {
      return (student.assignments || []).some((a) => a.status === "submitted");
    }
    if (filterMode === "ready_for_reward") {
      const studentTokens =
        student.tokenHistory && student.tokenHistory.length > 0
          ? student.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
          : student.gamification.currentTokens;
      return studentTokens >= 25;
    }
    return true;
  });

  // 3. Calculate quick class statistics based on current class filter
  const totalStudentsInClass = classFilteredStudents.length;
  const totalUnsubmittedCount = classFilteredStudents.reduce((acc, curr) => {
    return (
      acc +
      (curr.assignments || []).filter((a) => a.status === "not_done").length
    );
  }, 0);
  const totalPendingGradingCount = classFilteredStudents.reduce((acc, curr) => {
    return (
      acc +
      (curr.assignments || []).filter((a) => a.status === "submitted").length
    );
  }, 0);
  const near100TokensCount = classFilteredStudents.filter(
    (s) => {
      const tokens =
        s.tokenHistory && s.tokenHistory.length > 0
          ? s.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
          : s.gamification.currentTokens;
      return tokens >= 80;
    }
  ).length;

  // Student counts for each filter category
  const unsubmittedStudentsCount = React.useMemo(() => {
    return classFilteredStudents.filter((s) =>
      (s.assignments || []).some((a) => a.status === "not_done")
    ).length;
  }, [classFilteredStudents]);

  const pendingGradingStudentsCount = React.useMemo(() => {
    return classFilteredStudents.filter((s) =>
      (s.assignments || []).some((a) => a.status === "submitted")
    ).length;
  }, [classFilteredStudents]);

  const readyForRewardStudentsCount = React.useMemo(() => {
    return classFilteredStudents.filter((s) => {
      const studentTokens =
        s.tokenHistory && s.tokenHistory.length > 0
          ? s.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
          : s.gamification.currentTokens;
      return studentTokens >= 25;
    }).length;
  }, [classFilteredStudents]);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Toast Notification Container (Floating Top-Right on desktop, Top Center on mobile) */}
      <div className="fixed top-20 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto p-3.5 sm:p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl flex items-start gap-3 transition-all animate-in slide-in-from-top-4 duration-200"
          >
            <div className="shrink-0 pt-0.5">
              {t.type === "token" ? (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-mono">
                  <Coins className="w-4 h-4" />
                </div>
              ) : t.type === "success" ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  t.type === "token"
                    ? "bg-amber-400 shadow-[0_0_6px_#f59e0b]"
                    : t.type === "success"
                    ? "bg-emerald-400 shadow-[0_0_6px_#10b981]"
                    : "bg-blue-400 shadow-[0_0_6px_#0066FF]"
                }`} />
                <h5 className="font-bold text-xs sm:text-sm leading-tight text-white font-mono">
                  {t.title}
                </h5>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-snug font-sans">
                {t.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700 shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>


      {/* KHU VỰC GALLERY NÚT BẤM CHỌN LỚP HỌC • FILTER THEO [KHỐI]-[NGÀY][CA] */}
      {/* Lọc dữ liệu theo lớp học */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066ff] flex items-center justify-center font-bold border border-blue-100 shrink-0">
              <GraduationCap className="w-4 h-4 text-[#0066ff]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Lọc dữ liệu theo lớp học
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  [KHỐI]-[NGÀY][CA]
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {selectedClass !== "ALL" ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Đang lọc:</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-[#0066ff] text-white shadow-xs border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {selectedClass} ({classFilteredStudents.length} HS)
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedClass("ALL")}
                  className="text-[11px] font-bold text-[#0066ff] hover:underline cursor-pointer ml-1"
                >
                  Xóa lọc
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                Đang xem: <strong className="text-slate-900 font-bold">Tất cả các lớp ({studentList.length} HS)</strong>
              </span>
            )}
          </div>
        </div>

        {/* Gallery Nút Bấm Lựa Chọn Lớp Học */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {/* Nút: Tất cả các lớp */}
          <button
            type="button"
            id="btn-filter-class-all"
            onClick={() => setSelectedClass("ALL")}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
              selectedClass === "ALL"
                ? "bg-[#0066ff] text-white shadow-md shadow-blue-500/20 border border-white/20 scale-[1.01]"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 active:translate-y-[1px]"
            }`}
          >
            <span className="text-xs sm:text-[13px] font-bold font-mono tracking-tight flex items-center gap-1.5 truncate">
              <Users className="w-3.5 h-3.5 shrink-0" />
              TẤT CẢ
            </span>
            <span
              className={`text-[10px] sm:text-[11px] font-bold font-mono px-2 py-0.5 rounded-md shrink-0 leading-none ${
                selectedClass === "ALL"
                  ? "bg-white/20 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              {studentList.length} HS
            </span>
          </button>

          {/* Nút các lớp học theo cấu trúc chuẩn [KHỐI]-[NGÀY][CA] */}
          {availableClasses.map((cls) => {
            const isSelected = selectedClass === cls.code;
            return (
              <button
                key={cls.code}
                type="button"
                id={`btn-filter-class-${cls.code}`}
                onClick={() => setSelectedClass(cls.code)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0066ff] text-white shadow-md shadow-blue-500/20 border border-white/20 scale-[1.01]"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 active:translate-y-[1px]"
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isSelected
                        ? "bg-white shadow-[0_0_4px_#ffffff]"
                        : "bg-emerald-500 shadow-[0_0_3px_#10b981]"
                    }`}
                  />
                  <span className="text-xs sm:text-[13px] font-bold font-mono tracking-tight truncate">
                    {cls.code}
                  </span>
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold font-mono px-2 py-0.5 rounded-md shrink-0 leading-none ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  {cls.count} HS
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Class Stats Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066ff] flex items-center justify-center font-bold shrink-0 border border-blue-100 shadow-2xs">
            <Users className="w-4 h-4 text-[#0066ff]" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block leading-tight">
              Sĩ số lớp
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono leading-tight">
              {totalStudentsInClass} học sinh
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 border border-amber-200 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block leading-tight">
              Chưa nộp bài
            </span>
            <span className="text-xs sm:text-sm font-bold text-amber-700 font-mono leading-tight">
              {totalUnsubmittedCount} bài tập
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shrink-0 border border-sky-200 shadow-2xs">
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block leading-tight">
              Chờ cô chấm
            </span>
            <span className="text-xs sm:text-sm font-bold text-sky-700 font-mono leading-tight">
              {totalPendingGradingCount} bài
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-200 shadow-2xs">
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block leading-tight">
              Sắp chạm 100T
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-700 font-mono leading-tight">
              {near100TokensCount} học sinh
            </span>
          </div>
        </div>
      </div>

      {/* KHU VỰC NHẬP LIỆU TỔNG QUAN BUỔI HỌC CỦA LỚP (ĐỒNG BỘ SANG CỔNG PHỤ HUYNH) */}
      <ClassLessonEditor
        currentClassName={selectedClass}
        targetStudents={classFilteredStudents}
        onLessonNameChange={(name) => setClassLessonName(name)}
        onLessonDateChange={(date) => setClassLessonDate(date)}
        onSyncLessonToStudents={async (updatedList, summary) => {
          if (onSaveMultipleStudents) {
            await onSaveMultipleStudents(updatedList);
          } else if (onSaveStudent) {
            for (const s of updatedList) {
              await onSaveStudent(s);
            }
          }
          addToast(
            "success",
            "Đã đồng bộ thông tin buổi học!",
            `Đã cập nhật "${summary.name}" (${summary.date}) cho ${updatedList.length} học sinh.`
          );
        }}
      />

      {/* Control Bar: Search & Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên học sinh, trường, lớp..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 text-xs sm:text-sm text-slate-900 placeholder-slate-400 min-h-[40px]"
            />
          </div>

          {/* Filter Mode Pills (Touch-Friendly) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer font-bold ${
                filterMode === "all"
                  ? "bg-[#0066ff] text-white shadow-md shadow-blue-500/20 border border-white/20"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80 active:translate-y-[1px]"
              }`}
            >
              Tất cả ({classFilteredStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("has_unsubmitted")}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                filterMode === "has_unsubmitted"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 border border-white/20"
                  : "bg-amber-50/80 text-amber-900 hover:bg-amber-100 border border-amber-200 active:translate-y-[1px]"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Chưa nộp bài ({unsubmittedStudentsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("has_pending_grading")}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                filterMode === "has_pending_grading"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-500/25 border border-white/20"
                  : "bg-sky-50/80 text-sky-900 hover:bg-sky-100 border border-sky-200 active:translate-y-[1px]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Cần chấm điểm ({pendingGradingStudentsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("ready_for_reward")}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                filterMode === "ready_for_reward"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25 border border-white/20"
                  : "bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 active:translate-y-[1px]"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Đổi quà ({readyForRewardStudentsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH HỌC SINH (Optimized for Touch: Tablet Table & Mobile Cards) */}
      <div className="space-y-3">
        {/* Header Label */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-[#0066ff] text-xs sm:text-sm">
            Danh sách học sinh ({filteredStudents.length} học sinh)
          </span>
        </div>

        {/* Student Items List */}
        <div className="space-y-3.5">
          {filteredStudents.map((student) => {
            const currentTokens =
              student.tokenHistory && student.tokenHistory.length > 0
                ? student.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
                : student.gamification.currentTokens;
            const assignments = student.assignments || [];
            const unsubmitted = assignments.filter(
              (a) => a.status === "not_done"
            );
            const submitted = assignments.filter((a) => a.status === "submitted");
            const graded = assignments.filter((a) => a.status === "graded");

            // Làm sạch hiển thị: Bỏ phần "- K6 Chuyển Cấp...", "- Nhóm...", chỉ giữ lại "Lớp X" hoặc "Khối X"
            const cleanedGrade = (student.grade || "")
              .replace(/•.*$/i, "")
              .replace(/\s*-\s*.*$/i, "")
              .trim();

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-3.5"
              >
                {/* Top Row: Student Profile & Tokens Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Avatar & Information */}
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-100 border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight">
                          {student.fullName}
                        </h4>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {student.id}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({student.parentName})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-normal">
                        {cleanedGrade || student.grade} • {student.school}
                      </p>
                    </div>
                  </div>

                  {/* Right: Tokens Progress & Target */}
                  <div className="flex items-center gap-3 sm:text-right self-start sm:self-center">
                    <div className="space-y-1">
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="font-mono text-base sm:text-lg font-bold text-slate-900">
                          {currentTokens}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          / 100 Tokens
                        </span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-28 sm:w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                        <div
                          style={{
                            width: `${Math.min(100, (currentTokens / 100) * 100)}%`,
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#ff9800]"
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                        Quà: {student.gamification.targetRewardName.split("+")[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Assignment Status Overview */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">Bài tập tuần:</span>
                    {unsubmitted.length > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-lg border border-amber-300 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        {unsubmitted.length} bài chưa làm
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Đã làm đủ bài tập
                      </span>
                    )}

                    {submitted.length > 0 && (
                      <span className="inline-flex items-center gap-1 font-bold text-sky-900 bg-sky-100 px-2.5 py-0.5 rounded-lg border border-sky-300 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        {submitted.length} bài cần cô chấm
                      </span>
                    )}

                    {graded.length > 0 && (
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg text-[11px] shadow-2xs">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {graded.length} bài đã chấm
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: 1-Touch Action Buttons (Touch-Friendly min-h-[44px], Full-width vertical on mobile) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2.5 pt-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 flex-1 w-full">
                    {/* 1. NÚT QUẢN LÝ / CỘNG TRỪ TOKEN (FULLSCREEN MODAL) */}
                    <button
                      type="button"
                      id={`btn-open-scoring-${student.id}`}
                      onClick={() => setActiveScoringStudentSlug(student.slug)}
                      className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer font-mono bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs active:translate-y-[1px]"
                      title="Mở bảng cộng/trừ và chỉnh sửa token"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Token</span>
                    </button>

                    {/* 2. NÚT NHẬP ĐIỂM & BUỔI HỌC (GIAI ĐOẠN 2 & 3) */}
                    <button
                      type="button"
                      id={`btn-grading-${student.id}`}
                      onClick={() => setGradingStudent(student)}
                      className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066ff] font-bold text-xs sm:text-sm border border-blue-200/80 shadow-2xs active:translate-y-[1px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Cập nhật điểm kiểm tra, bài học mới và đánh giá 5 trục Radar"
                    >
                      <FileCheck className="w-4 h-4 text-[#0066ff]" />
                      <span>Nhập điểm & Buổi học</span>
                    </button>

                    {/* 3. NÚT GỬI NHẮC NHỞ ZALO */}
                    <button
                      type="button"
                      id={`btn-zalo-reminder-${student.id}`}
                      onClick={() => handleSendZaloReminder(student)}
                      className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs sm:text-sm border border-sky-200/80 shadow-2xs active:translate-y-[1px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-sky-600" />
                      <span>Nhắc Zalo</span>
                    </button>
                  </div>

                  {/* 4. NÚT XEM CỔNG PHỤ HUYNH */}
                  <button
                    type="button"
                    onClick={() => onViewStudentPortal(student.slug)}
                    className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:translate-y-[1px] transition-all cursor-pointer"
                  >
                    <span>Cổng Phụ Huynh</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 shadow-xs text-xs sm:text-sm font-medium">
              Không tìm thấy học sinh nào phù hợp với bộ lọc.
            </div>
          )}
        </div>
      </div>

      {/* Hero Banner for Teacher Portal (Đưa xuống cuối trang) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0066ff] via-[#1e88e5] to-[#0052cc] text-white p-4 sm:p-5 shadow-md shadow-blue-500/15 border border-blue-400/30 mt-6">
        {/* Các nút hành động - Mobile: 1 cột (từ trên xuống), Tablet: 2 hàng (mỗi hàng 2 nút), PC: 1 hàng 4 nút */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {/* Nút Thêm học sinh mới */}
          <button
            type="button"
            id="btn-add-new-student"
            onClick={() => setIsNewStudentModalOpen(true)}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#0066ff] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Thêm học sinh mới</span>
          </button>

          {/* Nút Xuất file Excel (.csv) */}
          <button
            type="button"
            id="btn-export-excel"
            onClick={() => {
              exportStudentsToCSV(students);
              addToast("success", "Đã xuất file bảng điểm Excel!", "File CSV chuẩn tiếng Việt UTF-8 đã được tải về máy.");
            }}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            title="Tải toàn bộ danh sách điểm số và học sinh ra file Excel / Google Sheets"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>

          {/* Nút Nhắc Zalo */}
          <button
            type="button"
            id="btn-batch-zalo-reminder"
            onClick={handleBatchZaloReminder}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>Nhắc Zalo ({totalUnsubmittedCount} bài)</span>
          </button>

          {/* Nút Mở cổng phụ huynh */}
          <button
            type="button"
            id="btn-view-parent-portal-hero"
            onClick={() => {
              const firstStudent = studentList[0];
              if (firstStudent) {
                onViewStudentPortal(firstStudent.slug);
              }
            }}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4 text-white shrink-0" />
            <span>Mở cổng phụ huynh</span>
          </button>
        </div>
      </div>

      {/* MODAL GIAI ĐOẠN 1: THÊM HỌC SINH MỚI (ĐẦU VÀO) */}
      <NewStudentModal
        isOpen={isNewStudentModalOpen}
        onClose={() => setIsNewStudentModalOpen(false)}
        existingSlugs={Object.keys(students)}
        onSave={async (newStudent) => {
          if (onSaveStudent) {
            await onSaveStudent(newStudent);
          }
          addToast(
            "success",
            `Đã thêm học sinh ${newStudent.fullName}!`,
            `Mã ${newStudent.id} đã được khởi tạo và lưu trữ trên Firebase.`
          );
        }}
      />

      {/* MODAL GIAI ĐOẠN 2 & 3: NHẬP ĐIỂM BUỔI HỌC & ĐÁNH GIÁ ĐỊNH KỲ */}
      <GradingModal
        isOpen={gradingStudent !== null}
        onClose={() => setGradingStudent(null)}
        student={gradingStudent}
        defaultLessonName={classLessonName || gradingStudent?.recentLesson?.lessonName || ""}
        defaultLessonDate={classLessonDate || gradingStudent?.recentLesson?.date || ""}
        onSave={async (updatedStudent) => {
          if (onSaveStudent) {
            await onSaveStudent(updatedStudent);
          }
          addToast(
            "success",
            `Đã cập nhật dữ liệu học vụ ${updatedStudent.fullName}!`,
            `Dữ liệu điểm số & 5 trục năng lực đã đồng bộ lên Firebase.`
          );
        }}
      />

      {/* MODAL FULLSCREEN: QUẢN LÝ & CHỈNH SỬA TOKEN HỌC VỤ */}
      <TokenManagerModal
        isOpen={activeScoringStudentSlug !== null}
        onClose={() => setActiveScoringStudentSlug(null)}
        student={activeScoringStudentSlug ? students[activeScoringStudentSlug] : null}
        onSaveStudent={onSaveStudent}
        onAddToast={addToast}
      />
    </div>
  );
};
