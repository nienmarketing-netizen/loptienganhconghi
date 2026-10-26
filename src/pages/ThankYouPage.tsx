import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  School,
  FileCheck,
  AlertCircle,
  Target,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";

export interface SubmissionData {
  parentName: string;
  phoneZalo: string;
  studentName: string;
  studentGrade: string;
  studentNameAndGrade?: string;
  school?: string;
  problems?: string[];
  priorityChoice?: string;
  ticketCode?: string;
  submittedAt?: string;
  trangThaiXuLy?: string;
  viTriCTA?: string;
}

interface ThankYouPageProps {
  submissionData?: SubmissionData | null;
  onNavigateToLdp?: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  submissionData: propData,
  onNavigateToLdp,
}) => {
  const [data, setData] = useState<SubmissionData>(() => {
    if (propData) return propData;
    try {
      const stored =
        sessionStorage.getItem("co_nghi_last_submission") ||
        localStorage.getItem("co_nghi_last_submission");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse error
    }
    // Default fallback so page is always fully functional even on direct visit
    return {
      parentName: "Quý Phụ huynh",
      phoneZalo: "Đã ghi nhận trên hệ thống",
      studentName: "Học sinh",
      studentGrade: "Cấp 2",
      studentNameAndGrade: "Học sinh",
      school: "THCS tại Quận Sơn Trà, Đà Nẵng",
      problems: ["Mất gốc kiến thức, sợ sai, cần củng cố phương pháp học"],
      priorityChoice:
        "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
      ticketCode: "CN-86625",
      submittedAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }) + ", " + new Date().toLocaleDateString("vi-VN"),
    };
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (propData) {
      setData(propData);
    }
  }, [propData]);

  const handleReturnToLdp = () => {
    if (onNavigateToLdp) {
      onNavigateToLdp();
    } else {
      window.history.pushState({ route: "ldp" }, "", "/ldp");
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const parentNameRaw = data.parentName?.trim() || "";
  const parentDisplay =
    !parentNameRaw ||
    parentNameRaw.toLowerCase() === "quý phụ huynh" ||
    parentNameRaw.toLowerCase().startsWith("phụ huynh") ||
    parentNameRaw.toLowerCase().startsWith("quý phụ huynh") ||
    parentNameRaw.toLowerCase().startsWith("ba ") ||
    parentNameRaw.toLowerCase().startsWith("mẹ ")
      ? (parentNameRaw || "Quý Phụ huynh")
      : `Phụ huynh ${parentNameRaw}`;

  const studentDisplay =
    data.studentName?.trim() ||
    (data.studentNameAndGrade ? data.studentNameAndGrade.split("-")[0].trim() : "") ||
    "Học sinh";

  const gradeDisplay =
    data.studentGrade ||
    (data.studentNameAndGrade && data.studentNameAndGrade.includes("-")
      ? data.studentNameAndGrade.split("-")[1].trim()
      : "");

  const ticketNumber = data.ticketCode || "CN-86625";
  const uniqueProblems = Array.from(new Set(data.problems || [])).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern text-slate-900 selection:bg-sky-200 selection:text-sky-900 relative overflow-x-clip font-body flex flex-col justify-between">
      {/* ─────────────────────────────────────────────────────────────
          1. HIỆU ỨNG TẢN QUANG (AMBIENT GLOW)
      ────────────────────────────────────────────────────────────── */}
      <div className="absolute top-12 left-1/4 w-[480px] h-[480px] bg-[#0A78F3] opacity-15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-[#C43838] opacity-15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────
          2. STICKY TOP HEADER (ĐỒNG NHẤT 100% VỚI SALE PAGE "/ldp")
      ────────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Thông tin lớp học Cô Nghi"
        className="sticky top-0 z-50 bg-[#2d3436] text-white border-b border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.18)] backdrop-blur-md"
      >
        <div className="w-[92%] sm:w-[90%] lg:w-[80%] mx-auto py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Bên trái: 2 dòng duy nhất không xuống hàng */}
          <button
            onClick={handleReturnToLdp}
            className="flex flex-col shrink-0 min-w-0 text-left hover:opacity-90 transition-opacity cursor-pointer"
            title="Quay về trang giới thiệu"
          >
            <span className="font-heading font-extrabold uppercase tracking-tight text-white text-xs sm:text-base leading-tight whitespace-nowrap">
              LỚP TIẾNG ANH CÔ NGHI
            </span>
            <span className="uppercase text-[9.5px] sm:text-[11px] tracking-wider text-sky-400 font-bold flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff4757] shrink-0" />
              <span>SƠN TRÀ, ĐÀ NẴNG</span>
            </span>
          </button>

          {/* Bên phải: 2 dòng duy nhất không xuống hàng */}
          <div className="text-right flex flex-col items-end shrink-0 min-w-0">
            <div className="font-body text-[10px] sm:text-sm text-slate-200 leading-tight whitespace-nowrap">
              <span className="text-slate-400 font-medium">Giáo viên:</span>{" "}
              <strong className="font-bold text-white">Thạc sĩ TESOL Quốc tế</strong>
            </div>
            <div className="text-[9.5px] sm:text-xs uppercase tracking-wider font-bold text-[#ff6b81] flex items-center justify-end gap-1 mt-0.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4757] animate-pulse shrink-0" />
              <span>Sĩ số: Tối đa 12 em/ lớp</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          3. NỘI DUNG CHÍNH: THANK YOU HERO & PHIẾU THÔNG TIN
      ────────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Top Banner Cảm ơn */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.25)] mx-auto animate-bounce-short">
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-[#C43838] text-xs font-bold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-[#C43838] animate-pulse" />
                Hệ Thống Đã Ghi Nhận Thành Công
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-slate-900 leading-tight pt-1">
                CẢM ƠN QUÝ PHỤ HUYNH!
              </h1>
            </div>

            <div className="space-y-2.5 max-w-xl mx-auto font-body text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed">
              <p>
                Cô Nghi đã tiếp nhận thông tin đăng ký của{" "}
                <strong className="text-slate-900 font-bold">{parentDisplay}</strong> cho bạn{" "}
                <strong className="text-[#C43838] font-bold">{studentDisplay}</strong>.
              </p>
              <p>
                Cô Nghi sẽ liên hệ trực tiếp qua số điện thoại{" "}
                <strong className="text-slate-900 font-bold">
                  {data.phoneZalo && data.phoneZalo !== "Đã ghi nhận trên hệ thống"
                    ? data.phoneZalo
                    : "đã ghi nhận trên hệ thống"}
                </strong>{" "}
                để sắp xếp lịch test 1-1 phù hợp nhất với con.
              </p>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              PHIẾU THÔNG TIN ĐĂNG KÝ HỌC VỤ (TACTILE REGISTRATION TICKET)
          ────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden relative">
            {/* Header dập nổi của Phiếu */}
            <div className="bg-gradient-to-r from-[#2d3436] via-slate-800 to-[#2d3436] text-white px-4 sm:px-8 py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                  <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium block leading-tight">
                    Phiếu tiếp nhận chẩn đoán học thuật
                  </span>
                  <span className="font-heading font-black text-sm sm:text-base md:text-lg tracking-tight text-white block leading-tight mt-0.5">
                    XÁC NHẬN ĐĂNG KÝ THÀNH CÔNG
                  </span>
                </div>
              </div>

              {/* Badge Mã Phiếu: Hàng mới bên dưới ở mobile, bên phải ở desktop */}
              <div className="flex items-center self-start sm:self-auto ml-[42px] sm:ml-0 gap-1.5 sm:gap-2 bg-black/35 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10 shrink-0">
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">MÃ:</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 tracking-wider">
                  #{ticketNumber}
                </span>
              </div>
            </div>

            {/* Thân phiếu: Lưới thông tin tổng hợp */}
            <div className="p-5 sm:p-8 space-y-5 bg-gradient-to-b from-white to-slate-50/50">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* 1. Phụ huynh */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Họ tên Phụ huynh</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
                      {data.parentName}
                    </span>
                  </div>
                </div>

                {/* 2. Số điện thoại Zalo */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Số điện thoại Zalo</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-emerald-800 block mt-0.5">
                      {data.phoneZalo}
                    </span>
                  </div>
                </div>

                {/* 3. Con & Khối lớp */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-[#ff4757] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Học sinh đăng ký</span>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        {studentDisplay}
                      </span>
                      {gradeDisplay && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                          {gradeDisplay}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Trường THCS */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <School className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Trường THCS theo học</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
                      {data.school || "Quận Sơn Trà, TP. Đà Nẵng"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Tình trạng học tập của con */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#d1d9e6]/40 border border-[#babecc]/60 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-2.5 text-xs sm:text-[13px] font-bold text-slate-700">
                  <AlertCircle className="w-4 h-4 text-[#ff4757] shrink-0" />
                  <span>Tình trạng học tập ghi nhận ban đầu:</span>
                </div>
                {uniqueProblems && uniqueProblems.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {uniqueProblems.map((prob, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 text-[14px] sm:text-[15.5px] font-medium text-slate-800 shadow-sm leading-snug"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#ff4757] shrink-0" />
                        <span>{prob}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-slate-600 italic">
                    Chưa chỉ định chi tiết (sẽ phân tích kỹ trong buổi kiểm tra học lực 1-1).
                  </p>
                )}
              </div>

              {/* 6. Nhu cầu ưu tiên */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-200/70 text-[#C43838] flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-rose-900 font-bold uppercase tracking-wider block">
                    Nhu cầu ưu tiên đã chọn:
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-rose-950 mt-0.5">
                    {data.priorityChoice || "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút)"}
                  </p>
                </div>
              </div>

              {/* Địa điểm & Thời gian */}
              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13px] text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ff4757] shrink-0" />
                  <span>
                    Địa điểm: <strong>866/25 Ngô Quyền, Sơn Trà, Đà Nẵng</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    Thời gian tiếp nhận: <strong>{data.submittedAt || "Vừa xong"}</strong>
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. KHỐI LIÊN HỆ TRỰC TIẾP (HOTLINE & FANPAGE & ĐỊA CHỈ)
          ────────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md space-y-5">
            <div className="text-center sm:text-left">
              <h2 className="font-heading font-extrabold text-base sm:text-lg uppercase tracking-tight text-slate-900">
                CẦN HỖ TRỢ NGAY HOẶC MUỐN CHỐT LỊCH GẤP?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Ba mẹ có thể chủ động liên hệ trực tiếp với Cô Nghi qua các kênh chính thức sau:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Hotline / Zalo */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200 flex flex-col justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">
                      HOTLINE / ZALO TRỰC TIẾP
                    </span>
                    <a
                      href="tel:0898171712"
                      className="font-mono font-black text-xl sm:text-2xl text-emerald-800 hover:text-emerald-900 transition-colors block leading-tight"
                    >
                      0898 171 712
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="tel:0898171712"
                    className="flex-1 py-2 px-3 text-center text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                  >
                    Gọi ngay
                  </a>
                  <a
                    href="https://zalo.me/0898171712"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 text-center text-xs font-bold rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 transition-colors"
                  >
                    Nhắn Zalo
                  </a>
                </div>
              </div>

              {/* Card Fanpage */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/40 border border-sky-200 flex flex-col justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A78F3] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-900 block">
                      FANPAGE CHÍNH THỨC
                    </span>
                    <span className="font-heading font-black text-base sm:text-lg text-sky-900 block leading-tight">
                      Lớp Tiếng Anh Cô Nghi
                    </span>
                  </div>
                </div>
                <div className="pt-1">
                  <a
                    href="https://facebook.com/lopanhvandiemcao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 flex items-center justify-center gap-2 text-xs font-bold rounded-xl bg-[#0A78F3] hover:bg-blue-600 text-white transition-colors shadow-sm"
                  >
                    <span>Truy cập Facebook Fanpage</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Nút quay lại trang chủ / trang giới thiệu */}
          <div className="text-center pt-2 pb-6">
            <button
              onClick={handleReturnToLdp}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang thông tin</span>
            </button>
          </div>

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          5. FOOTER TỐI GIẢN
      ────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#2d3436] text-slate-400 text-xs py-4 px-4 text-center border-t border-slate-700">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Lớp Tiếng Anh Cô Nghi – Sơn Trà, Đà Nẵng.</p>
          <p>Hotline / Zalo: 0898 171 712</p>
        </div>
      </footer>
    </div>
  );
};
