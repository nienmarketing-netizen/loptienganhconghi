import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Check,
  Clock,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
  Camera,
  Film,
  Play,
  Pause,
  Trash2,
  Maximize2,
  Mic,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Assignment, GradedMediaItem } from "../types";
import { formatWithCorrectDayOfWeek } from "../lib/dateUtils";
import { useLockBodyScroll } from "../lib/useLockBodyScroll";

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
  useLockBodyScroll(true);

  const graded = assignment.gradedDetails;

  // Build the initial list of media items (Images, Videos, Audios)
  const initialMediaItems: GradedMediaItem[] = useMemo(() => {
    if (!graded) return [];
    if (graded.mediaItems && graded.mediaItems.length > 0) {
      return graded.mediaItems;
    }

    const imgs =
      graded.gradedImages && graded.gradedImages.length > 0
        ? graded.gradedImages
        : graded.gradedImage
        ? [graded.gradedImage]
        : [];
    const caps = graded.gradedImageCaptions || [];

    return [
      ...imgs.map((url, i) => ({
        id: `media-img-${i}`,
        type: "image" as const,
        url,
        thumbnail: url,
        title: caps[i] || `Trang ${i + 1}: Bài làm & nét bút đỏ sửa tại lớp`,
        tag: i === 0 ? "Nét bút đỏ con ghi chú" : "Bóc tách câu",
        uploadedBy: "Cô Nghi",
      })),
      {
        id: "media-video-1",
        type: "video" as const,
        url: "https://assets.mixkit.co/videos/preview/mixkit-little-boy-at-school-doing-a-presentation-43485-large.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
        title: `Video ${studentName} tự quay thuyết trình & sửa câu đảo ngữ`,
        tag: "Video học sinh tự sửa",
        duration: "0:48",
        uploadedBy: "Học sinh tự sửa & Cô lưu hồ sơ",
      },
      {
        id: "media-audio-1",
        type: "audio" as const,
        url: "https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg",
        thumbnail:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
        title: "Audio ghi âm con đọc lại câu mẫu & Cô Nghi chỉnh âm đuôi",
        tag: "Audio luyện sửa",
        duration: "0:42",
        uploadedBy: "Ghi âm tại lớp",
      },
    ];
  }, [graded, studentName]);

  const [mediaList, setMediaList] = useState<GradedMediaItem[]>(initialMediaItems);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  // Scroll container and interaction tracking refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Lightbox swipe and trackpad gesture refs
  const lightboxTouchStartX = useRef<number | null>(null);
  const lightboxTouchStartY = useRef<number | null>(null);
  const lightboxWheelTimeout = useRef<number | null>(null);

  // Audio player state in Lightbox
  const [lightboxAudioPlaying, setLightboxAudioPlaying] = useState<boolean>(false);
  const lightboxAudioRef = useRef<HTMLAudioElement | null>(null);

  // Reset audio & zoom when lightbox index changes
  useEffect(() => {
    if (lightboxAudioRef.current) {
      lightboxAudioRef.current.pause();
      lightboxAudioRef.current.currentTime = 0;
      setLightboxAudioPlaying(false);
    }
    setLightboxZoom(1);
  }, [activeLightboxIndex]);

  // Delete media item from carousel
  const handleDeleteMedia = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaList((prev) => prev.filter((item) => item.id !== id));
    if (activeLightboxIndex !== null && mediaList[activeLightboxIndex]?.id === id) {
      setActiveLightboxIndex(null);
    }
  };

  // Manual scroll helper
  const handleManualScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
    userInteractionTimeoutRef.current = window.setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000);

    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Continuous Infinite Auto-Scroll with requestAnimationFrame & seamless halfWidth reset
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || mediaList.length <= 1) return;

    let animationFrameId: number;
    const speed = 0.65; // pixels per frame

    const step = () => {
      if (!isPaused && !isUserInteracting && !isDraggingRef.current && el) {
        el.scrollLeft += speed;
        // When halfway (first full duplicate batch passed), loop seamlessly back to start
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
    };
  }, [isPaused, isUserInteracting, mediaList.length]);

  // Mouse drag to scroll (Desktop Physics)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    setIsUserInteracting(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
      userInteractionTimeoutRef.current = window.setTimeout(() => {
        setIsUserInteracting(false);
      }, 5000);
    }
  };

  // Touch Swipe for Lightbox Viewer
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartX.current = e.touches[0].clientX;
    lightboxTouchStartY.current = e.touches[0].clientY;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStartX.current === null || lightboxTouchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - lightboxTouchStartX.current;
    const diffY = e.changedTouches[0].clientY - lightboxTouchStartY.current;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swipe Right -> Previous item
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + mediaList.length) % mediaList.length : null
        );
      } else {
        // Swipe Left -> Next item
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % mediaList.length : null
        );
      }
    }
    lightboxTouchStartX.current = null;
    lightboxTouchStartY.current = null;
  };

  // Trackpad 2-finger horizontal swipe for Lightbox
  const handleLightboxWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 35 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (lightboxWheelTimeout.current) return;
      lightboxWheelTimeout.current = window.setTimeout(() => {
        lightboxWheelTimeout.current = null;
      }, 400);

      if (e.deltaX > 0) {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % mediaList.length : null
        );
      } else {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + mediaList.length) % mediaList.length : null
        );
      }
    }
  };

  // Keyboard navigation (Arrow keys + Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex !== null) {
        if (e.key === "ArrowLeft") {
          setActiveLightboxIndex((prev) =>
            prev !== null ? (prev - 1 + mediaList.length) % mediaList.length : null
          );
        } else if (e.key === "ArrowRight") {
          setActiveLightboxIndex((prev) =>
            prev !== null ? (prev + 1) % mediaList.length : null
          );
        } else if (e.key === "Escape") {
          setActiveLightboxIndex(null);
        }
      } else {
        if (e.key === "Escape") {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, mediaList.length, onClose]);

  const handleShareResult = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleLightboxAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxAudioRef.current) return;
    if (lightboxAudioPlaying) {
      lightboxAudioRef.current.pause();
      setLightboxAudioPlaying(false);
    } else {
      lightboxAudioRef.current.play().then(() => setLightboxAudioPlaying(true));
    }
  };

  if (!graded) {
    return null;
  }

  // Duplicate items for continuous infinite scroll
  const slideItems = mediaList.length > 1 ? [...mediaList, ...mediaList] : mediaList;
  const currentLightboxItem =
    activeLightboxIndex !== null ? mediaList[activeLightboxIndex] : null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-[var(--shadow-floating)] border border-slate-100 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#0066ff] via-[#1e88e5] to-[#0052cc] px-4 sm:px-6 py-4 text-white flex items-center justify-between gap-3 relative shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-blue-100 flex items-center gap-1.5">
                  <span>Bài đã sửa & nhận xét</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                </span>
                <h3 className="text-sm sm:text-base font-bold !text-white tracking-[-0.015em] leading-snug break-words">
                  {assignment.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShareResult}
                className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-xl border border-white/20 transition-colors cursor-pointer leading-tight"
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
                className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/20"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-3.5 sm:p-5 overflow-y-auto overscroll-contain space-y-4 text-slate-800">
            {/* Top Score Banner - Recessed Well */}
            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                {/* Score Badge */}
                <div className="relative shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066ff] to-[#0052cc] text-white shadow-md shadow-blue-500/25 border border-white/30">
                  <span className="text-xl sm:text-2xl font-bold font-mono leading-none tracking-tight">
                    {graded.score}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider opacity-90">
                    / {graded.maxScore} điểm
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {studentName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 leading-tight shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      +{assignment.tokensReward} Tokens
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#0066ff] mt-0.5">
                    {graded.feedbackTitle}
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto flex flex-col justify-center sm:items-end gap-1.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-blue-200/60 sm:border-l sm:border-blue-200/60 sm:pl-4">
                <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
                  <span className="text-slate-500 font-medium">Giáo viên:</span>
                  <span className="font-bold text-slate-800">Cô Nghi</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0066ff]" />
                    Đã nộp lúc:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {assignment.submittedAt
                      ? formatWithCorrectDayOfWeek(assignment.submittedAt)
                      : "19:15 Thứ Ba, 15/09/2026"}
                  </span>
                </div>
              </div>
            </div>

            {/* LỜI NHẬN XÉT CỦA CÔ */}
            <div
              id="teacher-written-feedback-card"
              className="rounded-2xl bg-white border border-slate-200/80 p-3.5 sm:p-4.5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80"
                      alt="Cô Nghi"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0066ff]"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#0066ff] text-white rounded-full p-0.5 ring-2 ring-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-[-0.015em]">
                      Lời nhận xét của Cô Nghi
                    </h4>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      Đánh giá chi tiết và dặn dò cho học sinh & phụ huynh
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/60 rounded-xl p-3.5 sm:p-4 border border-blue-100 text-slate-800 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
                <MessageSquareQuote className="w-5 h-5 text-[#0066ff] shrink-0 mt-0.5" />
                <p className="font-normal text-slate-700 italic leading-relaxed">
                  "{graded.voiceTranscript}"
                </p>
              </div>
            </div>

            {/* SECTION: BÀI SỬA TẠI LỚP - ALBUM SLIDESHOW KẾT HỢP LIGHTBOX VIEWER */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs space-y-3">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066ff] border border-blue-200/60 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-[#0066ff]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 tracking-[-0.015em]">
                      <span>Bài sửa tại lớp</span>
                      <span className="text-xs font-bold text-white bg-[#0066ff] px-2 py-0.5 rounded-md leading-tight shadow-xs">
                        {mediaList.length}
                      </span>
                    </h4>
                  </div>
                </div>
              </div>

              {/* Media Cards Continuous Slide Carousel */}
              {mediaList.length === 0 ? (
                <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center mx-auto">
                    <Film className="w-5 h-5 text-[#0066ff]" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Chưa có bài sửa hoặc tư liệu nào được tải lên cho bài tập này.
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl p-1 bg-slate-50 border border-slate-200/80 shadow-xs group/slider">
                  {/* Edge gradient masks */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent z-10" />
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-l from-slate-50 via-slate-50/70 to-transparent z-10" />

                  {/* Manual Scroll Control Buttons */}
                  <button
                    type="button"
                    onClick={() => handleManualScroll("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white hover:text-[#0066ff] cursor-pointer"
                    aria-label="Cuộn sang trái"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleManualScroll("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white hover:text-[#0066ff] cursor-pointer"
                    aria-label="Cuộn sang phải"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Interactive Scrollable Track with Physics */}
                  <div
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUpOrLeave}
                    onMouseLeave={() => {
                      handleMouseUpOrLeave();
                      setIsPaused(false);
                    }}
                    onTouchStart={() => setIsUserInteracting(true)}
                    onTouchEnd={() => {
                      if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
                      userInteractionTimeoutRef.current = window.setTimeout(() => {
                        setIsUserInteracting(false);
                      }, 4000);
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    className="flex items-stretch gap-3.5 py-1 overflow-x-auto select-none cursor-grab active:cursor-grabbing scrollbar-none"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {slideItems.map((item, idx) => {
                      const isVideo = item.type === "video";
                      const isAudio = item.type === "audio";
                      return (
                        <div
                          key={`${item.id}-slide-${idx}`}
                          onClick={() => {
                            if (hasMovedRef.current) return;
                            setActiveLightboxIndex(idx % mediaList.length);
                          }}
                          className="group relative rounded-xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between w-64 sm:w-72 md:w-80 shrink-0 select-none border border-slate-200/80"
                        >
                          {/* Media Preview Container - aspect-video 16:9 */}
                          <div className="relative aspect-video w-full bg-slate-900/10 overflow-hidden flex items-center justify-center">
                            <img
                              src={item.thumbnail || item.url}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-100"
                            />

                            {/* Top Badges */}
                            {item.tag && (
                              <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                                <span className="text-[10px] font-bold font-mono text-slate-800 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                                  {item.tag}
                                </span>
                              </div>
                            )}

                            {/* Delete Button (Quick Removal) */}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteMedia(item.id, e)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-xs z-10"
                              title="Xóa tư liệu này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Play Button Overlay (for Videos & Audios) */}
                            {(isVideo || isAudio) && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-11 h-11 rounded-full bg-[#0066ff] text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 group-active:scale-95 transition-all border border-white/40">
                                  {isAudio ? (
                                    <Mic className="w-5 h-5 text-white" />
                                  ) : (
                                    <Play className="w-5 h-5 fill-white ml-0.5" />
                                  )}
                                </div>
                              </div>
                            )}

                            {/* View Fullscreen Overlay (for Images) */}
                            {!isVideo && !isAudio && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                                <div className="w-9 h-9 rounded-full bg-white text-[#1e293b] flex items-center justify-center shadow-md">
                                  <Maximize2 className="w-4 h-4 text-[#0066ff]" />
                                </div>
                              </div>
                            )}

                            {/* Video / Audio Duration */}
                            {item.duration && (
                              <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-white/20 z-10">
                                {item.duration}
                              </div>
                            )}
                          </div>

                          {/* Card Footer Info */}
                          <div className="p-2.5 bg-white text-slate-800 border-t border-slate-100">
                            <h5 className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-[#0066ff] transition-colors line-clamp-1">
                              {item.title}
                            </h5>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Chi tiết câu hỏi cần chữa (Correction Details list) */}
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Ghi chú bóc tách câu của Cô Nghi cho con:</span>
              </h4>

              <div className="space-y-2">
                {graded.corrections.map((corr, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 space-y-2 text-xs shadow-xs"
                  >
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">
                      {corr.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600">
                        <span className="text-xs font-medium text-slate-500 block">
                          Bài con đã chọn
                        </span>
                        <span className="font-semibold text-slate-800 mt-0.5 block">
                          {corr.studentAnswer}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                        <span className="text-xs font-medium text-emerald-700 block">
                          Đáp án chuẩn Cô Nghi
                        </span>
                        <span className="font-bold text-emerald-800 mt-0.5 block">
                          {corr.teacherCorrection}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-800 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 leading-relaxed">
                      💡 <span className="text-[#ff9800] font-bold">Mẹo của Cô Nghi:</span> {corr.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:translate-y-[1px] cursor-pointer ml-auto border border-blue-400/30 leading-tight"
            >
              Đã xem xong
            </button>
          </div>
        </div>
      </div>

      {/* UNIFIED FULLSCREEN ALBUM LIGHTBOX MODAL WITH CAROUSEL & THUMBNAIL STRIP */}
      {activeLightboxIndex !== null && currentLightboxItem && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[80vh] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header Bar */}
            <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[#0066FF] shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                    <span>ALBUM BÀI SỬA</span>
                    <span className="bg-[#0066FF] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                      {activeLightboxIndex + 1} / {mediaList.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {currentLightboxItem.type === "image" && (
                  <div className="hidden sm:flex items-center gap-1.5 mr-1">
                    <button
                      type="button"
                      onClick={() => setLightboxZoom((z) => Math.max(0.6, z - 0.25))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#0066FF] text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                      title="Thu nhỏ"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-bold w-10 text-center text-white">
                      {Math.round(lightboxZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setLightboxZoom((z) => Math.min(3.0, z + 0.25))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#0066FF] text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                      title="Phóng to"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightboxZoom(1)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#0066FF] text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                      title="100%"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveLightboxIndex(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
                  aria-label="Đóng album (ESC)"
                  title="Đóng album (Phím ESC)"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Main Stage Display (Image, Video, or Audio) + Floating Nav Buttons */}
            <div
              onTouchStart={handleLightboxTouchStart}
              onTouchEnd={handleLightboxTouchEnd}
              onWheel={handleLightboxWheel}
              className="relative flex-1 bg-black/95 overflow-hidden flex items-center justify-center group/stage select-none touch-pan-y"
            >
              {/* Previous Button */}
              {mediaList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) =>
                      prev !== null ? (prev - 1 + mediaList.length) % mediaList.length : null
                    );
                  }}
                  className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800/80 hover:bg-[#0066FF] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Mục trước (Phím ←)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Main Content View by Type */}
              <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
                {currentLightboxItem.type === "video" && (
                  <video
                    key={currentLightboxItem.id}
                    src={currentLightboxItem.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[60vh] sm:max-h-[68vh] max-w-full object-contain rounded-xl shadow-2xl"
                  />
                )}

                {currentLightboxItem.type === "image" && (
                  <div
                    style={{
                      transform: `scale(${lightboxZoom})`,
                      transformOrigin: "center center",
                      transition: "transform 0.15s ease-out",
                    }}
                    className="max-h-[60vh] sm:max-h-[68vh] max-w-full flex items-center justify-center"
                  >
                    <img
                      key={currentLightboxItem.id}
                      src={currentLightboxItem.url}
                      alt={currentLightboxItem.title}
                      className="max-h-[60vh] sm:max-h-[68vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
                    />
                  </div>
                )}

                {currentLightboxItem.type === "audio" && (
                  <div className="w-full max-w-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-white flex flex-col items-center justify-center relative overflow-hidden">
                    <audio
                      ref={lightboxAudioRef}
                      src={currentLightboxItem.url}
                      onEnded={() => setLightboxAudioPlaying(false)}
                    />

                    {/* Soundwave Bars Visualizer */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                      <div className="flex items-center gap-2 w-full justify-center">
                        {[35, 65, 90, 45, 80, 100, 60, 85, 50, 95, 70, 40, 75, 55, 90, 40, 70, 35].map((h, i) => (
                          <div
                            key={i}
                            className={`w-2 bg-[#0066FF] rounded-full transition-all duration-300 ${
                              lightboxAudioPlaying ? "animate-pulse" : ""
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Central Mic/Disc & Controls */}
                    <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-lg">
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border-4 border-[#0066FF] shadow-[0_0_30px_rgba(0,102,255,0.5)] flex items-center justify-center">
                          <Mic className="w-10 h-10 text-white" />
                        </div>
                        {lightboxAudioPlaying && (
                          <div className="absolute -inset-3 rounded-full border-2 border-[#0066FF] animate-ping opacity-40 pointer-events-none" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                          {currentLightboxItem.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
                          Thời lượng: {currentLightboxItem.duration || "0:42"}
                        </p>
                      </div>

                      {/* Big Play / Pause Button in Lightbox */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={toggleLightboxAudio}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:opacity-95 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-blue-500/30 transition-transform active:scale-95 cursor-pointer"
                        >
                          {lightboxAudioPlaying ? (
                            <>
                              <Pause className="w-5 h-5 fill-current" />
                              <span>Tạm dừng âm thanh</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                              <span>Bấm phát âm thanh luyện sửa</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Button */}
              {mediaList.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex((prev) =>
                      prev !== null ? (prev + 1) % mediaList.length : null
                    );
                  }}
                  className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800/80 hover:bg-[#0066FF] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Mục tiếp theo (Phím →)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Album Bar & Scrollable Thumbnail Strip */}
            <div className="bg-slate-950 border-t border-slate-800 p-2 sm:p-3 shrink-0 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-400 font-mono px-1">
                <div className="font-medium text-white flex items-start sm:items-center gap-2 flex-wrap">
                  {currentLightboxItem.tag && (
                    <span className="text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/30 text-[10px] shrink-0 font-bold">
                      {currentLightboxItem.tag}
                    </span>
                  )}
                  <span className="text-white text-xs sm:text-sm font-semibold break-words leading-relaxed">
                    {currentLightboxItem.title}
                  </span>
                </div>
                <span className="hidden sm:inline-block shrink-0 text-[10px] text-slate-400">
                  Phím <kbd className="bg-white/10 px-1 py-0.5 rounded text-white">←</kbd> <kbd className="bg-white/10 px-1 py-0.5 rounded text-white">→</kbd> chuyển • <kbd className="bg-white/10 px-1 py-0.5 rounded text-white">ESC</kbd> đóng
                </span>
              </div>

              {/* Album Scrollable Thumbnail Strip */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 custom-scrollbar">
                {mediaList.map((item, idx) => {
                  const isActive = idx === activeLightboxIndex;
                  const isVid = item.type === "video";
                  const isAud = item.type === "audio";
                  return (
                    <button
                      key={`album-thumb-${item.id}-${idx}`}
                      type="button"
                      onClick={() => setActiveLightboxIndex(idx)}
                      className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden transition-all cursor-pointer border ${
                        isActive
                          ? "ring-2 ring-[#0066FF] border-white scale-105 z-10 opacity-100 shadow-[0_0_12px_rgba(0,102,255,0.7)]"
                          : "border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500"
                      }`}
                    >
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {isVid && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                        </div>
                      )}
                      {isAud && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Mic className="w-3.5 h-3.5 text-[#0066FF]" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white font-mono text-center truncate px-0.5 py-0.2">
                        {idx + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
