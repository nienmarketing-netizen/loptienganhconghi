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
      className="space-y-4 relative"
    >
      {/* Top Header: Badge & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 lg:pb-3 border-b-0 lg:border-b border-slate-100">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Nội dung bài học (2 columns on sm) - Bright Blue Style */}
        <div className="sm:col-span-2 bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-[var(--shadow-card-sm)] flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-[#0052cc] tracking-[-0.01em]">
                Nội dung đã học tại lớp:
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-semibold pl-0.5">
              {lesson.topic}
            </p>
          </div>

          {lesson.skillsLearned && lesson.skillsLearned.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-blue-200/70">
              <span className="text-xs text-[#0066FF] font-semibold">Trọng tâm:</span>
              {lesson.skillsLearned.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-blue-200 text-[#0066FF] text-xs font-bold px-2.5 py-1 rounded-xl leading-tight shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Điểm số kiểm tra (1 column on sm) - Gold / Energy Orange Style */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-[var(--shadow-card-sm)] flex flex-col justify-between text-center sm:text-left">
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFB800] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs font-bold text-amber-900 tracking-[-0.01em]">
                Điểm số tại lớp:
              </span>
            </div>
            <p className="text-xs text-amber-800 font-medium leading-tight">
              {lesson.score.label}
            </p>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-3xl sm:text-4xl font-black text-[#FF9800] tracking-[-0.02em] leading-none font-mono">
                {lesson.score.value.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-amber-900">
                /{lesson.score.maxScore}
              </span>
            </div>
            {lesson.score.ratingBadge && (
              <span className="inline-block mt-2 bg-white text-amber-800 font-black text-[11px] px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                {lesson.score.ratingBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Đánh giá / Lời phê của Cô Nghi */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-[var(--shadow-card-sm)] space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquareQuote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-xs font-bold text-slate-900">
            Đánh giá & Nhận xét của Cô Nghi:
          </span>
        </div>
        <blockquote className="text-sm text-slate-800 leading-relaxed italic pl-3.5 border-l-4 border-[#0066FF] my-1 font-medium">
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

