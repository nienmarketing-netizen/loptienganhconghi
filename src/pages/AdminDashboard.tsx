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
} from "lucide-react";
import { StudentProfile, Assignment } from "../types";

interface AdminDashboardProps {
  students: Record<string, StudentProfile>;
  onUpdateStudentTokens: (
    studentSlug: string,
    tokensToAdd: number,
    reason: string
  ) => void;
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
  color: string;
}

const PRESET_SCORING_OPTIONS: ScoringOption[] = [
  {
    points: 10,
    label: "+10 (Làm đủ bài)",
    reason: "Hoàn thành đầy đủ bài tập tuần này",
    icon: "📝",
    color: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  {
    points: 5,
    label: "+5 (Đi học đúng giờ)",
    reason: "Đến lớp đúng giờ và chuẩn bị bài chu đáo",
    icon: "⏰",
    color: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    points: 15,
    label: "+15 (Top Quizizz)",
    reason: "Đạt Top 3 minigame Quizizz từ vựng trên lớp",
    icon: "🏆",
    color: "bg-indigo-500 hover:bg-indigo-600 text-white",
  },
  {
    points: 10,
    label: "+10 (Phát biểu hăng hái)",
    reason: "Tích cực giơ tay tương tác trong giờ học",
    icon: "🙋‍♂️",
    color: "bg-sky-500 hover:bg-sky-600 text-white",
  },
  {
    points: 20,
    label: "+20 (Điểm 10 kiểm tra)",
    reason: "Đạt điểm 10 tuyệt đối bài kiểm tra bóc tách",
    icon: "⭐",
    color: "bg-rose-500 hover:bg-rose-600 text-white",
  },
  {
    points: 5,
    label: "+5 (Vở ghi sạch đẹp)",
    reason: "Ghi chép từ vựng và cấu trúc cẩn thận",
    icon: "✨",
    color: "bg-teal-500 hover:bg-teal-600 text-white",
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  onUpdateStudentTokens,
  onViewStudentPortal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<
    "all" | "has_unsubmitted" | "ready_for_reward" | "has_pending_grading"
  >("all");
  const [activeScoringStudentSlug, setActiveScoringStudentSlug] = useState<
    string | null
  >(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [customAmount, setCustomAmount] = useState<string>("");

  const studentList = Object.values(students);

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

    addToast(
      "token",
      `+${points} Tokens cho ${student.fullName}!`,
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

  // Batch reminder for all unsubmitted
  const handleBatchZaloReminder = () => {
    const studentsWithUnsubmitted = studentList.filter((s) =>
      (s.assignments || []).some((a) => a.status === "not_done")
    );

    addToast(
      "info",
      `Đã gửi lời nhắc Zalo đồng loạt!`,
      `Đã gửi tin nhắn tự động đến phụ huynh của ${studentsWithUnsubmitted.length} học sinh chưa nộp bài tập tuần này.`
    );
  };

  // Filter students
  const filteredStudents = studentList.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === "has_unsubmitted") {
      return (student.assignments || []).some((a) => a.status === "not_done");
    }
    if (filterMode === "has_pending_grading") {
      return (student.assignments || []).some((a) => a.status === "submitted");
    }
    if (filterMode === "ready_for_reward") {
      return student.gamification.currentTokens >= 80;
    }
    return true;
  });

  // Calculate quick class statistics
  const totalStudents = studentList.length;
  const totalUnsubmittedCount = studentList.reduce((acc, curr) => {
    return (
      acc +
      (curr.assignments || []).filter((a) => a.status === "not_done").length
    );
  }, 0);
  const totalPendingGradingCount = studentList.reduce((acc, curr) => {
    return (
      acc +
      (curr.assignments || []).filter((a) => a.status === "submitted").length
    );
  }, 0);
  const near100TokensCount = studentList.filter(
    (s) => s.gamification.currentTokens >= 80
  ).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Toast Notification Container (Floating Top-Right on desktop, Top Center on mobile) */}
      <div className="fixed top-20 right-3 sm:right-6 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto p-3.5 sm:p-4 rounded-2xl bg-[#2d3436] text-white border border-white/20 border-b-black/40 border-r-black/40 shadow-[var(--shadow-floating)] flex items-start gap-3 transition-all animate-in slide-in-from-top-4 duration-200"
          >
            <div className="shrink-0 pt-0.5">
              {t.type === "token" ? (
                <div className="w-8 h-8 rounded-xl bg-[#1e2528] text-amber-400 border border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center font-bold font-mono">
                  <Coins className="w-4 h-4" />
                </div>
              ) : t.type === "success" ? (
                <div className="w-8 h-8 rounded-xl bg-[#1e2528] text-emerald-400 border border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#1e2528] text-[#ff4757] border border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)] flex items-center justify-center">
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
                    : "led-indicator-orange"
                }`} />
                <h5 className="font-extrabold text-xs sm:text-sm leading-tight text-white font-mono">
                  {t.title}
                </h5>
              </div>
              <p className="text-[11px] sm:text-xs text-[#a3b1c6] mt-0.5 leading-snug font-sans">
                {t.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="w-6 h-6 rounded-md bg-[#1e2528] hover:bg-[#ff4757] hover:text-white text-[#a3b1c6] flex items-center justify-center transition-colors cursor-pointer border border-white/10 shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Hero Banner for Teacher Portal */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-6 shadow-md border border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Cổng Quản Lý Lớp Học • Dành Cho Cô Nghi
            </span>
          </div>
          <h2 className="text-base sm:text-2xl font-black tracking-tight !text-white">
            Admin Dashboard: Chấm Điểm 1 Chạm & Quản Lý Học Vụ
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-normal">
            Tối ưu thao tác vuốt chạm trên Tablet & Điện thoại. Thưởng Tokens
            ngay trong giờ học và gửi nhắc nhở Zalo đến phụ huynh chỉ với 1 bấm.
          </p>
        </div>

        {/* Global Actions & Dedicated Portal URL Info */}
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="button"
            id="btn-copy-portal-url-hero"
            onClick={() => {
              const url = `${window.location.origin}/giao-vien`;
              navigator.clipboard.writeText(url);
              addToast("info", "Đã sao chép link Cổng Giáo Viên!", url);
            }}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
            title="Sao chép link Cổng Giáo Viên để lưu hoặc ghim vào thanh dấu trang"
          >
            <Copy className="w-4 h-4 text-amber-300" />
            <span className="font-mono text-amber-200">/giao-vien</span>
            <span className="text-white/80">(Chép link)</span>
          </button>

          <button
            type="button"
            id="btn-batch-zalo-reminder"
            onClick={handleBatchZaloReminder}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Nhắc Zalo tất cả ({totalUnsubmittedCount} bài chưa nộp)</span>
          </button>
        </div>
      </div>

      {/* Quick Class Stats Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Sĩ số lớp
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {totalStudents} học sinh
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Chưa nộp bài
            </span>
            <span className="text-base sm:text-lg font-black text-amber-700 font-mono">
              {totalUnsubmittedCount} bài tập
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Chờ cô chấm
            </span>
            <span className="text-base sm:text-lg font-black text-sky-700 font-mono">
              {totalPendingGradingCount} bài
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Sắp chạm 100T
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
              {near100TokensCount} học sinh
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên học sinh, trường, lớp..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-xs sm:text-sm text-slate-800 placeholder-slate-400 min-h-[42px]"
            />
          </div>

          {/* Filter Mode Pills (Touch-Friendly) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                filterMode === "all"
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả ({studentList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("has_unsubmitted")}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                filterMode === "has_unsubmitted"
                  ? "bg-amber-600 text-white font-bold"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Chưa nộp bài</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("has_pending_grading")}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                filterMode === "has_pending_grading"
                  ? "bg-sky-600 text-white font-bold"
                  : "bg-sky-50 text-sky-800 hover:bg-sky-100"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Cần chấm điểm</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("ready_for_reward")}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                filterMode === "ready_for_reward"
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Đổi quà (&ge;80T)</span>
            </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH HỌC SINH (Optimized for Touch: Tablet Table & Mobile Cards) */}
      <div className="space-y-3">
        {/* Header Label */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span>
            Danh sách học sinh ({filteredStudents.length} học sinh)
          </span>
          <span className="hidden sm:inline text-slate-400 font-normal">
            Bấm "+ Tokens" để thưởng điểm 1 chạm
          </span>
        </div>

        {/* Student Items List */}
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const currentTokens = student.gamification.currentTokens;
            const assignments = student.assignments || [];
            const unsubmitted = assignments.filter(
              (a) => a.status === "not_done"
            );
            const submitted = assignments.filter((a) => a.status === "submitted");
            const graded = assignments.filter((a) => a.status === "graded");

            const isScoringActive =
              activeScoringStudentSlug === student.slug;

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-xs hover:border-indigo-300 transition-all space-y-3"
              >
                {/* Top Row: Student Profile & Tokens Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Avatar & Information */}
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400 shrink-0 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-base font-extrabold text-slate-900">
                          {student.fullName}
                        </h4>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {student.id}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({student.parentName})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {student.grade} • {student.school}
                      </p>
                    </div>
                  </div>

                  {/* Right: Tokens Progress & Target */}
                  <div className="flex items-center gap-3 sm:text-right self-start sm:self-center">
                    <div className="space-y-1">
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="font-mono text-base sm:text-lg font-black text-slate-900">
                          {currentTokens}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          / 100 Tokens
                        </span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-28 sm:w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          style={{
                            width: `${Math.min(100, (currentTokens / 100) * 100)}%`,
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        Quà: {student.gamification.targetRewardName.split("+")[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Assignment Status Overview */}
                <div className="bg-slate-50/80 rounded-xl p-2.5 sm:p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-600">Bài tập tuần:</span>
                    {unsubmitted.length > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300 text-[11px]">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        {unsubmitted.length} bài chưa làm
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Đã làm đủ bài tập
                      </span>
                    )}

                    {submitted.length > 0 && (
                      <span className="inline-flex items-center gap-1 font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-300 text-[11px]">
                        <Clock className="w-3 h-3 text-sky-600" />
                        {submitted.length} bài cần cô chấm
                      </span>
                    )}

                    {graded.length > 0 && (
                      <span className="inline-flex items-center gap-1 font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-md text-[11px]">
                        <FileCheck className="w-3 h-3 text-emerald-600" />
                        {graded.length} bài đã chấm
                      </span>
                    )}
                  </div>

                  {/* List titles of pending assignments */}
                  {unsubmitted.length > 0 && (
                    <div className="text-[11px] text-slate-500 truncate max-w-sm italic">
                      Chưa nộp: {unsubmitted[0].title}
                    </div>
                  )}
                </div>

                {/* Bottom Row: 1-Touch Action Buttons (Touch-Friendly min-h-[44px]) */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    {/* 1. NÚT QUICK SCORING "+ TOKENS" (CHẤM ĐIỂM 1 CHẠM) */}
                    <div className="relative">
                      <button
                        type="button"
                        id={`btn-open-scoring-${student.id}`}
                        onClick={() =>
                          setActiveScoringStudentSlug(
                            isScoringActive ? null : student.slug
                          )
                        }
                        className={`min-h-[44px] px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer font-mono active:translate-y-[1px] ${
                          isScoringActive
                            ? "bg-[#ff4757] text-white shadow-[var(--shadow-recessed-sm)] border border-white/20"
                            : "bg-[#e0e5ec] hover:bg-[#d8e0ec] text-[#ff4757] border border-white/90 shadow-[var(--shadow-card-sm)]"
                        }`}
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>+ Tokens (1 chạm)</span>
                      </button>

                      {/* Popover / Dropdown các lý do tính sẵn - Soft UI Tactile Card */}
                      {isScoringActive && (
                        <div
                          className="absolute left-0 top-12 z-40 w-72 sm:w-80 bg-[#e0e5ec] rounded-2xl shadow-[var(--shadow-floating)] border border-white/80 border-b-[#babecc] border-r-[#babecc] p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-[#babecc]/50">
                            <span className="text-[11px] font-bold text-[#4a5568] uppercase font-mono tracking-wider flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                              Thưởng điểm: {student.fullName.split(" ").slice(-1)[0]}
                            </span>
                            <button
                              onClick={() => setActiveScoringStudentSlug(null)}
                              className="w-6 h-6 rounded-md bg-[#d1d9e6] hover:bg-[#ff4757] hover:text-white text-[#666666] flex items-center justify-center border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick 1-Touch Reasons List */}
                          <div className="space-y-1.5">
                            {PRESET_SCORING_OPTIONS.map((opt, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() =>
                                  handleQuickScore(student, opt.points, opt.reason)
                                }
                                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#e0e5ec] border border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] hover:shadow-[var(--shadow-card)] transition-all text-left cursor-pointer active:translate-y-[1px] min-h-[44px]"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="text-base">{opt.icon}</span>
                                  <div>
                                    <div className="font-bold text-xs text-[#1a1a1a]">
                                      {opt.label}
                                    </div>
                                    <div className="text-[10px] text-[#666666] line-clamp-1">
                                      {opt.reason}
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs font-mono font-black text-[#ff4757] bg-[#d1d9e6] border border-[#babecc]/60 px-2 py-0.5 rounded-lg shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
                                  +{opt.points}T
                                </span>
                              </button>
                            ))}
                          </div>

                          {/* Custom Amount Field */}
                          <div className="pt-2 border-t border-[#babecc]/50 flex items-center gap-1.5">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="+ Khác..."
                              className="w-24 px-2.5 py-1.5 rounded-xl bg-[#d1d9e6] border border-[#babecc] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.12)] text-xs font-mono text-[#1a1a1a] focus:outline-none focus:bg-[#e0e5ec]"
                            />
                            <button
                              type="button"
                              onClick={() => handleCustomScore(student)}
                              className="flex-1 py-1.5 px-3 bg-[#ff4757] hover:bg-[#ff3848] text-white rounded-xl text-xs font-bold font-mono shadow-[var(--shadow-accent-sm)] active:translate-y-[1px] transition-all cursor-pointer"
                            >
                              Cộng ngay
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 2. NÚT GỬI NHẮC NHỞ ZALO */}
                    <button
                      type="button"
                      id={`btn-zalo-reminder-${student.id}`}
                      onClick={() => handleSendZaloReminder(student)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs sm:text-sm border border-sky-200 flex items-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-sky-600" />
                      <span>Gửi nhắc nhở Zalo</span>
                    </button>
                  </div>

                  {/* 3. NÚT XEM CỔNG PHỤ HUYNH */}
                  <button
                    type="button"
                    onClick={() => onViewStudentPortal(student.slug)}
                    className="min-h-[44px] px-3 py-2 rounded-xl text-slate-600 hover:text-indigo-900 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Cổng Phụ Huynh</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs sm:text-sm">
              Không tìm thấy học sinh nào phù hợp với bộ lọc.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
