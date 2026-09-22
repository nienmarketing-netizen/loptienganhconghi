import React, { useState, useRef, useEffect } from "react";
import {
  X,
  FileText,
  Headphones,
  Video,
  Play,
  Pause,
  RotateCcw,
  Download,
  Check,
  ExternalLink,
  Volume2,
  Sparkles,
  Printer,
  FileCheck,
  Clock,
  HardDrive,
  Info,
} from "lucide-react";
import { Assignment, AssignmentMaterial } from "../types";

interface MaterialPreviewModalProps {
  assignment: Assignment;
  materials: AssignmentMaterial[];
  initialMaterialId?: string;
  studentName: string;
  onClose: () => void;
  onDownloadPDF: (asg: Assignment) => void;
}

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({
  assignment,
  materials,
  initialMaterialId,
  studentName,
  onClose,
  onDownloadPDF,
}) => {
  const [activeMaterialId, setActiveMaterialId] = useState<string>(
    initialMaterialId || (materials.length > 0 ? materials[0].id : "")
  );

  // Audio player states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100
  const [currentTimeText, setCurrentTimeText] = useState("0:00");
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [downloadSuccessItem, setDownloadSuccessItem] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeMaterial =
    materials.find((m) => m.id === activeMaterialId) || materials[0];

  // Pause media when changing tabs
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [activeMaterialId]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {
          // If browser restricts audio play without direct gesture, fallback state
          setIsPlayingAudio(true);
        });
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setAudioProgress((current / duration) * 100);

    const mins = Math.floor(current / 60);
    const secs = Math.floor(current % 60);
    setCurrentTimeText(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
  };

  const handleSeekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekPercent = parseFloat(e.target.value);
    const duration = audioRef.current.duration || 1;
    audioRef.current.currentTime = (seekPercent / 100) * duration;
    setAudioProgress(seekPercent);
  };

  const handleRewind5s = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleDownloadMaterial = (material: AssignmentMaterial) => {
    setDownloadSuccessItem(material.id);
    setTimeout(() => setDownloadSuccessItem(null), 3000);

    if (material.type === "pdf") {
      onDownloadPDF(assignment);
      return;
    }

    // Trigger download for audio/video via link
    const link = document.createElement("a");
    link.href = material.url;
    link.download = `${material.title.replace(/[\s/\\?%*:|"<>]/g, "_")}.${
      material.type === "mp3" ? "mp3" : "mp4"
    }`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-[#e0e5ec] w-full max-w-3xl rounded-lg sm:rounded-xl shadow-[var(--shadow-floating)] border border-white/80 border-b-[#babecc] border-r-[#babecc] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Screws */}
        <div className="absolute top-2.5 left-2.5 screw-dot z-20" aria-hidden="true" />
        <div className="absolute top-2.5 right-2.5 screw-dot z-20" aria-hidden="true" />

        {/* Header - Industrial Bevel */}
        <div className="p-4 sm:p-5 border-b border-white/20 flex items-start justify-between bg-[#2d3436] text-white">
          <div className="space-y-1 pr-3 pl-3 sm:pl-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase font-mono tracking-widest text-[#a3b1c6] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                <span>TÀI LIỆU & ĐỀ BÀI ĐÍNH KÈM</span>
              </span>
              <span className="text-[10px] font-bold font-mono text-[#a3b1c6] bg-[#1e2528] px-2 py-0.5 rounded border border-white/10">
                {assignment.unit}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-mono text-white leading-tight line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              {assignment.title}
            </h3>
            <p className="text-[11px] font-mono text-[#a3b1c6]">
              Học sinh: <strong className="text-white">{studentName}</strong> • Hạn chót:{" "}
              <strong className="text-[#ff4757]">{assignment.deadline}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 mr-1"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selector for multiple materials */}
        {materials.length > 1 && (
          <div className="px-4 sm:px-5 py-2.5 bg-[#d1d9e6] border-b border-[#babecc]/60 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-[var(--shadow-recessed-sm)]">
            {materials.map((m) => {
              const isActive = m.id === activeMaterial?.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMaterialId(m.id)}
                  className={`px-3 py-1.5 rounded-md sm:rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 active:translate-y-[1px] ${
                    isActive
                      ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)] border border-white/30"
                      : "bg-[#e0e5ec] text-[#2d3436] hover:bg-[#d8e0ec] border border-white/90 shadow-[var(--shadow-card-sm)]"
                  }`}
                >
                  {m.type === "video" && <Video className="w-3.5 h-3.5" />}
                  {m.type === "mp3" && <Headphones className="w-3.5 h-3.5" />}
                  {m.type === "pdf" && <FileText className="w-3.5 h-3.5" />}
                  <span className="truncate max-w-[170px]">{m.title}</span>
                  {(m.duration || m.fileSize) && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-[#d1d9e6] text-[#4a5568]"
                      }`}
                    >
                      {m.duration || m.fileSize}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeMaterial && (
            <>
              {/* Type 1: VIDEO VIEWER */}
              {activeMaterial.type === "video" && (
                <div className="space-y-4">
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-[#1e2528] border-2 border-[#2d3436] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8)] aspect-video flex items-center justify-center">
                    <video
                      ref={videoRef}
                      src={activeMaterial.url}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                      poster="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80"
                    >
                      Trình duyệt của bạn không hỗ trợ phát video HTML5.
                    </video>
                  </div>

                  <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-lg sm:rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[var(--shadow-recessed-sm)]">
                    <div className="space-y-1 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#2d3436] text-white">
                          Video Hướng Dẫn
                        </span>
                        {activeMaterial.duration && (
                          <span className="text-xs text-[#2d3436] font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#ff4757]" />
                            {activeMaterial.duration}
                          </span>
                        )}
                        {activeMaterial.fileSize && (
                          <span className="text-xs text-[#4a5568] font-medium flex items-center gap-1">
                            <HardDrive className="w-3.5 h-3.5 text-[#4a5568]" />
                            {activeMaterial.fileSize}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#2d3436]">
                        {activeMaterial.title}
                      </h4>
                      <p className="text-xs text-[#4a5568]">
                        💡 Lời dặn Cô Nghi: Con xem kỹ khẩu hình miệng và bật âm đuôi trước khi quay video nộp bài nhé!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadMaterial(activeMaterial)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md sm:rounded-lg bg-[#ff4757] hover:bg-[#ff3344] text-white font-bold font-mono text-xs shadow-[var(--shadow-accent)] transition-all shrink-0 cursor-pointer active:translate-y-[1px] border border-white/30"
                    >
                      {downloadSuccessItem === activeMaterial.id ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Đã tải về</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Tải video về máy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Type 2: AUDIO MP3 VIEWER */}
              {activeMaterial.type === "mp3" && (
                <div className="space-y-4">
                  {/* Hidden native audio element */}
                  <audio
                    ref={audioRef}
                    src={activeMaterial.url}
                    onTimeUpdate={handleAudioTimeUpdate}
                    onEnded={() => {
                      setIsPlayingAudio(false);
                      setAudioProgress(0);
                    }}
                  />

                  {/* Sleek Custom Audio Card - Industrial Deck Chassis */}
                  <div className="bg-[#1e2528] text-white rounded-lg sm:rounded-xl p-5 sm:p-6 shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8),0_4px_16px_rgba(0,0,0,0.4)] border border-white/10 space-y-5 font-mono">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-[#2d3436] border border-white/10 flex items-center justify-center text-[#ff4757] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-[#a3b1c6] tracking-wider block">
                            Audio Nghe & Phát Âm Mẫu
                          </span>
                          <span className="text-xs text-[#a3b1c6]">
                            Giọng đọc chuẩn Cambridge Native Speaker
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs bg-[#2d3436] px-2.5 py-1 rounded-md text-[#a3b1c6] border border-white/10">
                        <Volume2 className="w-3.5 h-3.5 text-[#ff4757]" />
                        <span>MP3 HD</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                        {activeMaterial.title}
                      </h4>
                      <p className="text-xs text-[#a3b1c6]">
                        Dùng làm tài liệu nghe điền từ và đối chiếu phát âm chuẩn cho các câu hỏi trong Unit.
                      </p>
                    </div>

                    {/* Timeline slider */}
                    <div className="space-y-1.5">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={audioProgress}
                        onChange={handleSeekAudio}
                        className="w-full h-2 bg-[#2d3436] rounded-md appearance-none cursor-pointer accent-[#ff4757]"
                      />
                      <div className="flex items-center justify-between text-xs text-[#a3b1c6] font-mono">
                        <span>{currentTimeText}</span>
                        <span>{activeMaterial.duration || "02:15"}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleRewind5s}
                          className="p-2.5 rounded-md sm:rounded-lg bg-[#2d3436] hover:bg-[#3d4447] text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                          title="Lùi 5 giây"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>-5s</span>
                        </button>

                        <button
                          type="button"
                          onClick={togglePlayAudio}
                          className="w-12 h-12 rounded-lg bg-[#ff4757] hover:bg-[#ff3344] text-white flex items-center justify-center shadow-[var(--shadow-accent)] border border-white/30 transition-all active:translate-y-[1px] cursor-pointer"
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6 ml-0.5" />
                          )}
                        </button>

                        {/* Speed selector */}
                        <div className="flex items-center gap-1 bg-[#2d3436] p-1 rounded-lg text-xs font-mono border border-white/10">
                          {[0.8, 1.0, 1.2].map((rate) => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => handleChangePlaybackRate(rate)}
                              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                                playbackRate === rate
                                  ? "bg-[#ff4757] text-white"
                                  : "text-[#a3b1c6] hover:text-white"
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadMaterial(activeMaterial)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md sm:rounded-lg bg-[#2d3436] hover:bg-[#3d4447] text-white font-bold font-mono text-xs border border-white/15 transition-all cursor-pointer active:translate-y-[1px]"
                      >
                        {downloadSuccessItem === activeMaterial.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300">Đã tải MP3</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Tải file MP3 ({activeMaterial.fileSize || "2.4 MB"})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-lg sm:rounded-xl p-4 text-xs text-[#2d3436] flex items-start gap-2.5 shadow-[var(--shadow-recessed-sm)] font-mono">
                    <Info className="w-4 h-4 text-[#ff4757] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Mẹo từ Cô Nghi:</span> Ba mẹ có thể cho con nghe lại từ 2 - 3 lần ở tốc độ 0.8x để nắm chắc từng phụ âm đuôi (/s/, /z/, /ed/), sau đó tăng lên 1.0x để con luyện phản xạ nghe tự nhiên.
                    </div>
                  </div>
                </div>
              )}

              {/* Type 3: PDF WORKSHEET VIEWER */}
              {activeMaterial.type === "pdf" && (
                <div className="space-y-4">
                  {/* Worksheet Preview Card */}
                  <div className="border border-white/80 border-b-[#babecc] border-r-[#babecc] rounded-lg sm:rounded-xl p-5 sm:p-6 bg-[#e0e5ec] shadow-[var(--shadow-card)] space-y-4 font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#babecc]/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-[#ff4757] text-white">
                            Phiếu bài tập PDF
                          </span>
                          <span className="text-xs text-[#4a5568]">
                            Dung lượng: {activeMaterial.fileSize || "1.1 MB"}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-[#2d3436] mt-1">
                          {activeMaterial.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadMaterial(activeMaterial)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md sm:rounded-lg bg-[#ff4757] hover:bg-[#ff3344] text-white font-bold text-xs shadow-[var(--shadow-accent)] transition-all cursor-pointer active:translate-y-[1px] border border-white/30"
                        >
                          {downloadSuccessItem === activeMaterial.id ? (
                            <>
                              <Check className="w-4 h-4 text-white" />
                              <span>Đã tải phiếu PDF</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Tải phiếu bài tập (.PDF)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Printable Sheet Mock Preview */}
                    <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-lg sm:rounded-xl p-5 shadow-[var(--shadow-recessed-sm)] font-mono text-xs space-y-3">
                      <div className="flex justify-between items-start border-b border-[#babecc]/60 pb-3">
                        <div>
                          <div className="font-black text-[#2d3436] text-sm">LỚP TIẾNG ANH CÔ NGHI</div>
                          <div className="text-[#4a5568] text-[11px] mt-0.5">
                            Học sinh: <span className="font-bold text-[#2d3436]">{studentName}</span> • Unit: {assignment.unit}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            +{assignment.tokensReward} Tokens
                          </span>
                          <div className="text-[10px] text-[#4a5568] mt-1">Hạn: {assignment.deadline}</div>
                        </div>
                      </div>

                      <div className="bg-[#e0e5ec] border border-white/90 rounded-lg p-3 text-[#2d3436] shadow-[var(--shadow-card-sm)]">
                        <span className="font-bold block mb-0.5 text-[#ff4757]">📌 Hướng dẫn làm bài:</span>
                        <span>Ba mẹ in phiếu hoặc cho con chép câu trả lời vào vở Tiếng Anh chuyên đề. Sau khi làm xong, chụp lại ảnh trang vở gửi cô qua Cổng Phụ Huynh để được chấm điểm chi tiết.</span>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <div className="p-2.5 rounded-lg bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)]">
                          <span className="font-bold text-[#2d3436] block">Part 1: Vocabulary & Grammar Mastery</span>
                          <span className="text-[#4a5568] text-[11px]">Bóc tách thành phần câu (S - V - O - M) và tìm bẫy ngữ pháp.</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)]">
                          <span className="font-bold text-[#2d3436] block">Part 2: Speaking / Writing Focus</span>
                          <span className="text-[#4a5568] text-[11px]">Luyện đọc to thành tiếng theo file Audio MP3 đính kèm và quay video thuyết trình ngắn.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Quick list of all available materials in this assignment */}
          <div className="pt-3 border-t border-[#babecc]/50">
            <span className="text-xs font-black font-mono uppercase tracking-wider text-[#2d3436] block mb-2">
              Tất cả tài liệu đính kèm ({materials.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-lg sm:rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    m.id === activeMaterial?.id
                      ? "border-white/90 bg-[#d1d9e6] shadow-[var(--shadow-recessed-sm)]"
                      : "border-white/80 border-b-[#babecc] border-r-[#babecc] bg-[#e0e5ec] shadow-[var(--shadow-card-sm)] hover:bg-[#d8e0ec]"
                  }`}
                >
                  <div
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                    onClick={() => setActiveMaterialId(m.id)}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[#ff4757]"
                    >
                      {m.type === "video" && <Video className="w-4 h-4" />}
                      {m.type === "mp3" && <Headphones className="w-4 h-4" />}
                      {m.type === "pdf" && <FileText className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 font-mono">
                      <span className="text-xs font-bold text-[#2d3436] block truncate">
                        {m.title}
                      </span>
                      <span className="text-[10px] text-[#4a5568]">
                        {m.duration || m.fileSize || "Đính kèm"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadMaterial(m)}
                    className="p-1.5 rounded-md text-[#4a5568] hover:text-[#ff4757] bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] active:translate-y-[1px] transition-colors cursor-pointer"
                    title={`Tải ${m.type.toUpperCase()}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#babecc]/50 bg-[#e0e5ec] flex items-center justify-between gap-3 font-mono">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md sm:rounded-lg text-[#2d3436] bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] hover:bg-[#d8e0ec] font-bold text-xs transition-all active:translate-y-[1px] cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownloadPDF(assignment)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md sm:rounded-lg bg-[#ff4757] hover:bg-[#ff3344] text-white font-bold text-xs shadow-[var(--shadow-accent)] transition-all active:translate-y-[1px] cursor-pointer border border-white/30"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Tải phiếu bài tập (.PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
