import React, { useState } from "react";
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Sparkles,
  Share2,
  Check,
  Clock,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
  Camera,
  PenTool,
  RotateCcw,
} from "lucide-react";
import { Assignment } from "../types";

interface ReviewModalProps {
  assignment: Assignment;
  studentName: string;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  assignment,
  studentName,
  onClose,
}) => {
  const graded = assignment.gradedDetails;

  const images =
    graded?.gradedImages && graded.gradedImages.length > 0
      ? graded.gradedImages
      : graded?.gradedImage
      ? [graded.gradedImage]
      : [];

  const captions =
    graded?.gradedImageCaptions && graded.gradedImageCaptions.length > 0
      ? graded.gradedImageCaptions
      : [
          "Trang 1: Bóc tách bài làm & con take note bút đỏ tại lớp",
          "Trang 2: Cô chữa bẫy ngữ pháp & ghi chú quy tắc",
          "Trang 3: Tổng kết điểm số & chữ ký Cô Nghi",
        ];

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareResult = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!graded) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      >
      <div
        className="relative w-full max-w-2xl bg-[#e0e5ec] rounded-2xl sm:rounded-3xl shadow-[var(--shadow-floating)] border border-white/80 border-b-[#babecc] border-r-[#babecc] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#2d3436] px-4 sm:px-6 py-3.5 text-white flex items-center justify-between gap-3 border-b border-white/20 relative">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <span>Bài đã sửa & nhận xét</span>
                <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
              </span>
              <h3 className="text-sm sm:text-base font-bold !text-white tracking-[-0.015em] leading-snug break-words">
                {assignment.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShareResult}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-[#1e2528] hover:bg-[#3d4447] text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors cursor-pointer leading-tight"
              title="Sao chép kết quả"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-white" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>
            <button
              id="btn-close-review-modal"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#1e2528] hover:bg-[#ff4757] flex items-center justify-center text-[#a3b1c6] hover:text-white transition-colors cursor-pointer border border-white/10"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 text-[#1a1a1a]">
          {/* Top Score Banner - Recessed Well */}
          <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[var(--shadow-recessed-sm)]">
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              {/* Big Red Score Badge */}
              <div className="relative shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)] border border-white/30">
                <span className="text-xl sm:text-2xl font-bold font-mono leading-none tracking-tight">
                  {graded.score}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider opacity-90">
                  / {graded.maxScore} điểm
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
                    {studentName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 leading-tight">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    +{assignment.tokensReward} Tokens
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#ff4757] mt-0.5">
                  {graded.feedbackTitle}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto flex flex-col justify-center sm:items-end gap-1.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[#babecc]/50 sm:border-l sm:border-[#babecc]/50 sm:pl-4">
              <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
                <span className="text-[#666666] font-medium">Giáo viên:</span>
                <span className="font-semibold text-[#1a1a1a]">Cô Nghi</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
                <span className="text-[#666666] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#ff4757]" />
                  Đã nộp lúc:
                </span>
                <span className="font-semibold text-[#1a1a1a]">
                  {assignment.submittedAt
                    ? assignment.submittedAt.replace(/(\b\d{1,2}\/\d{1,2})\b(?!\/\d{2,4})/g, "$1/2026")
                    : "19:15 Chủ Nhật, 15/09/2026"}
                </span>
              </div>
            </div>
          </div>

          {/* LỜI NHẬN XÉT CỦA CÔ */}
          <div
            id="teacher-written-feedback-card"
            className="rounded-2xl bg-[#e0e5ec] border border-white/90 border-b-[#babecc] border-r-[#babecc] p-3.5 sm:p-4.5 shadow-[var(--shadow-card-sm)] space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"
                    alt="Cô Nghi"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ff4757]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#ff4757] text-white rounded-full p-0.5 ring-2 ring-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-[-0.015em]">
                    Lời nhận xét của Cô Nghi
                  </h4>
                  <p className="text-xs text-[#666666] font-normal mt-0.5">
                    Đánh giá chi tiết và dặn dò cho học sinh & phụ huynh
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#d1d9e6] rounded-xl p-3.5 sm:p-4 border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[#1a1a1a] text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
              <MessageSquareQuote className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" />
              <p className="font-normal text-[#1a1a1a] italic leading-relaxed">
                "{graded.voiceTranscript}"
              </p>
            </div>
          </div>

          {/* SLIDE HÌNH ẢNH SỬA BÀI TẠI LỚP & TAKE NOTE BÚT ĐỎ CỦA HỌC SINH */}
          <div className="border border-white/80 border-b-[#babecc] border-r-[#babecc] rounded-2xl overflow-hidden bg-[#e0e5ec] shadow-[var(--shadow-card-sm)] space-y-0">
            {/* Header banner */}
            <div className="bg-[#d1d9e6] border-b border-[#babecc]/60 px-4 py-2.5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#e0e5ec] text-[#ff4757] border border-white/90 flex items-center justify-center shrink-0 shadow-xs">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-[-0.015em]">
                Bài sửa tại lớp
              </h4>
            </div>

            {/* Main Slide Carousel Viewer - Bright, Clean & Clear */}
            <div className="relative bg-slate-100 group border-y border-[#c8d3e2]/60">
              {/* Slide Image */}
              <div
                onClick={() => {
                  setLightboxZoom(1);
                  setIsLightboxOpen(true);
                }}
                className="relative w-full h-[320px] sm:h-[380px] bg-slate-50 flex items-center justify-center cursor-zoom-in overflow-hidden select-none p-2"
              >
                <img
                  src={images[activeSlide]}
                  alt={`Trang ${activeSlide + 1}`}
                  className="w-full h-full object-contain transition-transform duration-200 hover:scale-[1.01]"
                />

                {/* Badges on the image */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-white/95 text-[#1a1a1a] backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 shadow-sm leading-tight">
                    <Camera className="w-3.5 h-3.5 text-[#ff4757]" />
                    <span>Ảnh chụp bài làm tại lớp</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#ff4757] text-white px-2.5 py-1 rounded-md shadow-sm leading-tight">
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Nét bút đỏ con take-note</span>
                  </span>
                </div>

                {/* Floating Click-to-Zoom Badge */}
                <div className="absolute bottom-3 right-3 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/95 text-[#1a1a1a] backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-md leading-tight">
                    <Maximize2 className="w-3.5 h-3.5 text-[#ff4757]" />
                    <span>Bấm vào ảnh để phóng to</span>
                  </span>
                </div>
              </div>

              {/* Prev & Next Slide Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/90 hover:bg-[#ff4757] text-[#1e293b] hover:text-white flex items-center justify-center border border-slate-200 shadow-md transition-all active:scale-90 cursor-pointer"
                    title="Trang trước"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/90 hover:bg-[#ff4757] text-[#1e293b] hover:text-white flex items-center justify-center border border-slate-200 shadow-md transition-all active:scale-90 cursor-pointer"
                    title="Trang tiếp theo"
                    aria-label="Trang tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {/* Dots / Page indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-sm z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeSlide
                          ? "bg-[#ff4757] w-5"
                          : "bg-white/40 hover:bg-white/75 w-2"
                      }`}
                      aria-label={`Trang ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chi tiết câu hỏi cần chữa (Correction Details list) */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#ff4757]" />
              <span>Ghi chú bóc tách câu của Cô Nghi cho con:</span>
            </h4>

            <div className="space-y-2">
              {graded.corrections.map((corr, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/80 border-b-[#babecc] border-r-[#babecc] bg-[#e0e5ec] p-3 sm:p-3.5 space-y-2 text-xs shadow-[var(--shadow-card-sm)]"
                >
                  <p className="font-semibold text-[#1a1a1a] text-xs sm:text-sm">
                    {corr.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[#666666]">
                      <span className="text-xs font-medium text-[#666666] block">
                        Bài con đã chọn
                      </span>
                      <span className="font-semibold text-[#1a1a1a] mt-0.5 block">
                        {corr.studentAnswer}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-emerald-900">
                      <span className="text-xs font-medium text-emerald-700 block">
                        Đáp án chuẩn Cô Nghi
                      </span>
                      <span className="font-semibold text-emerald-800 mt-0.5 block">
                        {corr.teacherCorrection}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#1a1a1a] bg-[#d1d9e6] p-2.5 rounded-xl border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] leading-relaxed">
                    💡 <strong className="text-[#ff4757] font-semibold">Mẹo của Cô Nghi:</strong> {corr.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#e0e5ec] border-t border-[#babecc]/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#ff4757] hover:bg-[#ff3344] text-white font-semibold text-xs sm:text-sm transition-all shadow-[var(--shadow-accent)] active:translate-y-[1px] cursor-pointer ml-auto border border-white/30 leading-tight"
          >
            Đã xem xong
          </button>
        </div>
      </div>
    </div>

    {/* FULLSCREEN LIGHTBOX MODAL TO ZOOM AND INSPECT DETAILED HANDWRITTEN RED NOTES */}
    {isLightboxOpen && (
      <div
        className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex flex-col animate-in fade-in duration-150"
        onClick={() => setIsLightboxOpen(false)}
      >
        {/* Lightbox Top Header - Industrial Bevel */}
        <div
          className="p-3 sm:p-4 bg-[#2d3436] border-b border-white/10 flex items-center justify-between gap-3 text-white shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#ff4757] bg-[#1e2528] px-2.5 py-1 rounded-md border border-white/10 shrink-0">
              TRANG {activeSlide + 1} / {images.length}
            </span>
            <span className="text-slate-500 shrink-0">•</span>
            <p className="text-xs sm:text-sm text-slate-200 truncate">
              {captions[activeSlide] || "Xem chi tiết nét bút đỏ con ghi chú tại lớp"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setLightboxZoom((z) => Math.max(0.6, z - 0.25))}
              className="p-2 rounded-lg bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white transition-colors cursor-pointer border border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold w-12 text-center text-white">
              {Math.round(lightboxZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setLightboxZoom((z) => Math.min(3.0, z + 0.25))}
              className="p-2 rounded-lg bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white transition-colors cursor-pointer border border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLightboxZoom(1)}
              className="p-2 rounded-lg bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white transition-colors cursor-pointer border border-white/10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]"
              title="Đặt lại kích thước 100%"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-white/20 mx-1" />

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-lg bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white transition-colors cursor-pointer border border-white/10"
              title="Đóng xem chi tiết"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lightbox Body with Zoomable Image */}
        <div
          className="flex-1 overflow-auto flex items-center justify-center p-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Prev / Next buttons inside lightbox */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => {
                  setActiveSlide((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  setLightboxZoom(1);
                }}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-[#2d3436]/90 hover:bg-[#ff4757] text-white flex items-center justify-center border border-white/20 shadow-[var(--shadow-floating)] transition-all active:translate-y-[1px] cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveSlide((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  setLightboxZoom(1);
                }}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-[#2d3436]/90 hover:bg-[#ff4757] text-white flex items-center justify-center border border-white/20 shadow-[var(--shadow-floating)] transition-all active:translate-y-[1px] cursor-pointer"
                title="Trang tiếp theo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            style={{
              transform: `scale(${lightboxZoom})`,
              transformOrigin: "center center",
              transition: "transform 0.15s ease-out",
            }}
            className="max-w-full max-h-full flex items-center justify-center select-none"
          >
            <img
              src={images[activeSlide]}
              alt={`Phóng to trang ${activeSlide + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>

        {/* Lightbox Footer Instruction */}
        <div
          className="p-3 bg-slate-900/90 border-t border-slate-800 text-center text-xs text-slate-400 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <p>
            💡 <span className="text-amber-300 font-semibold">Ghi chú tại lớp:</span> Phụ huynh có thể phóng to ảnh để đọc rõ từng nét bút đỏ con take-note công thức và bài sửa trực tiếp của Cô Nghi.
          </p>
        </div>
      </div>
    )}
  </>
  );
};
