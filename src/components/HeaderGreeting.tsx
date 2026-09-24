import React from "react";
import { School } from "lucide-react";
import { StudentProfile } from "../types";
import { Badge } from "./ui/Badge";
import { MarqueeText } from "./MarqueeText";
import { parseStudentCode } from "../lib/studentUtils";

interface HeaderGreetingProps {
  student: StudentProfile;
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = ({ student }) => {
  const parsedCode = parseStudentCode(student.id);

  return (
    <header className="relative overflow-hidden rounded-lg sm:rounded-xl bg-[#1e293b] text-white p-4 sm:p-6 shadow-[var(--shadow-card)] border border-slate-700/60">
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-300 pb-2 sm:pb-3 mb-3 border-b border-white/10 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full led-indicator-green animate-pulse" />
          <span className="font-bold text-emerald-400">TERM_LINK: ACTIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-slate-300">
          <span>PORT: 3000</span>
          <span>//</span>
          <span>SYS_ID: {student.slug.toUpperCase()}</span>
        </div>
      </div>

      {/* Greeting & Student Profile */}
      <div className="flex items-start gap-3.5 sm:gap-4 px-1">
        {/* Student Avatar - Crisp & Bright Clean Bezel */}
        <div className="relative shrink-0">
          <div className="p-1 rounded-lg sm:rounded-xl bg-white shadow-md border-2 border-white/90">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-13 h-13 sm:w-16 sm:h-16 rounded-md sm:rounded-lg object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#ff4757] text-white text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-md shadow-[var(--shadow-accent)] border border-white/40">
            {student.grade.split("-")[0].trim()}
          </span>
        </div>

        {/* Personalized Message & Details */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-200 font-medium tracking-wide">
            Xin chào phụ huynh bạn:
          </div>

          <h2 className="text-base sm:text-xl md:text-2xl font-bold !text-white tracking-[-0.02em] truncate mt-0.5">
            {student.fullName}
          </h2>

          <div className="text-xs text-slate-200 mt-0.5 flex items-center gap-1.5 font-normal flex-wrap">
            <span className="text-slate-200 font-medium">Mã học sinh:</span>
            <span
              title={
                parsedCode
                  ? `${parsedCode.grade} • ${parsedCode.daysLabel} • ${parsedCode.shiftLabel} (STT ${parsedCode.sequence})`
                  : student.id
              }
              className="text-amber-300 font-bold bg-black/50 px-2 py-0.5 rounded border border-white/20 text-xs font-mono tracking-wider shadow-xs inline-flex items-center gap-1"
            >
              {student.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1 font-normal">
            <School className="w-3.5 h-3.5 text-[#ff4757] shrink-0" />
            <span className="truncate text-slate-100 font-medium">
              {student.grade.split("-")[0].trim()} • {student.school}
            </span>
          </div>

          {/* Desktop Attitude Badge */}
          <div className="hidden sm:flex mt-2.5 items-center gap-2 max-w-full">
            <Badge
              variant="success"
              className="bg-emerald-950/80 text-emerald-300 border-emerald-500/50 text-xs py-1 px-3 font-semibold max-w-[340px] overflow-hidden leading-tight"
            >
              <MarqueeText text={`Thái độ: ${student.attitudeBadge.label}`} speedSeconds={18}>
                <span>Thái độ: {student.attitudeBadge.label}</span>
              </MarqueeText>
            </Badge>
          </div>
        </div>
      </div>

      {/* Mobile Full-Width Attitude Badge */}
      <div className="flex sm:hidden items-center pt-3 mt-3 border-t border-white/10 w-full px-1">
        <Badge
          variant="success"
          className="bg-emerald-950/80 text-emerald-300 border-emerald-500/50 text-xs py-1.5 px-3 w-full justify-center min-h-[36px] font-semibold overflow-hidden leading-tight"
        >
          <MarqueeText text={`Thái độ: ${student.attitudeBadge.label}`} speedSeconds={18} className="w-full">
            <span>Thái độ: {student.attitudeBadge.label}</span>
          </MarqueeText>
        </Badge>
      </div>
    </header>
  );
};

