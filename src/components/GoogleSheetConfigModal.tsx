import React, { useState, useEffect } from "react";
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  Check,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  getGoogleSheetWebhookUrl,
  getGoogleSheetWebhookUrlAsync,
  setGoogleSheetWebhookUrl,
  submitLead,
  syncAllFirestoreLeadsToGoogleSheet,
  getVietnamTimestamp,
} from "../lib/leadService";

interface GoogleSheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1icicHi2LTdOSRD8TSLHjb8zgK4xWlhnSVRZFKEGLulA/edit?usp=sharing";

const APPS_SCRIPT_CODE = `/**
 * Webhook nhận dữ liệu JSON từ Form đăng ký và ghi vào Google Sheets (Đủ 10 cột A -> J)
 */
function doPost(e) {
  try {
    // 1. Kiểm tra payload gửi lên
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Không tìm thấy dữ liệu gửi lên (Empty payload).");
    }

    var payload = {};
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (err) {
      payload = e.parameter || {};
    }

    // 2. Trích xuất các trường thông tin từ payload (hỗ trợ cả tiếng Việt và tiếng Anh)
    var tenPhuHuynh  = payload.tenPhuHuynh || payload.parentName || "";
    var sdtRaw       = payload.sdtZalo || payload.phoneZalo || "";
    // Thêm nháy đơn ' để giữ nguyên số 0 ở đầu số điện thoại trong Sheets
    var sdtZalo      = sdtRaw ? "'" + sdtRaw : "";
    var hoTenCon     = payload.hoTenCon || payload.studentName || "";
    var khoiLop      = payload.khoiLop || payload.studentGrade || "";
    var truongTHCS   = payload.truongTHCS || payload.school || "";
    var tinhTrang    = payload.tinhTrang || (Array.isArray(payload.problems) ? payload.problems.join("; ") : (payload.problems || ""));
    var nhuCau       = payload.nhuCau || payload.priorityChoice || payload.priority || "";

    // Cột I: Trạng thái xử lý (Mặc định là "Mới tiếp nhận" nếu form không truyền)
    var trangThai    = payload.trangThaiXuLy || payload.trangThai || payload.status || "Mới tiếp nhận";

    // Cột J: Vị trí nút CTA mà người dùng đã bấm
    var viTriCTA     = payload.viTriCTA || payload.ctaLocation || payload.viTri || "Form cuối trang";

    // 3. Lấy trang tính và nối dòng mới theo đúng thứ tự 10 cột (A -> J)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var timestamp = new Date();

    sheet.appendRow([
      timestamp,     // Cột A: Thời gian đăng ký (Timestamp)
      tenPhuHuynh,   // Cột B: Tên Phụ huynh
      sdtZalo,       // Cột C: Số điện thoại Zalo
      hoTenCon,      // Cột D: Họ tên con
      khoiLop,       // Cột E: Khối lớp hiện tại
      truongTHCS,    // Cột F: Trường THCS
      tinhTrang,     // Cột G: Tình trạng hiện tại
      nhuCau,        // Cột H: Nhu cầu ưu tiên
      trangThai,     // Cột I: Trạng thái xử lý
      viTriCTA       // Cột J: Vị trí CTA
    ]);

    // 4. Trả về phản hồi JSON báo trạng thái thành công
    var responseData = {
      status: "success",
      message: "Ghi nhận đăng ký thành công!",
      timestamp: timestamp.toISOString()
    };

    return ContentService.createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    var errorResponse = {
      status: "error",
      message: error.toString()
    };

    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Xử lý preflight request (OPTIONS) từ trình duyệt nhằm hỗ trợ CORS
 */
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}`;

export const GoogleSheetConfigModal: React.FC<GoogleSheetConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [webhookUrl, setWebhookUrlState] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const local = getGoogleSheetWebhookUrl();
      if (local) {
        setWebhookUrlState(local);
      } else {
        getGoogleSheetWebhookUrlAsync().then((url) => {
          if (url) setWebhookUrlState(url);
        });
      }
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    await setGoogleSheetWebhookUrl(webhookUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSyncAllLeads = async () => {
    setIsSyncingAll(true);
    setTestResult(null);
    try {
      if (webhookUrl.trim()) {
        await setGoogleSheetWebhookUrl(webhookUrl.trim());
      }
      const res = await syncAllFirestoreLeadsToGoogleSheet();
      if (res.success) {
        setTestResult({
          success: true,
          message: `Đã đồng bộ thành công ${res.totalSynced} đơn đăng ký từ hệ thống sang Google Sheet!`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Lỗi đồng bộ: ${res.error || "Không thể gửi dữ liệu"}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Lỗi: ${err?.message || "Không thể đồng bộ"}`,
      });
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleSendTestLead = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const testLead = {
        parentName: "Phụ huynh Kiểm tra (Test Lead)",
        phoneZalo: "0905000999",
        studentName: "Học sinh Mẫu",
        studentGrade: "Lớp 8",
        school: "THCS Lê Độ",
        problems: [
          "Mất gốc hoàn toàn, học trước quên sau",
          "Cần gỡ điểm gấp cho kỳ thi",
        ],
        priorityChoice:
          "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
      };

      await submitLead(testLead, "cta_popup_modal");

      setTestResult({
        success: true,
        message:
          "Đã gửi thành công dữ liệu mẫu! Dữ liệu đã được lưu trữ an toàn và đẩy sang Google Sheet.",
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Lỗi kiểm tra: ${err?.message || "Không thể kết nối"}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-body">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[92vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-sm">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 uppercase tracking-tight">
              Cấu Hình Đồng Bộ Google Sheet
            </h3>
            <p className="text-xs text-slate-500">
              Tự động lưu toàn bộ lượt đăng ký từ Sale Page vào bảng tính của bạn
            </p>
          </div>
        </div>

        {/* Thông tin File Google Sheet Đang Kết Nối */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 mb-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              File Google Sheet Đích:
            </span>
            <a
              href={GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A78F3] hover:underline"
            >
              <span>Mở File Google Sheet Trên Tab Mới</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono text-[11.5px] text-slate-600 truncate">
            {GOOGLE_SHEET_URL}
          </div>
          <p className="text-[11.5px] text-slate-500">
            Hệ thống sẽ điền dữ liệu tương ứng chính xác vào <strong>8 cột A → H</strong>: Thời gian đăng ký (Timestamp), Tên Phụ huynh, Số điện thoại Zalo, Họ tên con, Khối lớp hiện tại, Trường THCS, Tình trạng hiện tại, Nhu cầu ưu tiên.
          </p>
        </div>

        {/* Hướng Dẫn 3 Bước Kèm Code Apps Script */}
        <div className="space-y-4 mb-5">
          <h4 className="font-heading font-extrabold text-sm uppercase text-slate-800 flex items-center gap-2">
            <span>Hướng Dẫn Kết Nối 3 Bước Nhanh (Chỉ Làm 1 Lần)</span>
          </h4>

          <div className="text-xs text-slate-700 space-y-2.5">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/70 border border-sky-100">
              <span className="w-5 h-5 rounded-full bg-[#0A78F3] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  Mở file Google Sheet &gt; Chọn menu{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-sky-700">
                    Tiện ích mở rộng (Extensions)
                  </code>{" "}
                  &gt;{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-sky-700">
                    Apps Script
                  </code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/70 border border-sky-100">
              <span className="w-5 h-5 rounded-full bg-[#0A78F3] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                2
              </span>
              <div className="space-y-2 w-full">
                <p className="font-semibold text-slate-900">
                  Xóa code cũ trong Apps Script và dán đoạn mã bên dưới vào:
                </p>

                <div className="relative">
                  <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] max-h-36 overflow-y-auto leading-relaxed border border-slate-800">
                    {APPS_SCRIPT_CODE}
                  </pre>
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Đã copy!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/70 border border-sky-100">
              <span className="w-5 h-5 rounded-full bg-[#0A78F3] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                3
              </span>
              <div>
                <p className="font-semibold text-slate-900">
                  Nhấn <strong className="text-slate-900">Triển khai (Deploy)</strong> &gt;{" "}
                  <strong className="text-slate-900">Tùy chọn triển khai mới (New deployment)</strong> &gt; Chọn loại:{" "}
                  <strong className="text-[#0A78F3]">Ứng dụng web (Web app)</strong>.
                </p>
                <p className="mt-1 text-slate-600">
                  * Mục <em>&quot;Người có quyền truy cập (Who has access)&quot;</em>: Chọn{" "}
                  <strong className="text-[#ff4757]">Bất kỳ ai (Anyone)</strong> &gt; Nhấn{" "}
                  <strong className="text-slate-900">Triển khai</strong> &gt; Copy URL Web App dán vào ô bên dưới.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ô Nhập URL Web App */}
        <div className="space-y-2 mb-5">
          <label className="block text-xs font-extrabold text-slate-800">
            Dán URL Ứng Dụng Web (Google Apps Script Web App URL) vào đây:
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={webhookUrl}
              onChange={(e) => setWebhookUrlState(e.target.value)}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0A78F3] text-slate-900 font-mono"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl bg-[#0A78F3] hover:bg-sky-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
            >
              Lưu URL
            </button>
          </div>
          {savedSuccess && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã lưu URL thành công lên hệ thống đám mây! Mọi thiết bị đều đã sẵn sàng đồng bộ.</span>
            </p>
          )}

          {!webhookUrl && (
            <p className="text-xs text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Chưa có Webhook URL! Các đơn đăng ký hiện được lưu an toàn tuyệt đối trên Firebase Firestore nhưng chưa có đường truyền sang Google Sheet. Hãy dán URL Web App của bạn vào ô trên và bấm &quot;Lưu URL&quot;.
              </span>
            </p>
          )}
        </div>

        {/* Nút Kiểm Tra Đồng Bộ Thử Nghiệm & Đồng Bộ Dữ Liệu Cũ */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleSendTestLead}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2d3436] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang gửi thử...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Thử 1 Dữ Liệu Mẫu</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isSyncingAll}
              onClick={handleSyncAllLeads}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              title="Đẩy toàn bộ các đơn đăng ký đã lưu trong Firestore sang Google Sheet"
            >
              {isSyncingAll ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang đẩy dữ liệu...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Đồng Bộ Lại Các Đơn Đã Lưu Sang Sheet</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Hoàn tất &amp; Đóng
          </button>
        </div>

        {testResult && (
          <div
            className={`mt-3 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResult.success
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
