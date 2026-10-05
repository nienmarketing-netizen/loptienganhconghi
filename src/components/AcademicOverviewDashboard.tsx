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
      {/* 1. Header of Academic Dashboard with Cartoon Flair & Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-indigo-100/70">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-pink-400/20 to-blue-400/20 text-[#635BFF] text-xs sm:text-sm font-black tracking-wide border border-indigo-200/60 shadow-2xs">
            <span className="text-sm">🌟</span>
            <span>Bảng thành tích siêu đẳng</span>
            <span className="text-sm">🚀</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2">
            <span>Hành trình chinh phục tiếng Anh của {firstName}</span>
            <span className="text-2xl">🎈</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 font-medium leading-relaxed">
            Xem ngay các nhiệm vụ bài tập đã vượt qua, ngọn lửa chăm chỉ và kho báu tokens rực rỡ nhé! 🏆
          </p>
        </div>

        {/* Timeframe Filter (Tuần này / Tháng này / Toàn khóa) with cute cartoon styling */}
        <div className="flex items-center self-start sm:self-auto bg-indigo-50/80 p-1.5 rounded-2xl border-2 border-indigo-100 shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => setTimeFilter("week")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              timeFilter === "week"
                ? "bg-white text-[#0066FF] shadow-xs border border-indigo-100 scale-102"
                : "text-slate-600 hover:text-[#0066FF]"
            }`}
          >
            <span>🗓️</span>
            <span>Tuần này</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("month")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              timeFilter === "month"
                ? "bg-white text-[#0066FF] shadow-xs border border-indigo-100 scale-102"
                : "text-slate-600 hover:text-[#0066FF]"
            }`}
          >
            <span>📅</span>
            <span>Tháng này</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              timeFilter === "all"
                ? "bg-white text-[#0066FF] shadow-xs border border-indigo-100 scale-102"
                : "text-slate-600 hover:text-[#0066FF]"
            }`}
          >
            <span>🌈</span>
            <span>Toàn khoá</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Metric Rows (Cartoon Playful Styling, 2x2 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5">
        {/* Row 1: Bài tập (Cute Mint Adventure) */}
        <div
          onClick={() => onToggleSection && onToggleSection("bai-tap")}
          className="bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0] hover:from-[#E6FBF2] hover:to-[#96F2C2] rounded-[26px] p-4 sm:p-5 border-2 border-emerald-300 shadow-[0_6px_20px_rgba(16,185,129,0.14)] hover:shadow-[0_10px_28px_rgba(16,185,129,0.22)] transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Bấm để xem danh sách bài tập"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 border-2 border-emerald-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                📚
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    Nhiệm vụ bài tập
                  </h4>
                  <span className="text-sm">📝</span>
                </div>
                <p className={`text-xs sm:text-sm font-bold leading-tight mt-1 ${notDoneCount === 0 ? "text-emerald-700" : "text-amber-700"}`}>
                  {notDoneCount === 0 ? "🎉 Siêu quá! Đã xong hết" : `⚡ Còn ${notDoneCount} bài nữa thôi!`}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-emerald-200">
              <span className="text-lg font-black text-emerald-600 font-mono tracking-tight">
                {completedCount}/{totalAssignments}
              </span>
              <span className="text-xs font-bold text-slate-600">bài</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) - 3 Hàng Chuẩn với phong cách Cartoon */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-13 h-13 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0 border-2 border-emerald-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                📚
              </div>
              <div className="flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-emerald-200">
                <span className="text-lg sm:text-xl font-black text-emerald-600 font-mono tracking-tight">
                  {completedCount}/{totalAssignments}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-600">bài tập</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Nhiệm vụ bài tập
                </h4>
                <span className="text-sm">📝</span>
              </div>
              <p className={`text-sm font-bold leading-tight mt-1 ${notDoneCount === 0 ? "text-emerald-700" : "text-amber-700"}`}>
                {notDoneCount === 0 ? "🎉 Siêu quá! Đã xong tất cả!" : `⚡ Còn ${notDoneCount} bài nữa là xong rồi!`}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Điểm số (Cute Pink Sweetness) */}
        <div
          onClick={() => onToggleSection && onToggleSection("diem-so")}
          className="bg-gradient-to-br from-[#FFF1F7] via-[#FCE7F3] to-[#FBCFE8] hover:from-[#FEE8F2] hover:to-[#F9A8D4] rounded-[26px] p-4 sm:p-5 border-2 border-pink-300 shadow-[0_6px_20px_rgba(236,72,153,0.14)] hover:shadow-[0_10px_28px_rgba(236,72,153,0.22)] transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Bấm để xem biểu đồ điểm số"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-white text-pink-600 flex items-center justify-center shrink-0 border-2 border-pink-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                ⭐
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    Điểm số phong độ
                  </h4>
                  <span className="text-sm">🌟</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-pink-700 leading-tight mt-1">
                  🚀 +8% tiến bộ vượt bậc!
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-pink-200">
              <span className="text-lg font-black text-pink-600 font-mono tracking-tight">
                {latestScore}
              </span>
              <span className="text-xs font-bold text-slate-600">/10đ 🏆</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-13 h-13 rounded-2xl bg-white text-pink-600 flex items-center justify-center shrink-0 border-2 border-pink-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                ⭐
              </div>
              <div className="flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-pink-200">
                <span className="text-lg sm:text-xl font-black text-pink-600 font-mono tracking-tight">
                  {latestScore}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-600">/10 điểm 🏆</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Điểm số phong độ
                </h4>
                <span className="text-sm">🌟</span>
              </div>
              <p className="text-sm font-bold text-pink-700 leading-tight mt-1">
                🚀 +8% tiến bộ vượt bậc, đỉnh chóp!
              </p>
            </div>
          </div>
        </div>

        {/* Row 3: Tokens (Cute Sunny Honey Treasure) */}
        <div
          onClick={() => {
            if (onOpenStore) onOpenStore();
            else if (onToggleSection) onToggleSection("gamification");
          }}
          className="bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] hover:from-[#FEF6D8] hover:to-[#FCD34D] rounded-[26px] p-4 sm:p-5 border-2 border-amber-300 shadow-[0_6px_20px_rgba(245,158,11,0.16)] hover:shadow-[0_10px_28px_rgba(245,158,11,0.24)] transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Bấm để mở kho đổi quà"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-white text-amber-600 flex items-center justify-center shrink-0 border-2 border-amber-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                🪙
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    Kho báu tokens
                  </h4>
                  <span className="text-sm">🎁</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-800 leading-tight mt-1 truncate max-w-[150px] sm:max-w-[200px]">
                  Mục tiêu: {targetReward}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-amber-200">
              <span className="text-lg font-black text-amber-600 font-mono tracking-tight">
                {tokenBalance}
              </span>
              <span className="text-xs font-bold text-slate-600">/100 🪙</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-13 h-13 rounded-2xl bg-white text-amber-600 flex items-center justify-center shrink-0 border-2 border-amber-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                🪙
              </div>
              <div className="flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-amber-200">
                <span className="text-lg sm:text-xl font-black text-amber-600 font-mono tracking-tight">
                  {tokenBalance}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-600">/100 xu vàng 🎁</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Kho báu tokens
                </h4>
                <span className="text-sm">🎁</span>
              </div>
              <p className="text-sm font-bold text-amber-800 leading-tight mt-1 truncate max-w-full">
                🎯 Sắp đủ xu đổi: {targetReward}
              </p>
            </div>
          </div>
        </div>

        {/* Row 4: Chuyên cần (Cute Fiery Energy) */}
        <div
          onClick={() => onToggleSection && onToggleSection("buoi-hoc")}
          className="bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA] hover:from-[#FEEFE2] hover:to-[#FDBA74] rounded-[26px] p-4 sm:p-5 border-2 border-orange-300 shadow-[0_6px_20px_rgba(249,115,22,0.14)] hover:shadow-[0_10px_28px_rgba(249,115,22,0.22)] transition-all cursor-pointer group hover:-translate-y-0.5"
          title="Bấm để xem buổi học"
        >
          {/* Mobile view (< sm) */}
          <div className="flex sm:hidden items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-13 h-13 rounded-2xl bg-white text-orange-600 flex items-center justify-center shrink-0 border-2 border-orange-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                🔥
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    Ngọn lửa chuyên cần
                  </h4>
                  <span className="text-sm">⚡</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-orange-700 leading-tight mt-1">
                  🏅 Chăm chỉ siêu cấp, không nghỉ!
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-orange-200">
              <span className="text-lg font-black text-orange-600 font-mono tracking-tight">
                {streakDays}
              </span>
              <span className="text-xs font-bold text-slate-600">ngày 🔥</span>
            </div>
          </div>

          {/* Tablet & PC view (sm: & md:) */}
          <div className="hidden sm:flex sm:flex-col justify-between h-full w-full gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="w-13 h-13 rounded-2xl bg-white text-orange-600 flex items-center justify-center shrink-0 border-2 border-orange-200 shadow-sm text-2xl group-hover:scale-110 transition-transform">
                🔥
              </div>
              <div className="flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border-2 border-orange-200">
                <span className="text-lg sm:text-xl font-black text-orange-600 font-mono tracking-tight">
                  {streakDays}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-600">ngày liên tiếp 🔥</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Ngọn lửa chuyên cần
                </h4>
                <span className="text-sm">⚡</span>
              </div>
              <p className="text-sm font-bold text-orange-700 leading-tight mt-1">
                🏅 Chăm chỉ siêu cấp, không nghỉ buổi nào!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Cartoon Super Skills & Weekly Fun Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* Box 1: Super Language Skills (Cartoon Style) */}
        <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-indigo-100 shadow-[0_6px_20px_rgba(99,91,255,0.06)] space-y-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>⚡ Siêu năng lực tiếng Anh</span>
              </h4>
              <span className="text-xs sm:text-sm font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full">
                5 kỹ năng
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Cấp độ thành thạo từng kỹ năng qua các bài tập và thử thách lớp học
            </p>
          </div>

          {/* Skill Progress Bars with colorful cartoon candy styles */}
          <div className="space-y-4 pt-1">
            {[
              {
                name: "Từ vựng",
                value: vocabVal,
                emoji: "📚",
                bgColor: "bg-blue-50",
                textColor: "text-[#2563eb]",
                borderColor: "border-blue-200",
                barGradient: "bg-gradient-to-r from-blue-400 to-blue-600",
                badgeText: "Siêu nhớ từ! 🌟",
              },
              {
                name: "Đọc hiểu",
                value: readingVal,
                emoji: "📖",
                bgColor: "bg-pink-50",
                textColor: "text-[#db2777]",
                borderColor: "border-pink-200",
                barGradient: "bg-gradient-to-r from-pink-400 to-rose-500",
                badgeText: "Đọc trôi chảy! 🌸",
              },
              {
                name: "Nghe hiểu",
                value: listeningVal,
                emoji: "🎧",
                bgColor: "bg-emerald-50",
                textColor: "text-[#16a34a]",
                borderColor: "border-emerald-200",
                barGradient: "bg-gradient-to-r from-emerald-400 to-teal-500",
                badgeText: "Tai thính siêu cấp! 🌿",
              },
              {
                name: "Ngữ pháp",
                value: grammarVal,
                emoji: "🪄",
                bgColor: "bg-purple-50",
                textColor: "text-[#9333ea]",
                borderColor: "border-purple-200",
                barGradient: "bg-gradient-to-r from-purple-400 to-indigo-600",
                badgeText: "Cấu trúc chuẩn! 🔮",
              },
              {
                name: "Phát âm & nói",
                value: phonicsVal,
                emoji: "🎤",
                bgColor: "bg-amber-50",
                textColor: "text-[#d97706]",
                borderColor: "border-amber-200",
                barGradient: "bg-gradient-to-r from-amber-400 to-orange-500",
                badgeText: "Phát âm tự tin! 🚀",
              },
            ].map((skill) => {
              return (
                <div key={skill.name} className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl ${skill.bgColor} flex items-center justify-center shrink-0 border-2 ${skill.borderColor} shadow-xs text-2xl`}
                  >
                    {skill.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm sm:text-base mb-1.5">
                      <span className="font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5 truncate">
                        <span>{skill.name}</span>
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                          {skill.badgeText}
                        </span>
                        <span className="font-black font-mono text-xs sm:text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          {skill.value}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200/80">
                      <div
                        className={`${skill.barGradient} h-2.5 rounded-full transition-all duration-700 shadow-xs`}
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Box 2: Weekly Activity Bar Chart (Cartoon Style) */}
        <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-indigo-100 shadow-[0_6px_20px_rgba(99,91,255,0.06)] flex flex-col justify-between">
          <div className="space-y-1 mb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>📅 Nhật ký rèn luyện mỗi ngày</span>
              </h4>
              <div className="text-xs sm:text-sm font-black text-blue-600 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                <span>⏱️</span>
                <span>5h 30m</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Thời lượng học tập và tương tác tiếng Anh chăm chỉ trong tuần qua
            </p>
          </div>

          {/* Interactive Cartoon Bar Chart */}
          <div className="h-44 sm:h-48 flex items-end justify-between gap-1 sm:gap-2 pt-2 pl-6 sm:pl-7 pr-1 relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-x-0 top-3 border-b-2 border-dashed border-slate-100 ml-6" />
            <div className="absolute inset-x-0 top-1/2 border-b-2 border-dashed border-slate-100 ml-6" />
            <div className="absolute inset-x-0 bottom-7 border-b-2 border-slate-200 ml-6" />

            {/* Y-axis markers */}
            <div className="absolute left-0 top-2 text-[10px] font-mono font-bold text-slate-400">60m</div>
            <div className="absolute left-0 top-1/2 -translate-y-1 text-[10px] font-mono font-bold text-slate-400">30m</div>
            <div className="absolute left-0 bottom-8 text-[10px] font-mono font-bold text-slate-400">0m</div>

            {/* Day Bars */}
            {weeklyActivityData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end z-10 group min-w-0">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-lg pointer-events-none whitespace-nowrap shadow-md">
                  {item.minutes} phút ✨
                </div>
                
                {/* Bar */}
                <div className="w-full max-w-[24px] sm:max-w-[30px] bg-slate-100 rounded-t-xl h-[115px] flex items-end overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className="w-full bg-gradient-to-t from-[#2563EB] to-[#60A5FA] group-hover:from-[#1D4ED8] group-hover:to-[#3B82F6] rounded-t-lg transition-all duration-300 shadow-xs"
                    style={{ height: `${item.heightPercent}%` }}
                  />
                </div>

                {/* Day Label with cartoon style */}
                <span className="mt-2 text-xs sm:text-sm font-black text-slate-700 group-hover:text-[#0066FF]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-600 font-bold">
            <span className="flex items-center gap-1.5">
              <span>⏰</span>
              <span>Trung bình: <strong>47 phút/ngày</strong></span>
            </span>
            <span className="text-emerald-600 font-black flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              <span>🎯</span>
              <span>Đạt 115% mục tiêu!</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Cartoon Achievements Collection & Dino Encouragement Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* Left: Cartoon Achievements List */}
        <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-amber-100 shadow-[0_6px_20px_rgba(245,158,11,0.06)] space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="text-2xl">🏅</span>
              <span>Bộ sưu tập huy hiệu vinh quang</span>
            </h4>
            <span className="text-xs sm:text-sm font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full">
              3 mới nhận ⭐
            </span>
          </div>

          <div className="space-y-3">
            {/* Achievement 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/50 border-2 border-blue-200/80 shadow-2xs hover:scale-101 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center text-xl font-black shrink-0 border-2 border-blue-200 shadow-xs">
                  🎯
                </div>
                <div>
                  <h5 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>Chiến binh từ vựng</span>
                    <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-md">
                      Top 1
                    </span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    Đạt 95% bài kiểm tra Vocabulary Unit 3 ✨
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-blue-600 shrink-0 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                Tháng 5
              </span>
            </div>

            {/* Achievement 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/90 to-yellow-50/50 border-2 border-amber-200/80 shadow-2xs hover:scale-101 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center text-xl font-black shrink-0 border-2 border-amber-200 shadow-xs">
                  ⭐
                </div>
                <div>
                  <h5 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>Ngôi sao đọc hiểu</span>
                    <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md">
                      10 bài
                    </span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    Hoàn thành 10 bài đọc truyện vui vẻ 📖
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-600 shrink-0 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-amber-200">
                Tháng 5
              </span>
            </div>

            {/* Achievement 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/50 border-2 border-emerald-200/80 shadow-2xs hover:scale-101 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white text-emerald-600 flex items-center justify-center text-xl font-black shrink-0 border-2 border-emerald-200 shadow-xs">
                  🕵️‍♂️
                </div>
                <div>
                  <h5 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>Thám tử ngữ pháp</span>
                    <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                      100%
                    </span>
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    Nắm chắc 5 cấu trúc câu không sai lỗi nào 🔍
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-emerald-600 shrink-0 font-mono bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                Tháng 5
              </span>
            </div>
          </div>
        </div>

        {/* Right: Dino Encouragement Mascot Card (Cute Speech Bubble) */}
        <div className="bg-gradient-to-br from-[#EEF6FF] via-[#E8F1FD] to-[#DCEBFC] rounded-[28px] p-5 sm:p-6 border-2 border-blue-200/90 shadow-[0_6px_20px_rgba(37,99,235,0.08)] relative overflow-visible flex flex-col justify-between">
          {/* Decorative soft glowing blobs */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/70 blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-blue-200/40 blur-lg" />
          </div>

          {/* Floating Cheerful Dino Mascot at top-right */}
          <div className="absolute -top-8 sm:-top-9 right-2 sm:right-3 z-20 pointer-events-none filter drop-shadow-lg animate-wiggle">
            <LearnlyDinoMascot className="w-[108px] h-[108px] sm:w-[124px] sm:h-[124px]" />
          </div>

          <div className="relative z-10 flex-1 pr-14 sm:pr-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#0066FF] border-2 border-blue-200 text-xs sm:text-sm font-black mb-2.5 shadow-2xs">
              <span className="text-base">💬</span>
              <span>Lời nhắn từ Cô Nghi</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Tuyệt vời lắm, {firstName}!</span>
              <span>🌟</span>
            </h4>

            {/* Cartoon Speech Bubble */}
            <div className="relative mt-2.5 p-3.5 rounded-2xl bg-white/95 border-2 border-blue-200 text-sm sm:text-base text-slate-700 font-bold leading-relaxed shadow-sm">
              <p>
                "Con đang học rất chăm ngoan và tự giác! Cô Nghi và ba mẹ rất tự hào về con. Hãy tiếp tục phát huy để rinh thêm nhiều huy hiệu và kho báu quà tặng nhé!" 🎁💖
              </p>
              {/* Little speech tail pointing towards the dino */}
              <div className="absolute -top-2 right-6 w-3.5 h-3.5 bg-white border-t-2 border-l-2 border-blue-200 transform rotate-45" />
            </div>

            <div className="mt-3.5 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl bg-amber-400 text-amber-950 shadow-xs border-2 border-white">
                <span>⭐</span>
                <span>{student.attitudeBadge?.label || "Bé ngoan & tích cực"}</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-blue-700 bg-blue-100/80 px-3 py-1 rounded-lg border border-blue-200">
                +10 điểm chăm chỉ 🎈
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
