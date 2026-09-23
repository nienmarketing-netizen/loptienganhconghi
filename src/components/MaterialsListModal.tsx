import React, { useState, useRef } from "react";
import {
  X,
  FolderDown,
  FileText,
  Headphones,
  Video,
  Download,
  Calendar,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { Assignment, AssignmentMaterial } from "../types";

interface MaterialsListModalProps {
  assignment: Assignment;
  materials: AssignmentMaterial[];
  studentName: string;
  onClose: () => void;
  onSelectMaterial?: (materialId: string) => void;
  onOpenFullPlayer?: () => void;
  onDownloadPDF: (assignment: Assignment) => void;
}

// Unified Material Download Button with pale white glow aura
const MaterialDownloadButton: React.FC<{
  label: string;
  onDownload: () => void;
}> = ({ label, onDownload }) => (
  <div className="relative group pt-1">
    {/* Pale white glow aura */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/30 via-white/60 to-white/30 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse pointer-events-none" />

    <button
      type="button"
      onClick={onDownload}
      className="relative w-full overflow-hidden flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4757] via-[#ff5263] to-[#ff4757] hover:from-[#e03949] hover:to-[#ff4757] text-white font-bold text-xs sm:text-sm border border-white/50 shadow-[0_0_18px_rgba(255,255,255,0.4),_0_4px_12px_rgba(0,0,0,0.15)] transition-all cursor-pointer active:translate-y-[1px]"
    >
      {/* Shimmer light sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
      <Download className="w-4 h-4 text-white drop-shadow shrink-0" />
      <span className="tracking-wide">{label}</span>
    </button>
  </div>
);

// Dedicated Audio Player View inside Dropdown
const AudioPlayerView: React.FC<{
  url: string;
  duration?: string;
  fileSize?: string;
  onDownload: () => void;
}> = ({ url, duration, fileSize, onDownload }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeText, setCurrentTimeText] = useState("0:00");
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(true));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setProgress((cur / dur) * 100);
    const m = Math.floor(cur / 60);
    const s = Math.floor(cur % 60);
    setCurrentTimeText(`${m}:${s < 10 ? "0" : ""}${s}`);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seek = parseFloat(e.target.value);
    const dur = audioRef.current.duration || 1;
    audioRef.current.currentTime = (seek / 100) * dur;
    setProgress(seek);
  };

  const handleRewind5s = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  };

  const handleChangeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="space-y-3">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
      />
      <div className="bg-[#1e2528] text-white rounded-lg sm:rounded-xl p-3.5 sm:p-4 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8)] border border-white/10 space-y-3 font-mono">
        {/* Timeline slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#2d3436] rounded-md appearance-none cursor-pointer accent-[#ff4757]"
          />
          <div className="flex items-center justify-between text-[11px] text-[#a3b1c6]">
            <span>{currentTimeText}</span>
            <span>{duration || "02:15"}</span>
          </div>
        </div>

        {/* Controls - Full width layout with expanded speed selector */}
        <div className="pt-1 w-full">
          <div className="flex items-center gap-2 w-full">
            {/* Lùi 5s */}
            <button
              type="button"
              onClick={handleRewind5s}
              className="py-2 px-3 rounded-lg bg-[#2d3436] hover:bg-[#3d4447] text-white border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs active:translate-y-[1px] shrink-0"
              title="Lùi 5s"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-semibold">-5s</span>
            </button>

            {/* Play/Pause: size reduced by 50% to compact square/icon button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Tạm dừng" : "Phát audio"}
              className="w-10 h-9 shrink-0 rounded-lg bg-[#ff4757] hover:bg-[#ff3344] text-white flex items-center justify-center shadow-[var(--shadow-accent)] border border-white/30 transition-all active:translate-y-[1px] cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 ml-0.5 fill-current" />
              )}
            </button>

            {/* Expanded speed selector taking the remaining width */}
            <div className="flex-1 grid grid-cols-3 gap-1 bg-[#2d3436] p-1 rounded-lg text-xs border border-white/10">
              {[0.8, 1.0, 1.2].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleChangeRate(rate)}
                  className={`py-1 rounded text-[11px] font-medium transition-colors cursor-pointer text-center ${
                    playbackRate === rate
                      ? "bg-[#ff4757] text-white font-bold shadow-xs"
                      : "text-[#a3b1c6] hover:text-white"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-lg p-3 text-xs text-[#666666] shadow-[var(--shadow-recessed-sm)] leading-relaxed">
        💡 <span className="font-bold text-[#ff4757]" style={{ color: "#ff4757" }}>Mẹo từ Cô Nghi:</span> Con nên nghe 2 - 3 lần ở tốc độ 0.8x để nắm chắc từng phụ âm đuôi (/s/, /z/, /ed/), sau đó tăng lên 1.0x để luyện phản xạ.
      </div>

      {/* Nút tải MP3 đồng bộ */}
      <MaterialDownloadButton
        label={`Tải file Audio MP3 - ${fileSize || "2.4 MB"}`}
        onDownload={onDownload}
      />
    </div>
  );
};

// Video Player View inside Dropdown
const VideoPlayerView: React.FC<{
  url: string;
  duration?: string;
  fileSize?: string;
  onDownload: () => void;
}> = ({ url, fileSize, onDownload }) => {
  return (
    <div className="space-y-3">
      <div className="relative rounded-lg overflow-hidden bg-[#1e2528] border-2 border-[#2d3436] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8)] aspect-video flex items-center justify-center">
        <video
          src={url}
          controls
          playsInline
          className="w-full h-full object-contain"
          poster="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80"
        >
          Trình duyệt không hỗ trợ phát video HTML5.
        </video>
      </div>

      <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-lg p-3 text-xs text-[#666666] shadow-[var(--shadow-recessed-sm)] leading-relaxed">
        💡 <span className="font-bold text-[#ff4757]" style={{ color: "#ff4757" }}>Lời dặn Cô Nghi:</span> Con xem kỹ khẩu hình miệng và bật âm đuôi trước khi quay video nộp bài nhé!
      </div>

      {/* Nút tải Video đồng bộ */}
      <MaterialDownloadButton
        label={`Tải video bài giảng - ${fileSize || "8.5 MB"}`}
        onDownload={onDownload}
      />
    </div>
  );
};

// PDF Worksheet View inside Dropdown
const PdfWorksheetView: React.FC<{
  fileSize?: string;
  onDownload: () => void;
}> = ({ fileSize, onDownload }) => {
  const displaySize = fileSize || "1.1 MB";

  return (
    <div className="space-y-3">
      {/* Khối dập chìm chứa toàn bộ text hướng dẫn làm bài, không còn khối dập nổi lồng bên trong */}
      <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-lg p-3 text-xs text-[#666666] shadow-[var(--shadow-recessed-sm)] leading-relaxed">
        📌 <span className="font-bold text-[#ff4757]" style={{ color: "#ff4757" }}>Hướng dẫn làm bài:</span> Ba mẹ in phiếu hoặc cho con chép câu trả lời vào vở Tiếng Anh. Sau khi làm xong, chụp lại ảnh trang vở gửi cô để được chấm điểm chi tiết.
      </div>

      {/* Nút tải Phiếu PDF đồng bộ */}
      <MaterialDownloadButton
        label={`Tải phiếu bài tập (PDF) - ${displaySize}`}
        onDownload={onDownload}
      />
    </div>
  );
};

export const MaterialsListModal: React.FC<MaterialsListModalProps> = ({
  assignment,
  materials,
  studentName,
  onClose,
  onDownloadPDF,
}) => {
  // All dropdowns are closed by default, only open when user clicks
  const [openMaterialId, setOpenMaterialId] = useState<string | null>(null);

  const toggleMaterial = (id: string) => {
    setOpenMaterialId((prev) => (prev === id ? null : id));
  };

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

  const getFormatLabel = (type: string) => {
    if (type === "video") return "Video bài giảng";
    if (type === "mp3") return "Audio MP3";
    return "Phiếu đề bài (PDF)";
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
        {/* Header - Industrial Bevel Bar */}
        <div className="bg-[#2d3436] px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3 border-b border-white/20 relative">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
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
            className="w-8 h-8 rounded-md bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/10"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-[#1a1a1a]">
          {/* Info pill - Recessed Well */}
          <div className="text-xs bg-[#d1d9e6] border border-[#babecc]/60 p-3 sm:p-3.5 rounded-lg sm:rounded-xl shadow-[var(--shadow-recessed-sm)] space-y-2">
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
          <div className="bg-[#e0e5ec] border border-white/90 border-b-[#babecc] border-r-[#babecc] rounded-lg sm:rounded-xl p-3.5 text-xs text-[#1a1a1a] shadow-[var(--shadow-card-sm)]">
            <div className="space-y-0.5">
              <span className="font-bold text-[#ff4757] block tracking-[-0.015em]" style={{ color: "#ff4757" }}>
                Hướng dẫn từ Cô Nghi:
              </span>
              <p className="text-[#666666] leading-relaxed text-xs font-normal">
                Các con bấm vào từng mục bên dưới để mở trình phát bài giảng, nghe audio luyện phát âm hoặc tải đề bài nhé!
              </p>
            </div>
          </div>

          {/* List of materials as Dropdowns / Accordions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-0.5">
              <span className="font-bold text-[#1a1a1a] tracking-[-0.015em]">
                Danh sách tài liệu ({materials.length})
              </span>
              <span className="text-[#666666] font-normal">chạm để mở trình phát</span>
            </div>

            {materials.map((mat) => {
              const isVideo = mat.type === "video";
              const isAudio = mat.type === "mp3";
              const isPdf = mat.type === "pdf";
              const isOpen = openMaterialId === mat.id;

              return (
                <div
                  key={mat.id}
                  className="rounded-lg sm:rounded-xl border border-white/90 border-b-[#babecc] border-r-[#babecc] bg-[#e0e5ec] shadow-[var(--shadow-card-sm)] overflow-hidden transition-all"
                >
                  {/* Dropdown Header: only format label and icon, no extra text */}
                  <button
                    type="button"
                    onClick={() => toggleMaterial(mat.id)}
                    className={`w-full p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors ${
                      isOpen ? "bg-[#dbe4ee]" : "hover:bg-[#d8e0ec]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[#ff4757]">
                        {isVideo && <Video className="w-5 h-5" />}
                        {isAudio && <Headphones className="w-5 h-5" />}
                        {isPdf && <FileText className="w-5 h-5" />}
                      </div>

                      {/* Only format label */}
                      <span className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-tight">
                        {getFormatLabel(mat.type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#ff4757]" : "text-[#666666]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Content: Integrated Audio/Video/PDF Player */}
                  {isOpen && (
                    <div className="p-3.5 sm:p-4 border-t border-[#babecc]/50 bg-[#e0e5ec] animate-in fade-in duration-150 space-y-3">
                      {/* Tiêu đề chủ đề của tài liệu */}
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3.5 rounded-full bg-[#ff4757] shrink-0" />
                        <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-tight leading-snug">
                          {mat.title}
                        </h4>
                      </div>

                      {isVideo && (
                        <VideoPlayerView
                          url={mat.url}
                          duration={mat.duration}
                          fileSize={mat.fileSize}
                          onDownload={() => handleDownload(mat)}
                        />
                      )}

                      {isAudio && (
                        <AudioPlayerView
                          url={mat.url}
                          duration={mat.duration}
                          fileSize={mat.fileSize}
                          onDownload={() => handleDownload(mat)}
                        />
                      )}

                      {isPdf && (
                        <PdfWorksheetView
                          fileSize={mat.fileSize}
                          onDownload={() => handleDownload(mat)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#e0e5ec] border-t border-[#babecc]/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-[#1a1a1a] bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] hover:bg-[#d8e0ec] font-semibold text-xs sm:text-sm transition-all active:translate-y-[1px] cursor-pointer leading-tight"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
