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
  ChevronLeft,
  GraduationCap,
  Calendar,
  Layers,
  Star,
  Check,
  Zap,
  Home,
  LayoutDashboard,
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
import { AcademicOverviewDashboard } from "../components/AcademicOverviewDashboard";

export type ParentPortalTab =
  | "dashboard"
  | "buoi-hoc"
  | "bai-tap"
  | "tokens"
  | "diem-so"
  | "nang-luc";

interface StudentDashboardProps {
  student: StudentProfile;
  onNavigateToAdmin?: () => void;
  onUpdateStudentTokens?: (
    studentSlug: string,
    tokensToAdd: number,
    reason: string
  ) => Promise<void> | void;
}

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

  // Active navigation tab for mobile & tablet (default is "dashboard")
  const [activeTab, setActiveTab] = useState<ParentPortalTab>("dashboard");

  // Accordion state for desktop: only one section can be open at a time (or null if all closed)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Horizontal scroll indicator state for sticky bottom nav
  const navScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const checkNavScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkNavScroll();
    const el = navScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkNavScroll, { passive: true });
      window.addEventListener("resize", checkNavScroll, { passive: true });
      return () => {
        el.removeEventListener("scroll", checkNavScroll);
        window.removeEventListener("resize", checkNavScroll);
      };
    }
  }, []);

  const handleScrollNavRight = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: 160, behavior: "smooth" });
    }
  };

  const handleScrollNavLeft = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: -160, behavior: "smooth" });
    }
  };

  const handleTabChange = (tab: ParentPortalTab) => {
    setActiveTab(tab);
    // Smooth scroll to top when switching tab view
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Scroll active button into view in bottom nav
    setTimeout(() => {
      const btnEl = document.getElementById(`tab-btn-${tab}`);
      if (btnEl && navScrollRef.current) {
        btnEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 50);
  };

  const toggleSection = (sectionId: string) => {
    // Map section IDs to mobile tabs
    const sectionToTabMap: Record<string, ParentPortalTab> = {
      "buoi-hoc": "buoi-hoc",
      "bai-tap": "bai-tap",
      gamification: "tokens",
      tokens: "tokens",
      "diem-so": "diem-so",
      "nang-luc": "nang-luc",
      dashboard: "dashboard",
      "tong-quan": "dashboard",
    };

    if (sectionToTabMap[sectionId]) {
      setActiveTab(sectionToTabMap[sectionId]);
    }
    setActiveSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  // Auto-scroll to section header when opening a section on desktop
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

  // Listen to navigation events to auto-open section or switch tab if targeted
  useEffect(() => {
    const handleOpenSection = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        const target = customEvent.detail;
        const sectionToTabMap: Record<string, ParentPortalTab> = {
          "buoi-hoc": "buoi-hoc",
          "bai-tap": "bai-tap",
          gamification: "tokens",
          tokens: "tokens",
          "diem-so": "diem-so",
          "nang-luc": "nang-luc",
          dashboard: "dashboard",
          "tong-quan": "dashboard",
        };
        if (sectionToTabMap[target]) {
          setActiveTab(sectionToTabMap[target]);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setActiveSectionId(target);
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
  const tokenBalance = getStudentTokenBalance(activeStudentProfile);

  // Tab definitions for the 6 sticky buttons (Learnly design with modern soft aesthetics)
  const navButtons: {
    id: ParentPortalTab;
    label: string;
    shortLabel: string;
    subLabel?: string;
    icon: React.ElementType;
    badgeCount?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      shortLabel: "Dashboard",
      icon: Home,
    },
    {
      id: "buoi-hoc",
      label: "Buổi học mới nhất",
      shortLabel: "Buổi học",
      subLabel: "mới nhất",
      icon: BookOpen,
      badgeCount: activeStudentProfile.recentLesson
        ? `${activeStudentProfile.recentLesson.score.value.toFixed(1)}đ`
        : undefined,
      badgeColor: "bg-amber-100 text-amber-900 border border-amber-300",
    },
    {
      id: "bai-tap",
      label: "Bài tập",
      shortLabel: "Bài tập",
      icon: FileText,
      badgeCount: notDoneCount > 0 ? notDoneCount : undefined,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "tokens",
      label: "Tokens",
      shortLabel: "Tokens",
      icon: Coins,
      badgeCount: `${tokenBalance}`,
      badgeColor: "bg-amber-100 text-amber-900 border border-amber-300",
    },
    {
      id: "diem-so",
      label: "Điểm số",
      shortLabel: "Điểm số",
      icon: TrendingUp,
    },
    {
      id: "nang-luc",
      label: "Năng lực",
      shortLabel: "Năng lực",
      icon: Stethoscope,
    },
  ];

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 pb-24 sm:pb-28 lg:pb-6 space-y-3 sm:space-y-4 max-lg:overflow-x-clip lg:overflow-visible">
      {/* ========================================================
          DESKTOP LAYOUT (PC - Left Sticky Buttons + Right Content)
          ======================================================== */}
      <div className="hidden lg:flex lg:gap-6 xl:gap-8 items-start">
        {/* Left Sticky Navigation Buttons (PC) */}
        <aside className="w-56 xl:w-64 shrink-0 sticky top-20 z-20 self-start">
          <div className="bg-white rounded-3xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_8px_30px_rgba(0,102,255,0.06)]">
            <nav className="space-y-1.5" aria-label="Điều hướng cổng phụ huynh PC">
              {navButtons.map((btn) => {
                const Icon = btn.icon;
                const isActive = activeTab === btn.id;

                return (
                  <button
                    key={btn.id}
                    type="button"
                    id={`pc-nav-btn-${btn.id}`}
                    onClick={() => handleTabChange(btn.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-95 group ${
                      isActive
                        ? "bg-[#0066FF] text-white shadow-[0_6px_20px_rgba(0,102,255,0.25)]"
                        : "text-slate-600 hover:text-[#0066FF] hover:bg-blue-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-50 text-slate-500 group-hover:bg-blue-100 group-hover:text-[#0066FF]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{btn.label}</span>
                    </div>

                    {btn.badgeCount !== undefined && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 leading-tight ${
                          isActive
                            ? "bg-white/25 text-white"
                            : btn.badgeColor || "bg-amber-500 text-white"
                        }`}
                      >
                        {btn.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Right Main Content (PC) */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <section id="tong-quan-pc" className="scroll-mt-20">
                <HeaderGreeting student={activeStudentProfile} />
              </section>
              <AcademicOverviewDashboard
                student={activeStudentProfile}
                onOpenStore={() => setShowStoreModal(true)}
                onOpenHistory={() => setShowHistoryModal(true)}
                onToggleSection={toggleSection}
              />
            </div>
          )}

          {/* TAB 2: BUỔI HỌC MỚI NHẤT */}
          {activeTab === "buoi-hoc" && activeStudentProfile.recentLesson && (
            <RecentLessonBlock
              lesson={activeStudentProfile.recentLesson}
              studentName={activeStudentProfile.fullName}
            />
          )}

          {/* TAB 3: BÀI TẬP & NHIỆM VỤ */}
          {activeTab === "bai-tap" && (
            <AssignmentList
              student={activeStudentProfile}
              onUpdateAssignments={(updated) => setCurrentAssignments(updated)}
            />
          )}

          {/* TAB 4: TOKENS & ĐỔI THƯỞNG */}
          {activeTab === "tokens" && (
            <GamificationBlock
              student={activeStudentProfile}
              onOpenHistory={() => setShowHistoryModal(true)}
              onOpenStore={() => setShowStoreModal(true)}
            />
          )}

          {/* TAB 5: ĐIỂM SỐ & TIẾN BỘ */}
          {activeTab === "diem-so" && (
            <GrowthLineChart student={activeStudentProfile} />
          )}

          {/* TAB 6: ĐÁNH GIÁ NĂNG LỰC */}
          {activeTab === "nang-luc" && (
            <DiagnosticRadarBlock student={activeStudentProfile} />
          )}

          {/* Teacher Support & Contact Card */}
          <section id="lien-he-pc" className="pt-2">
            <div className="relative rounded-3xl bg-gradient-to-r from-[#0066FF] via-[#1E88E5] to-[#0052cc] text-white p-6 shadow-[0_12px_32px_rgba(0,102,255,0.22)] border border-white/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 text-white shadow-xs">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black !text-white tracking-tight">
                    Ba mẹ cần trao đổi thêm với Cô Nghi?
                  </h4>
                  <p className="text-xs text-blue-100 mt-0.5 font-normal max-w-md">
                    Cô luôn sẵn sàng phản hồi ba mẹ về tình hình học tập, bài vở và tinh thần của con ở lớp.
                  </p>
                </div>
              </div>

              <a
                id="btn-zalo-contact-pc"
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0066FF] hover:text-[#0052cc] text-xs font-bold py-3 px-5 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 leading-tight"
              >
                <PhoneCall className="w-4 h-4 text-[#0066FF]" />
                <span>Nhắn Zalo Cô Nghi</span>
              </a>
            </div>
          </section>

          {/* Footer Branding (PC) */}
          <footer
            id="app-footer-pc"
            className="text-center pt-2 pb-0 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col items-center gap-1"
          >
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="font-bold text-slate-800 text-xs">
                Lớp Tiếng Anh Cô Nghi
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
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

            <p className="text-xs font-medium text-rose-500 flex items-center justify-center gap-1.5 pt-0.5">
              <span>Dành trọn sự tận tâm cho tương lai của các con</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0 inline-block" />
            </p>

            <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-normal">
              <span>Khu vực giáo viên:</span>
              <a
                href="/giao-vien"
                id="link-footer-teacher-portal-pc"
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
        </div>
      </div>

      {/* ========================================================
          MOBILE & TABLET VIEW SWITCHER (Active Tab Content)
          ======================================================== */}
      <div className="block lg:hidden space-y-4">
        {/* TAB 1: DASHBOARD (Mặc định) */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 sm:space-y-6">
            <section id="tong-quan" className="scroll-mt-20">
              <HeaderGreeting student={activeStudentProfile} />
            </section>
            <AcademicOverviewDashboard
              student={activeStudentProfile}
              onOpenStore={() => setShowStoreModal(true)}
              onOpenHistory={() => setShowHistoryModal(true)}
              onToggleSection={toggleSection}
            />
          </div>
        )}

        {/* TAB 2: BUỔI HỌC MỚI NHẤT */}
        {activeTab === "buoi-hoc" && activeStudentProfile.recentLesson && (
          <RecentLessonBlock
            lesson={activeStudentProfile.recentLesson}
            studentName={activeStudentProfile.fullName}
          />
        )}

        {/* TAB 3: BÀI TẬP & NHIỆM VỤ */}
        {activeTab === "bai-tap" && (
          <AssignmentList
            student={activeStudentProfile}
            onUpdateAssignments={(updated) => setCurrentAssignments(updated)}
          />
        )}

        {/* TAB 4: TOKENS & ĐỔI THƯỞNG */}
        {activeTab === "tokens" && (
          <GamificationBlock
            student={activeStudentProfile}
            onOpenHistory={() => setShowHistoryModal(true)}
            onOpenStore={() => setShowStoreModal(true)}
          />
        )}

        {/* TAB 5: ĐIỂM SỐ & TIẾN BỘ */}
        {activeTab === "diem-so" && (
          <GrowthLineChart student={activeStudentProfile} />
        )}

        {/* TAB 6: ĐÁNH GIÁ NĂNG LỰC */}
        {activeTab === "nang-luc" && (
          <DiagnosticRadarBlock student={activeStudentProfile} />
        )}
      </div>

      {/* 4. Teacher Support & Zalo Quick Contact (Mobile & Tablet) */}
      <section id="lien-he" className="scroll-mt-24 pt-6 block lg:hidden">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0066FF] via-[#1E88E5] to-[#0052cc] text-white p-5 sm:p-6 pt-7 sm:pt-6 shadow-[0_12px_32px_rgba(0,102,255,0.22)] border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Floating Message Badge (50% inside, 50% outside) */}
          <div className="absolute -top-6 left-5 sm:left-6 z-10 w-12 h-12 rounded-2xl bg-white text-[#0066FF] shadow-[0_8px_24px_rgba(0,102,255,0.3)] border-2 border-white flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-[#0066FF]" />
          </div>

          <div className="text-left w-full sm:w-auto">
            <h4 className="text-base sm:text-lg font-black !text-white tracking-tight">
              Ba mẹ cần trao đổi thêm với Cô Nghi?
            </h4>
            <p className="text-xs text-blue-100 mt-0.5 font-normal max-w-md">
              Cô luôn sẵn sàng phản hồi ba mẹ về tình hình học tập, bài vở và tinh thần của con ở lớp.
            </p>
          </div>

          <a
            id="btn-zalo-contact"
            href="https://zalo.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0066FF] hover:text-[#0052cc] text-xs font-bold py-3 px-5 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 leading-tight w-full sm:w-auto"
          >
            <PhoneCall className="w-4 h-4 text-[#0066FF]" />
            <span>Nhắn Zalo Cô Nghi</span>
          </a>
        </div>
      </section>

      {/* Footer Branding (Mobile & Tablet) */}
      <footer
        id="app-footer"
        className="text-center pt-2 pb-0 sm:pt-3 sm:pb-0 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col items-center gap-1 block lg:hidden"
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

      {/* ========================================================
          STICKY BOTTOM NAVIGATION BAR (Mobile & Tablet - 6 Buttons)
          Mobile: Shows 4 buttons at a time, horizontally scrollable for the other 2
          Tablet: Shows all buttons distributed evenly
          ======================================================== */}
      <nav
        id="parent-mobile-bottom-nav"
        aria-label="Điều hướng nhanh cổng phụ huynh"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-6px_28px_rgba(0,102,255,0.08)] block lg:hidden pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-1.5 px-1 sm:px-3 overscroll-contain"
      >
        {/* Right Scroll Indicator cue (Mobile only) */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-1.5 pl-6 bg-gradient-to-l from-white via-white/95 to-transparent pointer-events-auto sm:hidden z-10">
            <button
              type="button"
              onClick={handleScrollNavRight}
              aria-label="Cuộn xem thêm nút"
              className="w-7 h-7 rounded-full bg-[#0066FF] text-white shadow-md flex items-center justify-center active:scale-90 transition-transform cursor-pointer animate-pulse"
              title="Bấm hoặc vuốt để xem thêm nút"
            >
              <ChevronRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Left Scroll Indicator cue (Mobile only) */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1.5 pr-6 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-auto sm:hidden z-10">
            <button
              type="button"
              onClick={handleScrollNavLeft}
              aria-label="Cuộn về trước"
              className="w-7 h-7 rounded-full bg-white border border-slate-200 text-[#0066FF] shadow-md flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
              title="Quay lại các nút trước"
            >
              <ChevronLeft className="w-4 h-4 shrink-0 stroke-[2.5]" />
            </button>
          </div>
        )}

        <div
          ref={navScrollRef}
          onTouchMove={(e) => e.stopPropagation()}
          className="max-w-md md:max-w-3xl mx-auto flex items-center justify-start sm:justify-between overflow-x-auto scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {navButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeTab === btn.id;

            return (
              <button
                key={btn.id}
                type="button"
                id={`tab-btn-${btn.id}`}
                onClick={() => handleTabChange(btn.id)}
                className={`relative w-[25%] min-w-[25%] max-w-[25%] sm:w-auto sm:min-w-0 sm:max-w-none sm:flex-1 shrink-0 sm:shrink snap-start py-1 px-0.5 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer active:scale-95 group ${
                  isActive
                    ? "text-[#0066FF]"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title={btn.label}
              >
                {/* Active Indicator Background Pill with larger dimensions */}
                <div
                  className={`relative flex items-center justify-center w-11 h-8 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#0066FF]/12 text-[#0066FF] shadow-xs"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-[22px] sm:h-[22px] transition-transform ${
                      isActive ? "scale-110 text-[#0066FF]" : ""
                    }`}
                  />

                  {/* Notification / Badge Dot */}
                  {btn.badgeCount !== undefined && (
                    <span
                      className={`absolute -top-1 -right-1.5 min-w-[17px] h-4.5 px-1 rounded-full text-[9.5px] font-black flex items-center justify-center leading-none shadow-xs ${
                        btn.badgeColor || "bg-amber-500 text-white"
                      }`}
                    >
                      {btn.badgeCount}
                    </span>
                  )}
                </div>

                {/* Text Label with larger font size */}
                <div className="mt-0.5 flex flex-col items-center justify-center max-w-full text-center">
                  {btn.subLabel ? (
                    <>
                      <span
                        className={`text-[11px] sm:text-xs leading-tight truncate max-w-full ${
                          isActive
                            ? "font-black text-[#0066FF]"
                            : "font-bold text-slate-600"
                        }`}
                      >
                        {btn.shortLabel}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] leading-none opacity-85 truncate max-w-full ${
                          isActive
                            ? "font-bold text-[#0066FF]"
                            : "font-semibold text-slate-400"
                        }`}
                      >
                        {btn.subLabel}
                      </span>
                    </>
                  ) : (
                    <span
                      className={`text-[11px] sm:text-xs leading-tight truncate max-w-full ${
                        isActive
                          ? "font-black text-[#0066FF]"
                          : "font-bold text-slate-600"
                      }`}
                    >
                      {btn.shortLabel}
                    </span>
                  )}
                </div>

                {/* Active bottom micro-indicator bar */}
                {isActive && (
                  <span className="w-5 h-1 rounded-full bg-[#0066FF] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

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


