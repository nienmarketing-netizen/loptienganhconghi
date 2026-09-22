import React from "react";
import {
  X,
  FolderDown,
  FileText,
  Headphones,
  Video,
  Download,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Assignment, AssignmentMaterial } from "../types";

interface MaterialsListModalProps {
  assignment: Assignment;
  materials: AssignmentMaterial[];
  studentName: string;
  onClose: () => void;
  onSelectMaterial: (materialId: string) => void;
  onOpenFullPlayer: () => void;
  onDownloadPDF: (assignment: Assignment) => void;
}

export const MaterialsListModal: React.FC<MaterialsListModalProps> = ({
  assignment,
  materials,
  studentName,
  onClose,
  onSelectMaterial,
  onOpenFullPlayer,
  onDownloadPDF,
}) => {
  const handleDownload = (mat: AssignmentMaterial) => {
    if (mat.type === "pdf") {
      onDownloadPDF(assignment);
    } else {
      const link = document.createElement("a");
      link.href = mat.url;
      link.download = `${mat.title}.${mat.type === "mp3" ? "mp3" : "mp4"}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#e0e5ec] rounded-2xl sm:rounded-3xl shadow-[var(--shadow-floating)] border border-white/80 border-b-[#babecc] border-r-[#babecc] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Industrial Bevel Bar */}
        <div className="bg-[#2d3436] px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3 border-b border-white/20 relative">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
              <FolderDown className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#a3b1c6] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                <span>Tài liệu bài tập ({materials.length})</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-[-0.015em] leading-snug break-words">
                {assignment.title}
              </h3>
            </div>
          </div>
          <button
            id="btn-close-materials-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/10"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-[#1a1a1a]">
          {/* Info pill - Recessed Well */}
          <div className="text-xs bg-[#d1d9e6] border border-[#babecc]/60 p-3 sm:p-3.5 rounded-2xl shadow-[var(--shadow-recessed-sm)] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[#666666] block text-xs font-medium">Học sinh</span>
                <span className="font-bold text-[#1a1a1a] text-sm block break-words">
                  {studentName}
                </span>
              </div>
              <span className="self-start sm:self-center text-xs font-semibold px-2.5 py-1 rounded-md bg-[#e0e5ec] text-[#1a1a1a] border border-white/90 shadow-[var(--shadow-card-sm)] leading-tight">
                {assignment.unit}
              </span>
            </div>

            <div className="pt-2 border-t border-[#babecc]/50 flex items-center justify-between text-xs">
              <span className="text-[#666666] flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#ff4757] shrink-0" />
                Hạn chót nộp:
              </span>
              <span className="font-semibold text-[#ff4757]">
                {assignment.deadline}
              </span>
            </div>
          </div>

          {/* Teacher note card - Beveled card */}
          <div className="bg-[#e0e5ec] border border-white/90 border-b-[#babecc] border-r-[#babecc] rounded-2xl p-3.5 text-xs text-[#1a1a1a] shadow-[var(--shadow-card-sm)] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#ff4757] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#1a1a1a] block tracking-[-0.015em]">
                Hướng dẫn từ Cô Nghi:
              </span>
              <p className="text-[#666666] leading-relaxed text-xs font-normal">
                Các con mở tài liệu đính kèm bên dưới để chuẩn bị bài. Có thể xem video thị phạm hoặc nghe file audio nhiều lần trước khi làm bài tập nhé!
              </p>
            </div>
          </div>

          {/* List of materials */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs px-0.5">
              <span className="font-bold text-[#1a1a1a] tracking-[-0.015em]">Danh sách tài liệu ({materials.length})</span>
              <span className="text-[#666666] font-normal">chạm để xem / nghe</span>
            </div>

            {materials.map((mat) => {
              const isVideo = mat.type === "video";
              const isAudio = mat.type === "mp3";
              const isPdf = mat.type === "pdf";

              return (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-2xl border border-white/90 border-b-[#babecc] border-r-[#babecc] bg-[#e0e5ec] shadow-[var(--shadow-card-sm)] flex items-center justify-between gap-3"
                >
                  <button
                    type="button"
                    onClick={() => onSelectMaterial(mat.id)}
                    className="flex items-center gap-3 text-left min-w-0 flex-1 cursor-pointer group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[#ff4757]"
                    >
                      {isVideo && <Video className="w-5 h-5" />}
                      {isAudio && <Headphones className="w-5 h-5" />}
                      {isPdf && <FileText className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#d1d9e6] text-[#1a1a1a] border border-[#babecc]/60 leading-tight"
                        >
                          {isVideo ? "Video bài giảng" : isAudio ? "Audio MP3" : "Phiếu đề bài (PDF)"}
                        </span>
                        {mat.duration && (
                          <span className="text-xs text-[#666666] font-medium">
                            {mat.duration}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] truncate group-hover:text-[#ff4757] transition-colors">
                        {mat.title}
                      </h4>
                      <span className="text-xs text-[#666666] font-normal block mt-0.5">
                        Dung lượng: {mat.fileSize || "1.2 MB"}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectMaterial(mat.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#e0e5ec] hover:bg-[#d8e0ec] text-[#1a1a1a] text-xs font-semibold transition-all cursor-pointer border border-white/90 shadow-[var(--shadow-card-sm)] active:translate-y-[1px] flex items-center gap-1 leading-tight"
                    >
                      <span>{isVideo ? "Xem" : isAudio ? "Nghe" : "Mở"}</span>
                      <ExternalLink className="w-3 h-3 text-[#ff4757]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(mat)}
                      className="p-2 rounded-xl text-[#666666] hover:text-[#ff4757] bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] active:translate-y-[1px] transition-colors cursor-pointer"
                      title="Tải về máy"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer identical in style to UploadModal */}
        <div className="p-4 sm:p-5 bg-[#e0e5ec] border-t border-[#babecc]/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[#1a1a1a] bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] hover:bg-[#d8e0ec] font-semibold text-xs sm:text-sm transition-all active:translate-y-[1px] cursor-pointer leading-tight"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={onOpenFullPlayer}
            className="px-5 py-2.5 rounded-xl bg-[#ff4757] hover:bg-[#ff3344] text-white font-semibold text-xs sm:text-sm shadow-[var(--shadow-accent)] flex items-center gap-2 transition-all cursor-pointer active:translate-y-[1px] border border-white/30 leading-tight"
          >
            <FolderDown className="w-4 h-4" />
            <span>Mở toàn bộ trình phát</span>
          </button>
        </div>
      </div>
    </div>
  );
};
