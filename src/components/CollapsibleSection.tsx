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
        /* Collapsed State: Clean Floating Card */
        <button
          id={`btn-accordion-expand-${id}`}
          type="button"
          onClick={onToggle}
          aria-expanded={false}
          className={`group relative w-full flex items-center justify-between gap-2 sm:gap-3 px-4 py-3.5 sm:px-6 sm:py-4 bg-white border border-slate-100 shadow-[0_4px_16px_rgba(15,45,90,0.05)] ${effectiveRounded} hover:shadow-[0_8px_24px_rgba(15,45,90,0.08)] hover:-translate-y-0.5 active:translate-y-0 text-left transition-all duration-200 cursor-pointer min-h-[60px] sm:min-h-[68px]`}
        >
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 ${effectiveIconRounded} flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100 text-[#0066ff] group-hover:bg-[#0066ff] group-hover:text-white transition-all mt-0.5 sm:mt-0 shadow-xs`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-current" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#1e293b] tracking-[-0.015em] leading-snug group-hover:text-[#0066ff] transition-colors">
                  {title}
                </h3>
                {badge && (
                  <div className="shrink-0 inline-flex items-center">
                    {badge}
                  </div>
                )}
              </div>

              {subtitle && (
                <p className="text-[11px] sm:text-xs md:text-sm text-[#64748b] mt-0.5 leading-relaxed break-words font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-center pr-1">
            {/* Unified Expand Action */}
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[#1e293b] group-hover:text-[#0066ff] group-hover:border-blue-200 transition-all shrink-0 min-h-[34px] leading-tight shadow-xs">
              <span className="hidden sm:inline">Mở khóa</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#0066ff]" />
            </div>
          </div>
        </button>
      ) : (
        /* Open State: Sub-header with Collapse Toggle + Children */
        <div className="space-y-3 animate-in fade-in duration-200">
          <div
            className={`relative flex items-center justify-between gap-2 px-4 py-3 sm:px-5 sm:py-3.5 ${effectiveRounded} bg-white border border-slate-100 shadow-[0_4px_14px_rgba(15,45,90,0.05)]`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 ${effectiveIconRounded} flex items-center justify-center shrink-0 bg-blue-50 border border-blue-100 text-[#0066ff]`}
              >
                <Icon className="w-4 h-4 text-[#0066ff]" />
              </div>

              <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-[#1e293b] tracking-[-0.015em] leading-snug">
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
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[#1e293b] hover:text-[#0066ff] hover:border-blue-200 transition-all cursor-pointer shrink-0 min-h-[34px] mr-1 leading-tight shadow-xs"
            >
              <span>Thu gọn</span>
              <ChevronUp className="w-3.5 h-3.5 text-[#0066ff]" />
            </button>
          </div>

          <div className="relative transition-all">
            {children}
          </div>
        </div>
      )}
    </section>
  );
};


