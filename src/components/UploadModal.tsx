import React, { useState, useRef, useEffect } from "react";
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
  Video,
  Mic,
  Music,
  FileText,
  Play,
} from "lucide-react";
import { Assignment } from "../types";
import { formatWithCorrectDayOfWeek } from "../lib/dateUtils";
import { useLockBodyScroll } from "../lib/useLockBodyScroll";

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

interface UploadedMediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "file";
  url: string;
  size?: string;
}

const SAMPLE_HOMEWORK_ITEMS: {
  name: string;
  type: "image" | "video" | "audio";
  url: string;
}[] = [
  {
    name: "Ảnh vở trang 1 (Bóc tách ngữ pháp)",
    type: "image",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Ảnh vở trang 2 (Phần viết câu)",
    type: "image",
    url: "https://images.unsplash.com/photo-1584697964190-7bb5dfa5dc62?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Video thuyết trình nói (Unit 3)",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-little-girl-doing-a-presentation-in-front-of-the-class-43484-large.mp4",
  },
  {
    name: "Audio phát âm ghi âm (MP3)",
    type: "audio",
    url: "https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg",
  },
];

// Helper to determine media type from URL string
const detectMediaType = (url: string): "image" | "video" | "audio" | "file" => {
  if (url.startsWith("data:video/") || url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm")) {
    return "video";
  }
  if (url.startsWith("data:audio/") || url.endsWith(".mp3") || url.endsWith(".ogg") || url.endsWith(".wav") || url.endsWith(".m4a")) {
    return "audio";
  }
  return "image";
};

export const UploadModal: React.FC<UploadModalProps> = ({
  assignment,
  studentName,
  onClose,
  onSubmit,
}) => {
  useLockBodyScroll(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>(() => {
    if (assignment.submissionImages && assignment.submissionImages.length > 0) {
      return assignment.submissionImages.map((url, idx) => ({
        id: `existing-${idx}`,
        name: `Tệp bài nộp ${idx + 1}`,
        type: detectMediaType(url),
        url,
      }));
    }
    return [];
  });

  const [note, setNote] = useState<string>(assignment.submissionNote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        let type: "image" | "video" | "audio" | "file" = "file";
        if (file.type.startsWith("image/")) type = "image";
        else if (file.type.startsWith("video/")) type = "video";
        else if (file.type.startsWith("audio/")) type = "audio";

        const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setMediaList((prev) => [
              ...prev,
              {
                id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                name: file.name,
                type,
                url: event.target!.result as string,
                size: sizeStr,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input value to allow selecting same file again if needed
    e.target.value = "";
  };

  const handleRemoveMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSample = (sample: typeof SAMPLE_HOMEWORK_ITEMS[0]) => {
    if (!mediaList.some((m) => m.url === sample.url)) {
      setMediaList((prev) => [
        ...prev,
        {
          id: `sample-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: sample.name,
          type: sample.type,
          url: sample.url,
          size: sample.type === "video" ? "8.5 MB" : sample.type === "audio" ? "2.4 MB" : "1.2 MB",
        },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaList.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        const urls = mediaList.map((m) => m.url);
        onSubmit(assignment.id, urls, note);
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
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                <span>
                  {assignment.status === "submitted"
                    ? "Bài đã nộp (Chờ cô chấm)"
                    : "Nộp bài tập về nhà (Ảnh / Video / Audio)"}
                </span>
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
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4">
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
                {formatWithCorrectDayOfWeek(assignment.deadline || "")}
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
                    ? formatWithCorrectDayOfWeek(assignment.submittedAt)
                    : "19:45 Chủ Nhật, 20/09/2026"}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons: Camera capture & Multi-format library picker */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Direct Camera / Camcorder for Photo or Video */}
            <input
              type="file"
              accept="image/*,video/*"
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
              <span className="font-semibold text-xs sm:text-sm leading-tight text-center">
                Chụp ảnh / Quay video
              </span>
              <span className="text-xs text-[#666666] font-normal">
                Mở camera trực tiếp
              </span>
            </button>

            {/* Gallery & File Upload for Images, Videos, Audios, Docs */}
            <input
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.mp3,.m4a,.wav,.mp4,.mov"
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
              <span className="font-semibold text-xs sm:text-sm leading-tight text-center">
                Chọn từ thư viện / Tệp
              </span>
              <span className="text-xs text-[#666666] font-normal">
                Ảnh, Video, Audio ghi âm
              </span>
            </button>
          </div>

          {/* Preview of Uploaded Media (Image, Video, Audio) */}
          {mediaList.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#1a1a1a]">
                <span className="font-semibold">
                  Đã chọn {mediaList.length} tệp bài nộp:
                </span>
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Định dạng hợp lệ
                </span>
              </div>

              <div className="space-y-2">
                {mediaList.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="relative rounded-lg overflow-hidden border border-white/80 border-b-[#babecc] border-r-[#babecc] bg-[#e0e5ec] p-2.5 shadow-[var(--shadow-card-sm)] flex items-center gap-3"
                  >
                    {/* Media Type Icon & Thumbnail */}
                    {item.type === "image" && (
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-[#1e2528] shrink-0 border border-white/60 relative">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-[#2d3436]/90 text-[9px] text-white text-center font-bold py-0.5">
                          ẢNH
                        </span>
                      </div>
                    )}

                    {item.type === "video" && (
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-[#1e2528] shrink-0 border border-white/60 flex flex-col items-center justify-center relative text-white">
                        <Video className="w-5 h-5 text-[#ff4757]" />
                        <span className="absolute bottom-0 inset-x-0 bg-[#2d3436]/90 text-[9px] text-white text-center font-bold py-0.5">
                          VIDEO
                        </span>
                      </div>
                    )}

                    {item.type === "audio" && (
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-[#1e2528] shrink-0 border border-white/60 flex flex-col items-center justify-center relative text-white">
                        <Mic className="w-5 h-5 text-[#ff4757]" />
                        <span className="absolute bottom-0 inset-x-0 bg-[#2d3436]/90 text-[9px] text-white text-center font-bold py-0.5">
                          AUDIO
                        </span>
                      </div>
                    )}

                    {item.type === "file" && (
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-[#1e2528] shrink-0 border border-white/60 flex flex-col items-center justify-center relative text-white">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <span className="absolute bottom-0 inset-x-0 bg-[#2d3436]/90 text-[9px] text-white text-center font-bold py-0.5">
                          TỆP
                        </span>
                      </div>
                    )}

                    {/* Media Details & Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#1a1a1a] truncate">
                          {item.name || `Tệp ${index + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#666666]">
                        <span className="capitalize font-medium">
                          {item.type === "image" && "Ảnh bài làm"}
                          {item.type === "video" && "Video clip"}
                          {item.type === "audio" && "Ghi âm MP3"}
                          {item.type === "file" && "Tệp đính kèm"}
                        </span>
                        {item.size && <span>• {item.size}</span>}
                      </div>

                      {/* In-line audio mini-player if audio */}
                      {item.type === "audio" && (
                        <div className="mt-1.5">
                          <audio
                            src={item.url}
                            controls
                            className="w-full h-7 rounded"
                          />
                        </div>
                      )}

                      {/* In-line video mini-player if video */}
                      {item.type === "video" && (
                        <div className="mt-1.5">
                          <video
                            src={item.url}
                            controls
                            playsInline
                            className="w-full max-h-28 rounded bg-black"
                          />
                        </div>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="w-8 h-8 rounded-md bg-[#e0e5ec] hover:bg-[#ff4757] text-[#666666] hover:text-white flex items-center justify-center border border-white/80 shadow-[var(--shadow-card-sm)] transition-all cursor-pointer shrink-0"
                      title="Xóa tệp này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-[#babecc]/60 rounded-lg sm:rounded-xl p-4 text-center text-[#666666] text-xs bg-[#d1d9e6] shadow-[var(--shadow-recessed-sm)] leading-relaxed">
              <AlertCircle className="w-6 h-6 mx-auto mb-1 text-[#ff4757]" />
              Chưa có tệp bài tập nào được chọn. Ba mẹ hoặc con có thể chụp ảnh vở bài tập, quay video thuyết trình, tải file audio ghi âm hoặc chọn tệp mẫu phía trên.
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
              placeholder="VD: Con đã hoàn thành bài tập, có gửi kèm video luyện nói và ảnh chụp vở. Nhờ Cô Nghi xem kỹ giúp con phát âm đuôi..."
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
            disabled={mediaList.length === 0 || isSubmitting || submittedSuccess}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-md sm:rounded-lg text-white font-semibold text-xs sm:text-sm transition-all border border-white/30 leading-tight ${
              mediaList.length === 0 || isSubmitting || submittedSuccess
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
                <span>
                  Nộp bài ngay ({mediaList.length} tệp)
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
