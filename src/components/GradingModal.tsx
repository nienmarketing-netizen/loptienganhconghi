import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  BookOpen,
  TrendingUp,
  Trash2,
  Upload,
  FileCheck,
  Film,
  Paperclip,
  Calendar,
  Eye,
  Edit3,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Mic,
} from "lucide-react";
import {
  StudentProfile,
  RadarCapabilityPoint,
  Assignment,
  GradedMediaItem,
  LessonMediaItem,
} from "../types";
import { useLockBodyScroll } from "../lib/useLockBodyScroll";

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  defaultLessonName?: string;
  defaultLessonDate?: string;
  onSave: (updatedStudent: StudentProfile) => Promise<void>;
}

interface UploadedMediaItem {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  title: string;
  thumbnail?: string;
  duration?: string;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  isOpen,
  onClose,
  student,
  defaultLessonName = "",
  defaultLessonDate = "",
  onSave,
}) => {
  useLockBodyScroll(isOpen);

  // Mode: "edit" (Nhập liệu) or "review" (Xem lại & Kiểm tra)
  const [viewMode, setViewMode] = useState<"edit" | "review">("edit");
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);

  // Tab switcher: "lesson" ("Chấm điểm buổi học") & "periodic" ("Đánh giá định kỳ")
  const [activeTab, setActiveTab] = useState<"lesson" | "periodic">("lesson");

  // ================= TAB 1: CHẤM ĐIỂM BUỔI HỌC =================
  // 3.1. Tên bài học (mặc định lấy từ tổng quan buổi học lớp hoặc buổi học gần nhất)
  const [lessonName, setLessonName] = useState<string>("");
  // 2. Ngày học: Mặc định lấy từ "2. Thời gian" của tổng quan lớp
  const [lessonDate, setLessonDate] = useState<string>("");
  const [scoreValue, setScoreValue] = useState<number>(9.5);
  const [scoreBadge, setScoreBadge] = useState<string>("Top 3 của lớp ⭐");
  const [teacherFeedback, setTeacherFeedback] = useState<string>(
    "Con tiếp thu bài rất nhanh, nắm vững cấu trúc bóc tách câu và hăng hái phát biểu."
  );

  // 3.2. Chữa bài tập về nhà
  const [selectedHwId, setSelectedHwId] = useState<string>("");
  const [hwScore, setHwScore] = useState<number>(9.5);
  const [hwComment, setHwComment] = useState<string>(
    "Con làm bài rất cẩn thận, bóc tách cấu trúc câu tốt, chú ý thêm cách dùng thì quá khứ đơn."
  );
  const [hwFeedbackTitle, setHwFeedbackTitle] = useState<string>(
    "Xuất sắc! Bóc tách cấu trúc rất tốt ⭐"
  );
  const [hwMediaList, setHwMediaList] = useState<UploadedMediaItem[]>([]);

  // 3.4. Hình ảnh tại lớp học (Tùy chọn cho học sinh này)
  const [studentClassroomMedia, setStudentClassroomMedia] = useState<UploadedMediaItem[]>([]);

  // ================= TAB 2: ĐÁNH GIÁ ĐỊNH KỲ (5 TRỤC RADAR) =================
  const [radarVocab, setRadarVocab] = useState<number>(75);
  const [radarGrammar, setRadarGrammar] = useState<number>(80);
  const [radarListening, setRadarListening] = useState<number>(70);
  const [radarSpeaking, setRadarSpeaking] = useState<number>(65);
  const [radarAttitude, setRadarAttitude] = useState<number>(90);

  // 8.1: Chọn ngày tháng từ lịch cho đánh giá định kỳ
  const [periodicDate, setPeriodicDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [examName, setExamName] = useState<string>("Kiểm tra Giữa kỳ 1 ở trường");

  // 8.2: Chia thành 2 ô điểm thi: Điểm tại lớp và Điểm ở trường
  const [classExamScore, setClassExamScore] = useState<number>(8.5);
  const [schoolExamScore, setSchoolExamScore] = useState<number>(8.5);

  // 8.3: Lời nhắn gửi riêng cho phụ huynh (đồng bộ sang 'Lời nhắn riêng cho ba mẹ')
  const [parentMessage, setParentMessage] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Hidden file input refs
  const hwFileInputRef = useRef<HTMLInputElement>(null);
  const classroomMediaInputRef = useRef<HTMLInputElement>(null);

  // Helper date formatter (YYYY-MM-DD -> DD/MM/YYYY)
  const formatToDisplayDate = (dStr: string) => {
    if (!dStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
      const [y, m, d] = dStr.split("-");
      return `${d}/${m}/${y}`;
    }
    return dStr;
  };

  // Synchronize state when student or props change
  useEffect(() => {
    if (!student) return;

    setViewMode("edit");
    setIsSavedSuccess(false);

    // 1. Tên bài học: Mặc định lấy từ tổng quan buổi học lớp
    const initialLesson =
      defaultLessonName.trim() ||
      student.recentLesson?.lessonName ||
      "Buổi học bổ trợ & Ôn tập đề thi";
    setLessonName(initialLesson);

    // 2. Ngày học: Mặc định lấy từ "2. Thời gian" của lớp
    const initialDate =
      formatToDisplayDate(defaultLessonDate.trim()) ||
      student.recentLesson?.date ||
      new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    setLessonDate(initialDate);

    setScoreValue(student.recentLesson?.score?.value ?? 9.5);
    setScoreBadge(student.recentLesson?.score?.ratingBadge || "Top 3 của lớp ⭐");
    setTeacherFeedback(
      student.recentLesson?.teacherFeedback ||
        "Con tiếp thu bài rất nhanh, nắm vững cấu trúc bóc tách câu và hăng hái phát biểu."
    );

    // Homework correction selection: CHỈ LẤY BÀI TẬP ĐÃ NỘP VÀ CHƯA CHẤM
    const assignments = student.assignments || [];
    const submittedAsgList = assignments.filter((a) => a.status === "submitted");
    const targetAsg = submittedAsgList[0] || null;

    if (targetAsg) {
      setSelectedHwId(targetAsg.id);
      if (targetAsg.gradedDetails) {
        setHwScore(targetAsg.gradedDetails.score ?? 9.5);
        setHwComment(
          targetAsg.gradedDetails.comment ||
            "Con làm bài rất cẩn thận, bóc tách cấu trúc câu tốt."
        );
        setHwFeedbackTitle(
          targetAsg.gradedDetails.feedbackTitle || "Xuất sắc! Bóc tách cấu trúc rất tốt ⭐"
        );
        if (targetAsg.gradedDetails.mediaItems && targetAsg.gradedDetails.mediaItems.length > 0) {
          setHwMediaList(
            targetAsg.gradedDetails.mediaItems.map((m) => ({
              id: m.id,
              type: m.type,
              url: m.url,
              title: m.title,
              thumbnail: m.thumbnail || m.url,
              duration: m.duration,
            }))
          );
        } else if (targetAsg.gradedDetails.gradedImage) {
          setHwMediaList([
            {
              id: `hw-init-${Date.now()}`,
              type: "image",
              url: targetAsg.gradedDetails.gradedImage,
              title: "Bài chấm trực tiếp tại lớp của con",
              thumbnail: targetAsg.gradedDetails.gradedImage,
            },
          ]);
        }
      } else {
        setHwScore(9.5);
        setHwComment(
          "Con làm bài rất cẩn thận, bóc tách cấu trúc câu tốt, chú ý thêm cách dùng thì quá khứ đơn."
        );
        setHwFeedbackTitle("Xuất sắc! Bóc tách cấu trúc rất tốt ⭐");
        setHwMediaList([]);
      }
    } else {
      setSelectedHwId("");
      setHwScore(9.5);
      setHwComment("");
      setHwFeedbackTitle("");
      setHwMediaList([]);
    }

    // Classroom Media (3.4)
    if (student.recentLesson?.mediaItems && student.recentLesson.mediaItems.length > 0) {
      setStudentClassroomMedia(
        student.recentLesson.mediaItems.map((m) => ({
          id: m.id,
          type: (m.type as "image" | "video" | "audio") || "image",
          url: m.url,
          title: m.title,
          thumbnail: m.thumbnail || m.url,
          duration: m.duration,
        }))
      );
    } else {
      setStudentClassroomMedia([]);
    }

    // Tab 2 (Đánh giá định kỳ)
    setRadarVocab(student.radarCapabilities?.find((r) => r.subject === "Từ vựng")?.current || 75);
    setRadarGrammar(student.radarCapabilities?.find((r) => r.subject === "Ngữ pháp")?.current || 80);
    setRadarListening(student.radarCapabilities?.find((r) => r.subject === "Nghe hiểu")?.current || 70);
    setRadarSpeaking(student.radarCapabilities?.find((r) => r.subject === "Phát âm")?.current || 65);
    setRadarAttitude(student.radarCapabilities?.find((r) => r.subject === "Thái độ")?.current || 90);

    const latestGrowth = student.growthHistory && student.growthHistory.length > 0
      ? student.growthHistory[student.growthHistory.length - 1]
      : null;
    setClassExamScore(latestGrowth?.classScore ?? 8.5);
    setSchoolExamScore(latestGrowth?.schoolScore ?? 8.5);

    // 8.3: Lời nhắn riêng cho ba mẹ
    setParentMessage(student.teacherDiagnosis?.messageToParents || "");
  }, [student, defaultLessonName, defaultLessonDate, isOpen]);

  if (!isOpen || !student) return null;

  // Handle assignment select change
  const handleAssignmentChange = (asgId: string) => {
    setSelectedHwId(asgId);
    const asg = (student.assignments || []).find((a) => a.id === asgId);
    if (asg && asg.gradedDetails) {
      setHwScore(asg.gradedDetails.score ?? 9.5);
      setHwComment(asg.gradedDetails.comment || "");
      setHwFeedbackTitle(asg.gradedDetails.feedbackTitle || "Xuất sắc!");
      if (asg.gradedDetails.mediaItems && asg.gradedDetails.mediaItems.length > 0) {
        setHwMediaList(
          asg.gradedDetails.mediaItems.map((m) => ({
            id: m.id,
            type: m.type,
            url: m.url,
            title: m.title,
            thumbnail: m.thumbnail || m.url,
            duration: m.duration,
          }))
        );
      }
    }
  };

  // Generic file uploader
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetListSetter: React.Dispatch<React.SetStateAction<UploadedMediaItem[]>>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      let type: "image" | "video" | "audio" = "image";
      if (file.type.startsWith("video/")) type = "video";
      else if (file.type.startsWith("audio/")) type = "audio";

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        targetListSetter((prev) => [
          ...prev,
          {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            type,
            url: fileUrl,
            title: file.name.replace(/\.[^/.]+$/, ""),
            thumbnail: type === "image" ? fileUrl : undefined,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // Helper to build updatedStudent object
  const buildUpdatedStudent = (): StudentProfile => {
    let updatedStudent = { ...student };

    if (activeTab === "lesson") {
      // 3.4. HÌNH ẢNH TẠI LỚP HỌC
      const existingClassMedia: LessonMediaItem[] = student.recentLesson?.mediaItems || [];
      const studentMediaItemsFormatted: LessonMediaItem[] = studentClassroomMedia.map((m) => ({
        id: m.id,
        type: m.type,
        url: m.url,
        title: m.title,
        thumbnail: m.thumbnail || m.url,
        duration: m.duration,
        uploadedBy: "Cô Nghi",
      }));

      const mergedClassroomMedia = [
        ...studentMediaItemsFormatted,
        ...existingClassMedia.filter(
          (em) => !studentMediaItemsFormatted.some((sm) => sm.url === em.url)
        ),
      ];

      // 3.1 & 2: Cập nhật RecentLessonInfo
      const updatedRecentLesson = {
        date: lessonDate.trim() || new Date().toLocaleDateString("vi-VN"),
        lessonName:
          lessonName.trim() ||
          student.recentLesson?.lessonName ||
          "Buổi học bổ trợ & Ôn tập đề thi",
        topic: student.recentLesson?.topic || "Nội dung bài học định kỳ lớp Cô Nghi",
        skillsLearned: student.recentLesson?.skillsLearned || ["Từ vựng", "Ngữ pháp"],
        score: {
          value: scoreValue,
          maxScore: 10,
          label: "Điểm kiểm tra buổi học",
          ratingBadge: scoreBadge,
        },
        teacherFeedback: teacherFeedback.trim(),
        attendanceStatus: student.recentLesson?.attendanceStatus || "Đi học đúng giờ",
        mediaItems: mergedClassroomMedia,
      };

      // 3.2. Chữa bài tập về nhà
      let updatedAssignments = [...(student.assignments || [])];
      if (selectedHwId) {
        updatedAssignments = updatedAssignments.map((asg) => {
          if (asg.id === selectedHwId) {
            const defaultImage =
              hwMediaList.find((m) => m.type === "image")?.url ||
              "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80";

            const gradedMedias: GradedMediaItem[] = hwMediaList.map((m, idx) => ({
              id: m.id || `gm-${Date.now()}-${idx}`,
              type: m.type,
              url: m.url,
              thumbnail: m.thumbnail || m.url,
              title: m.title || `Trang ${idx + 1}: Bài làm & nét bút đỏ sửa tại lớp`,
              tag:
                m.type === "image"
                  ? "Nét bút đỏ con ghi chú"
                  : m.type === "video"
                  ? "Video học sinh tự sửa"
                  : "Audio luyện sửa",
              duration: m.duration,
              uploadedBy: "Cô Nghi",
            }));

            return {
              ...asg,
              status: "graded" as const,
              gradedDetails: {
                score: hwScore,
                maxScore: 10,
                feedbackTitle: hwFeedbackTitle || "Xuất sắc! Bóc tách cấu trúc rất tốt ⭐",
                comment: hwComment.trim(),
                gradedImage: defaultImage,
                gradedImages: hwMediaList.filter((m) => m.type === "image").map((m) => m.url),
                mediaItems: gradedMedias,
                audioDuration: 45,
                voiceTranscript: hwComment.trim(),
                teacherStamp: "Cô Nghi đã chấm ⭐",
                corrections: asg.gradedDetails?.corrections || [
                  {
                    question: "Phân tích cấu trúc câu và thì",
                    studentAnswer: "Con làm bài đầy đủ các bước",
                    teacherCorrection: "Cô Nghi đã chấm & sửa chi tiết từng nét bút đỏ",
                    explanation: hwComment.trim(),
                  },
                ],
              },
            };
          }
          return asg;
        });
      }

      updatedStudent = {
        ...updatedStudent,
        recentLesson: updatedRecentLesson,
        assignments: updatedAssignments,
      };
    } else {
      // TAB 2: ĐÁNH GIÁ ĐỊNH KỲ (5 TRỤC RADAR)
      const updatedRadar: RadarCapabilityPoint[] = [
        {
          subject: "Từ vựng",
          baseline:
            student.radarCapabilities?.find((r) => r.subject === "Từ vựng")?.baseline || 50,
          current: radarVocab,
          fullMark: 100,
        },
        {
          subject: "Ngữ pháp",
          baseline:
            student.radarCapabilities?.find((r) => r.subject === "Ngữ pháp")?.baseline || 45,
          current: radarGrammar,
          fullMark: 100,
        },
        {
          subject: "Nghe hiểu",
          baseline:
            student.radarCapabilities?.find((r) => r.subject === "Nghe hiểu")?.baseline || 55,
          current: radarListening,
          fullMark: 100,
        },
        {
          subject: "Phát âm",
          baseline:
            student.radarCapabilities?.find((r) => r.subject === "Phát âm")?.baseline || 40,
          current: radarSpeaking,
          fullMark: 100,
        },
        {
          subject: "Thái độ",
          baseline:
            student.radarCapabilities?.find((r) => r.subject === "Thái độ")?.baseline || 70,
          current: radarAttitude,
          fullMark: 100,
        },
      ];

      const updatedGrowth = [...(student.growthHistory || [])];
      const formattedPeriodicDate = formatToDisplayDate(periodicDate);

      if (examName.trim()) {
        const periodDisplay = formattedPeriodicDate
          ? `${examName.trim()} (${formattedPeriodicDate})`
          : examName.trim();

        updatedGrowth.push({
          period: periodDisplay,
          classScore: classExamScore,
          schoolScore: schoolExamScore,
          note: `Đánh giá ngày ${formattedPeriodicDate || new Date().toLocaleDateString("vi-VN")}`,
        });
      }

      updatedStudent = {
        ...updatedStudent,
        radarCapabilities: updatedRadar,
        growthHistory: updatedGrowth,
        teacherDiagnosis: {
          ...student.teacherDiagnosis,
          currentOverallScore: schoolExamScore,
          messageToParents: parentMessage.trim() || student.teacherDiagnosis.messageToParents,
        },
      };
    }

    return updatedStudent;
  };

  const handleSaveAndSync = async () => {
    setIsSubmitting(true);
    try {
      const updated = buildUpdatedStudent();
      await onSave(updated);
      setIsSavedSuccess(true);
      setViewMode("review");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveAndSync();
  };

  const studentAssignments = student.assignments || [];
  const submittedAssignments = studentAssignments.filter((a) => a.status === "submitted");
  const selectedAssignmentObj = studentAssignments.find((a) => a.id === selectedHwId);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 sm:p-6 text-slate-800 overflow-hidden">
        {/* ======================================================== */}
        {/* TIÊU ĐỀ XANH DƯƠNG SÁNG (#0066FF)                        */}
        {/* ======================================================== */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
          <div className="space-y-1 text-left w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-[#0066FF] tracking-tight">
                Nhập liệu học vụ
              </h2>
              {/* Badge trạng thái Xem lại / Chỉnh sửa */}
              {viewMode === "review" ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                  <Eye className="w-3 h-3 text-sky-600" />
                  Bản xem lại học vụ
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Edit3 className="w-3 h-3 text-amber-600" />
                  Đang chỉnh sửa dữ liệu
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800">
              Tên học sinh: <span className="font-bold text-[#0066FF]">{student.fullName}</span>
            </div>
            <div className="text-xs font-mono font-semibold text-slate-500">
              Mã học sinh: <span className="text-slate-800 font-bold">{student.id}</span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Cập nhật buổi học mới và điểm số tiến bộ
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Toggle Button between Edit and Review */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "edit" ? "review" : "edit")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0066FF] transition-colors border border-slate-200 cursor-pointer"
              title={viewMode === "edit" ? "Xem lại thông tin đã nhập" : "Quay lại chỉnh sửa"}
            >
              {viewMode === "edit" ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span className="hidden sm:inline">Xem lại</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span className="hidden sm:inline">Chỉnh sửa</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shrink-0 border border-slate-200 cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* BANNER THÔNG BÁO KHI ĐÃ LƯU THÀNH CÔNG */}
        {isSavedSuccess && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu & đồng bộ học vụ thành công! Bạn có thể xem lại hoặc tiếp tục chỉnh sửa bên dưới.</span>
            </div>
            {viewMode === "review" && (
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Edit3 className="w-3 h-3" />
                <span>Chỉnh sửa tiếp</span>
              </button>
            )}
          </div>
        )}

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("lesson")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "lesson"
                ? "bg-[#0066FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Chấm điểm buổi học</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("periodic")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "periodic"
                ? "bg-[#0066FF] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Đánh giá định kỳ</span>
          </button>
        </div>

        {/* NỘI DUNG CHÍNH */}
        {viewMode === "edit" ? (
          /* FORM NHẬP LIỆU */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
            {activeTab === "lesson" ? (
              /* TAB 1: CHẤM ĐIỂM BUỔI HỌC */
              <div className="space-y-3.5 text-xs">
                {/* 3.1 & 2: Tên bài học & Ngày học */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800">Tên bài học</label>
                      <span className="text-[10px] text-[#0066FF] font-semibold">
                        (Mặc định từ tổng quan lớp)
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={lessonName}
                      onChange={(e) => setLessonName(e.target.value)}
                      placeholder="Ví dụ: Phân tích và bóc tách đề chuyên"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-800">Ngày học</label>
                      <span className="text-[10px] text-[#0066FF] font-semibold">
                        (Từ tổng quan lớp)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={lessonDate}
                      onChange={(e) => setLessonDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                {/* Điểm mini-test & Huy hiệu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-800 mb-1">
                      Điểm mini-test (0 - 10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={scoreValue}
                      onChange={(e) => setScoreValue(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#0066FF] font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] text-center"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-800 mb-1">
                      Huy hiệu khen ngợi
                    </label>
                    <input
                      type="text"
                      value={scoreBadge}
                      onChange={(e) => setScoreBadge(e.target.value)}
                      placeholder="VD: Top 3 của lớp ⭐"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Lời nhận xét của Cô Nghi (Buổi học)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={teacherFeedback}
                    onChange={(e) => setTeacherFeedback(e.target.value)}
                    placeholder="Ghi nhận xét cụ thể để phụ huynh đọc được ngay..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF]"
                  />
                </div>

                {/* CHỮA BÀI TẬP VỀ NHÀ */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                    <FileCheck className="w-4 h-4 text-[#0066FF]" />
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono">
                      Chữa bài tập về nhà
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800 text-xs">
                      Tên bài tập về nhà cần chữa:
                    </label>
                    <select
                      value={selectedHwId}
                      onChange={(e) => handleAssignmentChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] shadow-xs cursor-pointer"
                    >
                      {submittedAssignments.length > 0 ? (
                        submittedAssignments.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.unit} - {a.title}
                          </option>
                        ))
                      ) : (
                        <option value="">(Không có bài tập nào đã nộp đang chờ chấm)</option>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-800 text-xs mb-1">
                        Điểm số (Thang 10):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={hwScore}
                        onChange={(e) => setHwScore(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#0066FF] font-mono font-bold text-sm shadow-xs focus:outline-none text-center"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-800 text-xs mb-1">
                        Tiêu đề đánh giá ngắn:
                      </label>
                      <input
                        type="text"
                        value={hwFeedbackTitle}
                        onChange={(e) => setHwFeedbackTitle(e.target.value)}
                        placeholder="VD: Xuất sắc! Bóc tách cấu trúc rất tốt ⭐"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-800 text-xs">
                      Nhận xét chữa bài của Cô Nghi:
                    </label>
                    <textarea
                      rows={2}
                      value={hwComment}
                      onChange={(e) => setHwComment(e.target.value)}
                      placeholder="Ghi nhận xét chi tiết, nhắc nhở lỗi sai hoặc khen ngợi con..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>File đính kèm chữa bài (Hình ảnh, video, audio):</span>
                    </label>

                    <input
                      type="file"
                      ref={hwFileInputRef}
                      multiple
                      accept="image/*,video/*,audio/*"
                      onChange={(e) => handleFileUpload(e, setHwMediaList)}
                      className="hidden"
                    />

                    <div
                      onClick={() => hwFileInputRef.current?.click()}
                      className="p-3 border-2 border-dashed border-slate-300 hover:border-[#0066FF] rounded-xl bg-white hover:bg-blue-50/30 text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0066FF]"
                    >
                      <Upload className="w-4 h-4 text-[#0066FF]" />
                      <span>Bấm vào đây để tải lên ảnh chấm bài / video / audio chữa bài</span>
                    </div>

                    {hwMediaList.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {hwMediaList.map((item, idx) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {item.type === "image" ? (
                                <img
                                  src={item.url}
                                  alt="Thumbnail"
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                              ) : item.type === "video" ? (
                                <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                                  <Film className="w-4 h-4 text-sky-400" />
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                                  <Mic className="w-4 h-4" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-slate-800 truncate block">
                                  {item.title || `File chữa bài ${idx + 1}`}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase font-mono">
                                  Định dạng: {item.type}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setHwMediaList((prev) => prev.filter((m) => m.id !== item.id))
                              }
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                              title="Xóa file này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* HÌNH ẢNH TẠI LỚP HỌC */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                    <Film className="w-4 h-4 text-[#0066FF]" />
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono">
                      Hình ảnh & Video học tập tại lớp của con
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tùy chọn tải lên hình ảnh / video / audio thực tế của riêng {student.fullName} trong buổi học.
                    Phần này sẽ hiển thị kết hợp cùng với các hình ảnh chung của cả lớp ở cổng phụ huynh.
                  </p>

                  <input
                    type="file"
                    ref={classroomMediaInputRef}
                    multiple
                    accept="image/*,video/*,audio/*"
                    onChange={(e) => handleFileUpload(e, setStudentClassroomMedia)}
                    className="hidden"
                  />

                  <div>
                    <button
                      type="button"
                      onClick={() => classroomMediaInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 hover:text-[#0066FF] flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>Tải ảnh / video / audio của con</span>
                    </button>
                  </div>

                  {studentClassroomMedia.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {studentClassroomMedia.map((m) => (
                        <div
                          key={m.id}
                          className="relative rounded-xl overflow-hidden border border-slate-200 bg-white group p-1.5 shadow-xs"
                        >
                          {m.type === "image" ? (
                            <img
                              src={m.url}
                              alt={m.title}
                              className="w-full h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-16 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                              <Film className="w-6 h-6 text-sky-400" />
                            </div>
                          )}
                          <div className="text-[10px] font-bold text-slate-800 truncate mt-1">
                            {m.title}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setStudentClassroomMedia((prev) =>
                                prev.filter((item) => item.id !== m.id)
                              )
                            }
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-rose-700"
                            title="Xóa file này"
                          >
                            <X className="w-3 h-3 stroke-[3]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: ĐÁNH GIÁ ĐỊNH KỲ (5 TRỤC RADAR) */
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono block">
                    Cập nhật 5 Trục Năng Lực Hiện Tại (Radar Current - Thang 0-100)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono">
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Từ vựng: {radarVocab}đ</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={radarVocab}
                        onChange={(e) => setRadarVocab(parseInt(e.target.value, 10))}
                        className="w-full accent-[#0066FF]"
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Ngữ pháp: {radarGrammar}đ</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={radarGrammar}
                        onChange={(e) => setRadarGrammar(parseInt(e.target.value, 10))}
                        className="w-full accent-[#0066FF]"
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Nghe hiểu: {radarListening}đ</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={radarListening}
                        onChange={(e) => setRadarListening(parseInt(e.target.value, 10))}
                        className="w-full accent-[#0066FF]"
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Phát âm: {radarSpeaking}đ</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={radarSpeaking}
                        onChange={(e) => setRadarSpeaking(parseInt(e.target.value, 10))}
                        className="w-full accent-[#0066FF]"
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Thái độ: {radarAttitude}đ</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={radarAttitude}
                        onChange={(e) => setRadarAttitude(parseInt(e.target.value, 10))}
                        className="w-full accent-[#0066FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* Cột mốc & Điểm thi định kỳ */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-mono block">
                    Cột mốc & Điểm thi định kỳ
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Tên bài kiểm tra / Cột mốc
                      </label>
                      <input
                        type="text"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                        placeholder="VD: Kiểm tra Giữa kỳ 1"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                        <span>Ngày thi / Ngày đánh giá:</span>
                      </label>
                      <input
                        type="date"
                        value={periodicDate}
                        onChange={(e) => setPeriodicDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono text-xs shadow-xs focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Điểm thi tại lớp (0 - 10)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={classExamScore}
                        onChange={(e) => setClassExamScore(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#0066FF] font-mono font-bold text-sm shadow-xs focus:outline-none text-center"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Điểm thi ở trường (0 - 10)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={schoolExamScore}
                        onChange={(e) => setSchoolExamScore(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-emerald-800 font-mono font-bold text-sm shadow-xs focus:outline-none text-center"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-1">
                    <label className="block font-bold text-slate-800">
                      Lời nhắn gửi riêng cho phụ huynh
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={parentMessage}
                    onChange={(e) => setParentMessage(e.target.value)}
                    placeholder="Ghi lời nhắn gửi riêng cho ba mẹ về năng lực, thái độ học tập và giải pháp tiếp theo của con..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0066FF] leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons của Form Nhập liệu */}
            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100 flex-wrap">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold text-xs border border-slate-200 cursor-pointer"
              >
                Đóng
              </button>

              <div className="flex items-center gap-2">
                {/* Tuỳ chọn Xem lại trước khi lưu */}
                <button
                  type="button"
                  onClick={() => setViewMode("review")}
                  className="px-3.5 py-2 rounded-xl text-sky-800 hover:text-sky-900 bg-sky-50 font-bold text-xs border border-sky-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-sky-600" />
                  <span>Xem lại nội dung đã nhập</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#004099] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSubmitting ? "Đang lưu..." : "Lưu & Đồng bộ học vụ"}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* ======================================================== */
          /* MÀN HÌNH XEM LẠI & CHỈNH SỬA (REVIEW MODE)                 */
          /* ======================================================== */
          <div className="mt-4 space-y-3.5 flex-1 overflow-y-auto pr-1 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-xs text-slate-800 block">
                  Tổng hợp nội dung học vụ chuẩn bị gửi / đã lưu
                </span>
                <span className="text-[11px] text-slate-500">
                  Kiểm tra kỹ lưỡng các thông tin hiển thị ở cổng phụ huynh
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className="px-3 py-1.5 rounded-xl bg-white text-[#0066FF] font-bold text-xs border border-blue-200 flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-blue-50"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa lại</span>
              </button>
            </div>

            {/* Block 1: Buổi học & Chấm điểm mini-test */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#0066FF]" />
                  <span>1. Buổi học mới nhất & Điểm số</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">{lessonDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Tên bài học:</span>
                  <span className="font-bold text-slate-800">{lessonName || "(Chưa nhập)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Điểm mini-test:</span>
                    <span className="font-bold text-sm text-[#0066FF] font-mono">{scoreValue} / 10đ</span>
                  </div>
                  {scoreBadge && (
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md mt-3">
                      {scoreBadge}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">Nhận xét của Cô Nghi:</span>
                <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-0.5 leading-relaxed">
                  "{teacherFeedback || "(Chưa có nhận xét)"}"
                </p>
              </div>
            </div>

            {/* Block 2: Chữa bài tập về nhà */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#0066FF]" />
                  <span>2. Chữa bài tập về nhà</span>
                </span>
                {selectedAssignmentObj ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    Đã chọn bài
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">(Chưa chọn bài tập)</span>
                )}
              </div>

              {selectedAssignmentObj ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Bài tập được chữa:</span>
                      <span className="font-bold text-slate-800">
                        {selectedAssignmentObj.unit} - {selectedAssignmentObj.title}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Điểm bài tập & Đánh giá:</span>
                      <span className="font-bold text-sm text-[#0066FF] font-mono">{hwScore} / 10đ</span>
                      <span className="text-[11px] text-slate-700 ml-1.5 font-semibold">
                        ({hwFeedbackTitle})
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block">Nhận xét chữa bài:</span>
                    <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-0.5 leading-relaxed">
                      "{hwComment || "(Chưa có nhận xét)"}"
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[11px] block mb-1">
                      File đính kèm ({hwMediaList.length} file):
                    </span>
                    {hwMediaList.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {hwMediaList.map((m, idx) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium"
                          >
                            <Paperclip className="w-3 h-3 text-[#0066FF]" />
                            <span className="truncate max-w-[160px]">{m.title || `File ${idx + 1}`}</span>
                            <span className="text-[9px] uppercase font-mono text-slate-500">
                              ({m.type})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Không có file đính kèm</span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  Không có bài tập nào được chọn để chữa trong lần nhập này.
                </p>
              )}
            </div>

            {/* Block 3: Hình ảnh & Video học tập tại lớp */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#0066FF]" />
                  <span>3. Hình ảnh & Video học tập tại lớp của con</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {studentClassroomMedia.length} file
                </span>
              </div>

              {studentClassroomMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {studentClassroomMedia.map((m) => (
                    <div key={m.id} className="rounded-xl border border-slate-200 p-1 bg-slate-50">
                      {m.type === "image" ? (
                        <img
                          src={m.url}
                          alt={m.title}
                          className="w-full h-14 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-14 bg-slate-800 text-white rounded-lg flex items-center justify-center">
                          <Film className="w-5 h-5 text-sky-400" />
                        </div>
                      )}
                      <span className="text-[9px] font-bold text-slate-700 truncate block mt-0.5">
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  Chưa tải lên file đa phương tiện riêng cho học sinh này (sẽ hiển thị ảnh chung của lớp).
                </p>
              )}
            </div>

            {/* Block 4: Đánh giá định kỳ (5 Trục Radar & Thi trường) */}
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#0066FF]" />
                  <span>4. Đánh giá định kỳ & Điểm thi</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {formatToDisplayDate(periodicDate)}
                </span>
              </div>

              {/* 5 Trục */}
              <div className="grid grid-cols-5 gap-1.5 text-center font-mono py-1">
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block">Từ vựng</span>
                  <span className="text-xs font-bold text-[#0066FF]">{radarVocab}đ</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block">Ngữ pháp</span>
                  <span className="text-xs font-bold text-[#0066FF]">{radarGrammar}đ</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block">Nghe hiểu</span>
                  <span className="text-xs font-bold text-[#0066FF]">{radarListening}đ</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block">Phát âm</span>
                  <span className="text-xs font-bold text-[#0066FF]">{radarSpeaking}đ</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[9px] text-slate-500 block">Thái độ</span>
                  <span className="text-xs font-bold text-[#0066FF]">{radarAttitude}đ</span>
                </div>
              </div>

              {/* Cột mốc thi & Điểm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Mốc kiểm tra:</span>
                  <span className="font-bold text-slate-800">{examName || "(Chưa có)"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Điểm tại lớp:</span>
                    <span className="font-bold text-sm text-[#0066FF] font-mono">{classExamScore}đ</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Điểm ở trường:</span>
                    <span className="font-bold text-sm text-emerald-700 font-mono">{schoolExamScore}đ</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">Lời nhắn gửi phụ huynh:</span>
                <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-0.5 leading-relaxed">
                  "{parentMessage || "(Chưa có lời nhắn)"}"
                </p>
              </div>
            </div>

            {/* Footer Buttons của Màn hình Xem lại */}
            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100 flex-wrap">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className="px-4 py-2 rounded-xl text-slate-700 hover:text-[#0066FF] hover:bg-slate-100 font-bold text-xs border border-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại chỉnh sửa</span>
              </button>

              <div className="flex items-center gap-2">
                {isSavedSuccess ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hoàn tất & Đóng</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveAndSync}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#004099] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{isSubmitting ? "Đang lưu..." : "Xác nhận & Lưu học vụ"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
