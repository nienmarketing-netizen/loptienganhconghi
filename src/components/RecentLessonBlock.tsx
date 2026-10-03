import React from "react";
import {
  Calendar,
  BookOpen,
  Award,
  MessageSquareQuote,
  CheckCircle2,
} from "lucide-react";
import { RecentLessonInfo } from "../types";
import { ClassroomMediaSection } from "./ClassroomMediaSection";
import { formatDateWithDayOfWeek } from "../lib/dateUtils";

interface RecentLessonBlockProps {
  lesson?: RecentLessonInfo;
  studentName: string;
}

export const RecentLessonBlock: React.FC<RecentLessonBlockProps> = ({
  lesson,
  studentName,
}) => {
  if (!lesson) return null;

  return (
    <div
      id="recent-lesson-summary"
      className="soft-ui-embossed rounded-lg sm:rounded-xl p-4 sm:p-5 transition-all space-y-4 relative"
    >
      {/* Top Header: Badge & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="text-[12px] font-semibold text-[#0066ff] flex items-center gap-1.5 tracking-[-0.01em]">
            <span className="w-2 h-2 rounded-full bg-[#0066ff] shadow-[0_0_8px_#0066ff] animate-pulse" />
            <span>Thông tin buổi học mới nhất</span>
          </div>
          <h3 className="text-sm sm:text-lg font-bold text-[#1e293b] tracking-[-0.015em] mt-0.5">
            {lesson.lessonName}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Badge */}
          <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-[#1e293b] text-xs font-semibold px-3 py-1.5 rounded-lg leading-tight shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#0066ff]" />
            <span>{formatDateWithDayOfWeek(lesson.date)}</span>
          </div>

          {/* Attendance Status */}
          {lesson.attendanceStatus && (
            <div className="hidden xs:inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-lg leading-tight shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4caf50] shrink-0" />
              <span>{lesson.attendanceStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Nội dung học & Điểm số buổi học */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Nội dung bài học (2 columns on sm) - Recessed well */}
        <div className="sm:col-span-2 bg-[#edf3fa] border border-[#dbe4f0] rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1e293b] tracking-[-0.01em]">
              <BookOpen className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>Nội dung đã học tại lớp:</span>
            </div>
            <p className="text-sm text-[#1e293b] leading-relaxed font-normal">
              {lesson.topic}
            </p>
          </div>

          {lesson.skillsLearned && lesson.skillsLearned.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-200/80">
              <span className="text-xs text-[#64748b] font-medium">Trọng tâm:</span>
              {lesson.skillsLearned.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200 text-[#1e293b] text-xs font-medium px-2.5 py-1 rounded-lg leading-tight shadow-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Điểm số kiểm tra (1 column on sm) */}
        <div className="bg-white border border-slate-100 shadow-[0_4px_14px_rgba(15,45,90,0.05)] rounded-xl p-4 flex flex-col justify-between text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-xs font-semibold text-[#1e293b] tracking-[-0.01em]">
              <Award className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>Điểm số tại lớp:</span>
            </div>
            <p className="text-xs text-[#64748b] leading-tight">
              {lesson.score.label}
            </p>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-3xl font-black text-[#0066ff] tracking-[-0.02em] leading-none">
                {lesson.score.value.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-[#64748b]">
                /{lesson.score.maxScore}
              </span>
            </div>
            {lesson.score.ratingBadge && (
              <span className="inline-block mt-1.5 bg-amber-50 text-amber-900 font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-300 shadow-xs">
                {lesson.score.ratingBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Đánh giá / Lời phê của Cô Nghi */}
      <div className="bg-[#edf3fa] border border-[#dbe4f0] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1e293b]">
          <MessageSquareQuote className="w-4 h-4 text-[#0066ff]" />
          <span>Đánh giá & Nhận xét của Cô Nghi:</span>
        </div>
        <blockquote className="text-sm text-[#1e293b] leading-relaxed italic pl-3 border-l-3 border-[#0066ff] my-1">
          "{lesson.teacherFeedback}"
        </blockquote>
      </div>

      {/* Khu vực Hình ảnh & Video học tập của học sinh tại lớp */}
      <ClassroomMediaSection
        initialMedia={lesson.mediaItems}
        studentName={studentName}
        lessonDate={formatDateWithDayOfWeek(lesson.date)}
      />
    </div>
  );
};

