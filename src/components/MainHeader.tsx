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
  { id: "gamification", label: "100 Tokens & Đổi thưởng", shortLabel: "100 Tokens", icon: Coins },
  { id: "diem-so", label: "Biểu đồ điểm số", shortLabel: "Điểm số", icon: TrendingUp },
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all duration-200">
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-amber-700 transition-colors">
                Lớp Tiếng Anh Cô Nghi
              </h1>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 flex items-center gap-1">
                {currentRoute === "admin" ? (
                  <>
                    <span className="text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.2 rounded">
                      Cổng Giáo Viên
                    </span>
                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                    <span className="text-slate-500">Admin Portal</span>
                  </>
                ) : (
                  <>
                    <span>Cổng Phụ Huynh</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-emerald-700 font-semibold">Trực tiếp</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Desktop Central Portal Switcher & Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            {/* Mode Switch Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
              <button
                type="button"
                id="btn-nav-student-portal"
                onClick={() => onNavigateToStudent(currentStudent.slug)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRoute === "student"
                    ? "bg-white text-slate-900 shadow-xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Cổng Phụ Huynh</span>
              </button>
              <button
                type="button"
                id="btn-nav-admin-portal"
                onClick={onNavigateToAdmin}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentRoute === "admin"
                    ? "bg-indigo-900 text-white shadow-xs font-extrabold"
                    : "text-slate-600 hover:text-indigo-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cổng Giáo Viên (Admin)</span>
              </button>
            </div>

            {/* In Student View, show sections nav */}
            {currentRoute === "student" && (
              <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70 text-xs font-semibold">
                {NAV_ITEMS.filter(
                  (item) => item.id !== "tong-quan" && item.id !== "lien-he"
                ).map((item) => {
                  const isActive = activeSection === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-1 px-2 py-1 lg:px-2.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-white text-slate-900 shadow-xs font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      title={item.label}
                    >
                      <Icon
                        className={`w-3 h-3 ${
                          isActive ? "text-amber-600" : "text-slate-400"
                        }`}
                      />
                      <span className="hidden xl:inline">{item.label}</span>
                      <span className="inline xl:hidden">{item.shortLabel || item.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Action: Mobile Portal Switcher and Hamburger */}
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Portal Toggle Button (Touch Friendly min-h-[42px]) */}
            <button
              type="button"
              id="btn-mobile-portal-switch"
              onClick={() => {
                if (currentRoute === "admin") {
                  onNavigateToStudent(currentStudent.slug);
                } else {
                  onNavigateToAdmin();
                }
              }}
              className={`md:hidden min-h-[42px] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                currentRoute === "admin"
                  ? "bg-amber-500 text-white"
                  : "bg-indigo-900 text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{currentRoute === "admin" ? "Xem Phụ Huynh" : "Cô Nghi"}</span>
            </button>

            {/* Mobile Hamburger Button */}
            {currentRoute === "student" && (
              <button
                id="btn-toggle-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center cursor-pointer"
                aria-label="Mở menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
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
        <div className="md:hidden border-t border-slate-200 bg-white/98 px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Chuyển nhanh tới phần
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full min-h-[44px] flex items-center justify-start px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-amber-50 text-amber-900 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
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

