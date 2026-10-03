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
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0066FF] via-[#1E88E5] to-[#0052cc] text-white p-5 sm:p-6 shadow-[0_14px_32px_rgba(0,102,255,0.22)] border border-white/20">
      {/* Top Friendly Badge Bar */}
      <div className="flex items-center justify-between text-xs text-blue-100/90 pb-3 mb-3.5 border-b border-white/15 px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7] animate-pulse" />
          <span className="font-bold text-white tracking-wide text-xs">Parent Dashboard • Cổng phụ huynh</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-100 font-medium">
          <span>✨</span>
          <span>Where Kids Learn, Grow & Shine</span>
        </div>
      </div>

      {/* Greeting & Student Profile */}
      <div className="flex items-start gap-3.5 sm:gap-4 px-0.5">
        {/* Student Avatar - Crisp Clean Bezel */}
        <div className="relative shrink-0">
          <div className="p-1 rounded-2xl bg-white shadow-md border-2 border-white/90">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#ffb800] text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm border border-white/60">
            {student.grade.split("-")[0].trim()}
          </span>
        </div>

        {/* Personalized Message & Details */}
        <div className="flex-1 min-w-0">
          <div className="text-xs text-blue-100 font-medium">
            Xin chào phụ huynh bạn:
          </div>

          <h2 className="text-lg sm:text-2xl font-black !text-white tracking-[-0.02em] truncate mt-0.5">
            {student.fullName}
          </h2>

          <div className="text-xs text-blue-100 mt-1 flex items-center gap-1.5 font-normal flex-wrap">
            <span className="text-blue-100 font-medium">Mã học sinh:</span>
            <span
              title={
                parsedCode
                  ? `${parsedCode.grade} • ${parsedCode.daysLabel} • ${parsedCode.shiftLabel} (STT ${parsedCode.sequence})`
                  : student.id
              }
              className="text-white font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-white/30 text-xs font-mono tracking-wider shadow-xs inline-flex items-center gap-1"
            >
              {student.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-blue-100 mt-1.5 font-normal">
            <School className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate text-white font-medium">
              {student.grade.split("-")[0].trim()} • {student.school}
            </span>
          </div>

          {/* Desktop Attitude Badge */}
          <div className="hidden sm:flex mt-3 items-center gap-2 max-w-full">
            <Badge
              variant="default"
              className="bg-white/15 text-white border-white/30 backdrop-blur-xs text-xs py-1 px-3 font-semibold max-w-[340px] overflow-hidden leading-tight"
            >
              <MarqueeText text={`Thái độ: ${student.attitudeBadge.label}`} speedSeconds={18}>
                <span>Thái độ: {student.attitudeBadge.label}</span>
              </MarqueeText>
            </Badge>
          </div>
        </div>
      </div>

      {/* Mobile Full-Width Attitude Badge */}
      <div className="flex sm:hidden items-center pt-3 mt-3 border-t border-white/15 w-full px-0.5">
        <Badge
          variant="default"
          className="bg-white/15 text-white border-white/30 backdrop-blur-xs text-xs py-1.5 px-3 w-full justify-center min-h-[36px] font-semibold overflow-hidden leading-tight"
        >
          <MarqueeText text={`Thái độ: ${student.attitudeBadge.label}`} speedSeconds={18} className="w-full">
            <span>Thái độ: {student.attitudeBadge.label}</span>
          </MarqueeText>
        </Badge>
      </div>
    </header>
  );
};

