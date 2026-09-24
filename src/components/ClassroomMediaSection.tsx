import React, { useState, useRef, useEffect } from "react";
import {
  Video,
  Image as ImageIcon,
  Plus,
  Play,
  Pause,
  Trash2,
  Maximize2,
  X,
  Upload,
  Sparkles,
  Camera,
  Film,
  Check,
  Eye,
  Calendar,
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

// Pre-made sample templates for quick adding by teacher
const SAMPLE_TEMPLATES = [
  {
    type: "video" as const,
    title: "Con tự tin đứng bục thuyết trình bài tập phân tích câu",
    url: "https://assets.mixkit.co/videos/preview/mixkit-little-boy-at-school-doing-a-presentation-43485-large.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
    duration: "0:48",
    tag: "Video thuyết trình",
  },
  {
    type: "video" as const,
    title: "Con luyện phản xạ giao tiếp Speaking 1-1 cùng Cô Nghi",
    url: "https://assets.mixkit.co/videos/preview/mixkit-little-girl-doing-a-presentation-in-front-of-the-class-43484-large.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    duration: "1:02",
    tag: "Luyện phản xạ",
  },
  {
    type: "image" as const,
    title: "Khoảnh khắc con chăm chú làm bài tập và take-note",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    tag: "Làm bài tập",
  },
  {
    type: "image" as const,
    title: "Con hào hứng thảo luận nhóm và chữa bài cùng các bạn",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    tag: "Hoạt động nhóm",
  },
  {
    type: "image" as const,
    title: "Cô Nghi trao huy hiệu Ngôi sao tuần & Token tích lũy cho con",
    url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&auto=format&fit=crop&q=80",
    tag: "Khen thưởng",
  },
];

export const ClassroomMediaSection: React.FC<ClassroomMediaSectionProps> = ({
  initialMedia = [],
  studentName,
  lessonDate,
}) => {
  const [mediaList, setMediaList] = useState<LessonMediaItem[]>(initialMedia);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<LessonMediaItem | null>(null);
  const [activeImage, setActiveImage] = useState<LessonMediaItem | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useLockBodyScroll(isModalOpen || activeLightboxIndex !== null);
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

  // Keyboard navigation for Fullscreen Album Lightbox and Upload Modal
  useEffect(() => {
    if (activeLightboxIndex === null && !isModalOpen) return;

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
      } else if (isModalOpen) {
        if (e.key === "Escape") {
          setIsModalOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, isModalOpen, mediaList.length]);

  // Form states for uploading / adding new media
  const [modalTab, setModalTab] = useState<"file" | "template">("file");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"image" | "video">("image");
  const [newTag, setNewTag] = useState("Hoạt động lớp");
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    setNewType(isVideo ? "video" : "image");
    setSelectedFileName(file.name);

    if (!newTitle) {
      setNewTitle(
        isVideo
          ? `Video học tập của ${studentName}`
          : `Hình ảnh học tập của ${studentName}`
      );
    }

    // Create a local blob URL for preview & playback
    const objectUrl = URL.createObjectURL(file);
    setSelectedFileUrl(objectUrl);
  };

  // Submit adding new media
  const handleAddMedia = () => {
    if (!selectedFileUrl && modalTab === "file") return;

    setIsUploading(true);
    setTimeout(() => {
      const newMediaItem: LessonMediaItem = {
        id: `media-custom-${Date.now()}`,
        type: newType,
        title:
          newTitle.trim() ||
          (newType === "video" ? "Video bài học" : "Ảnh bài học"),
        url: selectedFileUrl || "",
        thumbnail:
          newType === "video"
            ? "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80"
            : selectedFileUrl || "",
        duration: newType === "video" ? "0:45" : undefined,
        tag: newTag,
        uploadedBy: "Cô Nghi",
        timestamp: `${lessonDate} ${new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      };

      setMediaList((prev) => [newMediaItem, ...prev]);
      setIsUploading(false);
      setUploadSuccessMsg("Đã tải lên thành công!");

      setTimeout(() => {
        setIsModalOpen(false);
        setUploadSuccessMsg("");
        // Reset form
        setNewTitle("");
        setSelectedFileUrl(null);
        setSelectedFileName("");
      }, 700);
    }, 400);
  };

  // Add from sample template
  const handleAddFromTemplate = (tpl: (typeof SAMPLE_TEMPLATES)[0]) => {
    const newMediaItem: LessonMediaItem = {
      id: `media-tpl-${Date.now()}`,
      type: tpl.type,
      title: `${studentName}: ${tpl.title}`,
      url: tpl.url,
      thumbnail: tpl.thumbnail,
      duration: tpl.duration,
      tag: tpl.tag,
      uploadedBy: "Cô Nghi",
      timestamp: `${lessonDate} ${new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
    };

    setMediaList((prev) => [newMediaItem, ...prev]);
    setIsModalOpen(false);
  };

  // Delete media item
  const handleDeleteMedia = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Cô có chắc muốn xóa ảnh/video này không?")) {
      setMediaList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Ensure enough items to create an infinite continuous seamless sliding loop
  const minItemsForLoop = 4;
  const repeatCount = Math.max(1, Math.ceil(minItemsForLoop / Math.max(1, mediaList.length)));
  const baseItems = Array.from({ length: repeatCount }, () => mediaList).flat();
  // Duplicate baseItems into 2 identical halves for the 0% -> -50% translateX continuous loop
  const slideItems = [...baseItems, ...baseItems];
  // Calculate a slow, relaxed speed: ~8.5s per unique card, minimum 36s
  const slideDuration = Math.max(36, baseItems.length * 8.5);

  return (
    <div
      id="classroom-media-section"
      className="soft-ui-embossed-sm rounded-lg sm:rounded-xl p-3.5 sm:p-4 space-y-3"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[#b2c2d4]/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md sm:rounded-lg soft-ui-convex text-[#ff4757] flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4 text-[#ff4757]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] flex items-center gap-1.5 tracking-[-0.015em]">
              <span>Hình ảnh & video học tập tại lớp</span>
              <span className="text-xs font-semibold text-white bg-[#ff4757] px-2 py-0.5 rounded leading-tight shadow-[var(--shadow-accent-sm)]">
                {mediaList.length}
              </span>
            </h4>
          </div>
        </div>
      </div>

      {/* Media Cards Continuous Slide Carousel */}
      {mediaList.length === 0 ? (
        <div className="text-center py-6 px-4 soft-ui-debossed rounded-lg space-y-2">
          <div className="w-10 h-10 rounded-full soft-ui-convex text-[#475569] flex items-center justify-center mx-auto">
            <Film className="w-5 h-5 text-[#ff4757]" />
          </div>
          <p className="text-xs text-[#475569] font-mono font-medium">
            Chưa có hình ảnh hoặc video nào được tải lên cho buổi học này.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold font-mono text-[#ff4757] hover:underline cursor-pointer"
          >
            Bấm vào đây để tải lên ảnh hoặc video của học sinh
          </button>
        </div>
      ) : (
        <div className="relative rounded-lg sm:rounded-xl p-1 bg-[#dbe4ee]/35 border border-[#babecc]/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] group/slider">
          {/* Edge gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-r from-[#e0e5ec] via-[#e0e5ec]/70 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-12 bg-gradient-to-l from-[#e0e5ec] via-[#e0e5ec]/70 to-transparent z-10" />

          {/* Manual Scroll Control Buttons */}
          <button
            type="button"
            onClick={() => handleManualScroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-[#1a1a1a] shadow-md border border-[#babecc]/50 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white hover:text-[#ff4757] cursor-pointer"
            aria-label="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleManualScroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-[#1a1a1a] shadow-md border border-[#babecc]/50 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-white hover:text-[#ff4757] cursor-pointer"
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
                  className="group relative rounded-lg overflow-hidden soft-ui-convex hover:shadow-[var(--shadow-floating)] transition-all cursor-pointer flex flex-col justify-between w-64 sm:w-72 md:w-80 shrink-0 select-none border border-white/80 border-b-[#babecc]/70 border-r-[#babecc]/70"
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
                        <span className="text-[10px] font-bold font-mono text-slate-800 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md border border-slate-200 shadow-xs">
                          {item.tag}
                        </span>
                      </div>
                    )}

                    {/* Delete Button (Teacher management) */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMedia(item.id, e)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 hover:bg-[#ff4757] text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-xs z-10"
                      title="Xóa ảnh/video này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Play Button Overlay (for Videos) */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-11 h-11 rounded-full bg-[#ff4757] text-white flex items-center justify-center shadow-[var(--shadow-accent)] group-hover:scale-110 group-active:scale-95 transition-all border border-white/40">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* View Fullscreen Overlay (for Images) */}
                    {!isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                        <div className="w-9 h-9 rounded-full bg-white text-[#1e293b] flex items-center justify-center shadow-md">
                          <Maximize2 className="w-4 h-4 text-[#ff4757]" />
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
                  <div className="p-2.5 bg-white text-[#1e293b] border-t border-slate-100">
                    <h5 className="text-xs font-normal text-[#1e293b] leading-snug group-hover:text-[#ff4757] transition-colors">
                      {item.title}
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TEACHER UPLOAD MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#e0e5ec] rounded-lg sm:rounded-xl shadow-[var(--shadow-floating)] border border-white/80 border-b-[#babecc] border-r-[#babecc] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Industrial Bevel Bar */}
            <div className="bg-[#2d3436] px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3 border-b border-white/20 relative shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-md sm:rounded-lg bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-[#a3b1c6] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                    <span>Kho lưu trữ hình ảnh buổi học</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold !text-white tracking-[-0.015em] leading-snug truncate">
                    Thêm ảnh / video của {studentName}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-md bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/10"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs - Tactile Recessed Bar */}
            <div className="flex border-b border-[#babecc]/60 bg-[#d1d9e6] px-4 py-2 gap-2 text-xs font-bold shadow-[var(--shadow-recessed-sm)]">
              <button
                type="button"
                onClick={() => setModalTab("file")}
                className={`px-3 py-1.5 rounded-md sm:rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-[1px] ${
                  modalTab === "file"
                    ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)] border border-white/30"
                    : "bg-[#e0e5ec] text-[#2d3436] hover:bg-[#d8e0ec] border border-white/90 shadow-[var(--shadow-card-sm)]"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải lên từ thiết bị</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("template")}
                className={`px-3 py-1.5 rounded-md sm:rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-[1px] ${
                  modalTab === "template"
                    ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)] border border-white/30"
                    : "bg-[#e0e5ec] text-[#2d3436] hover:bg-[#d8e0ec] border border-white/90 shadow-[var(--shadow-card-sm)]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Chọn mẫu lớp học sẵn</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain space-y-4 text-[#1a1a1a]">
              {uploadSuccessMsg ? (
                <div className="py-8 text-center space-y-2 bg-[#d1d9e6] rounded-lg border border-emerald-500/60 shadow-[var(--shadow-recessed-sm)] p-4">
                  <div className="w-12 h-12 rounded-md sm:rounded-lg bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-[var(--shadow-card-sm)]">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1a1a1a]">
                    {uploadSuccessMsg}
                  </h4>
                  <p className="text-xs text-[#4a5568]">
                    Phụ huynh đã có thể xem video/hình ảnh mới nhất của con trên bảng điều khiển.
                  </p>
                </div>
              ) : modalTab === "file" ? (
                <div className="space-y-3.5">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />

                  {/* Dropzone / Upload Trigger - Recessed Well */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
                      selectedFileUrl
                        ? "border-[#ff4757] bg-[#e0e5ec] shadow-[var(--shadow-card-sm)]"
                        : "border-[#babecc] hover:border-[#ff4757] bg-[#d1d9e6] shadow-[var(--shadow-recessed-sm)]"
                    }`}
                  >
                    {selectedFileUrl ? (
                      <div className="space-y-2">
                        {newType === "video" ? (
                          <div className="w-full max-h-44 rounded-md sm:rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/20">
                            <video
                              src={selectedFileUrl}
                              controls
                              className="max-h-44 w-full object-contain"
                            />
                          </div>
                        ) : (
                          <img
                            src={selectedFileUrl}
                            alt="Xem trước"
                            className="w-full max-h-44 object-contain rounded-md sm:rounded-lg bg-black/10 border border-[#babecc]/60"
                          />
                        )}
                        <p className="text-xs font-bold text-[#ff4757] font-mono">
                          ✔ Đã chọn: {selectedFileName}
                        </p>
                        <p className="text-[11px] text-[#666666]">
                          Bấm để đổi file khác
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-12 h-12 rounded-md sm:rounded-lg bg-[#e0e5ec] border border-white/90 shadow-[var(--shadow-card-sm)] text-[#ff4757] flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1a1a1a]">
                            Bấm để tải lên ảnh hoặc video từ thiết bị
                          </p>
                          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
                            Hỗ trợ định dạng MP4, MOV, JPG, PNG, WEBP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4a5568]">
                      Tiêu đề / Lời ghi chú của cô:
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={`Ví dụ: ${studentName} tự tin thuyết trình bài tập...`}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-md sm:rounded-lg bg-[#d1d9e6] border border-[#babecc] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.12)] text-[#1a1a1a] focus:outline-none focus:bg-[#e0e5ec]"
                    />
                  </div>

                  {/* Category Tag Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4a5568]">
                      Chủ đề hoạt động:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Video thuyết trình",
                        "Luyện phản xạ",
                        "Làm bài tập",
                        "Hoạt động nhóm",
                        "Khen thưởng",
                        "Hoạt động lớp",
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setNewTag(tag)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                            newTag === tag
                              ? "bg-[#ff4757] text-white border-white/30 shadow-[var(--shadow-accent-sm)]"
                              : "bg-[#e0e5ec] text-[#4a5568] border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] hover:bg-[#d8e0ec]"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Templates Tab */
                <div className="space-y-2.5">
                  <p className="text-xs text-[#666666] font-medium">
                    Chọn nhanh một khoảnh khắc mẫu để thêm ngay vào buổi học của con:
                  </p>
                  <div className="space-y-2">
                    {SAMPLE_TEMPLATES.map((tpl, i) => (
                      <div
                        key={i}
                        onClick={() => handleAddFromTemplate(tpl)}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-[#e0e5ec] border border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] hover:shadow-[var(--shadow-card)] transition-all cursor-pointer"
                      >
                        <div className="relative w-16 h-12 rounded-md overflow-hidden bg-slate-900 shrink-0 border border-white/20">
                          <img
                            src={tpl.thumbnail || tpl.url}
                            alt={tpl.title}
                            className="w-full h-full object-cover"
                          />
                          {tpl.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                tpl.type === "video"
                                  ? "bg-[#d1d9e6] text-[#ff4757] border border-[#ff4757]/30"
                                  : "bg-[#d1d9e6] text-[#4a5568] border border-[#babecc]/60"
                              }`}
                            >
                              {tpl.type === "video" ? "Video" : "Ảnh"}
                            </span>
                            <span className="text-[10px] font-medium text-[#666666]">
                              {tpl.tag}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#1a1a1a] truncate mt-0.5">
                            {tpl.title}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-md bg-[#ff4757] hover:bg-[#ff3848] text-white font-mono font-bold text-[11px] shadow-[var(--shadow-accent-sm)] active:translate-y-[1px] shrink-0 cursor-pointer"
                        >
                          Chọn
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!uploadSuccessMsg && modalTab === "file" && (
              <div className="p-3 sm:p-4 bg-[#d1d9e6] border-t border-[#babecc]/60 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md sm:rounded-lg bg-[#e0e5ec] hover:bg-[#d8e0ec] text-[#4a5568] border border-white/90 shadow-[var(--shadow-card-sm)] text-xs font-bold transition-all cursor-pointer active:translate-y-[1px]"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAddMedia}
                  disabled={!selectedFileUrl || isUploading}
                  className="px-4 py-2 rounded-md sm:rounded-lg bg-[#ff4757] hover:bg-[#ff3848] disabled:opacity-50 text-white text-xs font-bold font-mono shadow-[var(--shadow-accent-sm)] transition-all active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <span>Đang tải lên...</span>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Đăng tải vào buổi học</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UNIFIED FULLSCREEN ALBUM LIGHTBOX MODAL WITH CAROUSEL & THUMBNAIL STRIP */}
      {activeLightboxIndex !== null && mediaList[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#1e2528] rounded-xl overflow-hidden border border-white/20 shadow-[var(--shadow-floating)] flex flex-col h-[90vh] sm:h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-[#2d3436] border-b border-white/10 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg bg-[#ff4757]/20 border border-[#ff4757]/40 flex items-center justify-center text-[#ff4757] shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-[#a3b1c6] font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full led-indicator-orange animate-pulse" />
                    <span>ALBUM LỚP HỌC</span>
                    <span className="bg-[#ff4757] text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono shadow-xs">
                      {activeLightboxIndex + 1} / {mediaList.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveLightboxIndex(null)}
                  className="w-8 h-8 rounded-md bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
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
                  className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#ff4757] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
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
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <img
                    key={mediaList[activeLightboxIndex].id}
                    src={mediaList[activeLightboxIndex].url}
                    alt={mediaList[activeLightboxIndex].title}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl select-none"
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
                  className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#ff4757] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Ảnh/Video tiếp theo (Phím →)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Album Bar & Scrollable Thumbnail Strip */}
            <div className="bg-[#2d3436] border-t border-white/10 p-2 sm:p-3 shrink-0 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#a3b1c6] font-mono px-1">
                <div className="font-medium text-white flex items-start sm:items-center gap-2 flex-wrap">
                  {mediaList[activeLightboxIndex].tag && (
                    <span className="text-[#ff4757] bg-[#ff4757]/15 px-2 py-0.5 rounded border border-[#ff4757]/30 text-[10px] shrink-0 font-bold">
                      {mediaList[activeLightboxIndex].tag}
                    </span>
                  )}
                  <span className="text-white text-xs sm:text-sm font-semibold break-words leading-relaxed">
                    {mediaList[activeLightboxIndex].title}
                  </span>
                </div>
                <span className="hidden sm:inline-block shrink-0 text-[10px] text-[#a3b1c6]">
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
                      className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden transition-all cursor-pointer border ${
                        isActive
                          ? "ring-2 ring-[#ff4757] border-white scale-105 z-10 opacity-100 shadow-[0_0_12px_rgba(255,71,87,0.7)]"
                          : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/60"
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
        </div>
      )}
    </div>
  );
};
