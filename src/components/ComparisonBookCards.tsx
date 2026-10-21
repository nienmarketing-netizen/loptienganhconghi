import React, { useState, useRef, useEffect } from "react";
import {
  Users,
  Building2,
  GraduationCap,
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
    title: "Tương tác với Phụ huynh",
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
  const topRef = useRef<HTMLDivElement>(null);

  const pagesInfo = [
    {
      id: 0,
      shortTitle: "Lớp đại trà",
      tag: "Thực trạng đại trà",
      badgeType: "danger",
      icon: Users,
      themeColor: "#C43838",
      accentBg: "bg-red-50",
      accentBorder: "border-red-200",
    },
    {
      id: 1,
      shortTitle: "Trung tâm lớn",
      tag: "Chi phí đắt đỏ",
      badgeType: "warning",
      icon: Building2,
      themeColor: "#d97706",
      accentBg: "bg-amber-50",
      accentBorder: "border-amber-200",
    },
    {
      id: 2,
      shortTitle: "Lớp cô Nghi",
      tag: "⭐ Giải pháp độc quyền",
      badgeType: "primary",
      icon: GraduationCap,
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
      }, 950);
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

  const scrollToTop = () => {
    if (topRef.current) {
      const yOffset = -75; // Trừ hao khoảng cách header cố định
      const y = topRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleBottomNext = () => {
    handleNext();
    scrollToTop();
  };

  const handleBottomPrev = () => {
    handlePrev();
    scrollToTop();
  };

  // Render nội dung bên trong của 1 trang sách hoàn chỉnh
  const renderPageContent = (pageIdx: number) => {
    if (pageIdx === 0) {
      return (
        <div className="w-full space-y-5 text-slate-800">
          {/* Header Trang 1 */}
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-100 text-[#C43838] flex items-center justify-center shrink-0 border border-rose-200 shadow-xs mt-0.5">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl md:text-2xl leading-tight">
                  Lớp đại trà
                </h3>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Mô hình:</span>
                  <span className="font-bold text-[#C43838]">Đọc – Chép đại trà</span>
                </div>
              </div>
            </div>
          </div>

          <p className="font-body text-slate-600 text-[15px] sm:text-[17px] leading-relaxed">
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
                <div className="flex items-center gap-2 font-heading font-extrabold text-slate-800 text-sm sm:text-base">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{crit.title}</span>
                </div>
                <p className="font-body text-slate-600 text-[15px] sm:text-[16.5px] leading-relaxed pl-6">
                  {crit.traditional}
                </p>
              </div>
            ))}
          </div>

          {/* Hộp đúc kết thực trạng */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-body text-sm sm:text-[15.5px] text-rose-900 leading-relaxed">
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
          <div className="pb-4 border-b border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 shadow-xs mt-0.5">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl md:text-2xl leading-tight">
                  Trung tâm lớn
                </h3>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className="text-slate-500 font-medium">Mô hình:</span>
                  <span className="font-bold text-amber-600">Thương mại quốc tế</span>
                </div>
              </div>
            </div>
          </div>

          <p className="font-body text-slate-600 text-[15px] sm:text-[17px] leading-relaxed">
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
                <div className="flex items-center gap-2 font-heading font-extrabold text-slate-800 text-sm sm:text-base">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{crit.title}</span>
                </div>
                <p className="font-body text-slate-600 text-[15px] sm:text-[16.5px] leading-relaxed pl-6">
                  {crit.commercial}
                </p>
              </div>
            ))}
          </div>

          {/* Hộp đúc kết thực trạng */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="font-body text-sm sm:text-[15.5px] text-amber-900 leading-relaxed">
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
        <div className="pb-4 border-b border-sky-200">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#0A78F3] to-sky-600 text-white flex items-center justify-center shrink-0 border border-white/40 shadow-md mt-0.5">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold tracking-tight text-[#0A78F3] text-lg sm:text-xl md:text-2xl leading-tight">
                Lớp cô Nghi
              </h3>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">Mô hình:</span>
                <span className="font-bold text-[#0A78F3]">Giám Sát Vi Mô 1-1</span>
              </div>
            </div>
          </div>
        </div>

        <p className="font-body text-slate-700 text-[15px] sm:text-[17px] leading-relaxed">
          Không dạy ồ ạt, Cô Nghi khóa cứng sĩ số vàng 12 em để trực tiếp bắt đúng bệnh học thuật, xoa dịu tâm lý sợ sai và dẫn dắt con bứt phá 1–3 điểm:
        </p>

        {/* 5 Tiêu chí vượt trội */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-4.5 pt-2">
          {CRITERIA_DATA.map((crit, idx) => (
            <div
              key={`nghi-full-${idx}`}
              className={`relative p-3.5 sm:p-4 pt-4 sm:pt-4.5 rounded-2xl bg-gradient-to-br from-sky-50/90 via-white to-blue-50/40 border border-sky-200/90 shadow-2xs space-y-1.5 hover:border-[#0A78F3] transition-colors ${
                idx === 4 ? "md:col-span-2" : ""
              }`}
            >
              {/* Nhãn treo 50% trong 50% ngoài box */}
              <div className="absolute -top-2.5 right-4 z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs font-mono text-[10px] sm:text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Vượt trội</span>
              </div>

              <div className="flex items-center gap-2 font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                <CheckCircle2 className="w-4 h-4 text-[#0A78F3] shrink-0" />
                <span>{crit.title}</span>
              </div>
              <p className="font-body font-medium text-slate-800 text-[15px] sm:text-[16.5px] leading-relaxed pl-6 border-l-2 border-[#0A78F3]">
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
    <div ref={topRef} className="w-full space-y-4">
      {/* ── THANH ĐIỀU HƯỚNG TAB KIỂU MỤC LỤC SÁCH (BOOK TABS) ── */}
      <div className="bg-[#e2e8f0]/90 p-1.5 sm:p-2 rounded-2xl border border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Dòng 1 (Mobile) / Cột trái (PC): 3 Tab chọn trang sách - Hiển thị full text tiêu đề, hỗ trợ cuộn ngang */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto flex-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none sm:grid sm:grid-cols-3">
          {pagesInfo.map((p, idx) => {
            const isActive = activePageIndex === idx;
            const IconComp = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleTurnPage(idx)}
                className={`py-2 px-3 sm:px-3.5 rounded-xl font-heading font-bold text-xs sm:text-[13px] flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 sm:shrink ${
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
                <span className="whitespace-nowrap font-bold">{p.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Dòng 2 (Mobile) / Cột phải (PC): Nút điều hướng trang */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 w-full sm:w-auto pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-300/80">
          <button
            type="button"
            onClick={handlePrev}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-[13px] font-bold border border-slate-300/90 shadow-2xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
            <span>Trang trước</span>
          </button>

          <span className="font-mono text-xs font-bold text-slate-600 px-2 py-1 bg-white/70 rounded-lg border border-slate-300/60">
            0{activePageIndex + 1} / 03
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="px-2.5 py-1.5 rounded-xl bg-[#0A78F3] hover:bg-[#096ad8] text-white text-xs sm:text-[13px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            title="Trang sau"
          >
            <span>Trang sau</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* ── KHU VỰC CUỐN SÁCH LẬT TRANG THỰC TẾ (REALISTIC FULL-WIDTH BOOK CONTAINER) ── */}
      <div
        className="relative w-full pt-2.5 z-0"
        style={{ perspective: "2500px" }}
      >
        {/* Lớp trang sách xếp chồng 2 phía sau (Hiệu ứng đỉnh và cạnh phải) */}
        <div className="absolute top-0 right-1 left-7 sm:left-9 bottom-3 rounded-2xl bg-[#e2e8f0] border border-slate-300/90 -z-20 shadow-xs pointer-events-none" />

        {/* Lớp trang sách xếp chồng 1 phía sau (Hiệu ứng đỉnh và cạnh phải) */}
        <div className="absolute top-1.5 right-0.5 left-6 sm:left-8 bottom-1.5 rounded-2xl bg-[#f1f5f9] border border-slate-300 -z-10 shadow-xs pointer-events-none" />

        {/* Khung sách mô phỏng bìa cứng và gáy sách bên trái */}
        <div className="relative z-10 w-full rounded-2xl bg-[#f8fafc] border border-slate-300/90 overflow-hidden shadow-sm flex flex-row">
          {/* Gáy sách thực tế bên trái (Spine binding với các móc tròn kim loại) */}
          <div className="w-6 sm:w-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shrink-0 relative flex flex-col justify-around py-6 sm:py-8 items-center border-r border-slate-600 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.6),2px_0_6px_rgba(0,0,0,0.25)] z-20">
            {/* 5 Vị trí móc tròn kim loại xuyên qua lỗ gáy sách */}
            {[0, 1, 2, 3, 4].map((ringIdx) => (
              <div key={`ring-${ringIdx}`} className="relative flex items-center justify-center w-7 sm:w-9 h-6 sm:h-7 my-1">
                {/* Lỗ đục cơ học dập chìm trên gáy */}
                <span className="w-2 sm:w-2.5 h-3.5 sm:h-4 rounded-full bg-slate-950 border border-slate-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)]" />
                
                {/* Vòng móc tròn kim loại (Chrome Metallic Binder Ring) 3D */}
                <div className="absolute -left-1 sm:-left-1.5 w-7 sm:w-9 h-3.5 sm:h-4 rounded-full border-[2px] sm:border-[2.5px] border-slate-300 bg-gradient-to-b from-slate-100 via-white to-slate-400 shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.95)] z-30 pointer-events-none flex items-center justify-center">
                  {/* Đường sáng bóng kim loại ở giữa móc */}
                  <div className="w-[80%] h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-slate-400 via-white to-slate-300 opacity-90" />
                </div>
                
                {/* Vết bóng đổ của móc kim loại dập xuống mặt trang */}
                <div className="absolute left-2.5 top-4 w-4 h-1.5 bg-black/40 blur-[1px] rounded-full pointer-events-none z-10" />
              </div>
            ))}
          </div>

          {/* Vùng nội dung trang sách chính */}
          <div className="relative flex-1 p-4 sm:p-7 md:p-8 min-h-[580px] bg-white flex flex-col justify-between">
            {/* Phía bên trên: Hiệu ứng các trang sách xếp chồng theo phương ngang */}
            <div className="absolute top-0 left-0 right-0 h-3 sm:h-3.5 flex flex-col pointer-events-none z-10 overflow-hidden border-b border-slate-200/90">
              <div className="h-0.5 w-full bg-slate-200 border-b border-slate-300/80" />
              <div className="h-0.5 w-full bg-[#f8fafc] border-b border-slate-200/90" />
              <div className="h-2 w-full bg-gradient-to-b from-slate-200/40 to-transparent" />
            </div>

            {/* Đường gân gập trang sách sát gáy */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-slate-300/40 via-slate-100/20 to-transparent pointer-events-none" />

            {/* Rìa bên phải: Hiệu ứng các trang sách xếp chồng đa tầng rõ rệt */}
            <div className="absolute top-0 bottom-0 right-0 w-3.5 sm:w-4.5 flex flex-row justify-end pointer-events-none z-10 overflow-hidden border-l border-slate-200/90">
              <div className="w-1 h-full bg-[#e2e8f0] border-r border-slate-300/80 shadow-[inset_-1px_0_1px_rgba(0,0,0,0.06)]" />
              <div className="w-1 h-full bg-[#f1f5f9] border-r border-slate-300/90 shadow-[inset_-1px_0_1px_rgba(0,0,0,0.08)]" />
              <div className="w-1.5 h-full bg-gradient-to-l from-slate-300 via-slate-100 to-white shadow-[inset_-1px_0_2px_rgba(0,0,0,0.18)]" />
            </div>

            {/* TRANG NỀN TẢNG (HIỂN THỊ NỘI DUNG TRANG ĐANG CHỌN) */}
            <div className="w-full">
              {renderPageContent(activePageIndex)}
            </div>

            {/* ── 2 NÚT ĐIỀU HƯỚNG NẰM BÊN TRONG BẢNG SO SÁNH ── */}
            <div className="mt-6 pt-4 border-t border-slate-200/90 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleBottomPrev}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-[13px] font-bold flex items-center gap-1.5 border border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
                <span>Trang trước</span>
              </button>

              <button
                type="button"
                onClick={handleBottomNext}
                className="px-4 py-1.5 rounded-xl bg-[#0A78F3] hover:bg-[#096ad8] text-white text-xs sm:text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <span>Trang sau</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* LỚP LẬT TRANG SÁCH HIỆU ỨNG 3D (FLIPPING PAGE OVERLAY) */}
            {animatingPageIndex !== null && flipDirection && (
              <div
                className={`absolute inset-0 z-30 p-4 sm:p-7 md:p-8 bg-white border-l-2 border-slate-300 shadow-[0_25px_60px_rgba(0,0,0,0.35)] pointer-events-none overflow-hidden ${
                  flipDirection === "next" ? "animate-book-page-turn" : "animate-book-page-turn-back"
                }`}
                style={{
                  transformOrigin: "left center",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Đường gân bóng đổ và vệt sáng phản chiếu khi lật trang */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/35 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                {renderPageContent(animatingPageIndex)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
