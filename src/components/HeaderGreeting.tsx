import React from "react";
import { School } from "lucide-react";
import { StudentProfile } from "../types";
import { Badge } from "./ui/Badge";

interface HeaderGreetingProps {
  student: StudentProfile;
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = ({ student }) => {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 shadow-xl border border-slate-700/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Greeting & Student Profile */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Student Avatar */}
        <div className="relative shrink-0">
          <img
            src={student.avatar}
            alt={student.fullName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-amber-400/60 shadow-lg"
          />
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ring-2 ring-slate-900 shadow-xs">
            {student.grade.split("-")[0].trim()}
          </span>
        </div>

        {/* Personalized Message & Details */}
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm text-slate-300 font-medium">
            Xin chào phụ huynh bạn:
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight truncate mt-0.5">
            {student.fullName}
          </h2>

          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span>Mã HS:</span>
            <span className="font-mono text-slate-200 font-medium">{student.id}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300/90 mt-1">
            <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {student.grade.split("-")[0].trim()} - {student.school}
            </span>
          </div>

          {/* Desktop Attitude Badge (sm: and up, inline with text column) */}
          <div className="hidden sm:flex mt-2.5 items-center gap-2">
            <Badge
              variant={student.attitudeBadge.variant}
              className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-[11px] py-1 px-2.5 shadow-xs"
            >
              <span>Thái độ: {student.attitudeBadge.label}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Mobile Full-Width Attitude Badge */}
      <div className="flex sm:hidden items-center pt-3 mt-3.5 border-t border-white/10 w-full">
        <Badge
          variant={student.attitudeBadge.variant}
          className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40 text-xs py-1.5 px-3 shadow-xs w-full justify-center min-h-[36px]"
        >
          <span className="truncate">Thái độ: {student.attitudeBadge.label}</span>
        </Badge>
      </div>
    </header>
  );
};
