import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { StudentProfile } from "../types";

interface MainHeaderProps {
  currentRoute: "student" | "admin";
  currentStudent: StudentProfile;
  studentsMap: Record<string, StudentProfile>;
  onSelectStudent: (slug: string) => void;
  onNavigateToAdmin: () => void;
  onNavigateToStudent: (slug?: string) => void;
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("tong-quan");
  const [copiedLink, setCopiedLink] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#e0e5ec]/95 backdrop-blur-md border-b border-white/80 shadow-[0_4px_14px_rgba(166,183,203,0.4)] transition-all duration-200">
      <div className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-6">
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
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl soft-ui-convex flex items-center justify-center text-[#ff4757] group-hover:shadow-[var(--shadow-floating)] transition-all">
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

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* If Student Route: Show Only Student Section Navigation */}
            {currentRoute === "student" && (
              <nav className="flex items-center gap-1 soft-ui-debossed p-1 rounded-xl text-xs font-semibold">
                {NAV_ITEMS.filter(
                  (item) => item.id !== "tong-quan" && item.id !== "lien-he"
                ).map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer leading-tight ${
                        isActive
                          ? "soft-ui-convex text-[#ff4757] font-semibold"
                          : "text-[#666666] hover:text-[#1a1a1a]"
                      }`}
                      title={item.label}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          isActive ? "text-[#ff4757]" : "text-[#666666]"
                        }`}
                      />
                      <span className="hidden lg:inline">{item.label}</span>
                      <span className="inline lg:hidden">{item.shortLabel || item.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* If Teacher Route (Admin): Show dedicated Teacher Portal Badge, Copy Link & Parent Preview Button */}
            {currentRoute === "admin" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-[#d1d9e6] border border-[#babecc]/60 px-3 py-1.5 rounded-xl shadow-[var(--shadow-recessed-sm)] text-xs">
                  <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                  <span className="text-[#666666] font-medium">Link Cổng:</span>
                  <span className="font-bold font-mono text-[#1a1a1a]">/giao-vien</span>
                </div>

                <button
                  type="button"
                  id="btn-copy-teacher-link"
                  onClick={copyTeacherUrl}
                  className="soft-ui-convex min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1a1a1a] flex items-center gap-1.5 cursor-pointer active:translate-y-[1px] transition-all"
                  title="Sao chép đường dẫn trực tiếp Cổng Giáo Viên"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Đã chép link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#ff4757]" />
                      <span>Chép link Cổng</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="btn-view-parent-portal"
                  onClick={() => onNavigateToStudent(currentStudent.slug)}
                  className="bg-[#2d3436] hover:bg-[#1a1a1a] text-white min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-[4px_4px_8px_rgba(0,0,0,0.25)] border border-white/20 cursor-pointer active:translate-y-[1px] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>Mở Cổng Phụ Huynh</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Action: Mobile Controls */}
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            {/* If Teacher Route (Admin) on Mobile: Show Copy Link & View Parent Button */}
            {currentRoute === "admin" && (
              <div className="flex md:hidden items-center gap-1.5">
                <button
                  type="button"
                  id="btn-mobile-copy-link"
                  onClick={copyTeacherUrl}
                  className="min-h-[40px] px-2.5 py-1.5 rounded-xl soft-ui-convex text-xs font-semibold flex items-center gap-1 text-[#1a1a1a] active:translate-y-[1px]"
                  title="Sao chép link /giao-vien"
                >
                  {copiedLink ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#ff4757]" />
                  )}
                  <span className="text-[11px] font-mono font-bold">
                    {copiedLink ? "Đã chép" : "/giao-vien"}
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-mobile-open-student-portal"
                  onClick={() => onNavigateToStudent(currentStudent.slug)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#2d3436] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm border border-white/20 active:translate-y-[1px]"
                >
                  <User className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>Phụ Huynh</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button for Student Portal */}
            {currentRoute === "student" && (
              <button
                id="btn-toggle-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-[#1e293b] soft-ui-convex min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer active:translate-y-[1px]"
                aria-label="Mở menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-[#ff4757]" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown if hamburger is opened */}
      {mobileMenuOpen && currentRoute === "student" && (
        <div className="md:hidden border-t border-white/80 soft-ui-embossed px-4 py-3 space-y-1.5 shadow-[0_8px_16px_rgba(166,183,203,0.4)] animate-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-bold font-mono text-[#4a5568] uppercase tracking-wider px-3 py-1">
            CHUYỂN NHANH TỚI PHẦN
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full min-h-[44px] flex items-center justify-start px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer active:translate-y-[1px] ${
                  isActive
                    ? "bg-[#dbe4ee] text-[#ff4757] shadow-[var(--shadow-recessed-sm)] border border-[#a8b8cc]/60"
                    : "text-[#2d3436] hover:bg-[#f1f5f9]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent)]" : "bg-[#dbe4ee] text-[#4a5568] shadow-[var(--shadow-recessed-sm)]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

