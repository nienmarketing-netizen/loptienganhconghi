import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Camera,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Coins,
  ChevronRight,
  ChevronDown,
  X,
  Eye,
  Check,
  FolderDown,
  FileText,
  Headphones,
  Video,
  Play,
} from "lucide-react";
import { Assignment, AssignmentMaterial, AssignmentStatus, StudentProfile } from "../types";
import { UploadModal } from "./UploadModal";
import { ReviewModal } from "./ReviewModal";
import { MaterialPreviewModal } from "./MaterialPreviewModal";
import { MaterialsListModal } from "./MaterialsListModal";

interface AssignmentListProps {
  student: StudentProfile;
  onUpdateAssignments?: (updatedAssignments: Assignment[]) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  student,
  onUpdateAssignments,
}) => {
  const [filterStatus, setFilterStatus] = useState<"all" | AssignmentStatus>(
    "all"
  );
  const [selectedForUpload, setSelectedForUpload] = useState<Assignment | null>(
    null
  );
  const [selectedForReview, setSelectedForReview] = useState<Assignment | null>(
    null
  );
  const [selectedMaterialForPreview, setSelectedMaterialForPreview] = useState<{
    assignment: Assignment;
    initialMaterialId?: string;
  } | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(
    null
  );
  const [selectedForMaterialsList, setSelectedForMaterialsList] = useState<Assignment | null>(
    null
  );

  const assignments = student.assignments || [];

  const filteredAssignments = assignments.filter((asg) => {
    if (filterStatus === "all") return true;
    return asg.status === filterStatus;
  });

  const countNotDone = assignments.filter((a) => a.status === "not_done").length;
  const countSubmitted = assignments.filter((a) => a.status === "submitted").length;
  const countGraded = assignments.filter((a) => a.status === "graded").length;

  const formatDeadlineText = (deadline: string) => {
    if (!deadline) return "";
    let text = deadline.includes(":") ? deadline : `21:00 ${deadline}`;
    return text.replace(/(\b\d{1,2}\/\d{1,2})\b(?!\/\d{2,4})/g, "$1/2026");
  };

  // Helper to get attached materials for an assignment (only actual attached files)
  const getMaterialsForAssignment = (asg: Assignment): AssignmentMaterial[] => {
    if (asg.materials && asg.materials.length > 0) {
      return asg.materials;
    }
    const list: AssignmentMaterial[] = [
      {
        id: `mat-pdf-${asg.id}`,
        type: "pdf",
        title: asg.pdfDownloadName || `Phieu_De_Bai_${asg.unit.replace(/\s+/g, "_")}.pdf`,
        url: "#",
        fileSize: "1.2 MB",
      },
    ];

    if (
      asg.skillType === "speaking" ||
      asg.title.toLowerCase().includes("nói") ||
      asg.title.toLowerCase().includes("phát âm")
    ) {
      list.push({
        id: `mat-audio-${asg.id}`,
        type: "mp3",
        title: "Audio phát âm mẫu chuẩn (Native Speaker)",
        url: "https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg",
        duration: "02:15",
        fileSize: "2.4 MB",
      });
      list.push({
        id: `mat-video-${asg.id}`,
        type: "video",
        title: "Video Cô Nghi thị phạm khẩu hình & nối âm",
        url: "https://assets.mixkit.co/videos/preview/mixkit-little-girl-doing-a-presentation-in-front-of-the-class-43484-large.mp4",
        duration: "01:45",
        fileSize: "8.5 MB",
      });
    } else if (
      asg.skillType === "listening" ||
      asg.title.toLowerCase().includes("nghe")
    ) {
      list.push({
        id: `mat-audio-${asg.id}`,
        type: "mp3",
        title: "File Audio bài nghe Unit Track (MP3)",
        url: "https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg",
        duration: "03:30",
        fileSize: "3.8 MB",
      });
    }
    return list;
  };

  // Handle PDF Download Simulation
  const handleDownloadPDF = (asg: Assignment) => {
    setDownloadSuccessId(asg.id);

    // Create a printable mock HTML worksheet blob for genuine PDF download experience
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${asg.title} - Lớp Tiếng Anh Cô Nghi</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
          .badge { background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 13px; }
          h1 { margin: 0 0 8px 0; font-size: 24px; color: #0f172a; }
          .meta { font-size: 14px; color: #64748b; margin-top: 6px; }
          .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .instructions { color: #b45309; font-weight: bold; font-size: 14px; margin-bottom: 8px; }
          .question { margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px dashed #e2e8f0; }
          .q-title { font-weight: 600; font-size: 15px; margin-bottom: 8px; }
          .lines { border-bottom: 1px dotted #94a3b8; height: 32px; margin-top: 8px; }
          .footer { text-align: center; margin-top: 40px; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>LỚP TIẾNG ANH CÔ NGHI</h1>
            <div class="meta">Học sinh: <strong>${student.fullName}</strong> (${student.grade})</div>
            <div class="meta">Hạn nộp: <strong>${asg.deadline}</strong> | Phần thưởng: <strong>+${asg.tokensReward} Tokens</strong></div>
          </div>
          <div class="badge">${asg.unit}</div>
        </div>

        <div class="box">
          <div class="instructions">📌 LƯU Ý TỪ CÔ NGHI:</div>
          <div>Các con in phiếu hoặc chép trực tiếp vào vở bài tập, bóc tách cấu trúc chủ ngữ (S), vị ngữ (V) và gạch chân từ khóa. Hoàn thành xong ba mẹ chụp ảnh gửi qua Cổng Phụ Huynh trước hạn chót nhé!</div>
        </div>

        <h2>${asg.title}</h2>

        <div class="question">
          <div class="q-title">Part 1: Phân tích và điền dạng đúng của động từ trong ngoặc (Present Perfect / Past Simple)</div>
          <div>1. She (live) ____________ in Hanoi since she was ten years old.</div>
          <div class="lines"></div>
          <div>2. We (visit) ____________ our grandparents last weekend in Da Lat.</div>
          <div class="lines"></div>
          <div>3. Nam (already / finish) ____________ his grammar revision for Unit 3.</div>
          <div class="lines"></div>
        </div>

        <div class="question">
          <div class="q-title">Part 2: Bóc tách thành phần câu và viết lại câu không đổi nghĩa</div>
          <div>4. "This is the first time I have seen such an interesting science project."</div>
          <div>&rarr; I have never ___________________________________________________________________.</div>
          <div class="lines"></div>
        </div>

        <div class="footer">
          Lớp Tiếng Anh Cô Nghi - Dạy Học Bằng Tận Tâm & Từng Bước Đồng Hành Cùng Con
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = asg.pdfDownloadName.replace(".pdf", ".html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  // Handle successful upload of assignment
  const handleAssignmentSubmitted = (
    assignmentId: string,
    uploadedImages: string[],
    note: string
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const dayStr = String(now.getDate()).padStart(2, "0");
    const monthStr = String(now.getMonth() + 1).padStart(2, "0");
    const submittedTime = `${timeStr}, ${dayStr}/${monthStr}/2026`;

    const updated = assignments.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          status: "submitted" as AssignmentStatus,
          submissionImages: uploadedImages,
          submissionNote: note,
          submittedAt: submittedTime,
          formattedDeadlineBadge: "Đang chờ cô chấm",
        };
      }
      return a;
    });

    if (onUpdateAssignments) {
      onUpdateAssignments(updated);
    }
  };

  return (
    <div className="relative rounded-2xl sm:rounded-3xl soft-ui-embossed p-4 sm:p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#b2c2d4]/40 pb-3 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
              <span>Bài tập tuần này</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg soft-ui-convex text-[#1a1a1a]">
              {assignments.length} bài
            </span>
          </div>
          <p className="text-xs text-[#666666] font-normal mt-0.5">
            Tải phiếu bài tập, nộp ảnh chụp vở và xem cô sửa bài trực tiếp
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {countNotDone > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 shadow-[inset_1px_1px_2px_#ffffff] flex items-center gap-1.5 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{countNotDone} chưa làm</span>
            </span>
          )}
          {countGraded > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-[inset_1px_1px_2px_#ffffff] flex items-center gap-1.5 leading-tight">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{countGraded} đã chấm</span>
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs - Recessed Well */}
      <div className="flex items-center gap-1.5 soft-ui-debossed p-1 rounded-xl overflow-x-auto no-scrollbar text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center justify-center leading-tight ${
            filterStatus === "all"
              ? "soft-ui-convex text-[#1a1a1a] font-semibold"
              : "text-[#666666] hover:text-[#1a1a1a]"
          }`}
        >
          Tất cả ({assignments.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("not_done")}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center gap-1.5 leading-tight ${
            filterStatus === "not_done"
              ? "soft-ui-convex text-amber-900 font-semibold"
              : "text-[#666666] hover:text-[#1a1a1a]"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Chưa làm ({countNotDone})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("submitted")}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center gap-1.5 leading-tight ${
            filterStatus === "submitted"
              ? "soft-ui-convex text-sky-900 font-semibold"
              : "text-[#666666] hover:text-[#1a1a1a]"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Đã nộp ({countSubmitted})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("graded")}
          className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center gap-1.5 leading-tight ${
            filterStatus === "graded"
              ? "soft-ui-convex text-emerald-900 font-semibold"
              : "text-[#666666] hover:text-[#1a1a1a]"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Đã chấm ({countGraded})</span>
        </button>
      </div>

      {/* Assignment Cards List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAssignments.map((asg) => {
          const isNotDone = asg.status === "not_done";
          const isSubmitted = asg.status === "submitted";
          const isGraded = asg.status === "graded";
          const materials = getMaterialsForAssignment(asg);

          return (
            <div
              key={asg.id}
              className="rounded-2xl p-4 sm:p-5 soft-ui-embossed-sm hover:shadow-[var(--shadow-floating)] transition-all relative space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  {/* Unit badge & Token reward */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md soft-ui-convex text-[#1a1a1a] leading-tight">
                      {asg.unit}
                    </span>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-md border border-amber-300 flex items-center gap-1 leading-tight">
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                      +{asg.tokensReward} Tokens
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] leading-snug">
                    {asg.title}
                  </h4>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 self-start">
                  {isNotDone && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 leading-tight">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Chưa làm</span>
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 leading-tight">
                      <Clock className="w-3.5 h-3.5 text-sky-700" />
                      <span>Đã nộp</span>
                    </span>
                  )}
                  {isGraded && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Đã chấm • {asg.gradedDetails?.score}đ</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline, Score and Status Banner - Recessed Well according to AGENTS.md Section 4 */}
              <div className="bg-[#d1d9e6] border border-[#babecc]/60 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[var(--shadow-recessed-sm)]">
                <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                  {/* Khối Điểm số / Huy hiệu San Hô Đỏ Nổi Khối */}
                  {isGraded ? (
                    <div className="relative shrink-0 flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)] border border-white/30">
                      <span className="text-xl sm:text-2xl font-bold font-mono leading-none tracking-tight">
                        {asg.gradedDetails?.score || 9.5}
                      </span>
                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider opacity-90">
                        / {asg.gradedDetails?.maxScore || 10} điểm
                      </span>
                    </div>
                  ) : isSubmitted ? (
                    <div className="relative shrink-0 flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-sky-600 text-white shadow-[0_4px_12px_rgba(2,132,199,0.35)] border border-white/30">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white mb-0.5" />
                      <span className="text-[9px] sm:text-[10px] font-bold font-mono uppercase tracking-wider leading-none">
                        ĐÃ NỘP
                      </span>
                    </div>
                  ) : (
                    <div className="relative shrink-0 flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)] border border-white/30">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white mb-0.5" />
                      <span className="text-[9px] sm:text-[10px] font-bold font-mono uppercase tracking-wider leading-none">
                        HẠN NỘP
                      </span>
                    </div>
                  )}

                  {/* Thông tin học sinh, Token & Nhận xét / Thời hạn */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
                        {isGraded ? student.fullName : isSubmitted ? student.fullName : "Nhiệm vụ tuần này"}
                      </span>
                      {isGraded ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 leading-tight">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          +{asg.tokensReward} Tokens
                        </span>
                      ) : isSubmitted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-300 leading-tight">
                          <Clock className="w-3.5 h-3.5 text-sky-700" />
                          Đang chờ cô chấm
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 leading-tight">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                          Chưa hoàn thành
                        </span>
                      )}
                    </div>
                    <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                      isSubmitted ? "text-sky-800" : "text-[#ff4757]"
                    }`}>
                      {isGraded
                        ? (asg.gradedDetails?.feedbackTitle || "Xuất sắc! Bóc tách cấu trúc câu rất chắc")
                        : isSubmitted
                        ? "Bài tập đã gửi thành công • Cô Nghi đang xem và sửa bài"
                        : `${formatDeadlineText(asg.deadline)} • Nhớ nộp đúng hạn để nhận +${asg.tokensReward} Tokens`}
                    </p>
                  </div>
                </div>

                {/* Cột thông tin phụ bên phải (Giáo viên, Ngày chấm / Thời gian nộp / Hạn chót) */}
                <div className="shrink-0 w-full sm:w-auto flex flex-col justify-center sm:items-end gap-1.5 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[#babecc]/50 sm:border-l sm:border-[#babecc]/50 sm:pl-4">
                  <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
                    <span className="text-[#666666] font-medium">
                      {isGraded ? "Giáo viên chấm:" : "Giáo viên phụ trách:"}
                    </span>
                    <span className="font-semibold text-[#1a1a1a]">Cô Nghi</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto text-xs">
                    <span className="text-[#666666] font-medium">
                      {isGraded ? "Ngày chấm:" : isSubmitted ? "Thời gian nộp:" : "Hạn chót:"}
                    </span>
                    <span className={`font-semibold ${
                      isNotDone ? "text-[#ff4757] font-mono" : "text-[#1a1a1a]"
                    }`}>
                      {isGraded
                        ? "16/09/2026"
                        : isSubmitted
                        ? (asg.submittedAt || "19:45 Thứ Sáu, 20/09/2026")
                        : asg.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                {/* 1. Nút "Tài liệu" & Nút "Chụp ảnh / Nộp bài" (Nếu trạng thái là Chưa làm) */}
                {isNotDone && (
                  <>
                    <button
                      type="button"
                      id={`btn-materials-${asg.id}`}
                      onClick={() => setSelectedForMaterialsList(asg)}
                      className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-xl font-semibold text-xs soft-ui-convex text-[#1a1a1a] active:shadow-[var(--shadow-pressed-sm)] active:translate-y-[1px] transition-all cursor-pointer leading-tight"
                      title="Bấm để xem danh sách tài liệu đính kèm"
                    >
                      <FolderDown className="w-4 h-4 text-[#ff4757]" />
                      <span>Tài liệu ({materials.length})</span>
                    </button>

                    {/* Nút "Nộp bài" */}
                    <button
                      type="button"
                      id={`btn-submit-photo-${asg.id}`}
                      onClick={() => setSelectedForUpload(asg)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-[#ff4757] hover:bg-[#e03949] text-white font-semibold text-xs shadow-[var(--shadow-accent)] active:shadow-[var(--shadow-accent-pressed)] active:translate-y-[1px] transition-all cursor-pointer ml-auto leading-tight"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Nộp bài</span>
                    </button>
                  </>
                )}

                {/* Status: Đã nộp -> Có thể mở modal tài liệu hoặc xem ảnh/video đã nộp */}
                {isSubmitted && (
                  <div className="w-full flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      id={`btn-materials-submitted-${asg.id}`}
                      onClick={() => setSelectedForMaterialsList(asg)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#1a1a1a] hover:text-[#ff4757] font-semibold px-3 py-1.5 rounded-lg soft-ui-convex transition-all cursor-pointer leading-tight"
                    >
                      <FolderDown className="w-3.5 h-3.5 text-[#ff4757]" />
                      <span>Tài liệu & đề bài ({materials.length})</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-view-submission-${asg.id}`}
                      onClick={() => setSelectedForUpload(asg)}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl soft-ui-convex text-sky-900 active:shadow-[var(--shadow-pressed-sm)] font-semibold text-xs transition-all cursor-pointer ml-auto leading-tight"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600" />
                      <span>Xem bài đã nộp / Bổ sung</span>
                    </button>
                  </div>
                )}

                {/* 3. Nút "Xem bài đã sửa" (Nếu trạng thái là Đã chấm) -> Mở ReviewModal */}
                {isGraded && (
                  <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <button
                      type="button"
                      id={`btn-materials-graded-${asg.id}`}
                      onClick={() => setSelectedForMaterialsList(asg)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#1a1a1a] hover:text-[#ff4757] font-semibold px-3 py-1.5 rounded-lg soft-ui-convex transition-all cursor-pointer leading-tight"
                    >
                      <FolderDown className="w-3.5 h-3.5 text-[#ff4757]" />
                      <span>Tài liệu & đề bài ({materials.length})</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-view-graded-${asg.id}`}
                      onClick={() => setSelectedForReview(asg)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-[0_4px_10px_rgba(5,150,105,0.3)] active:translate-y-[1px] transition-all cursor-pointer ml-auto border border-emerald-400 leading-tight"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Xem bài đã chấm & nhận xét</span>
                      <ChevronRight className="w-4 h-4 opacity-80" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredAssignments.length === 0 && (
          <div className="py-8 text-center text-[#475569] text-xs font-mono">
            Không có bài tập nào trong mục này.
          </div>
        )}
      </div>

      {/* Materials List Modal (Styled identically to UploadModal) */}
      {selectedForMaterialsList && (
        <MaterialsListModal
          assignment={selectedForMaterialsList}
          materials={getMaterialsForAssignment(selectedForMaterialsList)}
          studentName={student.fullName}
          onClose={() => setSelectedForMaterialsList(null)}
          onSelectMaterial={(materialId) => {
            const targetAsg = selectedForMaterialsList;
            setSelectedForMaterialsList(null);
            setSelectedMaterialForPreview({
              assignment: targetAsg,
              initialMaterialId: materialId,
            });
          }}
          onOpenFullPlayer={() => {
            const targetAsg = selectedForMaterialsList;
            setSelectedForMaterialsList(null);
            setSelectedMaterialForPreview({
              assignment: targetAsg,
            });
          }}
          onDownloadPDF={handleDownloadPDF}
        />
      )}

      {/* Upload Modal Dialog */}
      {selectedForUpload && (
        <UploadModal
          assignment={selectedForUpload}
          studentName={student.fullName}
          onClose={() => setSelectedForUpload(null)}
          onSubmit={handleAssignmentSubmitted}
        />
      )}

      {/* Review Modal Dialog (with Red ink markings and simulated Voice Audio Player) */}
      {selectedForReview && (
        <ReviewModal
          assignment={selectedForReview}
          studentName={student.fullName}
          onClose={() => setSelectedForReview(null)}
        />
      )}

      {/* Material Preview Modal (Video, Audio MP3, PDF Worksheet) */}
      {selectedMaterialForPreview && (
        <MaterialPreviewModal
          assignment={selectedMaterialForPreview.assignment}
          materials={getMaterialsForAssignment(selectedMaterialForPreview.assignment)}
          initialMaterialId={selectedMaterialForPreview.initialMaterialId}
          studentName={student.fullName}
          onClose={() => setSelectedMaterialForPreview(null)}
          onDownloadPDF={handleDownloadPDF}
        />
      )}
    </div>
  );
};
