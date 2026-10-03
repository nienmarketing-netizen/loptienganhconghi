import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Heart,
  PhoneCall,
  Sparkles,
  CalendarCheck,
  Coins,
  TrendingUp,
  Stethoscope,
  FileText,
  AlertCircle,
  CheckCircle2,
  Camera,
  Flame,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  GraduationCap,
  Calendar,
  Layers,
  Star,
  Check,
  Zap,
} from "lucide-react";
import { StudentProfile, Assignment } from "../types";
import { getStudentTokenBalance } from "../lib/studentUtils";
import { HeaderGreeting } from "../components/HeaderGreeting";
import { RecentLessonBlock } from "../components/RecentLessonBlock";
import { GamificationBlock } from "../components/GamificationBlock";
import { GrowthLineChart } from "../components/GrowthLineChart";
import { DiagnosticRadarBlock } from "../components/DiagnosticRadarBlock";
import { AssignmentList } from "../components/AssignmentList";
import { TokenHistoryModal } from "../components/TokenHistoryModal";
import { RewardStoreModal } from "../components/RewardStoreModal";
import { CollapsibleSection } from "../components/CollapsibleSection";

interface StudentDashboardProps {
  student: StudentProfile;
  onNavigateToAdmin?: () => void;
  onUpdateStudentTokens?: (
    studentSlug: string,
    tokensToAdd: number,
    reason: string
  ) => Promise<void> | void;
}

// Cute Dino Mascot SVG matching Learnly's green dinosaur in UI.jpg
const LearnlyDinoMascot: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
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

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onNavigateToAdmin,
  onUpdateStudentTokens,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [currentAssignments, setCurrentAssignments] = useState<Assignment[]>(
    student.assignments || []
  );

  // Accordion state: only one section can be open at a time (or null if all closed)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setActiveSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  // Auto-scroll to section header when opening a section
  useEffect(() => {
    if (!activeSectionId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(activeSectionId);
      if (!element) return;

      const headerOffset = 76;
      const elementRect = element.getBoundingClientRect();
      const currentScrollY =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      const targetY = Math.max(0, currentScrollY + elementRect.top - headerOffset);

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }, 40);

    return () => clearTimeout(timer);
  }, [activeSectionId]);

  // Listen to navigation events to auto-open section if targeted
  useEffect(() => {
    const handleOpenSection = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveSectionId(customEvent.detail);
      }
    };
    window.addEventListener("app:open-section", handleOpenSection);
    return () => window.removeEventListener("app:open-section", handleOpenSection);
  }, []);

  // Sync state when student prop changes
  useEffect(() => {
    setCurrentAssignments(student.assignments || []);
  }, [student.id, student.assignments]);

  const activeStudentProfile: StudentProfile = {
    ...student,
    assignments: currentAssignments,
  };

  // Computed previews for badges and stat metrics
  const notDoneCount = currentAssignments.filter((a) => a.status === "not_done").length;
  const latestGrowth = activeStudentProfile.growthHistory.slice(-1)[0];
  const latestScore = latestGrowth ? latestGrowth.classScore.toFixed(1) : "9.2";

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 pb-6 space-y-4 sm:space-y-6">
      {/* 1. Header & Personalized Greeting with Learnly Purple Theme */}
      <section id="tong-quan" className="scroll-mt-20">
        <HeaderGreeting student={activeStudentProfile} />
      </section>

      {/* Thông tin buổi học mới nhất (Dropdown / Collapsible) */}
      {activeStudentProfile.recentLesson && (
        <CollapsibleSection
          id="buoi-hoc"
          isOpen={activeSectionId === "buoi-hoc"}
          onToggle={() => toggleSection("buoi-hoc")}
          icon={CalendarCheck}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-700"
          title="Thông tin buổi học mới nhất"
          subtitle={`${activeStudentProfile.recentLesson.lessonName} • Ngày ${activeStudentProfile.recentLesson.date}`}
          badge={
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
                ⭐ {activeStudentProfile.recentLesson.score.value.toFixed(1)}/10
              </span>
              {activeStudentProfile.recentLesson.mediaItems &&
                activeStudentProfile.recentLesson.mediaItems.length > 0 && (
                  <span className="hidden xs:inline-flex items-center gap-1 text-xs font-semibold text-indigo-900 bg-indigo-100 border border-indigo-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{activeStudentProfile.recentLesson.mediaItems.length} ảnh/video</span>
                  </span>
                )}
            </div>
          }
        >
          <RecentLessonBlock
            lesson={activeStudentProfile.recentLesson}
            studentName={activeStudentProfile.fullName}
          />
        </CollapsibleSection>
      )}

      {/* Bài tập & Nhiệm vụ tuần này */}
      <CollapsibleSection
        id="bai-tap"
        isOpen={activeSectionId === "bai-tap"}
        onToggle={() => toggleSection("bai-tap")}
        icon={FileText}
        iconBgColor="bg-indigo-50"
        iconColor="text-indigo-600"
        title="Bài tập & Nhiệm vụ tuần này"
        subtitle={
          notDoneCount > 0
            ? `Cần hoàn thành ${notDoneCount} bài tập trước buổi học tới`
            : "Con đã hoàn thành tất cả nhiệm vụ tuần này!"
        }
        badge={
          notDoneCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{notDoneCount} bài chưa nộp</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Đã hoàn thành hết</span>
            </span>
          )
        }
      >
        <AssignmentList
          student={activeStudentProfile}
          onUpdateAssignments={(updated) => setCurrentAssignments(updated)}
        />
      </CollapsibleSection>

      {/* Gamification 100 Tokens & Đổi thưởng */}
      <CollapsibleSection
        id="gamification"
        isOpen={activeSectionId === "gamification"}
        onToggle={() => toggleSection("gamification")}
        icon={Coins}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-700"
        title="Tích luỹ và đổi thưởng (Kho Tokens)"
        subtitle={`Mục tiêu đổi quà: ${activeStudentProfile.gamification.targetRewardName}`}
        badge={
          <span className="inline-flex items-center text-xs font-semibold text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
            {getStudentTokenBalance(activeStudentProfile)}/100 Tokens
          </span>
        }
      >
        <GamificationBlock
          student={activeStudentProfile}
          onOpenHistory={() => setShowHistoryModal(true)}
          onOpenStore={() => setShowStoreModal(true)}
        />
      </CollapsibleSection>

      {/* Biểu đồ Tăng trưởng & Điểm số */}
      <CollapsibleSection
        id="diem-so"
        isOpen={activeSectionId === "diem-so"}
        onToggle={() => toggleSection("diem-so")}
        icon={TrendingUp}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-700"
        title="Biểu đồ điểm số và tiến bộ"
        subtitle="So sánh bài kiểm tra lớp Cô Nghi và bài thi học kỳ tại trường"
        badge={
          <span className="inline-flex items-center text-xs font-semibold text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
            Điểm mới nhất: {latestScore}đ
          </span>
        }
      >
        <GrowthLineChart student={activeStudentProfile} />
      </CollapsibleSection>

      {/* Đánh giá năng lực học sinh (5 Trụ cột) */}
      <CollapsibleSection
        id="nang-luc"
        isOpen={activeSectionId === "nang-luc"}
        onToggle={() => toggleSection("nang-luc")}
        icon={Stethoscope}
        iconBgColor="bg-rose-50"
        iconColor="text-rose-600"
        title="Đánh giá năng lực học sinh"
        subtitle="Chẩn đoán chuyên sâu 5 trụ cột ngôn ngữ từ ngày đầu nhập học"
        badge={
          <span className="inline-flex items-center text-xs font-semibold text-rose-950 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
            Đánh giá 5 trục
          </span>
        }
      >
        <DiagnosticRadarBlock student={activeStudentProfile} />
      </CollapsibleSection>

      {/* 4. Teacher Support & Zalo Quick Contact (Learnly Purple Modern Gradient Card) */}
      <section id="lien-he" className="scroll-mt-24 pt-2">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#4F46E5] via-[#635BFF] to-[#7C3AED] text-white p-5 sm:p-6 shadow-[0_12px_32px_rgba(99,91,255,0.22)] border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 text-white shadow-xs">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black !text-white tracking-tight">
                Ba mẹ cần trao đổi thêm với Cô Nghi?
              </h4>
              <p className="text-xs text-indigo-100 mt-0.5 font-normal max-w-md">
                Cô luôn sẵn sàng phản hồi ba mẹ về tình hình học tập, bài vở và tinh thần của con ở lớp.
              </p>
            </div>
          </div>

          <a
            id="btn-zalo-contact"
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#635BFF] hover:text-[#4F46E5] text-xs font-bold py-3 px-5 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 leading-tight"
          >
            <PhoneCall className="w-4 h-4 text-[#635BFF]" />
            <span>Nhắn Zalo Cô Nghi</span>
          </a>
        </div>
      </section>

      {/* Footer Branding */}
      <footer
        id="app-footer"
        className="text-center pt-4 pb-2 sm:pt-6 sm:pb-3 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col items-center gap-1.5"
      >
        <div className="contents sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-2 text-xs">
          <span className="order-1 sm:order-none font-bold text-slate-800 text-sm sm:text-xs">
            Lớp Tiếng Anh Cô Nghi
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="order-3 sm:order-none block sm:inline w-full sm:w-auto pt-1 sm:pt-0 mt-0.5 sm:mt-0 text-[11px] sm:text-xs text-slate-400 sm:text-slate-500 before:content-[''] before:block sm:before:hidden before:w-16 before:h-px before:bg-slate-300/70 before:mx-auto before:mb-2">
            Hệ thống LMS - phát triển bởi{" "}
            <a
              href="https://nien.work"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#635BFF] hover:text-indigo-900 hover:underline"
            >
              nien.work
            </a>
          </span>
        </div>

        <p className="order-2 sm:order-none text-xs font-medium text-rose-500 flex items-center justify-center gap-1.5 pt-0.5">
          <span>Dành trọn sự tận tâm cho tương lai của các con</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0 inline-block" />
        </p>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-normal">
          <span>Khu vực giáo viên:</span>
          <a
            href="/giao-vien"
            id="link-footer-teacher-portal"
            onClick={(e) => {
              if (onNavigateToAdmin) {
                e.preventDefault();
                onNavigateToAdmin();
              }
            }}
            className="font-mono text-slate-500 hover:text-[#635BFF] hover:underline transition-colors"
          >
            /giao-vien
          </a>
        </div>
      </footer>

      {/* Modal 1: Token History */}
      <TokenHistoryModal
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        student={activeStudentProfile}
      />

      {/* Modal 2: Reward Store with Reset Mechanics */}
      <RewardStoreModal
        open={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        student={activeStudentProfile}
        onRedeemReward={async (deltaTokens, reason) => {
          if (onUpdateStudentTokens) {
            await onUpdateStudentTokens(activeStudentProfile.slug, deltaTokens, reason);
          }
        }}
      />
    </div>
  );
};

