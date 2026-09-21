import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  id: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

const SECTION_THEMES: Record<
  string,
  {
    headerBg: string;
    border: string;
    accentBar: string;
    activeText: string;
    badgeStyle: string;
    pointerBg: string;
    btnStyle: string;
    connectionGlow: string;
  }
> = {
  "buoi-hoc": {
    headerBg: "bg-amber-50/90",
    border: "border-amber-200/90",
    accentBar: "border-l-4 border-l-amber-500",
    activeText: "text-amber-950",
    badgeStyle: "bg-amber-100/95 text-amber-900 border-amber-300/80",
    pointerBg: "bg-amber-50",
    btnStyle: "bg-white/95 hover:bg-white text-amber-900 border-amber-200/90",
    connectionGlow: "ring-1 ring-amber-300/60 shadow-xs",
  },
  "bai-tap": {
    headerBg: "bg-indigo-50/90",
    border: "border-indigo-200/90",
    accentBar: "border-l-4 border-l-indigo-500",
    activeText: "text-indigo-950",
    badgeStyle: "bg-indigo-100/95 text-indigo-900 border-indigo-300/80",
    pointerBg: "bg-indigo-50",
    btnStyle: "bg-white/95 hover:bg-white text-indigo-900 border-indigo-200/90",
    connectionGlow: "ring-1 ring-indigo-300/60 shadow-xs",
  },
  gamification: {
    headerBg: "bg-amber-50/90",
    border: "border-amber-200/90",
    accentBar: "border-l-4 border-l-amber-500",
    activeText: "text-amber-950",
    badgeStyle: "bg-amber-100/95 text-amber-900 border-amber-300/80",
    pointerBg: "bg-amber-50",
    btnStyle: "bg-white/95 hover:bg-white text-amber-900 border-amber-200/90",
    connectionGlow: "ring-1 ring-amber-300/60 shadow-xs",
  },
  "diem-so": {
    headerBg: "bg-blue-50/90",
    border: "border-blue-200/90",
    accentBar: "border-l-4 border-l-blue-500",
    activeText: "text-blue-950",
    badgeStyle: "bg-blue-100/95 text-blue-900 border-blue-300/80",
    pointerBg: "bg-blue-50",
    btnStyle: "bg-white/95 hover:bg-white text-blue-900 border-blue-200/90",
    connectionGlow: "ring-1 ring-blue-300/60 shadow-xs",
  },
  "ho-so-nang-luc": {
    headerBg: "bg-rose-50/90",
    border: "border-rose-200/90",
    accentBar: "border-l-4 border-l-rose-500",
    activeText: "text-rose-950",
    badgeStyle: "bg-rose-100/95 text-rose-900 border-rose-300/80",
    pointerBg: "bg-rose-50",
    btnStyle: "bg-white/95 hover:bg-white text-rose-900 border-rose-200/90",
    connectionGlow: "ring-1 ring-rose-300/60 shadow-xs",
  },
  "nang-luc": {
    headerBg: "bg-rose-50/90",
    border: "border-rose-200/90",
    accentBar: "border-l-4 border-l-rose-500",
    activeText: "text-rose-950",
    badgeStyle: "bg-rose-100/95 text-rose-900 border-rose-300/80",
    pointerBg: "bg-rose-50",
    btnStyle: "bg-white/95 hover:bg-white text-rose-900 border-rose-200/90",
    connectionGlow: "ring-1 ring-rose-300/60 shadow-xs",
  },
};

const DEFAULT_THEME = {
  headerBg: "bg-slate-100/90",
  border: "border-slate-300/80",
  accentBar: "border-l-4 border-l-slate-500",
  activeText: "text-slate-900",
  badgeStyle: "bg-slate-200/80 text-slate-800 border-slate-300/80",
  pointerBg: "bg-slate-100",
  btnStyle: "bg-white/95 hover:bg-white text-slate-800 border-slate-300/80",
  connectionGlow: "ring-1 ring-slate-300/60 shadow-xs",
};

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  isOpen,
  onToggle,
  icon: Icon,
  iconBgColor = "bg-slate-100",
  iconColor = "text-slate-700",
  title,
  subtitle,
  badge,
  children,
}) => {
  const theme = SECTION_THEMES[id] || DEFAULT_THEME;
  return (
    <section id={id} className="scroll-mt-24">
      {!isOpen ? (
        /* Collapsed State: Compact Touch-Friendly Card with Preview */
        <button
          id={`btn-accordion-expand-${id}`}
          type="button"
          onClick={onToggle}
          aria-expanded={false}
          className="w-full flex items-center justify-between gap-2 sm:gap-3 px-3 py-2.5 sm:p-5 bg-white hover:bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs hover:border-slate-300 text-left transition-all cursor-pointer min-h-[56px] sm:min-h-[64px]"
        >
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0 ${iconBgColor} ${iconColor}`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {title}
                </h3>
                {badge && (
                  <div className="shrink-0 inline-flex items-center">
                    {badge}
                  </div>
                )}
              </div>

              {subtitle && (
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-normal sm:leading-relaxed break-words">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-center pl-1">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full hidden md:inline">
              Mở xem
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </button>
      ) : (
        /* Open State: Sub-header with Collapse Toggle + Children */
        <div className="space-y-2 animate-in fade-in duration-200">
          <div
            className={`relative flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-2xl border shadow-xs transition-colors ${theme.headerBg} ${theme.border} ${theme.accentBar}`}
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${iconBgColor} ${iconColor}`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-xs sm:text-sm font-extrabold tracking-tight leading-snug break-words ${theme.activeText}`}
                >
                  {title}
                </h3>

                {badge && (
                  <div className="shrink-0 inline-flex items-center scale-90 sm:scale-100 origin-left">
                    {badge}
                  </div>
                )}
              </div>
            </div>

            <button
              id={`btn-accordion-collapse-${id}`}
              type="button"
              onClick={onToggle}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border shadow-2xs transition-all cursor-pointer shrink-0 min-h-[32px] ${theme.btnStyle}`}
            >
              <span>Thu gọn</span>
              <ChevronUp className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Downward pointer notch visually connecting the header to the opened content underneath */}
            <div
              className={`absolute -bottom-1.5 left-6 sm:left-7 w-3 h-3 rotate-45 border-r border-b ${theme.pointerBg} ${theme.border} z-10 pointer-events-none`}
              aria-hidden="true"
            />
          </div>

          <div className={`relative rounded-3xl transition-all ${theme.connectionGlow}`}>
            {children}
          </div>
        </div>
      )}
    </section>
  );
};

