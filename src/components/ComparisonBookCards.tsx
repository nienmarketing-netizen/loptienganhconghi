import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  RotateCw,
  BookMarked,
  ShieldCheck,
  Check,
} from "lucide-react";

interface Criterion {
  title: string;
  traditional: string;
  commercial: string;
  coNghi: string;
}

const CRITERIA_DATA: Criterion[] = [
  {
    title: "Mức độ quan tâm & Sửa lỗi",
    traditional: "Giáo viên chép đáp án lên bảng; học sinh yếu ngồi bàn cuối giấu dốt, chép bài đối phó.",
    commercial: "Học phí đắt đỏ nhưng lớp đông, thời gian chết lớn; không sửa chi tiết ngữ pháp.",
    coNghi: "Kèm vi mô 1-1 từng em: Cô Nghi trực tiếp bắt bệnh và sửa tỉ mỉ từng lỗi sai ngay tại bàn.",
  },
  {
    title: "Phương pháp xử lý bài tập",
    traditional: "Giải đề số lượng lớn theo kiểu học vẹt công thức; học sinh tiếp tục khoanh lụi.",
    commercial: "Tập trung nghe nói bề nổi; bỏ trống hoàn toàn kỹ năng Word Form và Writing trên trường.",
    coNghi: '"Bóc tách 4 bước" & "Dịch bắt buộc": Hiểu sâu bản chất, giải thích được lý do chọn đáp án.',
  },
  {
    title: "Tâm lý & Động lực của con",
    traditional: "Căng thẳng, sợ bị gọi tên trả bài, dễ chán nản và bỏ cuộc.",
    commercial: "Vui vẻ lúc chơi trò chơi nhưng về nhà vẫn sợ đề kiểm tra trên trường.",
    coNghi: "Chữa lành tâm lý & Game hóa 100 Tokens: Không la mắng; kích hoạt động lực tự giác từ bên trong.",
  },
  {
    title: "Bám sát đề thi tại Đà Nẵng",
    traditional: "Tài liệu chung chung, thiếu tính cập nhật theo từng trường cụ thể.",
    commercial: "Giáo trình quốc tế xa rời cấu trúc thi của Sở GD&ĐT Đà Nẵng.",
    coNghi: "Thực chiến 100% Sơn Trà: Sửa trọn bộ đề cương các trường THCS Lê Độ, Ngô Quyền, Nguyễn Chí Thanh...",
  },
  {
    title: "Vai trò của Phụ huynh",
    traditional: "Mẹ không nắm được tình hình học của con cho đến khi nhận điểm thi thấp.",
    commercial: "Tư vấn viên chỉ gọi điện khi đến kỳ đóng tiền khóa mới.",
    coNghi: "LMS tự động báo cáo qua Zalo lúc 20h00 + Kênh Cứu trợ SOS 1:1 giải bài tập tối cho con.",
  },
];

interface ComparisonBookCardsProps {
  onRegisterClick?: () => void;
}

export const ComparisonBookCards: React.FC<ComparisonBookCardsProps> = ({ onRegisterClick }) => {
  // 0: Lớp Đại Trà, 1: Trung Tâm Thương Mại, 2: Lớp Cô Nghi
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [animatingPageIndex, setAnimatingPageIndex] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const isAnimatingRef = useRef(false);

  const pagesInfo = [
    {
      id: 0,
      shortTitle: "Lớp Đại Trà (25–30 em)",
      tag: "Thực trạng đại trà",
      badgeType: "danger",
      icon: Users,
      themeColor: "#C43838",
      accentBg: "bg-red-50",
      accentBorder: "border-red-200",
    },
    {
      id: 1,
      shortTitle: "Trung Tâm Thương Mại",
      tag: "Chi phí đắt đỏ",
      badgeType: "warning",
      icon: AlertTriangle,
      themeColor: "#d97706",
      accentBg: "bg-amber-50",
      accentBorder: "border-amber-200",
    },
    {
      id: 2,
      shortTitle: "Lớp Cô Nghi (Tối đa 12 em)",
      tag: "⭐ Giải pháp độc quyền",
      badgeType: "primary",
      icon: Sparkles,
      themeColor: "#0A78F3",
      accentBg: "bg-sky-50",
      accentBorder: "border-sky-300",
    },
  ];

  const handleTurnPage = (targetIndex: number) => {
    if (isAnimatingRef.current || targetIndex === activePageIndex) return;
    if (targetIndex < 0 || targetIndex >= pagesInfo.length) return;

    isAnimatingRef.current = true;
    const direction = targetIndex > activePageIndex ? "next" : "prev";
    setFlipDirection(direction);
    setAnimatingPageIndex(activePageIndex);

    // Kích hoạt hiệu ứng lật trang thực tế
    setTimeout(() => {
      setActivePageIndex(targetIndex);
      setTimeout(() => {
        setAnimatingPageIndex(null);
        setFlipDirection(null);
        isAnimatingRef.current = false;
      }, 650);
    }, 20);
  };

  const handleNext = () => {
    if (activePageIndex < pagesInfo.length - 1) {
      handleTurnPage(activePageIndex + 1);
    } else {
      // Vòng lại trang đầu
      handleTurnPage(0);
    }
  };

  const handlePrev = () => {
    if (activePageIndex > 0) {
      handleTurnPage(activePageIndex - 1);
    } else {
      handleTurnPage(pagesInfo.length - 1);
    }
  };

  // Render nội dung bên trong của 1 trang sách hoàn chỉnh
  const renderPageContent = (pageIdx: number) => {
    if (pageIdx === 0) {
      return (
        <div className="w-full space-y-5 text-slate-800">
          {/* Header Trang 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#C43838] flex items-center justify-center shrink-0 border border-rose-200 shadow-xs">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Hồ sơ đối chiếu 01 • Báo động
                  </span>
                </div>
                <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg sm:text-xl md:text-2xl mt-0.5">
                  LỚP ĐẠI TRÀ (25–30 EM)
                </h3>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase">Mô hình</span>
              <p className="font-bold text-sm text-[#C43838]">Đọc – Chép đại trà</p>
            </div>
          </div>

          <p className="font-body text-slate-600 text-sm sm:text-[15.5px] leading-relaxed">
            Quy mô quá đông khiến giáo viên phải chạy đua cho kịp giáo án. Học sinh hổng kiến thức thường chọn cách &quot;ngồi bàn cuối giấu dốt&quot; và làm bài theo kiểu đoán mò:
          </p>

          {/* 5 Tiêu chí chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CRITERIA_DATA.map((crit, idx) => (
              <div
                key={`trad-full-${idx}`}
                className={`p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-2xs space-y-1.5 ${
                  idx === 4 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-2 font-heading font-extrabold text-slate-800 text-xs sm:text-sm">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{crit.title}</span>
                </div>
                <p className="font-body text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pl-6">
                  {crit.traditional}
                </p>
              </div>
            ))}
          </div>

          {/* Hộp đúc kết thực trạng */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-body text-xs sm:text-[13.5px] text-rose-900 leading-relaxed">
              <strong>Hệ quả thực tế:</strong> Con học ngày càng đuối nhưng sợ không dám hỏi bài. Đến khi nhận phiếu báo điểm 3–4 thì thói quen khoanh lụi đã ăn sâu, phụ huynh không kịp trở tay trước kỳ thi vào Lớp 10.
            </div>
          </div>
        </div>
      );
    }

    if (pageIdx === 1) {
      return (
        <div className="w-full space-y-5 text-slate-800">
          {/* Header Trang 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 shadow-xs">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Hồ sơ đối chiếu 02 • Đắt đỏ
                  </span>
                </div>
                <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg sm:text-xl md:text-2xl mt-0.5">
                  TRUNG TÂM THƯƠNG MẠI LỚN
                </h3>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase">Mô hình</span>
              <p className="font-bold text-sm text-amber-600">Thương mại quốc tế</p>
            </div>
          </div>

          <p className="font-body text-slate-600 text-sm sm:text-[15.5px] leading-relaxed">
            Cơ sở vật chất hoành tráng và học phí cao, tuy nhiên lộ trình giáo trình quốc tế không bám sát cấu trúc ra đề 36 câu phân loại của Sở GD&amp;ĐT Đà Nẵng:
          </p>

          {/* 5 Tiêu chí chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CRITERIA_DATA.map((crit, idx) => (
              <div
                key={`comm-full-${idx}`}
                className={`p-3.5 sm:p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 shadow-2xs space-y-1.5 ${
                  idx === 4 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-2 font-heading font-extrabold text-slate-800 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{crit.title}</span>
                </div>
                <p className="font-body text-slate-600 text-xs sm:text-[13.5px] leading-relaxed pl-6">
                  {crit.commercial}
                </p>
              </div>
            ))}
          </div>

          {/* Hộp đúc kết thực trạng */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="font-body text-xs sm:text-[13.5px] text-amber-900 leading-relaxed">
              <strong>Hệ quả thực tế:</strong> Con có thể giao tiếp cơ bản vui vẻ trong lớp, nhưng khi làm bài kiểm tra 1 tiết, học kỳ hay thi tuyển sinh thì bỏ trắng hoàn toàn phần chia từ (Word Form) và viết lại câu.
            </div>
          </div>
        </div>
      );
    }

    // Trang 3: Lớp Cô Nghi
    return (
      <div className="w-full space-y-5 text-slate-800">
        {/* Header Trang 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A78F3] to-sky-600 text-white flex items-center justify-center shrink-0 border border-white/40 shadow-md">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-white bg-[#0A78F3] px-2.5 py-0.5 rounded-full shadow-2xs">
                  ⭐ Giải Pháp Độc Quyền Sơn Trà
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Khuyên Chọn #1
                </span>
              </div>
              <h3 className="font-heading font-extrabold uppercase tracking-tight text-[#0A78F3] text-lg sm:text-xl md:text-2xl mt-0.5">
                LỚP CÔ NGHI (TỐI ĐA 12 EM)
              </h3>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-sky-200 sm:pl-4">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase">Mô hình</span>
            <p className="font-bold text-sm text-[#0A78F3]">Giám Sát Vi Mô 1-1</p>
          </div>
        </div>

        <p className="font-body text-slate-700 text-sm sm:text-[15.5px] leading-relaxed">
          Không dạy ồ ạt, Cô Nghi khóa cứng sĩ số vàng 12 em để trực tiếp bắt đúng bệnh học thuật, xoa dịu tâm lý sợ sai và dẫn dắt con bứt phá 1–3 điểm:
        </p>

        {/* 5 Tiêu chí vượt trội */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {CRITERIA_DATA.map((crit, idx) => (
            <div
              key={`nghi-full-${idx}`}
              className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-sky-50/90 via-white to-blue-50/40 border border-sky-200/90 shadow-2xs space-y-1.5 hover:border-[#0A78F3] transition-colors ${
                idx === 4 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center justify-between font-heading font-extrabold text-slate-900 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0A78F3] shrink-0" />
                  <span>{crit.title}</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-100/90 px-1.5 py-0.2 rounded border border-emerald-200">
                  Vượt trội
                </span>
              </div>
              <p className="font-body font-medium text-slate-800 text-xs sm:text-[13.5px] leading-relaxed pl-6 border-l-2 border-[#0A78F3]">
                {crit.coNghi}
              </p>
            </div>
          ))}
        </div>

        {/* Hộp đúc kết cam kết + CTA button */}
        <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-sky-100/80 via-blue-50 to-indigo-50 border border-sky-300/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-white text-[#0A78F3] flex items-center justify-center shrink-0 shadow-xs border border-sky-200">
              <ShieldCheck className="w-5 h-5 text-[#0A78F3]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Bảo hiểm học tập 2 lớp an tâm 100%
              </h4>
              <p className="font-body text-xs sm:text-sm text-slate-600 mt-0.5">
                Hoàn 100% học phí sau 7 ngày nếu không hài lòng + Phụ đạo 1-1 miễn phí ngoài giờ.
              </p>
            </div>
          </div>

          {onRegisterClick && (
            <button
              type="button"
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A78F3] hover:bg-[#096ad8] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Đăng Ký Test 1-1 Miễn Phí</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* ── THANH ĐIỀU HƯỚNG TAB KIỂU MỤC LỤC SÁCH (BOOK TABS) ── */}
      <div className="bg-[#e2e8f0]/90 p-1.5 sm:p-2 rounded-2xl border border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* 3 Tab chọn trang sách */}
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto flex-1">
          {pagesInfo.map((p, idx) => {
            const isActive = activePageIndex === idx;
            const IconComp = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleTurnPage(idx)}
                className={`py-2 px-2 sm:px-3.5 rounded-xl font-heading font-bold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <IconComp
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? (idx === 2 ? "text-[#0A78F3]" : idx === 1 ? "text-amber-500" : "text-[#C43838]") : "text-slate-400"
                  }`}
                />
                <span className="truncate">{p.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Nút lật trang trước / sau */}
        <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-300/80">
          <button
            type="button"
            onClick={handlePrev}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300/90 shadow-2xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
            title="Lật về trang trước"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span className="hidden min-[400px]:inline">Trang trước</span>
          </button>

          <span className="font-mono text-xs font-bold text-slate-600 px-2 py-1 bg-white/70 rounded-lg border border-slate-300/60">
            0{activePageIndex + 1} / 03
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-2.5 py-1.5 rounded-xl bg-[#0A78F3] hover:bg-[#096ad8] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            title="Lật sang trang sau"
          >
            <span className="hidden min-[400px]:inline">Lật trang sau</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* ── KHU VỰC CUỐN SÁCH LẬT TRANG THỰC TẾ (REALISTIC FULL-WIDTH BOOK CONTAINER) ── */}
      <div
        className="relative w-full rounded-3xl bg-slate-850 p-2 sm:p-3 border-2 border-slate-700 shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
        style={{ perspective: "2500px" }}
      >
        {/* Khung sách mô phỏng bìa cứng và gáy sách bên trái */}
        <div className="relative w-full rounded-2xl bg-[#f8fafc] border border-slate-300/90 overflow-hidden shadow-inner flex flex-row">
          {/* Gáy sách thực tế bên trái (Spine binding) */}
          <div className="w-5 sm:w-7 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 shrink-0 relative flex flex-col justify-around py-8 items-center border-r border-slate-600 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.5)]">
            {/* Lỗ đóng gáy sách cơ học dập chìm */}
            <span className="w-2 h-2 rounded-full bg-slate-950 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
            <span className="w-2 h-2 rounded-full bg-slate-950 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
            <span className="w-2 h-2 rounded-full bg-slate-950 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
            <span className="w-2 h-2 rounded-full bg-slate-950 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
          </div>

          {/* Vùng nội dung trang sách chính */}
          <div className="relative flex-1 p-4 sm:p-7 md:p-8 min-h-[580px] bg-white">
            {/* Đường gân gập trang sách sát gáy */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-slate-300/40 via-slate-100/20 to-transparent pointer-events-none" />

            {/* Mép giấy xếp lớp bên phải (Paper edge effect) */}
            <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-slate-200/80 to-transparent pointer-events-none border-l border-slate-100" />

            {/* TRANG NỀN TẢNG (HIỂN THỊ NỘI DUNG TRANG ĐANG CHỌN) */}
            <div className="w-full">
              {renderPageContent(activePageIndex)}
            </div>

            {/* LỚP LẬT TRANG SÁCH HIỆU ỨNG 3D (FLIPPING PAGE OVERLAY) */}
            {animatingPageIndex !== null && flipDirection && (
              <div
                className={`absolute inset-0 z-30 p-4 sm:p-7 md:p-8 bg-white border-l border-slate-200 shadow-2xl pointer-events-none overflow-hidden ${
                  flipDirection === "next" ? "animate-book-page-turn" : "animate-book-page-turn-back"
                }`}
                style={{
                  transformOrigin: "left center",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Đường gân bóng đổ khi lật trang */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
                {renderPageContent(animatingPageIndex)}
              </div>
            )}
          </div>
        </div>

        {/* ── CHÂN BẢNG SÁCH: NÚT ĐIỀU HƯỚNG LẬT SÁCH BẰNG TAY TRỰC QUAN ── */}
        <div className="mt-2.5 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>
              Đang mở: <strong className="text-white">{pagesInfo[activePageIndex].shortTitle}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-600 transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Lật lùi trang trước</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0A78F3] to-sky-500 hover:from-[#096ad8] hover:to-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Lật trang tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
