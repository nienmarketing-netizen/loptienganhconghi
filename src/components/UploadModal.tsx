import React, { useState, useRef } from "react";
import {
  X,
  Camera,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  AlertCircle,
  FileImage,
  Send,
  Clock,
  Calendar,
} from "lucide-react";
import { Assignment } from "../types";

interface UploadModalProps {
  assignment: Assignment;
  studentName: string;
  onClose: () => void;
  onSubmit: (
    assignmentId: string,
    uploadedImages: string[],
    note: string
  ) => void;
}

const SAMPLE_HOMEWORK_PHOTOS = [
  {
    name: "Ảnh chụp trang 1 (Bài tập bóc tách)",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Ảnh chụp trang 2 (Phần viết câu)",
    url: "https://images.unsplash.com/photo-1584697964190-7bb5dfa5dc62?w=800&auto=format&fit=crop&q=80",
  },
];

export const UploadModal: React.FC<UploadModalProps> = ({
  assignment,
  studentName,
  onClose,
  onSubmit,
}) => {
  const [images, setImages] = useState<string[]>(
    assignment.submissionImages && assignment.submissionImages.length > 0
      ? assignment.submissionImages
      : []
  );
  const [note, setNote] = useState<string>(assignment.submissionNote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSample = (url: string) => {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        onSubmit(assignment.id, images, note);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#e0e5ec] rounded-lg sm:rounded-xl shadow-[var(--shadow-floating)] border border-white/80 border-b-[#babecc] border-r-[#babecc] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Bevel Bar */}
        <div className="bg-[#2d3436] px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3 border-b border-white/20 relative">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                <span>{assignment.status === "submitted" ? "Bài đã nộp (Chờ cô chấm)" : "Nộp bài tập về nhà"}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold !text-white tracking-[-0.015em] leading-snug break-words">
                {assignment.title}
              </h3>
            </div>
          </div>
          <button
            id="btn-close-upload-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-[#1e2528] hover:bg-[#ff4757] text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/10"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Info pill - Recessed Well */}
          <div className="text-xs bg-[#d1d9e6] border border-[#babecc]/60 p-3 sm:p-3.5 rounded-lg sm:rounded-xl shadow-[var(--shadow-recessed-sm)] space-y-2">
            <div>
              <span className="text-[#666666] block text-xs font-medium">Học sinh</span>
              <span className="font-bold text-[#1a1a1a] text-sm block break-words mt-0.5">
                {studentName}
              </span>
            </div>

            <div className="pt-2 border-t border-[#babecc]/50 flex items-center justify-between text-xs">
              <span className="text-[#666666] flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#ff4757] shrink-0" />
                Hạn chót nộp:
              </span>
              <span className="font-semibold text-[#ff4757]">
                {assignment.deadline?.replace(/(\b\d{1,2}\/\d{1,2})\b(?!\/\d{2,4})/g, "$1/2026")}
              </span>
            </div>

            {(assignment.status === "submitted" || !!assignment.submittedAt) && (
              <div className="pt-2 border-t border-[#babecc]/50 flex items-center justify-between text-xs">
                <span className="text-[#666666] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Đã nộp lúc:
                </span>
                <span className="font-semibold text-emerald-800">
                  {assignment.submittedAt
                    ? assignment.submittedAt.replace(/(\b\d{1,2}\/\d{1,2})\b(?!\/\d{2,4})/g, "$1/2026")
                    : "19:45 Thứ Sáu, 20/09/2026"}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons to trigger Camera or File Picker */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Direct Camera Input for Mobile */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="camera-upload-input"
            />
            <button
              type="button"
              id="btn-take-photo"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-lg sm:rounded-xl bg-[#e0e5ec] hover:bg-[#d8e0ec] border border-white/90 border-b-[#babecc] border-r-[#babecc] text-[#1a1a1a] shadow-[var(--shadow-card-sm)] transition-all cursor-pointer group active:translate-y-[1px]"
            >
              <div className="w-10 h-10 rounded-lg bg-[#ff4757] text-white flex items-center justify-center shadow-[var(--shadow-accent-sm)]">
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs sm:text-sm leading-tight">Chụp ảnh ngay</span>
              <span className="text-xs text-[#666666] font-normal">Dùng máy ảnh</span>
            </button>

            {/* Gallery Upload Input */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
            />
            <button
              type="button"
              id="btn-choose-from-gallery"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-lg sm:rounded-xl bg-[#e0e5ec] hover:bg-[#d8e0ec] border border-white/90 border-b-[#babecc] border-r-[#babecc] text-[#1a1a1a] shadow-[var(--shadow-card-sm)] transition-all cursor-pointer group active:translate-y-[1px]"
            >
              <div className="w-10 h-10 rounded-lg bg-[#2d3436] text-white flex items-center justify-center shadow-[var(--shadow-card-sm)]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xs sm:text-sm leading-tight">Chọn từ thư viện</span>
              <span className="text-xs text-[#666666] font-normal">Tải ảnh bài tập</span>
            </button>
          </div>

          {/* Quick Mock Presets for fast testing in preview */}
          <div className="bg-[#d1d9e6] border border-[#babecc]/60 p-3 rounded-lg sm:rounded-xl shadow-[var(--shadow-recessed-sm)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#666666] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4757]" />
                Ảnh mẫu chụp vở mẫu (Test nhanh)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_HOMEWORK_PHOTOS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSample(item.url)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md sm:rounded-lg bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] text-xs font-semibold text-[#1a1a1a] hover:text-[#ff4757] transition-colors cursor-pointer active:translate-y-[1px] leading-tight"
                >
                  <FileImage className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>+ {item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview of Uploaded Images */}
          {images.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#1a1a1a]">
                <span className="font-semibold">
                  Đã chọn {images.length} trang ảnh bài tập:
                </span>
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ảnh rõ nét
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {images.map((imgSrc, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden border border-white/80 border-b-[#babecc] border-r-[#babecc] bg-[#1e2528] aspect-3/4 shadow-[var(--shadow-card-sm)]"
                  >
                    <img
                      src={imgSrc}
                      alt={`Bài tập trang ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#2d3436]/90 text-white text-xs font-semibold px-2 py-0.5 rounded border border-white/20">
                      Trang {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-[#ff4757] text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-[#babecc]/60 rounded-lg sm:rounded-xl p-4 text-center text-[#666666] text-xs bg-[#d1d9e6] shadow-[var(--shadow-recessed-sm)] leading-relaxed">
              <AlertCircle className="w-6 h-6 mx-auto mb-1 text-[#ff4757]" />
              Chưa có ảnh nào được tải lên. Ba mẹ hãy bấm chụp ảnh hoặc chọn ảnh mẫu phía trên.
            </div>
          )}

          {/* Note to Teacher */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
              <span>Lời nhắn kèm của con hoặc phụ huynh (tùy chọn):</span>
              <span className="text-xs font-normal text-[#666666]">Tối đa 200 từ</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Con đã làm xong bài và kiểm tra lại từ vựng. Nhờ Cô Nghi xem kỹ giúp con câu 5 và câu 8..."
              className="w-full text-xs sm:text-sm p-3 rounded-lg sm:rounded-xl border border-[#babecc] shadow-[var(--shadow-recessed-sm)] focus:outline-none focus:border-[#ff4757] text-[#1a1a1a] placeholder-[#888888] resize-none bg-[#d1d9e6]"
            />
          </div>

          {/* Success state banner if submitted */}
          {submittedSuccess && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-950 p-3 rounded-lg sm:rounded-xl flex items-center gap-2.5 animate-in fade-in duration-150 shadow-[inset_1px_1px_2px_#ffffff]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block">Nộp bài thành công!</span>
                Cô Nghi đã nhận được bài tập và sẽ chấm điểm sớm nhất cho con.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#e0e5ec] border-t border-[#babecc]/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-md sm:rounded-lg text-[#1a1a1a] bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] hover:bg-[#d8e0ec] font-semibold text-xs sm:text-sm transition-all active:translate-y-[1px] cursor-pointer leading-tight"
          >
            Đóng lại
          </button>

          <button
            type="button"
            id="btn-confirm-submit-assignment"
            onClick={handleSubmit}
            disabled={images.length === 0 || isSubmitting || submittedSuccess}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-md sm:rounded-lg text-white font-semibold text-xs sm:text-sm transition-all border border-white/30 leading-tight ${
              images.length === 0 || isSubmitting || submittedSuccess
                ? "bg-[#babecc] cursor-not-allowed text-[#666666]"
                : "bg-[#ff4757] hover:bg-[#ff3344] active:translate-y-[1px] shadow-[var(--shadow-accent)] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <span>Đang tải lên bài tập...</span>
            ) : submittedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã nộp bài</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Nộp bài ngay cho Cô Nghi ({images.length} ảnh)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
