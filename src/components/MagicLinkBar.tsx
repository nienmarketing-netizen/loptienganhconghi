import React, { useState } from "react";
import { Link2, Check, Share2, Users } from "lucide-react";
import { StudentProfile } from "../types";
import { MOCK_STUDENTS } from "../data/mockStudents";
import { Button } from "./ui/Button";
import { getStudentTokenBalance } from "../lib/studentUtils";

interface MagicLinkBarProps {
  currentStudent: StudentProfile;
  onSelectStudent: (slug: string) => void;
}

export const MagicLinkBar: React.FC<MagicLinkBarProps> = ({
  currentStudent,
  onSelectStudent,
}) => {
  const [copied, setCopied] = useState(false);

  const studentList = Object.values(MOCK_STUDENTS);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/student/${currentStudent.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2.5 px-3 sm:px-4">
      <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Magic Link Info */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
            <Link2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Zalo Magic Link:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/90 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-300 border border-slate-700/60 truncate max-w-[180px] sm:max-w-[220px]">
            <span>/student/</span>
            <span className="text-amber-300 font-bold truncate">{currentStudent.slug}</span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyLink}
            className="text-slate-300 hover:text-white hover:bg-slate-800 h-7 px-2 text-[11px] rounded-md gap-1"
            title="Sao chép link gửi qua Zalo phụ huynh"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Đã chép</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3" />
                <span>Sao chép</span>
              </>
            )}
          </Button>
        </div>

        {/* Quick Student Switcher for testing all parent views */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 hidden sm:inline-flex">
            <Users className="w-3 h-3" /> Học sinh:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {studentList.map((stu) => {
              const isActive = stu.id === currentStudent.id;
              return (
                <button
                  key={stu.id}
                  onClick={() => onSelectStudent(stu.slug)}
                  className={`px-2 py-1 rounded-md text-[11px] transition-all whitespace-nowrap font-medium ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/70"
                  }`}
                >
                  {stu.fullName.split(" ").slice(-2).join(" ")} ({getStudentTokenBalance(stu)}T)
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
