import React, { useState } from "react";
import {
  Sparkles,
  Coins,
  Flame,
  Clock,
  BookOpen,
  Award,
  Star,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Gift,
  ChevronRight,
  BarChart3,
  Calendar,
  Headphones,
  GraduationCap,
  Languages,
  Mic,
} from "lucide-react";
import { StudentProfile } from "../types";
import { getStudentTokenBalance } from "../lib/studentUtils";

interface AcademicOverviewDashboardProps {
  student: StudentProfile;
  onOpenStore?: () => void;
  onOpenHistory?: () => void;
  onToggleSection?: (sectionId: string) => void;
}

// Cute Dino Mascot SVG matching Learnly's green dinosaur in UI.jpg
const LearnlyDinoMascot: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <svg
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Soft shadow under dinosaur */}
    <ellipse cx="70" cy="126" rx="42" ry="8" fill="#D5DEF5" opacity="0.6" />

    {/* Tail with soft curves */}
    <path
      d="M102 96 C118 96 128 85 125 72 C122 62 110 70 102 78 Z"
      fill="#2ECC71"
    />
    {/* Tail spikes */}
    <path d="M120 71 L126 64 L127 74 Z" fill="#F1C40F" />
    <path d="M112 78 L118 72 L117 82 Z" fill="#F1C40F" />

    {/* Dino Body */}
    <ellipse cx="68" cy="88" rx="38" ry="34" fill="#2ECC71" />
    
    {/* Yellow Belly */}
    <path
      d="M48 85 C48 70 65 66 76 75 C85 83 84 105 76 112 C62 114 48 105 48 85 Z"
      fill="#F9E79F"
    />
    {/* Belly horizontal ridges */}
    <path d="M54 84 Q66 87 74 85" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" />
    <path d="M56 94 Q66 97 74 95" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 103 Q68 105 73 104" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" />

    {/* Dino Back Spikes */}
    <path d="M72 32 L78 24 L84 32 Z" fill="#F1C40F" />
    <path d="M86 38 L94 30 L98 40 Z" fill="#F1C40F" />
    <path d="M96 52 L105 46 L104 57 Z" fill="#F1C40F" />

    {/* Dino Head */}
    <circle cx="56" cy="46" r="32" fill="#2ECC71" />
    {/* Dino Cheeks/Muzzle bump */}
    <ellipse cx="44" cy="54" rx="20" ry="16" fill="#2ECC71" />

    {/* Rosy Cheeks */}
    <ellipse cx="36" cy="56" rx="6" ry="4" fill="#FF8A80" opacity="0.6" />
    <ellipse cx="72" cy="52" rx="5" ry="3.5" fill="#FF8A80" opacity="0.6" />

    {/* Cute Big Sparkling Eyes */}
    {/* Left Eye */}
    <circle cx="44" cy="42" r="7.5" fill="#1C2833" />
    <circle cx="42" cy="40" r="2.8" fill="white" />
    <circle cx="46" cy="44" r="1.2" fill="white" />

    {/* Right Eye */}
    <circle cx="62" cy="40" r="7" fill="#1C2833" />
    <circle cx="60.5" cy="38" r="2.6" fill="white" />
    <circle cx="64" cy="42" r="1" fill="white" />

    {/* Cheerful Smile */}
    <path
      d="M42 56 Q52 66 60 56"
      stroke="#1C2833"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="#C0392B"
    />
    <path
      d="M48 61 Q52 64 56 61"
      fill="#F1948A"
    />

    {/* Cute Left Arm Waving */}
    <path
      d="M32 76 C24 70 20 58 26 54 C30 52 35 62 38 72 Z"
      fill="#2ECC71"
    />
    {/* Little claws */}
    <circle cx="24" cy="54" r="2" fill="#27AE60" />
    <circle cx="26" cy="51" r="2" fill="#27AE60" />

    {/* Right Arm */}
    <path
      d="M82 82 C90 85 96 88 94 94 C92 98 84 94 80 88 Z"
      fill="#27AE60"
    />

    {/* Little Feet */}
    <ellipse cx="50" cy="120" rx="12" ry="7" fill="#27AE60" />
    <ellipse cx="82" cy="119" rx="12" ry="7" fill="#27AE60" />
    {/* Toenails */}
    <circle cx="44" cy="122" r="2" fill="#F1C40F" />
    <circle cx="49" cy="124" r="2" fill="#F1C40F" />
    <circle cx="54" cy="123" r="2" fill="#F1C40F" />
    <circle cx="76" cy="121" r="2" fill="#F1C40F" />
    <circle cx="81" cy="123" r="2" fill="#F1C40F" />
    <circle cx="86" cy="122" r="2" fill="#F1C40F" />

    {/* Sparkling Stars around dino */}
    <path d="M18 36 L21 42 L27 45 L21 48 L18 54 L15 48 L9 45 L15 42 Z" fill="#F1C40F" />
    <path d="M106 24 L108 28 L112 30 L108 32 L106 36 L104 32 L100 30 L104 28 Z" fill="#F39C12" />
    <circle cx="118" cy="46" r="2.5" fill="#F1C40F" />
  </svg>
);

export const AcademicOverviewDashboard: React.FC<AcademicOverviewDashboardProps> = ({
  student,
  onOpenStore,
  onOpenHistory: _onOpenHistory,
  onToggleSection,
}) => {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "all">("week");

  // Calculations from real student profile
  const totalAssignments = student.assignments?.length || 0;
  const notDoneCount = student.assignments?.filter((a) => a.status === "not_done").length || 0;
  const completedCount = totalAssignments - notDoneCount;
  const tokenBalance = getStudentTokenBalance(student);
  const targetReward = student.gamification?.targetRewardName || "Hộp bút phi hành gia";
  const streakDays = student.gamification?.streakDays || 7;

  // Latest class score
  const latestGrowth = student.growthHistory?.slice(-1)[0];
  const latestScore = latestGrowth ? latestGrowth.classScore.toFixed(1) : "9.2";

  // First name for friendly personalized copy
  const firstName = student.fullName.split(" ").slice(-1)[0] || "Con";

  // Weekly study activity data (7 days Mon -> Sun)
  const weeklyActivityData = [
    { day: "T2", label: "Mon", minutes: 35, heightPercent: 58 },
    { day: "T3", label: "Tue", minutes: 25, heightPercent: 42 },
    { day: "T4", label: "Wed", minutes: 45, heightPercent: 75 },
    { day: "T5", label: "Thu", minutes: 30, heightPercent: 50 },
    { day: "T6", label: "Fri", minutes: 55, heightPercent: 92 },
    { day: "T7", label: "Sat", minutes: 20, heightPercent: 33 },
    { day: "CN", label: "Sun", minutes: 40, heightPercent: 67 },
  ];

  // Map Pillar skills from radar capabilities or standard curriculum
  const radarMap = student.radarCapabilities?.reduce((acc, curr) => {
    acc[curr.subject.toLowerCase()] = curr;
    return acc;
  }, {} as Record<string, typeof student.radarCapabilities[0]>) || {};

  const vocabVal = radarMap["từ vựng"]?.current || 85;
  const readingVal = radarMap["đọc hiểu"]?.current || radarMap["đọc"]?.current || 78;
  const listeningVal = radarMap["nghe hiểu"]?.current || radarMap["nghe"]?.current || 82;
  const grammarVal = radarMap["ngữ pháp"]?.current || 88;
  const phonicsVal = radarMap["phát âm"]?.current || 92;

  return (
    <section
      id="parent-academic-dashboard"
      className="bg-transparent lg:bg-white rounded-none lg:rounded-3xl lg:sm:rounded-[32px] p-0 lg:p-7 border-0 lg:border lg:border-indigo-100/90 shadow-none lg:shadow-[0_10px_36px_rgba(99,91,255,0.07),0_2px_8px_rgba(0,0,0,0.02)] space-y-5 sm:space-y-6"
    >
      {/* 1. Header of Academic Dashboard with Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 lg:pb-3 border-b-0 lg:border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learning Dashboard • Bảng tiến độ học vụ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Tổng quan học vụ & Tiến trình rèn luyện
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi chi tiết số bài tập, mức độ chuyên cần, năng lực 4 kỹ năng và tích luỹ điểm thưởng của {firstName}
          </p>
        </div>

        {/* Timeframe Filter (Tuần này / Tháng này / Toàn khóa) */}
        <div className="flex items-center self-start sm:self-auto bg-blue-50/60 p-1 rounded-2xl border border-blue-100/60 shrink-0">
          <button
            type="button"
            onClick={() => setTimeFilter("week")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeFilter === "week"
                ? "bg-white text-[#0066FF] shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tuần này
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("month")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeFilter === "month"
                ? "bg-white text-[#0066FF] shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tháng này
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeFilter === "all"
                ? "bg-white text-[#0066FF] shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Toàn khoá
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Metric Rows (Mobile: 1 cột; Tablet: 2 hàng 2 cột; Desktop PC: 4 cột) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
        {/* Row 1: Bài tập */}
        <div
          onClick={() => onToggleSection && onToggleSection("bai-tap")}
          className="bg-[#f0fbf7] hover:bg-[#e6f7f1] rounded-2xl p-3 sm:p-3.5 lg:p-4 border border-[#c6f0e0]/80 shadow-[0_2px_8px_rgba(16,185,129,0.05)] hover:border-emerald-300 transition-all cursor-pointer group"
          title="Bấm để xem danh sách bài tập"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-xs">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                  Bài tập
                </h4>
                <p className={`text-xs font-semibold leading-tight mt-0.5 ${notDoneCount === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                  {notDoneCount === 0 ? "Đã xong tất cả 🎉" : `Còn ${notDoneCount} bài chưa nộp`}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-emerald-200/90">
              <span className="text-base sm:text-lg font-black text-emerald-600 font-mono tracking-tight">
                {completedCount}/{totalAssignments}
              </span>
              <span className="text-xs font-semibold text-slate-600">bài tập</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) - Hàng 1: Icon & Badge, Hàng 2: Chỉ số, Hàng 3: Note */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-11 h-11 rounded-2xl bg-[#dcfce7] text-[#059669] flex items-center justify-center shrink-0 border border-emerald-200/60 shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-xl bg-white shadow-xs border border-emerald-200/90">
                <span className="text-base font-black text-emerald-600 font-mono tracking-tight">
                  {completedCount}/{totalAssignments}
                </span>
                <span className="text-xs font-semibold text-slate-600">bài tập</span>
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                Bài tập
              </h4>
              <p className={`text-xs font-semibold leading-tight mt-1 ${notDoneCount === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                {notDoneCount === 0 ? "Đã xong tất cả 🎉" : `Còn ${notDoneCount} bài chưa nộp`}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Điểm số */}
        <div
          onClick={() => onToggleSection && onToggleSection("diem-so")}
          className="bg-[#fdf4f8] hover:bg-[#fcebf3] rounded-2xl p-3 sm:p-3.5 lg:p-4 border border-[#fbcfe8]/80 shadow-[0_2px_8px_rgba(236,72,153,0.05)] hover:border-pink-300 transition-all cursor-pointer group"
          title="Bấm để xem biểu đồ điểm số"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#fce7f3] text-[#db2777] flex items-center justify-center shrink-0 border border-pink-200/60 shadow-xs">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                  Điểm số
                </h4>
                <p className="text-xs font-semibold text-emerald-600 leading-tight mt-0.5">
                  +8% tiến bộ
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-pink-200/90">
              <span className="text-base sm:text-lg font-black text-[#db2777] font-mono tracking-tight">
                {latestScore}
              </span>
              <span className="text-xs font-semibold text-slate-600">/10 điểm</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) - Hàng 1: Icon & Badge, Hàng 2: Chỉ số, Hàng 3: Note */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-11 h-11 rounded-2xl bg-[#fce7f3] text-[#db2777] flex items-center justify-center shrink-0 border border-pink-200/60 shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-xl bg-white shadow-xs border border-pink-200/90">
                <span className="text-base font-black text-[#db2777] font-mono tracking-tight">
                  {latestScore}
                </span>
                <span className="text-xs font-semibold text-slate-600">/10 điểm</span>
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                Điểm số
              </h4>
              <p className="text-xs font-semibold text-emerald-600 leading-tight mt-1">
                +8% tiến bộ
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Tokens */}
        <div
          onClick={() => {
            if (onOpenStore) onOpenStore();
            else if (onToggleSection) onToggleSection("gamification");
          }}
          className="bg-[#fffbf0] hover:bg-[#fef7e0] rounded-2xl p-3 sm:p-3.5 lg:p-4 border border-[#fde68a]/80 shadow-[0_2px_8px_rgba(245,158,11,0.05)] hover:border-amber-300 transition-all cursor-pointer group"
          title="Bấm để mở kho đổi quà"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0 border border-amber-200/60 shadow-xs">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                  Tokens
                </h4>
                <p className="text-xs font-semibold text-amber-700 leading-tight mt-0.5 truncate max-w-[130px] sm:max-w-[180px]">
                  Mục tiêu: {targetReward}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-amber-200/90">
              <span className="text-base sm:text-lg font-black text-[#d97706] font-mono tracking-tight">
                {tokenBalance}
              </span>
              <span className="text-xs font-semibold text-slate-600">/100 🪙</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) - Hàng 1: Icon & Badge, Hàng 2: Chỉ số, Hàng 3: Note */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-11 h-11 rounded-2xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0 border border-amber-200/60 shadow-xs group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-xl bg-white shadow-xs border border-amber-200/90">
                <span className="text-base font-black text-[#d97706] font-mono tracking-tight">
                  {tokenBalance}
                </span>
                <span className="text-xs font-semibold text-slate-600">/100 🪙</span>
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                Tokens
              </h4>
              <p className="text-xs font-semibold text-amber-700 leading-tight mt-1 truncate max-w-full">
                Mục tiêu: {targetReward}
              </p>
            </div>
          </div>
        </div>

        {/* Row 4: Chuyên cần */}
        <div
          onClick={() => onToggleSection && onToggleSection("buoi-hoc")}
          className="bg-[#fff7ed] hover:bg-[#ffedd5]/60 rounded-2xl p-3 sm:p-3.5 lg:p-4 border border-[#fed7aa]/80 shadow-[0_2px_8px_rgba(249,115,22,0.05)] hover:border-orange-300 transition-all cursor-pointer group"
          title="Bấm để xem buổi học"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#ffedd5] text-[#ea580c] flex items-center justify-center shrink-0 border border-orange-200/60 shadow-xs">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-[#ea580c]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                  Chuyên cần
                </h4>
                <p className="text-xs font-semibold text-emerald-600 leading-tight mt-0.5">
                  Chăm chỉ rèn luyện
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3 py-1.5 rounded-xl bg-white shadow-xs border border-orange-200/90">
              <span className="text-base sm:text-lg font-black text-[#ea580c] font-mono tracking-tight">
                {streakDays}
              </span>
              <span className="text-xs font-semibold text-slate-600">ngày 🔥</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) - Hàng 1: Icon & Badge, Hàng 2: Chỉ số, Hàng 3: Note */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-11 h-11 rounded-2xl bg-[#ffedd5] text-[#ea580c] flex items-center justify-center shrink-0 border border-orange-200/60 shadow-xs group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-[#ea580c]" />
              </div>
              <div className="flex items-baseline gap-1 px-2.5 py-1 rounded-xl bg-white shadow-xs border border-orange-200/90">
                <span className="text-base font-black text-[#ea580c] font-mono tracking-tight">
                  {streakDays}
                </span>
                <span className="text-xs font-semibold text-slate-600">ngày 🔥</span>
              </div>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1a1a1a] tracking-tight leading-snug">
                Chuyên cần
              </h4>
              <p className="text-xs font-semibold text-emerald-600 leading-tight mt-1">
                Chăm chỉ rèn luyện
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Learning Progress & Weekly Activity (2 Columns like UI.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* Box 1: Learning Progress (Language Skills) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[var(--shadow-card-sm)] space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Tiến trình kỹ năng
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Đo lường mức độ thành thạo ngôn ngữ qua các bài tập và kiểm tra định kỳ
            </p>
          </div>

          {/* Skill Progress Bars matching the reference screenshot */}
          <div className="space-y-3.5 pt-1">
            {[
              {
                name: "Vocabulary",
                value: vocabVal,
                icon: Languages,
                bgColor: "bg-blue-50/80",
                textColor: "text-[#2563eb]",
                borderColor: "border-blue-100",
                barColor: "bg-[#2563eb]",
              },
              {
                name: "Reading",
                value: readingVal,
                icon: BookOpen,
                bgColor: "bg-pink-50/80",
                textColor: "text-[#db2777]",
                borderColor: "border-pink-100",
                barColor: "bg-[#d946ef]",
              },
              {
                name: "Listening",
                value: listeningVal,
                icon: Headphones,
                bgColor: "bg-emerald-50/80",
                textColor: "text-[#16a34a]",
                borderColor: "border-emerald-100",
                barColor: "bg-[#22c55e]",
              },
              {
                name: "Grammar",
                value: grammarVal,
                icon: GraduationCap,
                bgColor: "bg-purple-50/80",
                textColor: "text-[#9333ea]",
                borderColor: "border-purple-100",
                barColor: "bg-[#9333ea]",
              },
              {
                name: "Phonics & Speaking",
                value: phonicsVal,
                icon: Mic,
                bgColor: "bg-amber-50/80",
                textColor: "text-[#d97706]",
                borderColor: "border-amber-100",
                barColor: "bg-[#2563eb]",
              },
            ].map((skill) => {
              const Icon = skill.icon;
              return (
                <div key={skill.name} className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${skill.bgColor} ${skill.textColor} flex items-center justify-center shrink-0 border ${skill.borderColor} shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                      <span className="font-bold text-slate-800 tracking-tight">
                        {skill.name}
                      </span>
                      <span className="font-extrabold font-mono text-slate-800">
                        {skill.value}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100/90 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${skill.barColor} h-2 rounded-full transition-all duration-700`}
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 2: Weekly Activity Bar Chart */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[var(--shadow-card-sm)] flex flex-col justify-between">
          <div className="space-y-1 mb-2">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0066FF]" />
              <span>Hoạt động rèn luyện tuần qua</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Thời lượng làm bài và tương tác học tiếng Anh mỗi ngày
            </p>
            <div className="pt-1">
              <div className="text-[11px] font-bold text-[#0066FF] bg-blue-50 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-blue-100 w-fit">
                <Clock className="w-3 h-3" />
                <span>5h 30m</span>
              </div>
            </div>
          </div>

          {/* Interactive Bar Chart matching UI.jpg Weekly Activity */}
          <div className="h-44 sm:h-48 flex items-end justify-between gap-1 sm:gap-2 pt-2 pl-6 sm:pl-7 pr-1 relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-x-0 top-3 border-b border-dashed border-slate-200/70 ml-6" />
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-200/70 ml-6" />
            <div className="absolute inset-x-0 bottom-7 border-b border-slate-200 ml-6" />

            {/* Y-axis markers */}
            <div className="absolute left-0 top-2 text-[9px] font-mono text-slate-400">60m</div>
            <div className="absolute left-0 top-1/2 -translate-y-1 text-[9px] font-mono text-slate-400">30m</div>
            <div className="absolute left-0 bottom-8 text-[9px] font-mono text-slate-400">0m</div>

            {/* Day Bars */}
            {weeklyActivityData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end z-10 group min-w-0">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-sm">
                  {item.minutes} phút
                </div>
                
                {/* Bar */}
                <div className="w-full max-w-[20px] sm:max-w-[26px] bg-slate-100 rounded-t-lg h-[115px] flex items-end overflow-hidden p-0.5">
                  <div
                    className="w-full bg-[#0066FF] group-hover:bg-[#0052cc] rounded-t-md transition-all duration-300 shadow-xs"
                    style={{ height: `${item.heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className="mt-2 text-[10px] sm:text-[11px] font-bold text-slate-600 group-hover:text-[#0066FF]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Trung bình: <strong>47 phút/ngày</strong></span>
            <span className="text-[#4CAF50] font-bold">Đạt 115% mục tiêu tuần 🎯</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Achievements & Dino Encouragement Widget (Matching UI.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* Left: Recent Achievements List */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[var(--shadow-card-sm)] space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FFB800]" />
              <span>Thành tích & Huy hiệu mới</span>
            </h4>
          </div>

          <div className="space-y-2.5">
            {/* Achievement 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 shadow-2xs hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center text-sm font-bold shrink-0 border border-blue-100">
                  🧮
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    Chiến binh Từ vựng
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Đạt 95% bài kiểm tra Vocabulary Unit 3
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 shrink-0 font-mono">
                Tháng 5
              </span>
            </div>

            {/* Achievement 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 shadow-2xs hover:border-amber-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FF9800] flex items-center justify-center text-sm font-bold shrink-0 border border-amber-200">
                  ⭐
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    Ngôi sao Đọc hiểu
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Hoàn thành 10 bài đọc truyện ngắn
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 shrink-0 font-mono">
                Tháng 5
              </span>
            </div>

            {/* Achievement 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 shadow-2xs hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#4CAF50] flex items-center justify-center text-sm font-bold shrink-0 border border-emerald-200">
                  🌿
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    Thám tử Ngữ pháp
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Nắm chắc 5 cấu trúc câu phức không sai câu nào
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 shrink-0 font-mono">
                Tháng 5
              </span>
            </div>
          </div>
        </div>

        {/* Right: Dino Encouragement Mascot Card */}
        <div className="bg-gradient-to-br from-[#EEF4FF] via-[#F4F7FC] to-[#E5EDFC] rounded-2xl sm:rounded-3xl p-5 border border-blue-100/90 shadow-[var(--shadow-card-sm)] relative">
          {/* Decorative soft glowing blobs masked inside card */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/60 blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-blue-200/30 blur-lg" />
          </div>

          {/* Floating Cheerful Dino Mascot at top-right, increased size by +30%, 30% overflowing outside */}
          <div className="absolute -top-7 sm:-top-8 right-2 sm:right-3 z-20 pointer-events-none">
            <LearnlyDinoMascot className="w-[104px] h-[104px] sm:w-[116px] sm:h-[116px] drop-shadow-md" />
          </div>

          <div className="relative z-10 flex-1 pr-12 sm:pr-14">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200/80 text-[11px] font-extrabold mb-1.5 shadow-2xs">
              <Star className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" />
              <span>Ghi nhận từ Cô Nghi</span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Keep it up, {firstName}!
            </h4>

            <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
              Con đang học rất xuất sắc! Cô Nghi và ba mẹ rất tự hào về tinh thần tự giác, chuẩn bị bài chu đáo của con.
            </p>

            <div className="mt-2.5 flex items-center">
              <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white text-[#0066FF] shadow-xs border border-blue-100 whitespace-nowrap">
                <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800] shrink-0" />
                <span>{student.attitudeBadge?.label || "Chăm ngoan & Tích cực"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
