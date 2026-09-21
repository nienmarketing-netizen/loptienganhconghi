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
      className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs transition-all space-y-3.5"
    >
      {/* Top Header: Badge & Date */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            THÔNG TIN BUỔI HỌC MỚI NHẤT
          </h3>
          <span className="text-sm font-extrabold text-slate-900 tracking-tight">
            {lesson.lessonName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Badge */}
          <div className="inline-flex items-center gap-1.5 bg-slate-100/90 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200/80">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{lesson.date}</span>
          </div>

          {/* Attendance Status */}
          {lesson.attendanceStatus && (
            <div className="hidden xs:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{lesson.attendanceStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Nội dung học & Điểm số buổi học */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Nội dung bài học (2 columns on sm) */}
        <div className="sm:col-span-2 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Nội dung đã học tại lớp:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {lesson.topic}
            </p>
          </div>

          {lesson.skillsLearned && lesson.skillsLearned.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5 mt-2.5 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-500 font-medium">Trọng tâm:</span>
              {lesson.skillsLearned.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-white text-slate-700 border border-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-md shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Điểm số kiểm tra (1 column on sm) */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-3.5 border border-amber-200/70 flex flex-col justify-between text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-xs font-bold text-amber-900">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Điểm số tại lớp:</span>
            </div>
            <p className="text-[11px] text-amber-800/80 leading-tight">
              {lesson.score.label}
            </p>
          </div>

          <div className="my-1.5">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-3xl font-black text-amber-950 tracking-tight">
                {lesson.score.value.toFixed(1)}
              </span>
              <span className="text-xs font-bold text-amber-700">
                /{lesson.score.maxScore}
              </span>
            </div>
            {lesson.score.ratingBadge && (
              <span className="inline-block mt-1 bg-white/90 text-amber-900 font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                {lesson.score.ratingBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Đánh giá / Lời phê của Cô Nghi */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 bg-gradient-to-r from-indigo-50/40 via-white to-amber-50/30 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
          <span>Đánh giá & Nhận xét của Cô Nghi:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic pl-1 border-l-2 border-indigo-400">
          "{lesson.teacherFeedback}"
        </p>
      </div>

      {/* Khu vực Hình ảnh & Video học tập của học sinh tại lớp */}
      <ClassroomMediaSection
        initialMedia={lesson.mediaItems}
        studentName={studentName}
        lessonDate={lesson.date}
      />
    </div>
  );
};

