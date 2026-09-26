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
      } bg-[#e0e5ec]/95 backdrop-blur-md border-b border-white/80 shadow-[0_4px_14px_rgba(166,183,203,0.4)] transition-all duration-200`}
    >
      <div
        className={`w-full mx-auto transition-all ${
          currentRoute === "admin"
            ? "max-w-5xl px-3 sm:px-6"
            : "max-w-md md:max-w-2xl lg:max-w-3xl px-3.5 sm:px-5"
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
            <div className="w-10 h-10 rounded-lg soft-ui-convex flex items-center justify-center text-[#ff4757] group-hover:shadow-[var(--shadow-floating)] transition-all">
              <BookOpen className="w-5 h-5 text-[#ff4757]" />
            </div>
            <div>
              <h1 className="text-xs sm:text-base md:text-lg font-bold text-[#1a1a1a] tracking-[-0.015em] leading-tight group-hover:text-[#ff4757] transition-colors">
                Lớp Tiếng Anh Cô Nghi
              </h1>
              <div className="text-[10px] sm:text-[11px] font-normal text-[#666666] flex items-center gap-1.5 normal-case">
                {currentRoute === "admin" ? (
                  <>
                    <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                    <span className="text-[#ff4757] font-semibold">Cổng giáo viên</span>
                    <span className="text-[#a3b1c6]">/</span>
                    <span className="text-[#666666]">Admin</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full led-indicator-green animate-pulse" />
                    <span className="text-[#1a1a1a] font-semibold">Cổng phụ huynh</span>
                    <span className="text-[#a3b1c6]">/</span>
                    <span className="text-emerald-700 font-semibold">Online</span>
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg soft-ui-convex text-xs font-bold text-[#1a1a1a] hover:text-[#ff4757] transition-all cursor-pointer active:translate-y-[1px]"
                title="Đăng xuất khỏi cổng giáo viên"
              >
                <LogOut className="w-3.5 h-3.5 text-[#ff4757]" />
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
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg soft-ui-convex text-xs font-semibold text-[#666666] hover:text-[#ff4757] transition-all cursor-pointer active:translate-y-[1px]"
                title="Đổi mã học sinh khác hoặc về cổng đăng nhập"
              >
                <LogOut className="w-3.5 h-3.5 text-[#ff4757]" />
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
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg transition-all flex items-center justify-center cursor-pointer active:translate-y-[1px] relative z-50 ${
                    mobileMenuOpen
                      ? "bg-[#dbe4ee] text-[#ff4757] shadow-[var(--shadow-recessed-sm)] border border-[#a8b8cc]/70 ring-2 ring-[#ff4757]/25"
                      : "soft-ui-convex text-[#1a1a1a] hover:text-[#ff4757]"
                  }`}
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="true"
                  aria-label="Mục lục học vụ"
                  title="Mục lục học vụ"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-[#ff4757]" />
                  ) : (
                    <Menu className="w-5 h-5 text-[#ff4757]" />
                  )}
                </button>

                {/* Pop-up Navigation Menu (Floating for PC and Mobile) */}
                {mobileMenuOpen && (
                  <div
                    id="popup-nav-menu"
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] rounded-xl bg-[#e0e5ec] border border-white/95 p-2.5 shadow-[var(--shadow-floating)] z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-black/5"
                  >
                    <div className="flex items-center justify-between px-2.5 py-1.5 mb-1.5 border-b border-[#babecc]/50">
                      <span className="text-[11px] font-bold font-mono text-[#4a5568] uppercase tracking-wider">
                        CHUYỂN NHANH TỚI PHẦN
                      </span>
                      <span className="text-[10px] font-bold font-mono text-[#ff4757] bg-[#ff4757]/10 px-2 py-0.5 rounded-md border border-[#ff4757]/20">
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
                            className={`w-full min-h-[40px] flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-left active:translate-y-[1px] ${
                              isActive
                                ? "bg-[#dbe4ee] text-[#ff4757] shadow-[var(--shadow-recessed-sm)] border border-[#a8b8cc]/60"
                                : "text-[#1a1a1a] hover:bg-[#d8e0ec] hover:text-[#ff4757]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`p-1.5 rounded-md shrink-0 ${
                                  isActive
                                    ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent)]"
                                    : "bg-[#d1d9e6] text-[#4a5568] shadow-[var(--shadow-recessed-sm)]"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-xs leading-tight">
                                {item.label}
                              </span>
                            </div>
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-[#ff4757] shadow-[0_0_6px_#ff4757]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {onNavigateToPortal && (
                      <div className="pt-2 mt-2 border-t border-[#babecc]/50">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            localStorage.removeItem("current_authorized_student");
                            onNavigateToPortal();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-[#ff4757] hover:bg-[#d8e0ec] transition-all cursor-pointer text-left active:translate-y-[1px]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-md bg-[#ff4757]/15 text-[#ff4757]">
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

