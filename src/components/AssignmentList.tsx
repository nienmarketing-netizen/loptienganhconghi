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
    <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Bài tập tuần này
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {assignments.length} bài
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tải phiếu bài tập, nộp ảnh chụp vở và xem cô sửa bài trực tiếp
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {countNotDone > 0 && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {countNotDone} chưa làm
            </span>
          )}
          {countGraded > 0 && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {countGraded} đã chấm
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs - Designed with touch-friendly 44px height for easy mobile tapping */}
      <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl overflow-x-auto no-scrollbar text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center justify-center ${
            filterStatus === "all"
              ? "bg-white text-slate-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Tất cả ({assignments.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("not_done")}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
            filterStatus === "not_done"
              ? "bg-white text-amber-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Chưa làm ({countNotDone})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("submitted")}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
            filterStatus === "submitted"
              ? "bg-white text-sky-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Đã nộp ({countSubmitted})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("graded")}
          className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
            filterStatus === "graded"
              ? "bg-white text-emerald-900 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
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
              className={`rounded-2xl border p-4 sm:p-5 transition-all relative ${
                isNotDone
                  ? "bg-gradient-to-br from-white to-amber-50/30 border-amber-200/90 shadow-xs hover:border-amber-300"
                  : isSubmitted
                  ? "bg-gradient-to-br from-white to-sky-50/30 border-sky-200/80 shadow-xs hover:border-sky-300"
                  : "bg-gradient-to-br from-white to-emerald-50/40 border-emerald-200 shadow-xs hover:border-emerald-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  {/* Unit badge & Token reward */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                      {asg.unit}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-600" />
                      +{asg.tokensReward} Tokens
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {asg.title}
                  </h4>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 self-start">
                  {isNotDone && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Chưa làm</span>
                    </span>
                  )}
                  {isSubmitted && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
                      <Clock className="w-3.5 h-3.5 text-sky-700" />
                      <span>Đã nộp</span>
                    </span>
                  )}
                  {isGraded && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Đã chấm • {asg.gradedDetails?.score}đ</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline and status note */}
              <div className="space-y-1.5 text-xs text-slate-500 py-2 border-t border-slate-100 w-full">
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Hạn chót:
                  </span>
                  <span
                    className={
                      isNotDone ? "text-amber-700 font-bold" : "text-slate-700 font-semibold"
                    }
                  >
                    {formatDeadlineText(asg.deadline)}
                  </span>
                </div>

                {isSubmitted && (
                  <div className="flex items-center justify-between text-[11px] sm:text-xs pt-1.5 border-t border-slate-100/80">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Nộp lúc:
                    </span>
                    <span className="text-sky-700 font-semibold">
                      {asg.submittedAt || "19:45 Thứ Sáu, 20/09/2026"}
                    </span>
                  </div>
                )}

                {isGraded && (
                  <div className="flex items-center justify-between text-[11px] sm:text-xs pt-1.5 border-t border-slate-100/80">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      Nộp lúc:
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      {asg.submittedAt || "19:15 Chủ Nhật, 15/09/2026"}
                    </span>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-3 pt-3 border-t border-slate-100/90 flex flex-wrap items-center gap-2.5">
                {/* 1. Nút "Tài liệu" & Nút "Chụp ảnh / Nộp bài" (Nếu trạng thái là Chưa làm) */}
                {isNotDone && (
                  <>
                    <button
                      type="button"
                      id={`btn-materials-${asg.id}`}
                      onClick={() => setSelectedForMaterialsList(asg)}
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all active:scale-95 cursor-pointer"
                      title="Bấm để xem danh sách tài liệu đính kèm"
                    >
                      <FolderDown className="w-4 h-4 text-indigo-600" />
                      <span>Tài liệu ({materials.length})</span>
                    </button>

                    {/* Nút "Nộp bài" */}
                    <button
                      type="button"
                      id={`btn-submit-photo-${asg.id}`}
                      onClick={() => setSelectedForUpload(asg)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all active:scale-95 cursor-pointer ml-auto"
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
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <FolderDown className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tài liệu & đề bài ({materials.length})</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-view-submission-${asg.id}`}
                      onClick={() => setSelectedForUpload(asg)}
                      className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs transition-colors cursor-pointer ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
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
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-900 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <FolderDown className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Tài liệu & đề bài ({materials.length})</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-view-graded-${asg.id}`}
                      onClick={() => setSelectedForReview(asg)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer ml-auto"
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
          <div className="py-8 text-center text-slate-400 text-xs">
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
