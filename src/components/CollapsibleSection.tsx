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
  roundedClassName?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  isOpen,
  onToggle,
  icon: Icon,
  iconBgColor = "bg-[#d1d9e6]",
  iconColor = "text-[#2d3436]",
  title,
  subtitle,
  badge,
  children,
  roundedClassName,
}) => {
  const effectiveRounded = roundedClassName || "rounded-lg sm:rounded-xl";
  const effectiveIconRounded = "rounded-md sm:rounded-lg";

  return (
    <section id={id} className="scroll-mt-24">
      {!isOpen ? (
        /* Collapsed State: Soft UI Embossed Block dập nổi từ background */
        <button
          id={`btn-accordion-expand-${id}`}
          type="button"
          onClick={onToggle}
          aria-expanded={false}
          className={`relative w-full flex items-center justify-between gap-2 sm:gap-3 px-4 py-3.5 sm:px-6 sm:py-4 soft-ui-embossed ${effectiveRounded} hover:shadow-[var(--shadow-floating)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[var(--shadow-pressed)] text-left transition-all duration-200 cursor-pointer min-h-[60px] sm:min-h-[68px]`}
        >
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 ${effectiveIconRounded} flex items-center justify-center shrink-0 soft-ui-convex text-[#ff4757] mt-0.5 sm:mt-0`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff4757]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] leading-snug">
                  {title}
                </h3>
                {badge && (
                  <div className="shrink-0 inline-flex items-center">
                    {badge}
                  </div>
                )}
              </div>

              {subtitle && (
                <p className="text-[11px] sm:text-xs md:text-sm text-[#666666] mt-0.5 leading-relaxed break-words font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-center pr-2">
            {/* 3 Vertical Ventilation Grooves */}
            <div className="hidden sm:flex items-center gap-1 opacity-70" aria-hidden="true">
              <div className="w-1 h-5 rounded-full bg-[#b8c6d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
              <div className="w-1 h-5 rounded-full bg-[#b8c6d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
              <div className="w-1 h-5 rounded-full bg-[#b8c6d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
            </div>

            <span className="text-xs font-semibold text-[#1a1a1a] soft-ui-convex px-2.5 py-1 rounded-md hidden md:inline leading-tight">
              Mở khóa
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg soft-ui-convex flex items-center justify-center text-[#1a1a1a] shrink-0">
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </button>
      ) : (
        /* Open State: Sub-header with Collapse Toggle + Children */
        <div className="space-y-3 animate-in fade-in duration-200">
          <div
            className={`relative flex items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-3.5 ${effectiveRounded} soft-ui-embossed`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 ${effectiveIconRounded} flex items-center justify-center shrink-0 soft-ui-convex text-[#ff4757]`}
              >
                <Icon className="w-4 h-4 text-[#ff4757]" />
              </div>

              <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] leading-snug">
                  {title}
                </h3>
                {badge && (
                  <div className="shrink-0 inline-flex items-center">
                    {badge}
                  </div>
                )}
              </div>
            </div>

            <button
              id={`btn-accordion-collapse-${id}`}
              type="button"
              onClick={onToggle}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md sm:rounded-lg soft-ui-convex text-[#1a1a1a] active:shadow-[var(--shadow-pressed-sm)] hover:text-[#ff4757] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0 min-h-[34px] mr-1 leading-tight"
            >
              <span>Thu gọn</span>
              <ChevronUp className="w-3.5 h-3.5 text-[#ff4757]" />
            </button>

            {/* Downward mechanical pointer notch */}
            <div
              className="absolute -bottom-1.5 left-7 w-3 h-3 rotate-45 border-r border-b bg-[#dbe4ee] border-[#b0c0d2] z-10 pointer-events-none shadow-[2px_2px_3px_rgba(0,0,0,0.05)]"
              aria-hidden="true"
            />
          </div>

          <div className="relative transition-all">
            {children}
          </div>
        </div>
      )}
    </section>
  );
};


