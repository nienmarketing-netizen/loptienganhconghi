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

  // Map 4 Pillar skills from radar capabilities or standard curriculum
  const radarMap = student.radarCapabilities?.reduce((acc, curr) => {
    acc[curr.subject.toLowerCase()] = curr;
    return acc;
  }, {} as Record<string, typeof student.radarCapabilities[0]>) || {};

  const vocabVal = radarMap["từ vựng"]?.current || 85;
  const readingVal = radarMap["nghe hiểu"]?.current || 78;
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
        <div className="flex items-center self-start sm:self-auto bg-[#F4F6FD] p-1 rounded-2xl border border-indigo-50 shrink-0">
          <button
            type="button"
            onClick={() => setTimeFilter("week")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeFilter === "week"
                ? "bg-white text-[#635BFF] shadow-xs"
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
                ? "bg-white text-[#635BFF] shadow-xs"
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
                ? "bg-white text-[#635BFF] shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Toàn khoá
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Metric Cards (Directly matching the Parent Dashboard tablet in UI.jpg) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Lessons / Homework Completed */}
        <div
          onClick={() => onToggleSection && onToggleSection("bai-tap")}
          className="bg-[#FAFBFD] hover:bg-[#F4F6FE] rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-indigo-200 transition-all cursor-pointer group"
          title="Bấm để xem danh sách bài tập"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold text-xs text-slate-600">Bài tập & Nhiệm vụ</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {completedCount}/{totalAssignments}
            </span>
            <span className="text-xs text-slate-400 font-medium">bài</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-md w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{notDoneCount === 0 ? "Đã xong hết 🎉" : `Còn ${notDoneCount} bài`}</span>
          </div>
        </div>

        {/* Card 2: Accuracy & Test Score */}
        <div
          onClick={() => onToggleSection && onToggleSection("diem-so")}
          className="bg-[#FAFBFD] hover:bg-[#F4F6FE] rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-indigo-200 transition-all cursor-pointer group"
          title="Bấm để xem biểu đồ điểm số"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold text-xs text-slate-600">Độ chính xác / Điểm</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#635BFF] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#635BFF] tracking-tight">
              {latestScore}
            </span>
            <span className="text-xs text-slate-400 font-medium">/10đ</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-md w-fit">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>+8% so với tuần trước</span>
          </div>
        </div>

        {/* Card 3: Tokens Gamification & Target Reward */}
        <div
          onClick={() => {
            if (onOpenStore) onOpenStore();
            else if (onToggleSection) onToggleSection("gamification");
          }}
          className="bg-[#FAFBFD] hover:bg-[#F4F6FE] rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-amber-200 transition-all cursor-pointer group"
          title="Bấm để mở kho đổi quà"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold text-xs text-slate-600">Kho Tokens</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight">
              {tokenBalance}
            </span>
            <span className="text-xs text-slate-400 font-medium">/100 🪙</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50/90 px-2 py-0.5 rounded-md w-fit truncate max-w-full">
            <Gift className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="truncate">{targetReward}</span>
          </div>
        </div>

        {/* Card 4: Study Streak */}
        <div
          onClick={() => onToggleSection && onToggleSection("buoi-hoc")}
          className="bg-[#FAFBFD] hover:bg-[#F4F6FE] rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-orange-200 transition-all cursor-pointer group"
          title="Bấm để xem buổi học"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold text-xs text-slate-600">Chuỗi chuyên cần</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-orange-500 tracking-tight">
              {streakDays} Days
            </span>
            <span className="text-sm">🔥</span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-orange-600 bg-orange-50/80 px-2 py-0.5 rounded-md w-fit">
            Keep it going! Chăm chỉ liên tục
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Learning Progress & Weekly Activity (2 Columns like UI.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* Box 1: Learning Progress (4 Language Skills) */}
        <div className="bg-[#FAFBFD] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100/90 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Tiến trình 4 kỹ năng</span>
                <span className="text-xs font-semibold text-slate-400 font-mono">(Learning Progress)</span>
              </h4>
              <span className="text-xs font-bold text-[#635BFF] bg-[#635BFF]/10 px-2.5 py-0.5 rounded-lg">
                Chuẩn đầu ra
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Đo lường mức độ thành thạo ngôn ngữ qua các bài tập và kiểm tra định kỳ
            </p>
          </div>

          {/* Skill Progress Bars */}
          <div className="space-y-3.5 pt-1">
            {/* Skill 1: Vocabulary */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                    🔤
                  </div>
                  <span>Từ vựng & Mẫu câu (Vocabulary)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Xuất sắc</span>
                  <span className="font-extrabold font-mono text-blue-600">{vocabVal}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#3B82F6] h-2.5 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${vocabVal}%` }}
                />
              </div>
            </div>

            {/* Skill 2: Reading & Listening */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs">
                    📖
                  </div>
                  <span>Đọc hiểu & Nghe ngữ cảnh (Reading)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Tiến bộ</span>
                  <span className="font-extrabold font-mono text-pink-600">{readingVal}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#EC4899] h-2.5 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${readingVal}%` }}
                />
              </div>
            </div>

            {/* Skill 3: Grammar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                    🔬
                  </div>
                  <span>Ngữ pháp & Cấu trúc câu (Grammar)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Vững chắc</span>
                  <span className="font-extrabold font-mono text-emerald-600">{grammarVal}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#10B981] h-2.5 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${grammarVal}%` }}
                />
              </div>
            </div>

            {/* Skill 4: Phonics & Speaking */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
                    🗣️
                  </div>
                  <span>Phát âm & Phản xạ nói (Phonics & Speaking)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Tự tin</span>
                  <span className="font-extrabold font-mono text-amber-600">{phonicsVal}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200/70 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#F59E0B] h-2.5 rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${phonicsVal}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Weekly Activity Bar Chart */}
        <div className="bg-[#FAFBFD] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100/90 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#635BFF]" />
                <span>Hoạt động rèn luyện tuần qua</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Thời lượng làm bài và tương tác học tiếng Anh mỗi ngày
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#635BFF] bg-[#635BFF]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>5h 30m</span>
            </div>
          </div>

          {/* Interactive Bar Chart matching UI.jpg Weekly Activity */}
          <div className="h-44 sm:h-48 flex items-end justify-between gap-2 pt-2 px-1 relative">
            {/* Horizontal grid lines */}
            <div className="absolute inset-x-0 top-3 border-b border-dashed border-slate-200/70" />
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-200/70" />
            <div className="absolute inset-x-0 bottom-7 border-b border-slate-200" />

            {/* Y-axis markers */}
            <div className="absolute -left-1 top-2 text-[9px] font-mono text-slate-400">60m</div>
            <div className="absolute -left-1 top-1/2 -translate-y-1 text-[9px] font-mono text-slate-400">30m</div>
            <div className="absolute -left-1 bottom-8 text-[9px] font-mono text-slate-400">0m</div>

            {/* Day Bars */}
            {weeklyActivityData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end z-10 group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md pointer-events-none whitespace-nowrap shadow-sm">
                  {item.minutes} phút
                </div>
                
                {/* Bar */}
                <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-[115px] flex items-end overflow-hidden p-0.5">
                  <div
                    className="w-full bg-[#635BFF] group-hover:bg-[#4F46E5] rounded-t-md transition-all duration-300 shadow-xs"
                    style={{ height: `${item.heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className="mt-2 text-[11px] font-bold text-slate-600 group-hover:text-[#635BFF]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Trung bình: <strong>47 phút/ngày</strong></span>
            <span className="text-emerald-600 font-bold">Đạt 115% mục tiêu tuần 🎯</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Achievements & Dino Encouragement Widget (Matching UI.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1">
        
        {/* Left: Recent Achievements List */}
        <div className="bg-[#FAFBFD] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100/90 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Thành tích & Huy hiệu mới (Recent Badges)</span>
            </h4>
          </div>

          <div className="space-y-2.5">
            {/* Achievement 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:border-purple-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#635BFF] flex items-center justify-center text-sm font-bold shrink-0">
                  🧮
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    Chiến binh Từ vựng (Vocab Whiz)
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
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:border-pink-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-bold shrink-0">
                  ⭐
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    Ngôi sao Đọc hiểu (Reading Star)
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
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-bold shrink-0">
                  🌿
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                    Thám tử Ngữ pháp (Grammar Explorer)
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
        <div className="bg-gradient-to-br from-[#EEF2FF] via-[#F5F6FF] to-[#E0E7FF] rounded-2xl sm:rounded-3xl p-5 border border-indigo-100 flex items-center justify-between gap-3 relative overflow-hidden">
          {/* Decorative soft glowing blobs */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/50 blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-indigo-200/30 blur-lg pointer-events-none" />

          <div className="relative z-10 flex-1 pr-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-[11px] font-extrabold mb-1.5">
              <Star className="w-3 h-3 text-[#635BFF] fill-[#635BFF]" />
              <span>Ghi nhận từ Cô Nghi</span>
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Keep it up, {firstName}!
            </h4>

            <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
              Con đang học rất xuất sắc! Cô Nghi và ba mẹ rất tự hào về tinh thần tự giác, chuẩn bị bài chu đáo của con.
            </p>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white text-[#635BFF] shadow-xs border border-indigo-100">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{student.attitudeBadge?.label || "Chăm ngoan & Tích cực"}</span>
              </span>

              {onOpenStore && (
                <button
                  type="button"
                  onClick={onOpenStore}
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#635BFF] text-white hover:bg-[#4F46E5] shadow-xs transition-colors cursor-pointer"
                >
                  <Gift className="w-3 h-3 text-white" />
                  <span>Đổi quà tặng</span>
                </button>
              )}
            </div>
          </div>

          {/* Cheerful Green Dino Mascot matching UI.jpg */}
          <div className="relative z-10 shrink-0 flex items-center justify-center">
            <LearnlyDinoMascot className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" />
          </div>
        </div>
      </div>
    </section>
  );
};
