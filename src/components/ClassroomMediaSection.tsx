import React, { useState, useRef } from "react";
import {
  Video,
  Image as ImageIcon,
  Plus,
  Play,
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
} from "lucide-react";
import { LessonMediaItem } from "../types";

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

  return (
    <div
      id="classroom-media-section"
      className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs space-y-3"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Hình ảnh & Video học tập tại lớp</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.2 rounded-full font-mono">
                {mediaList.length}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cô Nghi ghi lại khoảnh khắc học tập thực tế để phụ huynh tiện theo dõi
            </p>
          </div>
        </div>

        {/* Teacher Upload Action Button */}
        <button
          type="button"
          id="btn-teacher-add-media"
          onClick={() => {
            setUploadSuccessMsg("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Thêm ảnh / video</span>
        </button>
      </div>

      {/* Media Cards Grid */}
      {mediaList.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50/75 rounded-xl border border-dashed border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Film className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Chưa có hình ảnh hoặc video nào được tải lên cho buổi học này.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 cursor-pointer"
          >
            Bấm vào đây để tải lên ảnh hoặc video của học sinh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mediaList.map((item) => {
            const isVideo = item.type === "video";
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isVideo) {
                    setActiveVideo(item);
                  } else {
                    setActiveImage(item);
                  }
                }}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Media Preview Container */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-xs ${
                        isVideo
                          ? "bg-rose-600/90 text-white"
                          : "bg-indigo-600/90 text-white"
                      }`}
                    >
                      {isVideo ? (
                        <>
                          <Video className="w-2.5 h-2.5" />
                          <span>Video</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-2.5 h-2.5" />
                          <span>Hình ảnh</span>
                        </>
                      )}
                    </span>

                    {item.tag && (
                      <span className="text-[10px] font-semibold text-slate-200 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-white/10">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Delete Button (Teacher management) */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMedia(item.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Xóa ảnh/video này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Play Button Overlay (for Videos) */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-11 h-11 rounded-full bg-rose-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-all">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* View Fullscreen Overlay (for Images) */}
                  {!isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* Video Duration */}
                  {isVideo && item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-white/15">
                      {item.duration}
                    </div>
                  )}
                </div>

                {/* Card Footer Info */}
                <div className="p-2.5 bg-white text-slate-800 space-y-1">
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h5>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <span>{item.uploadedBy || "Cô Nghi"}</span>
                    </span>
                    <span>{item.timestamp || lessonDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TEACHER UPLOAD MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Thêm hình ảnh / video học tập của học sinh
                  </h3>
                  <p className="text-[11px] text-indigo-200">
                    Dành cho học sinh: {studentName} • Buổi ngày {lessonDate}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalTab("file")}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                  modalTab === "file"
                    ? "border-indigo-600 text-indigo-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Tải lên từ máy tính / điện thoại
              </button>
              <button
                type="button"
                onClick={() => setModalTab("template")}
                className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                  modalTab === "template"
                    ? "border-indigo-600 text-indigo-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Chọn mẫu lớp học sẵn</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              {uploadSuccessMsg ? (
                <div className="py-8 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    {uploadSuccessMsg}
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Phụ huynh đã có thể xem video/hình ảnh mới nhất của con.
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

                  {/* Dropzone / Upload Trigger */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      selectedFileUrl
                        ? "border-indigo-500 bg-indigo-50/50"
                        : "border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/20"
                    }`}
                  >
                    {selectedFileUrl ? (
                      <div className="space-y-2">
                        {newType === "video" ? (
                          <div className="w-full max-h-44 rounded-xl overflow-hidden bg-black flex items-center justify-center">
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
                            className="w-full max-h-44 object-contain rounded-xl bg-black/5"
                          />
                        )}
                        <p className="text-xs font-bold text-indigo-700">
                          ✔ Đã chọn: {selectedFileName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Bấm để đổi file khác
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Bấm để tải lên ảnh hoặc video từ thiết bị
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Hỗ trợ định dạng MP4, MOV, JPG, PNG, WEBP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Tiêu đề / Lời ghi chú của cô:
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder={`Ví dụ: ${studentName} tự tin thuyết trình bài tập...`}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Category Tag Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
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
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            newTag === tag
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
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
                  <p className="text-xs text-slate-600 font-medium">
                    Chọn nhanh một khoảnh khắc mẫu để thêm ngay vào buổi học của con:
                  </p>
                  <div className="space-y-2">
                    {SAMPLE_TEMPLATES.map((tpl, i) => (
                      <div
                        key={i}
                        onClick={() => handleAddFromTemplate(tpl)}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer"
                      >
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0">
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
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                tpl.type === "video"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {tpl.type === "video" ? "Video" : "Ảnh"}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500">
                              {tpl.tag}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                            {tpl.title}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shrink-0"
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
              <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAddMedia}
                  disabled={!selectedFileUrl || isUploading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
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

      {/* FULLSCREEN VIDEO PLAYER MODAL FOR PARENTS */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-950 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Header */}
            <div className="p-3.5 sm:p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold truncate">
                    {activeVideo.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Video của {studentName} • {activeVideo.uploadedBy || "Cô Nghi"} quay tại lớp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={activeVideo.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Footer Note */}
            <div className="p-3 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-amber-300">
                {activeVideo.tag || "Video học tập tại lớp"}
              </span>
              <span>Thời lượng: {activeVideo.duration || "0:45"}</span>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE VIEWER MODAL FOR PARENTS */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-950 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between text-white">
              <div>
                <h4 className="text-xs sm:text-sm font-bold">{activeImage.title}</h4>
                <p className="text-[10px] text-slate-400">
                  {studentName} • {activeImage.uploadedBy || "Cô Nghi chụp tại lớp"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image display */}
            <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-black">
              <img
                src={activeImage.url}
                alt={activeImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
