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
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
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
              <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
                ⭐ {activeStudentProfile.recentLesson.score.value.toFixed(1)}/10
              </span>
              {activeStudentProfile.recentLesson.mediaItems &&
                activeStudentProfile.recentLesson.mediaItems.length > 0 && (
                  <span className="hidden xs:inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
                    <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-600" />
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
            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 border border-amber-300/70 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
              <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 shrink-0" />
              <span>{notDoneCount} bài chưa nộp</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300/70 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
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
        title="Tích lũy 100 Tokens & Đổi thưởng"
        subtitle={`Mục tiêu đổi quà: ${activeStudentProfile.gamification.targetRewardName}`}
        badge={
          <span className="inline-flex items-center font-mono font-bold text-amber-900 bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
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
        title="Biểu đồ Điểm số & Tăng trưởng"
        subtitle="So sánh bài kiểm tra lớp Cô Nghi và bài thi học kỳ tại trường"
        badge={
          <span className="inline-flex items-center font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300/70 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
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
          <span className="inline-flex items-center font-semibold text-rose-800 bg-rose-100 border border-rose-300/70 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px]">
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
            <h4 className="text-sm sm:text-base font-bold text-white text-center sm:text-left">
              Ba mẹ cần trao đổi thêm với cô Nghi?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Cô luôn sẵn sàng phản hồi ba mẹ về bài vở và tinh thần học tập của con.
            </p>
          </div>

          <a
            id="btn-zalo-contact"
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 shrink-0 min-h-[40px]"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Nhắn Zalo Cô Nghi</span>
          </a>
        </div>
      </section>

      {/* Footer Branding */}
      <footer
        id="app-footer"
        className="text-center pt-4 pb-1 sm:pt-5 sm:pb-2 border-t border-slate-200/80 text-xs text-slate-500 space-y-1.5"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs">
          <span className="font-bold text-slate-800 text-sm sm:text-xs">
            Lớp Tiếng Anh Cô Nghi
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="text-slate-500">
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

        <p className="text-xs font-medium text-rose-600 flex items-center justify-center gap-1.5 pt-0.5">
          <span>Dành trọn sự tận tâm cho tương lai của các con</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0 inline-block" />
        </p>
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

