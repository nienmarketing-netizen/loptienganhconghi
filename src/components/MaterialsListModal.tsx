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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Matching UploadModal layout and style with indigo theme */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 px-4 sm:px-5 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <FolderDown className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block">
                Tài liệu bài tập ({materials.length})
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-bold leading-snug break-words">
                {assignment.title}
              </h3>
            </div>
          </div>
          <button
            id="btn-close-materials-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Info pill identical to UploadModal */}
          <div className="text-xs bg-slate-50 border border-slate-200/80 p-3 sm:p-3.5 rounded-2xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-500 block text-[11px]">Học sinh</span>
                <span className="font-bold text-slate-900 text-sm block break-words">
                  {studentName}
                </span>
              </div>
              <span className="self-start sm:self-center text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                {assignment.unit}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                Hạn chót nộp:
              </span>
              <span className="font-bold text-slate-800">
                {assignment.deadline}
              </span>
            </div>
          </div>

          {/* Teacher note card */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 text-xs text-indigo-950 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block text-indigo-900">
                Hướng dẫn từ Cô Nghi:
              </span>
              <p className="text-indigo-800/90 leading-relaxed text-[11px] sm:text-xs">
                Các con mở tài liệu đính kèm bên dưới để chuẩn bị bài. Có thể xem video thị phạm hoặc nghe file audio nhiều lần trước khi làm bài tập nhé!
              </p>
            </div>
          </div>

          {/* List of materials */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 px-0.5">
              <span>Danh sách tài liệu ({materials.length})</span>
              <span className="text-[10px] text-slate-400 font-medium lowercase">chạm để xem / nghe</span>
            </div>

            {materials.map((mat) => {
              const isVideo = mat.type === "video";
              const isAudio = mat.type === "mp3";
              const isPdf = mat.type === "pdf";

              return (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all flex items-center justify-between gap-3"
                >
                  <button
                    type="button"
                    onClick={() => onSelectMaterial(mat.id)}
                    className="flex items-center gap-3 text-left min-w-0 flex-1 cursor-pointer group"
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isVideo
                          ? "bg-sky-100 text-sky-700"
                          : isAudio
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {isVideo && <Video className="w-5 h-5" />}
                      {isAudio && <Headphones className="w-5 h-5" />}
                      {isPdf && <FileText className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isVideo
                              ? "bg-sky-100 text-sky-800"
                              : isAudio
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {isVideo ? "Video bài giảng" : isAudio ? "Audio MP3" : "Phiếu đề bài (PDF)"}
                        </span>
                        {mat.duration && (
                          <span className="text-[11px] text-slate-500 font-semibold">
                            {mat.duration}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {mat.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Dung lượng: {mat.fileSize || "1.2 MB"}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onSelectMaterial(mat.id)}
                      className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer border border-indigo-200/80 active:scale-95 flex items-center gap-1"
                    >
                      <span>{isVideo ? "Xem" : isAudio ? "Nghe" : "Mở"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(mat)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
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
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={onOpenFullPlayer}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <FolderDown className="w-4 h-4" />
            <span>Mở toàn bộ trình phát</span>
          </button>
        </div>
      </div>
    </div>
  );
};
