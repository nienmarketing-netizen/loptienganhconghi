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
} from "lucide-react";
import { StudentProfile, Assignment } from "../types";
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
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onNavigateToAdmin,
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

  // Auto-scroll to section header when opening a section, preventing layout jumping
  useEffect(() => {
    if (!activeSectionId) return;

    // Small delay ensures previous section has collapsed and new section is mounted
    const timer = setTimeout(() => {
      const element = document.getElementById(activeSectionId);
      if (!element) return;

      // Sticky header height (64px) + comfortable breathing room (12px)
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

  // Computed previews for badges
  const notDoneCount = currentAssignments.filter((a) => a.status === "not_done").length;
  const latestGrowth = activeStudentProfile.growthHistory.slice(-1)[0];
  const latestScore = latestGrowth ? latestGrowth.classScore.toFixed(1) : "8.5";

  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-3.5 sm:px-5 pt-4 sm:pt-6 pb-2 space-y-4 sm:space-y-5">
      {/* 1. Header & Personalized Greeting */}
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
              <span className="inline-flex items-center gap-1 text-xs font-bold font-mono text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
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

      {/* 2. Phase 2: Khối Quản lý Học vụ - Bài tập tuần này (ĐƯA LÊN ĐẦU TIÊN & MẶC ĐỊNH MỞ) */}
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

      {/* 3. Dropdown: Gamification 100 Tokens & Đổi thưởng (CHỈ MỞ KHI CLICK) */}
      <CollapsibleSection
        id="gamification"
        isOpen={activeSectionId === "gamification"}
        onToggle={() => toggleSection("gamification")}
        icon={Coins}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-700"
        title="Tích luỹ và đổi thưởng"
        subtitle={`Mục tiêu đổi quà: ${activeStudentProfile.gamification.targetRewardName}`}
        badge={
          <span className="inline-flex items-center text-xs font-bold font-mono text-amber-950 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
            {activeStudentProfile.gamification.currentTokens}/100 Tokens
          </span>
        }
      >
        <GamificationBlock
          student={activeStudentProfile}
          onOpenHistory={() => setShowHistoryModal(true)}
          onOpenStore={() => setShowStoreModal(true)}
        />
      </CollapsibleSection>

      {/* 4. Dropdown: Biểu đồ Tăng trưởng & Điểm số (CHỈ MỞ KHI CLICK) */}
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
          <span className="inline-flex items-center text-xs font-bold font-mono text-emerald-950 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap">
            Điểm mới nhất: {latestScore}đ
          </span>
        }
      >
        <GrowthLineChart student={activeStudentProfile} />
      </CollapsibleSection>

      {/* 5. Dropdown: Đánh giá năng lực học sinh (CHỈ MỞ KHI CLICK) */}
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

      {/* 6. Teacher Support & Zalo Quick Contact (Section thông thường) */}
      <section id="lien-he" className="scroll-mt-24 pt-3">
        <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-4 sm:p-5 pt-6 sm:pt-6 shadow-lg border border-indigo-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {/* Corner badge: half outside, half inside */}
          <div
            id="badge-contact-corner"
            className="absolute -top-5 left-5 sm:left-6 w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-950/50 ring-4 ring-slate-50 border border-indigo-300/40 z-10"
          >
            <MessageCircle className="w-5 h-5 text-white fill-white/20" />
          </div>

          <div className="pt-2 sm:pt-0">
            <h4 className="text-xs sm:text-base font-bold !text-white text-center sm:text-left tracking-[-0.015em]">
              Ba mẹ cần trao đổi thêm với cô Nghi?
            </h4>
            <p className="text-xs text-slate-200 mt-0.5 font-normal">
              Cô luôn sẵn sàng phản hồi ba mẹ về bài vở và tinh thần học tập của con.
            </p>
          </div>

          <a
            id="btn-zalo-contact"
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 !text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 shrink-0 min-h-[40px] leading-tight"
          >
            <PhoneCall className="w-3.5 h-3.5 !text-white" />
            <span className="!text-white font-semibold">Nhắn Zalo Cô Nghi</span>
          </a>
        </div>
      </section>

      {/* Footer Branding */}
      <footer
        id="app-footer"
        className="text-center pt-4 pb-2 sm:pt-5 sm:pb-2 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col items-center gap-1.5"
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
              className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
            >
              nien.work
            </a>
          </span>
        </div>

        <p className="order-2 sm:order-none text-xs font-medium text-rose-600 flex items-center justify-center gap-1.5 pt-0.5">
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
            className="font-mono text-slate-500 hover:text-[#ff4757] hover:underline transition-colors"
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

      {/* Modal 2: 100 Tokens Reward Store */}
      <RewardStoreModal
        open={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        student={activeStudentProfile}
      />
    </div>
  );
};

