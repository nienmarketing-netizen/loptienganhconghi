import React, { useState } from "react";
import { X, Check, BookOpen, TrendingUp, Sparkles, Image, Plus, Trash2 } from "lucide-react";
import { StudentProfile, RadarCapabilityPoint, Assignment } from "../types";

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  onSave: (updatedStudent: StudentProfile) => Promise<void>;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<"lesson" | "periodic">("lesson");

  // Tab 1 (GĐ 2): Buổi học thường kỳ
  const [lessonName, setLessonName] = useState<string>(
    `Buổi ${new Date().toLocaleDateString("vi-VN")}: Ôn tập & Bóc tách đề thi`
  );
  const [lessonDate, setLessonDate] = useState<string>(
    new Date().toLocaleDateString("vi-VN")
  );
  const [scoreValue, setScoreValue] = useState<number>(9.0);
  const [scoreBadge, setScoreBadge] = useState<string>("Top 3 của lớp ⭐");
  const [teacherFeedback, setTeacherFeedback] = useState<string>(
    "Con phản xạ rất nhanh, nắm vững cấu trúc bóc tách câu."
  );
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
  );
  const [tokensToAdd, setTokensToAdd] = useState<number>(10);
  const [newHwTitle, setNewHwTitle] = useState<string>("");
  const [newHwDeadline, setNewHwDeadline] = useState<string>("20:00 - Thứ 7 tuần này");

  // Tab 2 (GĐ 3): Đánh giá định kỳ 5 trục Radar
  const [radarVocab, setRadarVocab] = useState<number>(
    student?.radarCapabilities?.find((r) => r.subject === "Từ vựng")?.current || 75
  );
  const [radarGrammar, setRadarGrammar] = useState<number>(
    student?.radarCapabilities?.find((r) => r.subject === "Ngữ pháp")?.current || 80
  );
  const [radarListening, setRadarListening] = useState<number>(
    student?.radarCapabilities?.find((r) => r.subject === "Nghe hiểu")?.current || 70
  );
  const [radarSpeaking, setRadarSpeaking] = useState<number>(
    student?.radarCapabilities?.find((r) => r.subject === "Phát âm")?.current || 65
  );
  const [radarAttitude, setRadarAttitude] = useState<number>(
    student?.radarCapabilities?.find((r) => r.subject === "Thái độ")?.current || 90
  );

  const [examName, setExamName] = useState<string>("Kiểm tra Giữa kỳ 1 ở trường");
  const [examScore, setExamScore] = useState<number>(8.5);
  const [parentMessage, setParentMessage] = useState<string>(
    student?.teacherDiagnosis?.messageToParents || ""
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let updatedStudent = { ...student };

      if (activeTab === "lesson") {
        // Cập nhật buổi học gần nhất (GĐ 2)
        const newRecentLesson = {
          date: lessonDate,
          lessonName,
          topic: "Bài học định kỳ lớp Cô Nghi",
          score: {
            value: scoreValue,
            maxScore: 10,
            label: "Điểm bài kiểm tra buổi học",
            ratingBadge: scoreBadge,
          },
          teacherFeedback,
          attendanceStatus: "Đi học đúng giờ",
          mediaItems: photoUrl
            ? [
                {
                  id: `media-${Date.now()}`,
                  type: "image" as const,
                  url: photoUrl,
                  title: "Ảnh bài chấm trực tiếp tại lớp",
                  uploadedBy: "Cô Nghi",
                },
              ]
            : student.recentLesson?.mediaItems,
        };

        // Thêm bài tập nếu có
        let updatedAssignments = [...(student.assignments || [])];
        if (newHwTitle.trim()) {
          updatedAssignments.unshift({
            id: `asg-${Date.now()}`,
            title: newHwTitle.trim(),
            unit: "Bài tập mới",
            deadline: newHwDeadline,
            status: "not_done",
            tokensReward: 10,
            pdfDownloadName: "Bai_Tap_Ve_Nha.pdf",
          });
        }

        // Tích token
        const newTokens = Math.min(
          student.gamification.maxTokens,
          student.gamification.currentTokens + tokensToAdd
        );

        const newHistoryItem = {
          id: `tk-${Date.now()}`,
          date: `${lessonDate}`,
          reason: `Buổi học ${lessonDate}: Đạt ${scoreValue}đ & hoàn thành bài`,
          tokens: tokensToAdd,
          type: "earned" as const,
          category: "bonus" as const,
        };

        updatedStudent = {
          ...updatedStudent,
          recentLesson: newRecentLesson,
          assignments: updatedAssignments,
          gamification: {
            ...updatedStudent.gamification,
            currentTokens: newTokens,
          },
          tokenHistory: [newHistoryItem, ...(student.tokenHistory || [])],
        };
      } else {
        // Cập nhật định kỳ 5 trục Radar & Mốc kiểm tra (GĐ 3)
        const updatedRadar: RadarCapabilityPoint[] = [
          {
            subject: "Từ vựng",
            baseline: student.radarCapabilities?.find((r) => r.subject === "Từ vựng")?.baseline || 50,
            current: radarVocab,
            fullMark: 100,
          },
          {
            subject: "Ngữ pháp",
            baseline: student.radarCapabilities?.find((r) => r.subject === "Ngữ pháp")?.baseline || 45,
            current: radarGrammar,
            fullMark: 100,
          },
          {
            subject: "Nghe hiểu",
            baseline: student.radarCapabilities?.find((r) => r.subject === "Nghe hiểu")?.baseline || 55,
            current: radarListening,
            fullMark: 100,
          },
          {
            subject: "Phát âm",
            baseline: student.radarCapabilities?.find((r) => r.subject === "Phát âm")?.baseline || 40,
            current: radarSpeaking,
            fullMark: 100,
          },
          {
            subject: "Thái độ",
            baseline: student.radarCapabilities?.find((r) => r.subject === "Thái độ")?.baseline || 70,
            current: radarAttitude,
            fullMark: 100,
          },
        ];

        const updatedGrowth = [...(student.growthHistory || [])];
        if (examName.trim()) {
          updatedGrowth.push({
            period: examName.trim(),
            classScore: examScore,
            schoolScore: examScore,
            note: "Cập nhật bài thi trường",
          });
        }

        updatedStudent = {
          ...updatedStudent,
          radarCapabilities: updatedRadar,
          growthHistory: updatedGrowth,
          teacherDiagnosis: {
            ...student.teacherDiagnosis,
            currentOverallScore: examScore,
            messageToParents: parentMessage.trim() || student.teacherDiagnosis.messageToParents,
          },
        };
      }

      await onSave(updatedStudent);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#e0e5ec] rounded-2xl shadow-[var(--shadow-floating)] border border-white/80 p-5 sm:p-6 my-auto text-[#1a1a1a]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#babecc]/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/60 text-amber-300">
                {student.id}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] tracking-tight">
                Nhập liệu học vụ: {student.fullName}
              </h3>
            </div>
            <p className="text-xs text-[#666666] mt-0.5">
              Cập nhật buổi học mới và tiến độ tăng trưởng trên Firebase
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg soft-ui-convex flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-[#d1d9e6] rounded-xl border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)]">
          <button
            type="button"
            onClick={() => setActiveTab("lesson")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "lesson"
                ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)]"
                : "text-[#666666] hover:text-[#1a1a1a]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Giai đoạn 2: Buổi học & Chấm điểm thường kỳ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("periodic")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "periodic"
                ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)]"
                : "text-[#666666] hover:text-[#1a1a1a]"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Giai đoạn 3: Đánh giá định kỳ (5 Trục Radar)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {activeTab === "lesson" ? (
            /* TAB 1: Giai đoạn 2 - Buổi học thường kỳ */
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#1a1a1a] mb-1">Tên bài học</label>
                  <input
                    type="text"
                    required
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] font-semibold text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1a1a1a] mb-1">Ngày học</label>
                  <input
                    type="text"
                    value={lessonDate}
                    onChange={(e) => setLessonDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] font-mono text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-medium text-[#1a1a1a] mb-1">Điểm mini-test (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#ff4757] font-mono font-bold text-sm shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1a1a1a] mb-1">Huy hiệu khen ngợi</label>
                  <input
                    type="text"
                    value={scoreBadge}
                    onChange={(e) => setScoreBadge(e.target.value)}
                    placeholder="VD: Top 3 của lớp ⭐"
                    className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1a1a1a] mb-1">Cộng Tokens thưởng</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={tokensToAdd}
                    onChange={(e) => setTokensToAdd(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-emerald-800 font-mono font-bold text-sm shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1a1a1a] mb-1">Lời nhận xét của Cô Nghi</label>
                <textarea
                  rows={2}
                  required
                  value={teacherFeedback}
                  onChange={(e) => setTeacherFeedback(e.target.value)}
                  placeholder="Ghi nhận xét cụ thể để phụ huynh đọc được ngay..."
                  className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#1a1a1a] mb-1">Link ảnh bài tập cô đã chấm</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="Dán link ảnh (hoặc URL ảnh bài tập)"
                  className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none"
                />
                {photoUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-[#babecc]"
                    />
                    <span className="text-[11px] text-emerald-800 font-semibold">
                      ✓ Ảnh sẽ hiển thị trong phần chi tiết bài làm của học sinh
                    </span>
                  </div>
                )}
              </div>

              {/* Giao bài tập về nhà mới */}
              <div className="p-3 bg-[#d1d9e6] border border-[#babecc]/60 rounded-xl space-y-2">
                <span className="font-bold text-[#1a1a1a] uppercase tracking-wider text-[11px] font-mono block">
                  Giao bài tập về nhà tuần này (Tùy chọn)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Tiêu đề bài tập về nhà mới..."
                    value={newHwTitle}
                    onChange={(e) => setNewHwTitle(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Hạn nộp (VD: 20:00 - Chủ Nhật)"
                    value={newHwDeadline}
                    onChange={(e) => setNewHwDeadline(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] text-xs"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: Giai đoạn 3 - Đánh giá định kỳ 5 trục Radar */
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#d1d9e6] border border-[#babecc]/60 rounded-xl space-y-3">
                <span className="font-bold text-[#1a1a1a] uppercase tracking-wider text-[11px] font-mono block">
                  Cập nhật 5 Trục Năng Lực Hiện Tại (Radar Current - Thang 0-100)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono">
                  <div className="p-2 rounded-lg bg-[#e0e5ec] border border-white/60">
                    <span className="text-[10px] text-[#666666] block">Từ vựng: {radarVocab}đ</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={radarVocab}
                      onChange={(e) => setRadarVocab(parseInt(e.target.value, 10))}
                      className="w-full accent-[#ff4757]"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-[#e0e5ec] border border-white/60">
                    <span className="text-[10px] text-[#666666] block">Ngữ pháp: {radarGrammar}đ</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={radarGrammar}
                      onChange={(e) => setRadarGrammar(parseInt(e.target.value, 10))}
                      className="w-full accent-[#ff4757]"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-[#e0e5ec] border border-white/60">
                    <span className="text-[10px] text-[#666666] block">Nghe hiểu: {radarListening}đ</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={radarListening}
                      onChange={(e) => setRadarListening(parseInt(e.target.value, 10))}
                      className="w-full accent-[#ff4757]"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-[#e0e5ec] border border-white/60">
                    <span className="text-[10px] text-[#666666] block">Phát âm: {radarSpeaking}đ</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={radarSpeaking}
                      onChange={(e) => setRadarSpeaking(parseInt(e.target.value, 10))}
                      className="w-full accent-[#ff4757]"
                    />
                  </div>
                  <div className="p-2 rounded-lg bg-[#e0e5ec] border border-white/60">
                    <span className="text-[10px] text-[#666666] block">Thái độ: {radarAttitude}đ</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={radarAttitude}
                      onChange={(e) => setRadarAttitude(parseInt(e.target.value, 10))}
                      className="w-full accent-[#ff4757]"
                    />
                  </div>
                </div>
              </div>

              {/* Thêm bài thi trường */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#1a1a1a] mb-1">Mốc thi trường mới (Tùy chọn)</label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="VD: Kiểm tra Giữa kỳ 1 ở trường"
                    className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#1a1a1a] mb-1">Điểm đạt được</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={examScore}
                    onChange={(e) => setExamScore(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#ff4757] font-mono font-bold text-sm shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#1a1a1a] mb-1">
                  Lời nhắn gửi định kỳ cho phụ huynh ({student.parentSalutation})
                </label>
                <textarea
                  rows={3}
                  value={parentMessage}
                  onChange={(e) => setParentMessage(e.target.value)}
                  placeholder="Đánh giá chặng đường học tập của con tháng này..."
                  className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#babecc]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg soft-ui-convex text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#ff4757] hover:bg-[#e03949] text-white text-xs font-bold font-mono shadow-[var(--shadow-accent)] border border-white/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? "Đang đồng bộ Firebase..." : "Lưu & Cập nhật"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
