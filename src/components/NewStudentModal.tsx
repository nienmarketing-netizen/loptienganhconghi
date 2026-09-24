import React, { useState } from "react";
import { X, UserPlus, Sparkles, Check, School, ShieldAlert, Gift } from "lucide-react";
import { StudentProfile, RadarCapabilityPoint } from "../types";
import { AVAILABLE_REWARDS } from "../data/mockStudents";

interface NewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: StudentProfile) => Promise<void>;
  existingSlugs: string[];
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingSlugs,
}) => {
  // Form state
  const [gradeNum, setGradeNum] = useState<string>("8");
  const [days, setDays] = useState<string>("T35");
  const [shift, setShift] = useState<string>("C1");
  const [seq, setSeq] = useState<string>("06");
  const [fullName, setFullName] = useState<string>("");
  const [parentSalutation, setParentSalutation] = useState<string>("");
  const [parentName, setParentName] = useState<string>("");
  const [school, setSchool] = useState<string>("THCS Trưng Vương");
  const [schoolClass, setSchoolClass] = useState<string>("8A2");
  const [targetRewardName, setTargetRewardName] = useState<string>(
    `${AVAILABLE_REWARDS[0].name} - ${AVAILABLE_REWARDS[0].tokensCost} Tokens`
  );
  const [baselineOverallScore, setBaselineOverallScore] = useState<number>(5.5);
  const [diagnosisTitle, setDiagnosisTitle] = useState<string>("Hổng cấu trúc câu, từ vựng thụ động");
  const [initialObservations, setInitialObservations] = useState<string>(
    "Con phản xạ nghe khá nhưng còn e ngại khi nói, chưa nắm chắc cách chia thì Quá khứ đơn."
  );

  // Radar 5 axes baseline
  const [radarGrammar, setRadarGrammar] = useState<number>(45);
  const [radarVocab, setRadarVocab] = useState<number>(50);
  const [radarListening, setRadarListening] = useState<number>(55);
  const [radarSpeaking, setRadarSpeaking] = useState<number>(40);
  const [radarAttitude, setRadarAttitude] = useState<number>(70);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!isOpen) return null;

  // Auto generated ID
  const studentId = `G${gradeNum}-${days}${shift}-${seq.padStart(2, "0")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên học sinh.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Generate unique slug from fullName
      const baseSlug = fullName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      let uniqueSlug = baseSlug || `hoc-sinh-${Date.now()}`;
      if (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${uniqueSlug}-${seq}`;
      }

      const salutation =
        parentSalutation.trim() ||
        `phụ huynh bé ${fullName.trim().split(" ").slice(-1)[0]}`;

      const radarCapabilities: RadarCapabilityPoint[] = [
        { subject: "Từ vựng", baseline: radarVocab, current: radarVocab + 5, fullMark: 100 },
        { subject: "Ngữ pháp", baseline: radarGrammar, current: radarGrammar + 5, fullMark: 100 },
        { subject: "Nghe hiểu", baseline: radarListening, current: radarListening + 5, fullMark: 100 },
        { subject: "Phát âm", baseline: radarSpeaking, current: radarSpeaking + 5, fullMark: 100 },
        { subject: "Thái độ", baseline: radarAttitude, current: radarAttitude, fullMark: 100 },
      ];

      const newStudent: StudentProfile = {
        id: studentId,
        slug: uniqueSlug,
        fullName: fullName.trim(),
        parentSalutation: salutation,
        parentName: parentName.trim() || "Phụ huynh",
        grade: `Lớp ${gradeNum} - ${schoolClass.trim() || "K" + gradeNum}`,
        school: school.trim() || "THCS",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${uniqueSlug}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        attitudeBadge: {
          label: "Mới nhập học",
          variant: "indigo",
        },
        gamification: {
          currentTokens: 5,
          maxTokens: 100,
          targetRewardName: targetRewardName.trim() || "Thẻ Đặc Quyền / Sổ Flashcard",
        },
        growthHistory: [
          {
            period: "Khảo sát đầu vào",
            classScore: baselineOverallScore,
            schoolScore: baselineOverallScore,
            note: "Mốc khảo sát ngày đầu vào lớp",
          },
        ],
        radarCapabilities,
        teacherDiagnosis: {
          admissionDate: new Date().toLocaleDateString("vi-VN"),
          baselineOverallScore,
          currentOverallScore: baselineOverallScore,
          diagnosisTitle: diagnosisTitle.trim(),
          initialObservations: initialObservations.trim(),
          breakthroughAction: "Củng cố bóc tách câu, luyện phát âm chuẩn IPA từng buổi.",
          messageToParents: `Chào ${salutation}, Cô Nghi đã hoàn tất khảo sát đầu vào cho con.`,
        },
        tokenHistory: [
          {
            id: `tk-${Date.now()}`,
            date: new Date().toLocaleDateString("vi-VN"),
            reason: "Kickstart Bonus (Thưởng đăng ký học)",
            tokens: 5,
            type: "earned",
            category: "bonus",
          },
        ],
        assignments: [
          {
            id: `asg-${Date.now()}`,
            title: "Bài tập 01: Ôn tập thì Hiện tại & Quá khứ đơn",
            unit: "Unit 01",
            deadline: "20:00 - Chủ nhật tuần này",
            status: "not_done",
            tokensReward: 10,
            pdfDownloadName: "Bai_Tap_Unit_01.pdf",
          },
        ],
        recentLesson: {
          date: new Date().toLocaleDateString("vi-VN"),
          lessonName: "Buổi 01: Nhập học & Khảo sát năng lực ban đầu",
          topic: "Diagnostic Test & Làm quen phương pháp bóc tách",
          score: {
            value: baselineOverallScore,
            maxScore: 10,
            label: "Điểm chẩn đoán đầu vào",
          },
          teacherFeedback: "Con có tinh thần học tập rất tốt, nắm bắt nhanh.",
          attendanceStatus: "Có mặt đúng giờ",
        },
      };

      await onSave(newStudent);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Đã xảy ra lỗi khi lưu vào Firebase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#e0e5ec] rounded-2xl shadow-[var(--shadow-floating)] border border-white/80 p-5 sm:p-6 my-auto text-[#1a1a1a]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#babecc]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff4757] text-white flex items-center justify-center shadow-[var(--shadow-accent-sm)]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3
                className="text-base sm:text-lg font-bold text-[#ff4757] !text-[#ff4757] tracking-tight"
                style={{ color: "#ff4757" }}
              >
                Thêm thông tin học sinh mới
              </h3>
              <p className="text-xs text-[#666666]">
                Khởi tạo hồ sơ, cấu trúc ca học và đánh giá chẩn đoán Baseline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg soft-ui-convex flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Section 1: Cấu trúc ca học & Mã học sinh */}
          <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-xl p-3.5 shadow-[var(--shadow-recessed-sm)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <span className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider font-mono">
                1. Cấu trúc Ca học & Mã học sinh
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#666666] sm:hidden font-medium">Mã học sinh:</span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-white/20 w-fit">
                  {studentId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-[#666666] font-medium mb-1">Khối lớp</label>
                <select
                  value={gradeNum}
                  onChange={(e) => setGradeNum(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] font-mono text-[#1a1a1a] text-xs font-semibold focus:outline-none"
                >
                  <option value="6">Khối 6 (G6)</option>
                  <option value="7">Khối 7 (G7)</option>
                  <option value="8">Khối 8 (G8)</option>
                  <option value="9">Khối 9 (G9)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#666666] font-medium mb-1">Lịch học</label>
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] font-mono text-[#1a1a1a] text-xs font-semibold focus:outline-none"
                >
                  <option value="T24">Thứ 2-4 (T24)</option>
                  <option value="T35">Thứ 3-5 (T35)</option>
                  <option value="T7C">Thứ 7-CN (T7C)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#666666] font-medium mb-1">Ca học</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] font-mono text-[#1a1a1a] text-xs font-semibold focus:outline-none"
                >
                  <option value="C1">Ca 1: 17h30 (C1)</option>
                  <option value="C2">Ca 2: 19h30 (C2)</option>
                  <option value="C3">Ca 3: 14h00 (C3)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#666666] font-medium mb-1">Số thứ tự (STT)</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={seq}
                  onChange={(e) => setSeq(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] font-mono text-[#1a1a1a] text-xs font-bold text-center focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin định danh học sinh & Phụ huynh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-[#1a1a1a] mb-1">Họ và tên học sinh *</label>
              <input
                type="text"
                required
                placeholder="VD: Nguyễn Hoàng Gia Bảo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] font-semibold text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:bg-[#e0e5ec]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1a1a1a] mb-1">Danh xưng phụ huynh</label>
              <input
                type="text"
                placeholder="VD: mẹ bé Gia Bảo hoặc ba bé Gia Bảo"
                value={parentSalutation}
                onChange={(e) => setParentSalutation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:bg-[#e0e5ec]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1a1a1a] mb-1">Họ tên phụ huynh</label>
              <input
                type="text"
                placeholder="VD: Chị Minh Trang"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:bg-[#e0e5ec]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#1a1a1a] mb-1">Trường học & Lớp chính khóa</label>
              <input
                type="text"
                placeholder="VD: THCS Trưng Vương - 8A1"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:bg-[#e0e5ec]"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="select-target-reward" className="font-medium text-[#1a1a1a] flex items-center gap-1.5 mb-1">
                <Gift className="w-3.5 h-3.5 text-[#ff4757]" />
                <span>Mục tiêu quà tặng tích lũy Tokens</span>
              </label>
              <div className="space-y-1.5">
                <select
                  id="select-target-reward"
                  value={targetRewardName}
                  onChange={(e) => setTargetRewardName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#d1d9e6] border border-[#babecc] text-[#1a1a1a] font-semibold text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] focus:outline-none focus:bg-[#e0e5ec] cursor-pointer"
                >
                  {AVAILABLE_REWARDS.map((rew) => (
                    <option key={rew.id} value={`${rew.name} - ${rew.tokensCost} Tokens`}>
                      {rew.name} - {rew.tokensCost} Tokens
                    </option>
                  ))}
                  <option value="Tùy chỉnh khác">✨ Nhập quà tặng tùy chỉnh khác...</option>
                </select>

                {(!AVAILABLE_REWARDS.some(
                  (r) => `${r.name} - ${r.tokensCost} Tokens` === targetRewardName
                ) || targetRewardName === "Tùy chỉnh khác") && (
                  <input
                    type="text"
                    placeholder="Nhập tên phần quà tùy chỉnh..."
                    value={targetRewardName === "Tùy chỉnh khác" ? "" : targetRewardName}
                    onChange={(e) => setTargetRewardName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] text-[#1a1a1a] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Đánh giá chẩn đoán đầu vào & 5 Trục năng lực (Baseline) */}
          <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-xl p-3.5 shadow-[var(--shadow-recessed-sm)] space-y-3">
            <span className="block text-xs font-bold text-[#1a1a1a] uppercase tracking-wider font-mono">
              2. Chẩn đoán Baseline đầu vào (Thang 10 & 5 Trục Radar)
            </span>

            {/* Mục Điểm khảo sát đưa xuống thành một hàng ngay phía trên Chẩn đoán nhanh của Cô */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5 p-2 rounded-lg bg-[#e0e5ec] border border-[#babecc]">
              <label htmlFor="input-baseline-overall-score" className="text-xs font-semibold text-[#1a1a1a]">
                Điểm khảo sát:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  id="input-baseline-overall-score"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={baselineOverallScore}
                  onChange={(e) => setBaselineOverallScore(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 rounded bg-white border border-[#babecc] font-mono text-center font-bold text-[#ff4757] text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)] focus:outline-none"
                />
                <span className="text-xs font-medium text-[#666666]">/ 10 điểm</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#666666] font-medium mb-1">Chẩn đoán nhanh của Cô</label>
              <input
                type="text"
                value={diagnosisTitle}
                onChange={(e) => setDiagnosisTitle(e.target.value)}
                placeholder="VD: Hổng cấu trúc câu, từ vựng thụ động"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] text-xs text-[#1a1a1a]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#666666] font-medium mb-1">Ghi chú quan sát chi tiết</label>
              <textarea
                rows={2}
                value={initialObservations}
                onChange={(e) => setInitialObservations(e.target.value)}
                placeholder="Ghi chú về phản xạ, điểm mạnh và lỗ hổng cần kèm..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] text-xs text-[#1a1a1a]"
              />
            </div>

            {/* 5 Trục Radar */}
            <div className="pt-2 border-t border-[#babecc]/50">
              <span className="block text-[11px] font-bold text-[#1a1a1a] mb-2 font-mono">
                5 Trục Năng lực Đầu vào (Thang 0 - 100):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
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
          </div>

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
              <span>{isSubmitting ? "Đang lưu..." : "Lưu thông tin"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
