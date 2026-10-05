import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Camera,
  Film,
  Play,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LessonMediaItem } from "../types";
import { useLockBodyScroll } from "../lib/useLockBodyScroll";

interface ClassroomMediaSectionProps {
  initialMedia?: LessonMediaItem[];
  studentName: string;
  lessonDate: string;
}

const EMPTY_MEDIA: LessonMediaItem[] = [];

export const ClassroomMediaSection: React.FC<ClassroomMediaSectionProps> = ({
  initialMedia,
  studentName,
  lessonDate,
}) => {
  const mediaList = initialMedia && initialMedia.length > 0 ? initialMedia : EMPTY_MEDIA;
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useLockBodyScroll(activeLightboxIndex !== null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const userInteractionTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Manual scroll helper
  const handleManualScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
    userInteractionTimeoutRef.current = window.setTimeout(() => {
      setIsUserInteracting(false);
    }, 6000);

    const scrollAmount = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Auto scroll effect when user is not manually interacting
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

  // Mouse drag to scroll
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

  // Touch / Trackpad swipe handling for Lightbox
  const lightboxTouchStartX = useRef<number | null>(null);
  const lightboxTouchStartY = useRef<number | null>(null);
  const lightboxWheelTimeout = useRef<number | null>(null);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    lightboxTouchStartX.current = e.touches[0].clientX;
    lightboxTouchStartY.current = e.touches[0].clientY;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (lightboxTouchStartX.current === null || lightboxTouchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - lightboxTouchStartX.current;
    const diffY = e.changedTouches[0].clientY - lightboxTouchStartY.current;

    // Only swipe if horizontal move is significant and greater than vertical move
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

  // Trackpad 2-finger horizontal swipe
  const handleLightboxWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 35 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (lightboxWheelTimeout.current) return;
      lightboxWheelTimeout.current = window.setTimeout(() => {
        lightboxWheelTimeout.current = null;
      }, 400);

      if (e.deltaX > 0) {
        // Wheel Right -> Next
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % mediaList.length : null
        );
      } else {
        // Wheel Left -> Previous
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + mediaList.length) % mediaList.length : null
        );
      }
    }
  };

  // Keyboard navigation for Fullscreen Album Lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, mediaList.length]);

  // Ensure enough items to create an infinite continuous seamless sliding loop
  const minItemsForLoop = 4;
  const repeatCount = Math.max(1, Math.ceil(minItemsForLoop / Math.max(1, mediaList.length)));
  const baseItems = Array.from({ length: repeatCount }, () => mediaList).flat();
  // Duplicate baseItems into 2 identical halves for the 0% -> -50% translateX continuous loop
  const slideItems = [...baseItems, ...baseItems];

  return (
    <div
      id="classroom-media-section"
      className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(16,185,129,0.06)] space-y-3.5"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[#A7F3D0]/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#065F46] flex items-center gap-1.5 tracking-[-0.015em]">
              <span>Hình ảnh & video học tập tại lớp</span>
              {mediaList.length > 0 && (
                <span className="text-xs font-bold text-white bg-[#10B981] px-2.5 py-0.5 rounded-full leading-tight shadow-xs">
                  {mediaList.length}
                </span>
              )}
            </h4>
          </div>
        </div>
      </div>

      {/* Media Cards Continuous Slide Carousel */}
      {mediaList.length === 0 ? (
        <div className="text-center py-6 px-4 bg-white/70 rounded-xl border border-[#A7F3D0]/80 space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
            <Camera className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xs text-[#065F46] font-bold">
            Chưa có hình ảnh hoặc video cho buổi học này.
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Cô Nghi sẽ đăng tải khoảnh khắc học tập của con sau buổi học.
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white hover:text-[#0066FF] cursor-pointer"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleManualScroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white hover:text-[#0066FF] cursor-pointer"
            aria-label="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Interactive Scrollable Track */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
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
              return (
                <div
                  key={`${item.id}-slide-${idx}`}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    setActiveLightboxIndex(idx % mediaList.length);
                  }}
                  className="group relative rounded-xl overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between w-64 sm:w-72 md:w-80 shrink-0 select-none border border-slate-200/80 shadow-xs"
                >
                  {/* Media Preview Container - Bright, Clean & Vivid */}
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

                    {/* Play Button Overlay (for Videos) */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 group-active:scale-95 transition-all border border-white/40">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* View Fullscreen Overlay (for Images) */}
                    {!isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                        <div className="w-9 h-9 rounded-full bg-white text-[#1e293b] flex items-center justify-center shadow-md">
                          <Maximize2 className="w-4 h-4 text-[#0066FF]" />
                        </div>
                      </div>
                    )}

                    {/* Video Duration */}
                    {isVideo && item.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-white/20 z-10">
                        {item.duration}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Info */}
                  <div className="p-2.5 bg-white text-slate-800 border-t border-slate-100">
                    <h5 className="text-xs font-normal text-slate-800 leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-1">
                      {item.title}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UNIFIED FULLSCREEN ALBUM LIGHTBOX MODAL WITH CAROUSEL & THUMBNAIL STRIP */}
      {activeLightboxIndex !== null &&
        mediaList[activeLightboxIndex] &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setActiveLightboxIndex(null)}
          >
          <div
            className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[80vh] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[#0066FF] shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                    <span>ALBUM LỚP HỌC</span>
                    <span className="bg-[#0066FF] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                      {activeLightboxIndex + 1} / {mediaList.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveLightboxIndex(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
                  aria-label="Đóng album"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Main Stage Display (Image or Video) + Nav Buttons */}
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
                  title="Ảnh/Video trước (Phím ←)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Main Content View */}
              <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
                {mediaList[activeLightboxIndex].type === "video" ? (
                  <video
                    key={mediaList[activeLightboxIndex].id}
                    src={mediaList[activeLightboxIndex].url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                  />
                ) : (
                  <img
                    key={mediaList[activeLightboxIndex].id}
                    src={mediaList[activeLightboxIndex].url}
                    alt={mediaList[activeLightboxIndex].title}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-2xl select-none"
                  />
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
                  title="Ảnh/Video tiếp theo (Phím →)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Album Bar & Scrollable Thumbnail Strip */}
            <div className="bg-slate-950 border-t border-slate-800 p-2 sm:p-3 shrink-0 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-400 font-mono px-1">
                <div className="font-medium text-white flex items-start sm:items-center gap-2 flex-wrap">
                  {mediaList[activeLightboxIndex].tag && (
                    <span className="text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/30 text-[10px] shrink-0 font-bold">
                      {mediaList[activeLightboxIndex].tag}
                    </span>
                  )}
                  <span className="text-white text-xs sm:text-sm font-semibold break-words leading-relaxed">
                    {mediaList[activeLightboxIndex].title}
                  </span>
                </div>
                <span className="hidden sm:inline-block shrink-0 text-[10px] text-slate-400">
                  Phím <kbd className="bg-white/10 px-1 py-0.5 rounded text-white">←</kbd> <kbd className="bg-white/10 px-1 py-0.5 rounded text-white">→</kbd> chuyển bài • <kbd className="bg-white/10 px-1 py-0.5 rounded text-white">ESC</kbd> đóng
                </span>
              </div>

              {/* Album Scrollable Thumbnail Strip */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 custom-scrollbar">
                {mediaList.map((item, idx) => {
                  const isActive = idx === activeLightboxIndex;
                  const isVid = item.type === "video";
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
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white font-mono text-center truncate px-0.5 py-0.2">
                        {idx + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
