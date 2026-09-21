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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 sm:px-5 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100 block">
                {assignment.status === "submitted" ? "Bài đã nộp (Chờ cô chấm)" : "Nộp bài tập về nhà"}
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-bold leading-snug break-words">
                {assignment.title}
              </h3>
            </div>
          </div>
          <button
            id="btn-close-upload-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Info pill */}
          <div className="text-xs bg-slate-50 border border-slate-200/80 p-3 sm:p-3.5 rounded-2xl space-y-2">
            <div>
              <span className="text-slate-500 block text-[11px]">Học sinh</span>
              <span className="font-bold text-slate-900 text-sm block break-words">
                {studentName}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                Hạn chót nộp:
              </span>
              <span className="font-semibold text-amber-700">
                {assignment.deadline?.replace(/(\b\d{1,2}\/\d{1,2})\b(?!\/\d{2,4})/g, "$1/2026")}
              </span>
            </div>

            {(assignment.status === "submitted" || !!assignment.submittedAt) && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                  Đã nộp lúc:
                </span>
                <span className="font-semibold text-emerald-900">
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
              className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border-2 border-dashed border-amber-300 text-amber-900 transition-all cursor-pointer group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs sm:text-sm">Chụp ảnh ngay</span>
              <span className="text-[10px] text-amber-700">Dùng máy ảnh điện thoại</span>
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
              className="flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border-2 border-dashed border-indigo-300 text-indigo-900 transition-all cursor-pointer group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs sm:text-sm">Chọn từ thư viện</span>
              <span className="text-[10px] text-indigo-700">Tải ảnh bài tập có sẵn</span>
            </button>
          </div>

          {/* Quick Mock Presets for fast testing in preview */}
          <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Ảnh mẫu chụp vở mẫu (Test nhanh)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_HOMEWORK_PHOTOS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSample(item.url)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-[11px] font-medium text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
                >
                  <FileImage className="w-3.5 h-3.5 text-amber-600" />
                  <span>+ {item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview of Uploaded Images */}
          {images.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold">
                  Đã chọn {images.length} trang ảnh bài tập:
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ảnh rõ nét
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {images.map((imgSrc, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border-2 border-amber-300 bg-slate-100 aspect-3/4 shadow-xs"
                  >
                    <img
                      src={imgSrc}
                      alt={`Bài tập trang ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Trang {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl p-4 text-center text-slate-400 text-xs bg-slate-50/50">
              <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
              Chưa có ảnh nào được tải lên. Ba mẹ hãy bấm chụp ảnh hoặc chọn ảnh mẫu phía trên.
            </div>
          )}

          {/* Note to Teacher */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
              <span>Lời nhắn kèm của con hoặc phụ huynh (tùy chọn):</span>
              <span className="text-[11px] font-normal text-slate-400">Tối đa 200 từ</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Con đã làm xong bài và kiểm tra lại từ vựng. Nhờ Cô Nghi xem kỹ giúp con câu 5 và câu 8..."
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-slate-800 placeholder-slate-400 resize-none bg-slate-50/50"
            />
          </div>

          {/* Success state banner if submitted */}
          {submittedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">Nộp bài thành công!</span>
                Cô Nghi đã nhận được bài tập và sẽ chấm điểm sớm nhất cho con.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-200/70 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Đóng lại
          </button>

          <button
            type="button"
            id="btn-confirm-submit-assignment"
            onClick={handleSubmit}
            disabled={images.length === 0 || isSubmitting || submittedSuccess}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-all ${
              images.length === 0 || isSubmitting || submittedSuccess
                ? "bg-slate-300 cursor-not-allowed text-slate-500"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] shadow-amber-500/25 cursor-pointer"
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
