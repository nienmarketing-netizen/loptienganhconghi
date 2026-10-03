import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  BookOpen,
  Menu,
  X,
  Coins,
  TrendingUp,
  Stethoscope,
  PhoneCall,
  User,
  FileText,
  GraduationCap,
  CalendarCheck,
  Copy,
  Check,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { StudentProfile } from "../types";

interface MainHeaderProps {
  currentRoute: "student" | "admin";
  currentStudent: StudentProfile;
  studentsMap: Record<string, StudentProfile>;
  onSelectStudent: (slug: string) => void;
  onNavigateToAdmin: () => void;
  onNavigateToStudent: (slug?: string) => void;
  onNavigateToPortal?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "tong-quan", label: "Tổng quan", shortLabel: "Tổng quan", icon: User },
  { id: "buoi-hoc", label: "Buổi học gần nhất", shortLabel: "Buổi học", icon: CalendarCheck },
  { id: "bai-tap", label: "Bài tập tuần này", shortLabel: "Bài tập", icon: FileText },
  { id: "gamification", label: "Tích luỹ và đổi thưởng", shortLabel: "Đổi thưởng", icon: Coins },
  { id: "diem-so", label: "Biểu đồ điểm số và tiến bộ", shortLabel: "Điểm số", icon: TrendingUp },
  { id: "nang-luc", label: "Đánh giá năng lực", shortLabel: "Năng lực", icon: Stethoscope },
  { id: "lien-he", label: "Liên hệ Cô Nghi", shortLabel: "Liên hệ", icon: PhoneCall },
];

export const MainHeader: React.FC<MainHeaderProps> = ({
  currentRoute,
  currentStudent,
  studentsMap: _studentsMap,
  onSelectStudent: _onSelectStudent,
  onNavigateToAdmin,
  onNavigateToStudent,
  onNavigateToPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("tong-quan");
  const [copiedLink, setCopiedLink] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const copyTeacherUrl = () => {
    const url = `${window.location.origin}/giao-vien`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    // Notify accordion to open target section
    window.dispatchEvent(
      new CustomEvent("app:open-section", { detail: sectionId })
    );

    if (currentRoute !== "student") {
      onNavigateToStudent(currentStudent.slug);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return;
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        setActiveSection(sectionId);
      }
    }, 50);
  };

  // Observe active section on scroll
  useEffect(() => {
    if (currentRoute !== "student") return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentRoute]);

  return (
    <header
      className={`sticky top-0 ${
        mobileMenuOpen ? "z-50" : "z-40"
      } bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_10px_rgba(15,45,90,0.05)] transition-all duration-200`}
    >
      <div
        className={`w-full mx-auto transition-all ${
          currentRoute === "admin"
            ? "max-w-5xl px-3 sm:px-6"
            : "max-w-md md:max-w-3xl lg:max-w-6xl xl:max-w-7xl px-3.5 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Logo & Brand Name */}
          <div
            onClick={() => {
              if (currentRoute === "admin") {
                onNavigateToAdmin();
              } else {
                scrollToSection("tong-quan");
              }
            }}
            className={`flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 transition-all duration-200 ${
              mobileMenuOpen ? "opacity-35 blur-[0.5px] pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-[#635BFF] group-hover:bg-[#635BFF] group-hover:text-white transition-all shadow-xs">
              <GraduationCap className="w-5 h-5 text-current" />
            </div>
            <div>
              <h1 className="text-xs sm:text-base md:text-lg font-black text-slate-900 tracking-[-0.015em] leading-tight group-hover:text-[#635BFF] transition-colors">
                Lớp Tiếng Anh Cô Nghi
              </h1>
              <div className="text-[10px] sm:text-[11px] font-normal text-slate-500 flex items-center gap-1.5 normal-case">
                {currentRoute === "admin" ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#635BFF] shadow-[0_0_8px_rgba(99,91,255,0.5)] animate-pulse" />
                    <span className="text-[#635BFF] font-bold">Cổng giáo viên</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-500">Admin</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[#635BFF] font-bold">Parent Dashboard</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-emerald-600 font-bold">Cổng phụ huynh</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation & Actions for Admin */}
          {currentRoute === "admin" && (
            <div className="hidden sm:flex items-center">
              {/* Nút Mở cổng phụ huynh đã được đưa xuống banner hero của trang quản trị */}
            </div>
          )}

          {/* Right Action: Mobile Controls & Student Pop-up Menu */}
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            {/* If Admin Route: Logout button */}
            {currentRoute === "admin" && onNavigateToPortal && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("teacher_session");
                  localStorage.removeItem("teacher_user");
                  onNavigateToPortal();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#1e293b] hover:text-[#0066ff] hover:border-blue-200 transition-all cursor-pointer shadow-xs active:translate-y-[1px]"
                title="Đăng xuất khỏi cổng giáo viên"
              >
                <LogOut className="w-3.5 h-3.5 text-[#0066ff]" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            )}

            {/* If Student Route: Quick Switch Student Code button */}
            {currentRoute === "student" && onNavigateToPortal && (
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("current_authorized_student");
                  onNavigateToPortal();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#635BFF] hover:border-indigo-200 transition-all cursor-pointer shadow-xs active:translate-y-[1px]"
                title="Đổi mã học sinh khác hoặc về cổng đăng nhập"
              >
                <LogOut className="w-3.5 h-3.5 text-[#635BFF]" />
                <span>Đổi học sinh</span>
              </button>
            )}

            {/* If Student Route: Unified Pop-up Menu for both PC and Mobile */}
            {currentRoute === "student" && (
              <div className="relative" ref={menuContainerRef}>
                {/* Full-screen Backdrop: làm tối và mờ toàn bộ website */}
                {mobileMenuOpen &&
                  createPortal(
                    <div
                      id="popup-nav-backdrop"
                      onClick={() => setMobileMenuOpen(false)}
                      className="fixed inset-0 bg-[#0b1329]/40 backdrop-blur-[3px] z-40 transition-all duration-200 animate-in fade-in cursor-pointer"
                      aria-label="Đóng bảng mục lục học vụ"
                      title="Bấm ra ngoài để đóng"
                    />,
                    document.body
                  )}

                <button
                  type="button"
                  id="btn-toggle-nav-menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all flex items-center justify-center cursor-pointer active:translate-y-[1px] relative z-50 ${
                    mobileMenuOpen
                      ? "bg-blue-50 text-[#0066ff] border border-blue-200 shadow-sm ring-2 ring-[#0066ff]/20"
                      : "bg-white border border-slate-200 text-[#1e293b] hover:text-[#0066ff] hover:border-blue-200 shadow-xs"
                  }`}
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="true"
                  aria-label="Mục lục học vụ"
                  title="Mục lục học vụ"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-[#0066ff]" />
                  ) : (
                    <Menu className="w-5 h-5 text-[#0066ff]" />
                  )}
                </button>

                {/* Pop-up Navigation Menu (Floating for PC and Mobile) */}
                {mobileMenuOpen && (
                  <div
                    id="popup-nav-menu"
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] rounded-2xl bg-white border border-slate-100 p-3 shadow-[0_16px_36px_rgba(15,45,90,0.12)] z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center justify-between px-2.5 py-1.5 mb-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold font-mono text-[#64748b] uppercase tracking-wider">
                        CHUYỂN NHANH TỚI PHẦN
                      </span>
                      <span className="text-[10px] font-bold font-mono text-[#0066ff] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                        {NAV_ITEMS.length} MỤC
                      </span>
                    </div>

                    <div className="space-y-1">
                      {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.id;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left active:translate-y-[1px] ${
                              isActive
                                ? "bg-blue-50 text-[#0066ff] border border-blue-200/80 font-bold"
                                : "text-[#1e293b] hover:bg-slate-50 hover:text-[#0066ff]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`p-1.5 rounded-lg shrink-0 ${
                                  isActive
                                    ? "bg-[#0066ff] text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)]"
                                    : "bg-slate-100 text-[#64748b]"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-xs leading-tight">
                                {item.label}
                              </span>
                            </div>
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-[#0066ff] shadow-[0_0_6px_#0066ff]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {onNavigateToPortal && (
                      <div className="pt-2 mt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            localStorage.removeItem("current_authorized_student");
                            onNavigateToPortal();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#0066ff] hover:bg-blue-50 transition-all cursor-pointer text-left active:translate-y-[1px]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-blue-100 text-[#0066ff]">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-bold">Đổi mã học sinh / Cổng đăng nhập</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

