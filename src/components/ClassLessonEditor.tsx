import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  BookOpen,
  Tag,
  Upload,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  Film,
  Camera,
  Play,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  FileText,
  FileCheck2,
  Coins,
  Headphones,
  Paperclip,
  Trash2,
  Clock,
} from "lucide-react";
import {
  Assignment,
  AssignmentMaterial,
  LessonMediaItem,
  RecentLessonInfo,
  StudentProfile,
} from "../types";
import { formatWithCorrectDayOfWeek } from "../lib/dateUtils";

interface ClassLessonEditorProps {
  currentClassName: string;
  targetStudents: StudentProfile[];
  onSyncLessonToStudents: (
    updatedStudents: StudentProfile[],
    lessonSummary: { name: string; date: string }
  ) => Promise<void> | void;
}

export const ClassLessonEditor: React.FC<ClassLessonEditorProps> = ({
  currentClassName,
  targetStudents,
  onSyncLessonToStudents,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 3. Các ô dữ liệu để trống cho giáo viên tự nhập
  const [lessonName, setLessonName] = useState<string>("");

  // 4. Riêng mục "2. Thời gian" update và nhập sẵn thời gian hiện tại (YYYY-MM-DD)
  const [lessonDate, setLessonDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [topic, setTopic] = useState<string>("");

  // Tag list for focus items (trống ban đầu để giáo viên tự nhập)
  const [skills, setSkills] = useState<string[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState<string>("");

  // Media items uploaded or added (để trống ban đầu)
  const [mediaItems, setMediaItems] = useState<LessonMediaItem[]>([]);

  // 6. TRƯỜNG DỮ LIỆU SỐ 6: "BÀI TẬP VỀ NHÀ"
  const [hwUnit, setHwUnit] = useState<string>("");
  const [hwTokens, setHwTokens] = useState<number>(10);
  const [hwDescription, setHwDescription] = useState<string>("");
  // Hạn chót: không set ngày mặc định, để trống cho giáo viên chọn
  const [hwDeadlineDate, setHwDeadlineDate] = useState<string>("");
  const [hwDeadlineTime, setHwDeadlineTime] = useState<string>("21:00");
  const [hwMaterials, setHwMaterials] = useState<AssignmentMaterial[]>([]);
  const [hwTeacherInstruction, setHwTeacherInstruction] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // 9. Ở trường "4. Trọng tâm buổi học:" chỉ khi Enter mới chuyển thành badge, bấm dấu "," không chuyển
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTagFromInput();
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTagInput(e.target.value);
  };

  const addTagFromInput = () => {
    const trimmed = currentTagInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setCurrentTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle local File Upload for Section 5 (Images & Videos in class)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isImage && !isVideo) return;

      const fileUrl = URL.createObjectURL(file);
      const newItem: LessonMediaItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: isVideo ? "video" : "image",
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: fileUrl,
        tag: isVideo ? "Video tại lớp" : "Ảnh hoạt động",
      };

      setMediaItems((prev) => [newItem, ...prev]);
    });

    e.target.value = "";
  };

  const removeMedia = (idToRemove: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== idToRemove));
  };

  // Handle Upload Materials for Section 6 (Audio, Video, PDF, Image)
  const handleHomeworkMaterialUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const mime = file.type;
      let matType: "pdf" | "mp3" | "video" | "image" = "pdf";
      if (mime.startsWith("audio/")) {
        matType = "mp3";
      } else if (mime.startsWith("video/")) {
        matType = "video";
      } else if (mime.startsWith("image/")) {
        matType = "image";
      } else if (mime.includes("pdf")) {
        matType = "pdf";
      }

      const fileSizeBytes = file.size;
      const fileSizeStr =
        fileSizeBytes > 1024 * 1024
          ? `${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(fileSizeBytes / 1024)} KB`;

      const fileUrl = URL.createObjectURL(file);
      const newMat: AssignmentMaterial = {
        id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: matType,
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: fileUrl,
        fileSize: fileSizeStr,
      };

      setHwMaterials((prev) => [...prev, newMat]);
    });

    e.target.value = "";
  };

  const removeHwMaterial = (idToRemove: string) => {
    setHwMaterials((prev) => prev.filter((m) => m.id !== idToRemove));
  };

  // Convert YYYY-MM-DD back to DD/MM/YYYY
  const getFormattedDateDisplay = () => {
    if (!lessonDate) return "";
    const [y, m, d] = lessonDate.split("-");
    if (!y || !m || !d) return "";
    return `${d}/${m}/${y}`;
  };

  // Build Homework Deadline formatted string (e.g., "21:00 Chủ Nhật, 27/09/2026")
  const getFormattedHwDeadline = () => {
    if (!hwDeadlineDate) return "";
    const [y, m, d] = hwDeadlineDate.split("-");
    if (!y || !m || !d) return "";
    const raw = `${hwDeadlineTime || "21:00"} ${d}/${m}/${y}`;
    return formatWithCorrectDayOfWeek(raw);
  };

  // Sync to all target students
  const handleSaveAndSync = async () => {
    if (!lessonName.trim() && !hwDescription.trim()) {
      alert("Vui lòng nhập ít nhất thông tin tên buổi học hoặc nội dung bài tập về nhà!");
      return;
    }

    setIsSaving(true);
    const dateFormatted = getFormattedDateDisplay() || "Hôm nay";
    const deadlineFormatted = getFormattedHwDeadline();

    const hasNewHomework = hwDescription.trim().length > 0 || hwUnit.trim().length > 0;

    const updatedStudentsList = targetStudents.map((student) => {
      // 1. Cập nhật RecentLessonInfo
      const existingLesson = student.recentLesson;
      const updatedLesson: RecentLessonInfo = {
        lessonName: lessonName.trim() || existingLesson?.lessonName || "Buổi học bổ trợ",
        date: dateFormatted,
        topic: topic.trim() || existingLesson?.topic || "",
        skillsLearned: skills.length > 0 ? skills : (existingLesson?.skillsLearned || []),
        score: existingLesson?.score || {
          value: 9.5,
          maxScore: 10,
          label: "Điểm kiểm tra đầu giờ",
          ratingBadge: "Top 3 của lớp ⭐",
        },
        teacherFeedback:
          existingLesson?.teacherFeedback ||
          "Con tiếp thu bài rất nhanh, nắm vững cấu trúc và hăng hái phát biểu.",
        attendanceStatus: existingLesson?.attendanceStatus || "Đi học đúng giờ",
        mediaItems: mediaItems.length > 0 ? mediaItems : (existingLesson?.mediaItems || []),
      };

      // 2. Cập nhật Assignments nếu giáo viên có nhập bài tập về nhà
      let updatedAssignments = [...(student.assignments || [])];
      if (hasNewHomework) {
        const asgId = `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const asgTitle = hwDescription.trim()
          ? hwDescription.trim().split("\n")[0]
          : lessonName.trim() || "Bài tập rèn luyện tại nhà";

        const newAssignment: Assignment = {
          id: asgId,
          title: asgTitle,
          unit: hwUnit.trim() || "Unit bổ trợ",
          description: hwDescription.trim(),
          teacherInstruction: hwTeacherInstruction.trim(),
          deadline: deadlineFormatted || "21:00 Chủ Nhật tuần này",
          formattedDeadlineBadge: "Đang mở",
          status: "not_done",
          tokensReward: hwTokens,
          pdfDownloadName: `Phieu_BaiTap_${(hwUnit || "Unit").replace(/\s+/g, "_")}.pdf`,
          materials: hwMaterials.length > 0 ? hwMaterials : undefined,
        };

        // Thêm bài tập mới lên đầu danh sách bài tập của học sinh
        updatedAssignments = [newAssignment, ...updatedAssignments];
      }

      return {
        ...student,
        recentLesson: updatedLesson,
        assignments: updatedAssignments,
      };
    });

    try {
      await onSyncLessonToStudents(updatedStudentsList, {
        name: lessonName.trim() || hwUnit.trim() || "Buổi học & Bài tập mới",
        date: dateFormatted,
      });

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4500);
    } catch (err) {
      console.error("Error syncing class lesson & homework:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="section-class-lesson-editor"
      className={`bg-[#d1d9e6] border border-[#babecc]/60 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-[var(--shadow-recessed-sm)] transition-all ${
        isExpanded ? "space-y-4" : ""
      }`}
    >
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between gap-3 cursor-pointer select-none group ${
          isExpanded ? "pb-2.5 border-b border-[#babecc]/50" : ""
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ff4757] text-white flex items-center justify-center font-bold shadow-[var(--shadow-accent-sm)] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-tight group-hover:text-[#ff4757] transition-colors">
                Nhập liệu tổng quan buổi học của lớp
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#2d3436] text-white shadow-xs">
                {currentClassName === "ALL" ? "Tất cả các lớp" : `Lớp ${currentClassName}`}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-1.5 rounded-lg soft-ui-convex hover:text-[#ff4757] text-slate-700 transition-all cursor-pointer shrink-0"
          title={isExpanded ? "Thu gọn form" : "Mở rộng form"}
          aria-label={isExpanded ? "Thu gọn form" : "Mở rộng form"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Hàng 1: 1. Thông tin buổi học & 2. Thời gian */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Thông tin buổi học */}
            <div className="md:col-span-2 space-y-1.5">
              <label
                htmlFor="input-lesson-name"
                className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>1. Thông tin buổi học:</span>
                </span>
                <span className="text-[11px] text-[#666666] font-normal leading-tight">
                  (Chủ đề / Tên bài)
                </span>
              </label>
              <input
                id="input-lesson-name"
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder="Ví dụ: Phân tích và bóc tách đề chuyên"
                className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40"
              />
            </div>

            {/* 2. Thời gian: Chọn trong lịch */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-lesson-date"
                className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>2. Thời gian:</span>
                </span>
                <span className="text-[11px] text-[#666666] font-normal leading-tight">
                  (Chọn trong lịch)
                </span>
              </label>
              <input
                id="input-lesson-date"
                type="date"
                value={lessonDate}
                onChange={(e) => setLessonDate(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40 cursor-pointer font-mono"
              />
            </div>
          </div>

          {/* 3. Nội dung đã học tại lớp: Nhập text */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-lesson-topic"
              className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#ff4757]" />
                <span>3. Nội dung đã học tại lớp:</span>
              </span>
              <span className="text-[11px] text-[#666666] font-normal leading-tight">
                (Mô tả chi tiết kiến thức đã dạy)
              </span>
            </label>
            <textarea
              id="input-lesson-topic"
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Cấu trúc Thì Hiện tại Hoàn thành & Kỹ thuật bóc tách thành phần câu (S-V-O-M), luyện phát âm đuôi -ed."
              className="w-full p-2.5 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40 leading-relaxed resize-y"
            />
          </div>

          {/* 4. Trọng tâm buổi học: Nhập text, ấn Enter tạo badge khối */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-lesson-skills"
              className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
            >
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#ff4757]" />
                <span>4. Trọng tâm buổi học:</span>
              </span>
              <span className="text-[11px] text-[#666666] font-normal leading-tight">
                (Nhập text rồi gõ phím Enter để tạo từng badge khối)
              </span>
            </label>

            {/* Container gom badge và ô input gõ */}
            <div className="min-h-[46px] p-2 bg-white rounded-lg border border-[#babecc] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] flex flex-wrap items-center gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-bold font-sans bg-[#e0e5ec] text-[#1a1a1a] px-2.5 py-1 rounded-md soft-ui-convex border border-white/60 shadow-xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="text-[#666666] hover:text-[#ff4757] p-0.5 rounded cursor-pointer"
                    title={`Xóa badge "${skill}"`}
                    aria-label={`Xóa badge "${skill}"`}
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </span>
              ))}

              <input
                id="input-lesson-skills"
                type="text"
                value={currentTagInput}
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
                onBlur={addTagFromInput}
                placeholder={
                  skills.length === 0
                    ? "Nhập từ khóa trọng tâm rồi nhấn Enter (ví dụ: Ngữ pháp nâng cao, Phát âm đuôi -ed, ...)"
                    : "Thêm trọng tâm khác (nhấn Enter)..."
                }
                className="flex-1 min-w-[200px] border-none outline-none text-xs sm:text-sm bg-transparent text-[#1a1a1a] placeholder:text-slate-400 py-1"
              />
            </div>
          </div>

          {/* 5. Hình ảnh và video tại lớp: Tải lên hình ảnh, video */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#ff4757]" />
                <span>5. Hình ảnh và video tại lớp:</span>
              </label>

              {/* Input file ẩn */}
              <label
                htmlFor="input-upload-class-media"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2d3436] hover:bg-[#1a1a1a] px-3 py-1.5 rounded-lg shadow-sm border border-white/20 cursor-pointer active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-[#ff4757]" />
                <span>Tải ảnh / video lên</span>
              </label>
              <input
                id="input-upload-class-media"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Gallery Media Previews */}
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-lg overflow-hidden border border-[#babecc] bg-slate-900 aspect-video flex items-center justify-center shadow-xs"
                  >
                    {item.type === "video" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white p-2 text-center">
                        <Film className="w-5 h-5 text-indigo-400 mb-1" />
                        <span className="text-[10px] font-medium line-clamp-1 text-slate-300">
                          {item.title}
                        </span>
                        <span className="text-[9px] text-amber-300 bg-amber-400/20 px-1 rounded mt-0.5">
                          Video
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Nút xóa media */}
                    <button
                      type="button"
                      onClick={() => removeMedia(item.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                      title="Xóa media này"
                      aria-label="Xóa media này"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    {/* Badge loại */}
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white flex items-center gap-1">
                      {item.type === "video" ? (
                        <Play className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      ) : (
                        <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
                      )}
                      <span className="truncate max-w-[80px]">{item.tag || item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#babecc] rounded-lg p-3 text-center bg-white/40">
                <p className="text-xs text-[#666666]">
                  Chưa có hình ảnh/video nào. Hãy bấm "Tải ảnh / video lên" ở góc phải để thêm tư liệu lớp học.
                </p>
              </div>
            )}
          </div>

          {/* 6. TRƯỜNG DỮ LIỆU SỐ 6: "BÀI TẬP VỀ NHÀ" (ĐỒNG BỘ QUA PHẦN BÀI TẬP CỦA HỌC SINH) */}
          <div className="pt-2 border-t border-[#babecc]/60 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2d3436] text-[#ff4757] flex items-center justify-center font-bold shadow-xs shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-tight">
                  6. Bài tập về nhà:
                </span>
              </div>
            </div>

            {/* Khung chứa các trường dữ liệu của bài tập về nhà */}
            <div className="bg-[#e0e5ec] border border-white/90 border-b-[#babecc] border-r-[#babecc] rounded-xl p-3.5 sm:p-4 shadow-[var(--shadow-card-sm)] space-y-3.5">
              {/* Hàng: Unit buổi học & Thưởng tokens */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Unit buổi học (Nhập text) */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="input-hw-unit"
                    className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#ff4757]" />
                      <span>Unit buổi học:</span>
                    </span>
                    <span className="text-[11px] text-[#666666] font-normal leading-tight">
                      (Ví dụ: Unit 3 - Speaking & Reading Focus)
                    </span>
                  </label>
                  <input
                    id="input-hw-unit"
                    type="text"
                    value={hwUnit}
                    onChange={(e) => setHwUnit(e.target.value)}
                    placeholder="Ví dụ: Unit 3 - Speaking & Reading Focus"
                    className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40"
                  />
                </div>

                {/* Thưởng tokens: (Chọn +5, +10, +15 tokens) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>Thưởng tokens:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 min-h-[42px] items-center">
                    {[5, 10, 15].map((pts) => {
                      const isSelected = hwTokens === pts;
                      return (
                        <button
                          key={pts}
                          type="button"
                          onClick={() => setHwTokens(pts)}
                          className={`min-h-[40px] px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 border ${
                            isSelected
                              ? "bg-[#ff4757] text-white border-[#ff4757] shadow-[var(--shadow-accent-sm)]"
                              : "bg-white text-[#1a1a1a] border-[#babecc] hover:bg-slate-50 soft-ui-convex"
                          }`}
                        >
                          +{pts}T
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Nội dung bài tập: (Nhập text) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="input-hw-description"
                  className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#ff4757]" />
                    <span>Nội dung bài tập:</span>
                  </span>
                  <span className="text-[11px] text-[#666666] font-normal leading-tight">
                    (Mô tả yêu cầu bài tập cho học sinh)
                  </span>
                </label>
                <textarea
                  id="input-hw-description"
                  rows={2}
                  value={hwDescription}
                  onChange={(e) => setHwDescription(e.target.value)}
                  placeholder="Ví dụ: Làm phiếu bài tập Thì Hiện Tại Hoàn Thành (Part 1 & 2), gạch chân từ khóa và bóc tách thành phần câu S-V-O-M."
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40 leading-relaxed resize-y"
                />
              </div>

              {/* Hạn chót: (Chọn trong lịch) - không set ngày mặc định */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="input-hw-deadline-date"
                    className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
                  >
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#ff4757]" />
                      <span>Hạn chót:</span>
                    </span>
                    <span className="text-[11px] text-[#666666] font-normal leading-tight">
                      (Chọn ngày trong lịch)
                    </span>
                  </label>
                  <input
                    id="input-hw-deadline-date"
                    type="date"
                    value={hwDeadlineDate}
                    onChange={(e) => setHwDeadlineDate(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40 cursor-pointer font-mono"
                  />
                </div>

                {/* Giờ hạn chót */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="input-hw-deadline-time"
                    className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#ff4757]" />
                    <span>Giờ hạn chót:</span>
                  </label>
                  <input
                    id="input-hw-deadline-time"
                    type="time"
                    value={hwDeadlineTime}
                    onChange={(e) => setHwDeadlineTime(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40 cursor-pointer font-mono"
                  />
                </div>
              </div>

              {/* Tài liệu: (Upload đa định dạng: Audio, Video, PDF, Image) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5">
                    <span className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#ff4757]" />
                      <span>Tài liệu:</span>
                    </span>
                    <span className="text-[11px] text-[#666666] font-normal leading-tight">
                      (Upload đa định dạng: Audio, Video, PDF, Image)
                    </span>
                  </label>

                  {/* Nút Upload tài liệu */}
                  <label
                    htmlFor="input-upload-hw-materials"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2d3436] hover:bg-[#1a1a1a] px-3 py-1.5 rounded-lg shadow-sm border border-white/20 cursor-pointer active:scale-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#ff4757]" />
                    <span>Tải tài liệu lên</span>
                  </label>
                  <input
                    id="input-upload-hw-materials"
                    type="file"
                    multiple
                    accept=".pdf,image/*,video/*,audio/*"
                    onChange={handleHomeworkMaterialUpload}
                    className="hidden"
                  />
                </div>

                {/* Danh sách tài liệu đã upload */}
                {hwMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {hwMaterials.map((mat) => {
                      return (
                        <div
                          key={mat.id}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-[#babecc] shadow-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-md bg-[#d1d9e6] text-[#ff4757] flex items-center justify-center shrink-0">
                              {mat.type === "pdf" && <FileText className="w-4 h-4" />}
                              {mat.type === "mp3" && <Headphones className="w-4 h-4" />}
                              {mat.type === "video" && <Film className="w-4 h-4" />}
                              {mat.type === "image" && <ImageIcon className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#1a1a1a] truncate">
                                {mat.title}
                              </p>
                              <span className="text-[10px] text-[#666666] uppercase font-mono">
                                {mat.type} • {mat.fileSize || "Đính kèm"}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeHwMaterial(mat.id)}
                            className="p-1 rounded-md text-[#666666] hover:text-red-600 transition-colors cursor-pointer shrink-0"
                            title="Xóa tài liệu này"
                            aria-label="Xóa tài liệu này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-dashed border-[#babecc] rounded-lg p-2.5 text-center bg-white/40">
                    <p className="text-xs text-[#666666]">
                      Chưa có tài liệu đính kèm. Bấm "Tải tài liệu lên" để thêm file Audio MP3, Video bài giảng, đề PDF hoặc Ảnh.
                    </p>
                  </div>
                )}
              </div>

              {/* Hướng dẫn từ cô Nghi: (Nhập text) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="input-hw-teacher-instruction"
                  className="text-xs font-bold text-[#1a1a1a] flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff4757]" />
                    <span>Hướng dẫn từ cô Nghi:</span>
                  </span>
                  <span className="text-[11px] text-[#666666] font-normal leading-tight">
                    (Lời dặn dò cho học sinh khi làm bài)
                  </span>
                </label>
                <textarea
                  id="input-hw-teacher-instruction"
                  rows={2}
                  value={hwTeacherInstruction}
                  onChange={(e) => setHwTeacherInstruction(e.target.value)}
                  placeholder="Ví dụ: Các con in phiếu hoặc chép trực tiếp vào vở, gạch chân cấu trúc và nộp trước hạn chót nhé!"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-lg bg-white border border-[#babecc] text-[#1a1a1a] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/40 leading-relaxed resize-y"
                />
              </div>
            </div>
          </div>

          {/* Action Row: Nút Đồng bộ dữ liệu sang toàn bộ học sinh của lớp */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#babecc]/50">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                id="btn-sync-lesson-to-parents"
                onClick={handleSaveAndSync}
                disabled={isSaving}
                className="w-full sm:w-auto min-h-[42px] px-5 py-2.5 rounded-lg bg-[#ff4757] hover:bg-[#e03949] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[var(--shadow-accent)] border border-white/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang đồng bộ Firebase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu & Đồng bộ sang Cổng phụ huynh</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Toast thông báo lưu thành công */}
          {showSuccessToast && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-400/80 p-3 flex items-center gap-2.5 text-xs text-emerald-950 font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Đã đồng bộ thành công thông tin buổi học & bài tập về nhà tới {targetStudents.length} học sinh trong lớp!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
