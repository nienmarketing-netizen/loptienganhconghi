import React from "react";
import { School, Sparkles, Rocket, Heart, Star } from "lucide-react";
import { StudentProfile } from "../types";
import { Badge } from "./ui/Badge";
import { MarqueeText } from "./MarqueeText";
import { parseStudentCode } from "../lib/studentUtils";

interface HeaderGreetingProps {
  student: StudentProfile;
}

export const HeaderGreeting: React.FC<HeaderGreetingProps> = ({ student }) => {
  const parsedCode = parseStudentCode(student.id);
  const firstName = student.fullName.split(" ").slice(-1)[0] || "bạn";

  return (
    <header className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] text-white p-5 sm:p-6 shadow-[0_16px_36px_rgba(37,99,235,0.25)] border-2 sm:border-[3px] border-white/30">
      {/* Decorative cartoon doodle stickers floating in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10 blur-xl" />
        <div className="absolute top-2 right-12 text-2xl animate-bounce duration-1000 opacity-80">
          ⭐
        </div>
        <div className="absolute bottom-3 right-28 text-xl opacity-75 hidden sm:block">
          🎈
        </div>
        <div className="absolute top-1/2 right-4 text-2xl opacity-80 hidden sm:block">
          🚀
        </div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-blue-300/20 blur-xl" />
      </div>

      {/* Top Cute Badge Bar */}
      <div className="relative z-10 flex items-center justify-between text-sm text-blue-100 pb-3 mb-3.5 border-b border-white/20 px-0.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-yellow-950 font-black text-xs shadow-sm shadow-yellow-500/40 animate-pulse">
            ⭐
          </span>
          <span className="font-extrabold text-white tracking-wide text-sm sm:text-base drop-shadow-xs">
            Góc học tập siêu vui
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-yellow-200 font-bold bg-white/15 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-xs">
          <span>✨</span>
          <span>Cố gắng mỗi ngày, nhận quà liền tay! 🎁</span>
        </div>
      </div>

      {/* Greeting & Student Profile */}
      <div className="relative z-10 flex items-start gap-4 sm:gap-5 px-0.5">
        {/* Student Avatar - Cute Cartoon Frame with Bouncy Badge */}
        <div className="relative shrink-0 group">
          <div className="p-1 rounded-3xl bg-gradient-to-tr from-yellow-300 via-white to-pink-300 shadow-[0_6px_16px_rgba(0,0,0,0.18)] border-2 border-white transform transition-transform group-hover:scale-105 group-hover:rotate-1">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-[22px] object-cover"
            />
          </div>
          {/* Grade sticker badge */}
          <span className="absolute -bottom-1.5 -right-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 text-xs font-black px-2 py-0.5 rounded-full shadow-md border-2 border-white flex items-center gap-0.5">
            <span>🎒</span>
            <span>{student.grade.split("-")[0].trim()}</span>
          </span>
        </div>

        {/* Personalized Cute Message & Details */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-yellow-200 font-bold flex items-center gap-1.5">
            <span>Chào mừng siêu sao nhí:</span>
            <span className="animate-wiggle text-base">👋</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black !text-white tracking-tight truncate mt-0.5 drop-shadow-xs flex items-center gap-2">
            <span>{student.fullName}</span>
            <span className="text-lg sm:text-xl">🌟</span>
          </h2>

          {/* Student ID & School Tags */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-blue-100 mt-2 flex-wrap">
            <span
              title={
                parsedCode
                  ? `${parsedCode.grade} • ${parsedCode.daysLabel} • ${parsedCode.shiftLabel} (STT ${parsedCode.sequence})`
                  : student.id
              }
              className="text-white font-extrabold bg-white/20 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/30 text-xs sm:text-sm font-mono tracking-wider shadow-2xs inline-flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5 text-yellow-300" />
              <span>ID: {student.id}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-xl border border-white/20 text-white font-semibold text-xs sm:text-sm">
              <School className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="truncate">{student.school}</span>
            </span>
          </div>

          {/* Desktop Attitude Badge */}
          <div className="hidden sm:flex mt-3.5 items-center gap-2 max-w-full">
            <Badge
              variant="default"
              className="bg-white/20 text-white border-white/30 backdrop-blur-xs text-xs sm:text-sm py-1.5 px-4 font-bold rounded-2xl max-w-[420px] overflow-hidden leading-tight shadow-xs flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300 shrink-0" />
              <MarqueeText text={`Bé ngoan: ${student.attitudeBadge.label}`} speedSeconds={18}>
                <span>Bé ngoan: {student.attitudeBadge.label}</span>
              </MarqueeText>
            </Badge>
          </div>
        </div>
      </div>

      {/* Mobile Full-Width Attitude Badge */}
      <div className="relative z-10 flex sm:hidden items-center pt-3 mt-3 border-t border-white/20 w-full px-0.5">
        <Badge
          variant="default"
          className="bg-white/20 text-white border-white/30 backdrop-blur-xs text-xs sm:text-sm py-2 px-3.5 w-full justify-center min-h-[38px] font-bold rounded-2xl overflow-hidden leading-tight shadow-xs flex items-center gap-1.5"
        >
          <Heart className="w-4 h-4 text-pink-300 fill-pink-300 shrink-0" />
          <MarqueeText text={`Bé ngoan: ${student.attitudeBadge.label}`} speedSeconds={18} className="w-full">
            <span>Bé ngoan: {student.attitudeBadge.label}</span>
          </MarqueeText>
        </Badge>
      </div>
    </header>
  );
};

