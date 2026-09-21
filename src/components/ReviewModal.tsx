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
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <span>BÀI ĐÃ SỬA & NHẬN XÉT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-bold leading-snug break-words">
                {assignment.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShareResult}
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="Sao chép kết quả"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
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
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 text-slate-800">
          {/* Top Score Banner */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/50 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
              {/* Big Red Score Badge */}
              <div className="relative shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/30 border-2 border-white">
                <span className="text-xl sm:text-2xl font-black font-mono leading-none tracking-tight">
                  {graded.score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                  / {graded.maxScore} điểm
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {studentName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    +{assignment.tokensReward} Tokens
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-800 mt-0.5">
                  {graded.feedbackTitle}
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto flex flex-col justify-center sm:items-end gap-1.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-emerald-200/60 sm:border-l sm:border-emerald-200/60 sm:pl-4">
              <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] text-slate-500">Giáo viên chấm:</span>
                <span className="text-xs font-bold text-slate-900">Cô Nghi</span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  Đã nộp lúc:
                </span>
                <span className="font-semibold text-emerald-900">
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
            className="rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-amber-50/50 border border-amber-200/90 p-3.5 sm:p-4.5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"
                    alt="Cô Nghi"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 ring-2 ring-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Lời nhận xét của Cô Nghi
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Đánh giá chi tiết và dặn dò cho học sinh & phụ huynh
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/95 rounded-xl p-3.5 sm:p-4 border border-amber-200/80 shadow-xs text-slate-800 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
              <MessageSquareQuote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-800 italic">
                "{graded.voiceTranscript}"
              </p>
            </div>
          </div>

          {/* SLIDE HÌNH ẢNH SỬA BÀI TẠI LỚP & TAKE NOTE BÚT ĐỎ CỦA HỌC SINH */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs space-y-0">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-b border-amber-200/80 px-4 py-2.5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Bài sửa tại lớp
              </h4>
            </div>

            {/* Main Slide Carousel Viewer */}
            <div className="relative bg-slate-950 group">
              {/* Slide Image */}
              <div
                onClick={() => {
                  setLightboxZoom(1);
                  setIsLightboxOpen(true);
                }}
                className="relative w-full h-[320px] sm:h-[380px] bg-slate-950 flex items-center justify-center cursor-zoom-in overflow-hidden select-none"
              >
                <img
                  src={images[activeSlide]}
                  alt={`Trang ${activeSlide + 1}`}
                  className="w-full h-full object-contain transition-transform duration-200 hover:scale-[1.01]"
                />

                {/* Badges on the image */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-900/85 text-white backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                    <Camera className="w-3 h-3 text-amber-400" />
                    <span>Ảnh chụp bài làm tại lớp</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-600/90 text-white backdrop-blur-md px-2.5 py-1 rounded-full shadow-md">
                    <PenTool className="w-3 h-3" />
                    <span>Nét bút đỏ con take-note</span>
                  </span>
                </div>

                {/* Floating Click-to-Zoom Badge */}
                <div className="absolute bottom-3 right-3 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black/75 hover:bg-black/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/25 shadow-lg backdrop-blur-xs transition-all active:scale-90 cursor-pointer"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/25 shadow-lg backdrop-blur-xs transition-all active:scale-90 cursor-pointer"
                    title="Trang tiếp theo"
                    aria-label="Trang tiếp theo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {/* Dots / Page indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 z-10">
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
                          ? "bg-amber-400 w-5"
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
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Ghi chú bóc tách câu của Cô Nghi cho con:</span>
            </h4>

            <div className="space-y-2">
              {graded.corrections.map((corr, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-3.5 space-y-1.5 text-xs shadow-xs"
                >
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">
                    {corr.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Bài con đã chọn
                      </span>
                      <span className="font-semibold text-slate-800">
                        {corr.studentAnswer}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <span className="text-[10px] font-bold text-emerald-600 block uppercase">
                        Đáp án chuẩn Cô Nghi
                      </span>
                      <span className="font-bold text-emerald-700">
                        {corr.teacherCorrection}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 bg-amber-50/70 p-2 rounded-xl border border-amber-200/70 leading-relaxed">
                    💡 <strong className="text-amber-900">Mẹo của Cô Nghi:</strong> {corr.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer ml-auto"
          >
            Đã xem xong
          </button>
        </div>
      </div>
    </div>

    {/* FULLSCREEN LIGHTBOX MODAL TO ZOOM AND INSPECT DETAILED HANDWRITTEN RED NOTES */}
    {isLightboxOpen && (
      <div
        className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in duration-150"
        onClick={() => setIsLightboxOpen(false)}
      >
        {/* Lightbox Top Header */}
        <div
          className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 text-white shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-amber-400 shrink-0">
              Trang {activeSlide + 1} / {images.length}
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
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold w-12 text-center text-amber-300">
              {Math.round(lightboxZoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setLightboxZoom((z) => Math.min(3.0, z + 0.25))}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLightboxZoom(1)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Đặt lại kích thước 100%"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
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
                className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/30 shadow-xl transition-all active:scale-95 cursor-pointer"
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
                className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/30 shadow-xl transition-all active:scale-95 cursor-pointer"
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
