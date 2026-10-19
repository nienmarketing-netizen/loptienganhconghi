import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Gamepad2,
  Volume2,
  FileText,
  Smartphone,
  ChevronRight,
  MapPin,
  X,
  Check,
} from "lucide-react";

interface VslScene {
  timeRange: string;
  title: string;
  visual: string;
  script: string;
}

const VSL_SCENES: VslScene[] = [
  {
    timeRange: "0:00 – 0:35",
    title: "Hook & Đồng cảm",
    visual:
      "Cô Nghi đứng tại lớp học 866/25 Ngô Quyền, giọng nói ấm áp, chân thành. Chèn cảnh tái hiện bàn học buổi tối căng thẳng.",
    script:
      '"Chào ba mẹ tại Sơn Trà. Có phải mỗi buổi tối khi bước vào phòng con, nhìn thấy tờ bài kiểm tra Tiếng Anh chỉ vỏn vẹn 3, 4 điểm với những câu trắc nghiệm khoanh bừa, lòng mẹ lại quặn thắt vì lo lắng? Mẹ la mắng, ép con chép phạt từ vựng hàng trang giấy, nhưng chỉ qua ngày hôm sau con lại quên sạch, rồi đóng sập cửa phòng chống đối?"',
  },
  {
    timeRange: "0:35 – 1:25",
    title: "Nguyên nhân & Cảnh báo kỳ thi Đà Nẵng",
    visual:
      "Cận cảnh đề thi tuyển sinh lớp 10 Đà Nẵng 36 câu và biểu đồ điểm chuẩn THPT Hoàng Hoa Thám (33,25đ), Sơn Trà (27,00đ), Ngô Quyền (24,00đ).",
    script:
      '"Thực tế, các con không hề lười hay kém thông minh. Khi lên cấp 2, chương trình Global Success nặng gấp nhiều lần tiểu học. Đưa một đứa trẻ đang hổng kiến thức vào lớp học đại trà 25–30 người chỉ khiến con sợ bị chê cười, thu mình ẩn nấp và chọn cách khoanh lụi. Đáng báo động hơn, điểm chuẩn lớp 10 tại Sơn Trà vừa tăng vọt, và đề thi 36 câu của Sở GD&ĐT Đà Nẵng có tới 70% số điểm đòi hỏi tự viết Word Form, viết lại câu và dịch đọc hiểu. Khoanh lụi đồng nghĩa với nguy cơ trượt trường công lập!"',
  },
  {
    timeRange: "1:25 – 2:35",
    title: "Hệ thống Giải pháp Độc quyền",
    visual:
      "Cảnh Cô Nghi chấm bài 1-1 trong lớp 12 em, học sinh hào hứng chơi Quizizz, cuốn sổ 100 Tokens và màn hình điện thoại Zalo nhận báo cáo từ LMS.",
    script:
      '"Đó là lý do Cô Nghi xây dựng Trạm Cứu Hộ Học Thuật tại 866/25 Ngô Quyền với sĩ số khóa cứng chỉ 12 em/lớp. Tại đây, trước khi dạy chữ, Cô Nghi xoa dịu tâm trí các con bằng triết lý Small Win – Chiến thắng nhỏ. Các con được trị dứt điểm bệnh đoán mò bằng phương pháp Bóc tách 4 bước và Dịch bắt buộc, kết hợp tích lũy 100 Tokens đổi quà để tự giác học tập. Đặc biệt, đúng 8h tối mỗi ngày, hệ thống LMS độc quyền sẽ tự động gửi báo cáo điểm số và tiến độ của con về thẳng Zalo của mẹ."',
  },
  {
    timeRange: "2:35 – 3:30",
    title: "Bảo hiểm Rủi ro & Kêu gọi Hành động",
    visual:
      "Hiển thị chứng nhận Bảo hiểm 2 lớp và bộ quà tặng Phác đồ + Sổ tay Ma thuật. Mũi tên chỉ xuống nút đăng ký bên dưới.",
    script:
      '"Mẹ không cần phải gánh bất kỳ rủi ro nào. Lớp học áp dụng Bảo hiểm 2 lớp: Hoàn 100% học phí trong 7 ngày đầu nếu con không thích, và dạy kèm 1-1 miễn phí ngoài giờ đến khi điểm trên trường của con tăng từ 1 đến 3 điểm. Hãy bấm vào nút bên dưới để đăng ký cho con Phiên Chẩn Đoán Năng Lực 1-1 miễn phí 45 phút cùng Cô Nghi và nhận ngay Bản Phác Đồ Bắt Bệnh kèm Bộ Sổ Tay Ma Thuật nhé!"',
  },
];

export const LandingPage: React.FC = () => {
  const [activeVslIndex, setActiveVslIndex] = useState(0);
  const [isPlayingVsl, setIsPlayingVsl] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    parentName: "",
    phoneZalo: "",
    studentNameAndGrade: "",
    school: "THCS Lê Độ",
    problems: ["Mất gốc hoàn toàn, học trước quên sau"],
    priorityChoice: "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
  });

  const handleOpenRegisterModal = () => {
    setIsModalOpen(true);
    setRegistrationSubmitted(false);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern text-slate-900 selection:bg-sky-200 selection:text-sky-900 relative overflow-x-clip font-body pb-24">
      {/* ─────────────────────────────────────────────────────────────
          ĐƯỜNG Ô LƯỚI NỀN KỸ THUẬT SỐ (DIGITAL GRID LINES)
      ────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 bg-grid-lines opacity-90"
      />

      {/* ─────────────────────────────────────────────────────────────
          1. HIỆU ỨNG TẢN QUANG (AMBIENT GLOW)
          1 đốm Cyan (#00ADEF) và 1 đốm Sota-Red (#C43838)
      ────────────────────────────────────────────────────────────── */}
      <div className="absolute top-12 left-1/4 w-[480px] h-[480px] bg-[#00ADEF] opacity-15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-[#C43838] opacity-15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[1500px] left-10 w-[420px] h-[420px] bg-[#00ADEF] opacity-10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────
          STICKY TOP HEADER (LUÔN DÍNH TRÊN CÙNG THEO YÊU CẦU)
      ────────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Thông tin lớp học Cô Nghi"
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
      >
        <div className="w-[92%] sm:w-[90%] lg:w-[80%] mx-auto py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Bên trái: 2 dòng duy nhất không xuống hàng */}
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-xs sm:text-base leading-tight whitespace-nowrap">
              LỚP TIẾNG ANH CÔ NGHI
            </span>
            <span className="font-mono uppercase text-[9.5px] sm:text-[11px] tracking-wider text-[#00ADEF] font-bold flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
              <span>SƠN TRÀ, ĐÀ NẴNG</span>
            </span>
          </div>

          {/* Bên phải: 2 dòng duy nhất không xuống hàng */}
          <div className="text-right flex flex-col items-end shrink-0 min-w-0">
            <div className="font-body text-[10px] sm:text-sm text-slate-700 leading-tight whitespace-nowrap">
              <span className="text-slate-500 font-medium">Giáo viên:</span>{" "}
              <strong className="font-bold text-slate-900">Thạc sĩ TESOL Quốc tế</strong>
            </div>
            <div className="font-mono text-[9.5px] sm:text-xs uppercase tracking-wider font-bold text-[#C43838] flex items-center justify-end gap-1 mt-0.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C43838] animate-pulse shrink-0" />
              <span>Sĩ số: Tối đa 12 em/ lớp</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative z-10">
        {/* ─────────────────────────────────────────────────────────────
            KHỐI 1: HERO SECTION – TRẠM CỨU HỘ MẤT GỐC (ABOVE THE FOLD)
        ────────────────────────────────────────────────────────────── */}
        <section className="pt-8 sm:pt-12 pb-14">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-6 sm:space-y-8">
            {/* Eyebrow Tag full width trên mobile, nền đỏ mờ nổi bật theo yêu cầu */}
            <div className="flex justify-center w-full px-1 sm:px-2">
              <div className="flex items-center sm:inline-flex w-full sm:w-auto justify-center sm:justify-start gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 via-rose-50/70 to-red-50 border border-red-200 shadow-[0_2px_12px_rgba(196,56,56,0.12)]">
                <span className="w-2 h-2 rounded-full bg-[#C43838] animate-pulse shrink-0 shadow-[0_0_8px_rgba(196,56,56,0.85)]" />
                {/* Desktop: Hiển thị tĩnh đầy đủ */}
                <div className="hidden sm:block font-sans text-xs text-red-950 font-bold tracking-normal whitespace-nowrap leading-normal">
                  Trạm cứu hộ mất gốc tiếng Anh cấp 2 tại Sơn Trà
                </div>
                {/* Mobile: Full-width Style Maquette chạy chữ trọn vẹn bề ngang */}
                <div className="sm:hidden flex-1 min-w-0 overflow-hidden whitespace-nowrap py-0.5 flex items-center">
                  <div className="animate-marquee-slow font-sans text-xs text-red-950 font-bold tracking-normal flex items-center gap-6 leading-normal">
                    <span>Trạm cứu hộ mất gốc tiếng Anh cấp 2 tại Sơn Trà</span>
                    <span className="text-[#C43838] font-black">•</span>
                    <span>Trạm cứu hộ mất gốc tiếng Anh cấp 2 tại Sơn Trà</span>
                    <span className="text-[#C43838] font-black">•</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tiêu đề chính H1: 3 dòng phân cấp tối ưu kích thước tối đa và highlight từ khóa */}
            <h1 className="font-heading font-extrabold uppercase tracking-tight text-center max-w-4xl mx-auto flex flex-col items-center gap-1 sm:gap-2">
              {/* Dòng 1: Kích thước lớn nhất có thể trên 1 hàng mobile */}
              <span className="text-[21px] xs:text-[25px] sm:text-3xl md:text-4xl lg:text-[44px] leading-tight whitespace-nowrap text-center text-slate-900 tracking-tight">
                CHẤM DỨT BỆNH{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ADEF] via-sky-500 to-blue-600 underline decoration-[#00ADEF] decoration-wavy decoration-2 underline-offset-4">
                  &quot;KHOANH LỤI&quot;
                </span>
              </span>

              {/* Dòng 2: Kích thước lớn nhất có thể trên 1 hàng mobile */}
              <span className="text-[21px] xs:text-[25px] sm:text-3xl md:text-4xl lg:text-[44px] leading-tight whitespace-nowrap text-center text-slate-900 tracking-tight">
                GIÚP CON{" "}
                <span className="text-[#00ADEF] bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200 shadow-2xs font-black">
                  TỰ GIÁC
                </span>{" "}
                HỌC TẬP
              </span>

              {/* Dòng 3: Sentence case, nổi bật mốc điểm và thời gian, 1 hàng duy nhất */}
              <span className="text-[13px] xs:text-[14.5px] sm:text-xl md:text-2xl lg:text-[25px] leading-snug font-bold text-slate-700 mt-0.5 sm:mt-1 normal-case whitespace-nowrap text-center flex items-center gap-1 flex-nowrap">
                <span>Bứt phá</span>
                <span className="text-[#C43838] font-black underline decoration-[#C43838] decoration-2 underline-offset-2">
                  1–3 điểm
                </span>
                <span>trên trường</span>
                <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-300 font-black shadow-2xs">
                  chỉ sau 90 ngày!
                </span>
              </span>
            </h1>

            {/* Tiêu đề phụ */}
            <p className="font-body text-slate-600 leading-relaxed text-sm sm:text-base md:text-lg text-center max-w-3xl mx-auto">
              Phương pháp <strong className="text-[#00ADEF]">&quot;Bóc tách 4 bước&quot;</strong> &amp;{" "}
              <strong className="text-[#00ADEF]">&quot;Dịch bắt buộc&quot;</strong> từ Thạc sĩ TESOL giúp con lấy lại nền tảng sách giáo khoa mới (Global Success, Friends Plus) và làm chủ ma trận 36 câu đề thi vào lớp 10 của Sở GD&amp;ĐT Đà Nẵng. Không nhồi nhét chép phạt, không la mắng áp lực –{" "}
              <strong className="text-slate-900">
                Báo cáo tiến độ tự động về Zalo của mẹ lúc 20h00 mỗi tối
              </strong>{" "}
              qua hệ thống LMS độc quyền!
            </p>

            {/* 3 Huy hiệu Bảo Chứng Đầu Trang (Shofu Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Badge 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#00ADEF]/60 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00ADEF] border border-sky-100 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono uppercase text-xs tracking-wider text-[#00ADEF] font-bold block mb-1">
                    CHỨNG NHẬN
                  </span>
                  <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm">
                    Trình Độ Chuyên Môn Bảo Chứng
                  </h4>
                  <p className="font-body text-slate-600 text-xs mt-1.5 leading-relaxed">
                    Cử nhân Biên dịch Tiếng Anh (GPA 8.17/10) – Thạc sĩ TESOL Quốc tế – Sáng lập dự án Hopepath Academy.
                  </p>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#00ADEF]/60 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00ADEF] border border-sky-100 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono uppercase text-xs tracking-wider text-[#00ADEF] font-bold block mb-1">
                    SĨ SỐ VÀNG
                  </span>
                  <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm">
                    Giám Sát Vi Mô 1-1
                  </h4>
                  <p className="font-body text-slate-600 text-xs mt-1.5 leading-relaxed">
                    Quy mô tối đa 12 học sinh/lớp – Bắt đúng bệnh, sửa tỉ mỉ từng lỗi sai ngữ pháp &amp; phát âm cho từng em ngay tại bàn.
                  </p>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#C43838]/60 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C43838] border border-red-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono uppercase text-xs tracking-wider text-[#C43838] font-bold block mb-1">
                    RỦI RO BẰNG 0
                  </span>
                  <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm">
                    Bảo Hiểm Học Tập 2 Lớp
                  </h4>
                  <p className="font-body text-slate-600 text-xs mt-1.5 leading-relaxed">
                    Hoàn 100% học phí 7 ngày đầu nếu con không hào hứng + Phụ đạo 1-1 MIỄN PHÍ ngoài giờ đến khi điểm số thực sự tăng.
                  </p>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                KHU VỰC VSL (VIDEO SALES LETTER 3.5 PHÚT TƯƠNG TÁC THEO SHOFU)
            ────────────────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-md hover:shadow-lg transition-all space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00ADEF] animate-pulse" />
                  <span className="font-mono uppercase text-xs tracking-wider font-bold text-slate-900">
                    Master VSL (3.5 Phút): Thông Điệp Trực Tiếp Từ Cô Nghi
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-[#00ADEF]" /> 03:30 Phút Thấu Cảm
                </div>
              </div>

              {/* Khung trình phát VSL phong cách Studio kỹ thuật số */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-[16/9] flex flex-col justify-between p-4 sm:p-6 text-white">
                {/* Header overlay */}
                <div className="flex items-center justify-between z-10">
                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider border border-white/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00ADEF] animate-pulse" />
                    Lớp học 866/25 Ngô Quyền, Sơn Trà
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-[#00ADEF] font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10">
                    Phân đoạn {activeVslIndex + 1}/4
                  </div>
                </div>

                {/* Player Center Content */}
                <div className="text-center my-auto z-10 max-w-xl mx-auto">
                  {!isPlayingVsl ? (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setIsPlayingVsl(true)}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00ADEF] hover:bg-sky-500 active:scale-95 text-white flex items-center justify-center shadow-2xl shadow-sky-500/50 border-2 border-white/60 transition-all hover:scale-105 group mb-4 cursor-pointer"
                      >
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-white text-white group-hover:scale-105 transition-transform" />
                      </button>
                      <div className="inline-block bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 mb-2">
                        <p className="font-heading font-extrabold uppercase tracking-tight text-xs sm:text-sm text-sky-300">
                          &quot;Xem 3 phút này để hiểu vì sao ép con chép phạt chỉ khiến con sợ Tiếng Anh hơn&quot;
                        </p>
                      </div>
                      <p className="font-body text-xs text-slate-300">
                        Bấm để lắng nghe chia sẻ ấm áp của Cô Nghi gửi đến Ba Mẹ
                      </p>
                    </div>
                  ) : (
                    <div className="bg-black/85 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/15 text-left animate-fadeIn">
                      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#00ADEF] font-bold mb-2">
                        <span>🎬 {VSL_SCENES[activeVslIndex].title}</span>
                        <span>{VSL_SCENES[activeVslIndex].timeRange}</span>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-slate-100 italic leading-relaxed">
                        {VSL_SCENES[activeVslIndex].script}
                      </p>
                      <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="truncate">B-Roll: {VSL_SCENES[activeVslIndex].visual}</span>
                        <button
                          onClick={() => setIsPlayingVsl(false)}
                          className="text-[#00ADEF] hover:text-sky-300 underline ml-2 shrink-0 cursor-pointer font-bold uppercase tracking-wider"
                        >
                          Thu nhỏ
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thanh 4 phân đoạn */}
                <div className="z-10 grid grid-cols-4 gap-1.5 sm:gap-2 pt-2">
                  {VSL_SCENES.map((scene, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveVslIndex(idx);
                        setIsPlayingVsl(true);
                      }}
                      className={`text-left p-2 rounded-lg text-[10px] sm:text-xs transition-all border cursor-pointer ${
                        activeVslIndex === idx
                          ? "bg-[#00ADEF] text-white border-white/40 shadow-md font-bold"
                          : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/10"
                      }`}
                    >
                      <div className="truncate font-mono font-bold">{scene.timeRange}</div>
                      <div className="truncate hidden sm:block opacity-90 font-mono">{scene.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nút Kêu gọi Hành động Chính (CTA Shofu Style) */}
              <div className="pt-2 flex flex-col items-center">
                <button
                  onClick={handleOpenRegisterModal}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00ADEF] text-white font-mono text-sm font-bold uppercase tracking-wider hover:bg-sky-500 transition-all shadow-xl shadow-sky-500/30 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>ĐĂNG KÝ PHIÊN CHẨN ĐOÁN NĂNG LỰC 1-1 &amp; NHẬN BỘ SỔ TAY MA THUẬT MIỄN PHÍ</span>
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-3 bg-slate-100 rounded-xl p-3 max-w-2xl text-center border border-slate-200">
                  <p className="font-body text-xs text-slate-600 leading-relaxed">
                    🔒 <strong className="text-slate-900">Cam kết:</strong> Buổi đánh giá 1-1 kéo dài 45 phút tại 866/25 Ngô Quyền hoàn toàn <strong className="text-[#00ADEF]">MIỄN PHÍ 100%</strong>. Tặng ngay Phác đồ cá nhân hóa &amp; Sổ 100 Tokens dù gia đình chưa đăng ký học.{" "}
                    <span className="font-mono uppercase text-xs tracking-wider text-[#C43838] font-bold">
                      Chỉ nhận 8 lịch test mới trong tuần này!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 2: BÓC TÁCH NỖI ĐAU & THẤU CẢM GIA ĐÌNH (PROBLEM & AGITATION)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 border-t border-slate-200">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-8">
            {/* Header Khối 2 */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm font-mono text-xs text-[#C43838] uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#C43838] animate-pulse" />
                <span>Thấu Cảm Nỗi Niềm Ba Mẹ</span>
              </div>
              <h2 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-xl sm:text-2xl md:text-3xl">
                CÓ PHẢI MỖI BUỔI TỐI TẠI GIA ĐÌNH ĐANG BIẾN THÀNH &quot;CHIẾN TRƯỜNG&quot; CHỈ VÌ MÔN TIẾNG ANH CỦA CON?
              </h2>
              <p className="font-body text-slate-600 leading-relaxed text-xs sm:text-sm">
                Nhiều phụ huynh có con đang học tại các trường THCS Lê Độ, Nguyễn Chí Thanh, Phạm Ngọc Thạch, Phan Bội Châu, Lý Tự Trọng hay Ngô Quyền tìm đến Lớp Tiếng Anh Cô Nghi trong tâm trạng mệt mỏi và bế tắc cùng cực khi chứng kiến bốn triệu chứng học thuật và tâm lý ngày càng trầm trọng ở con:
              </p>
            </div>

            {/* 4 Triệu chứng điển hình (Shofu Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Triệu chứng 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-[#C43838] font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      01
                    </span>
                    <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Học trước quên sau, &quot;bay màu&quot; kiến thức trong phòng thi
                    </h3>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-3">
                    <p className="font-body text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900">Biểu hiện thực tế:</strong> Ở nhà mẹ bắt ngồi học thuộc lòng từ vựng hàng giờ đồng hồ, nhưng hôm sau lên lớp kiểm tra 15 phút hay 1 tiết thì con quên sạch toàn bộ, nhìn trang giấy trắng mà không biết viết gì.
                    </p>
                  </div>
                </div>

                <div className="font-mono uppercase text-xs tracking-wider text-[#C43838] font-bold flex items-start gap-1.5 pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Hệ lụy: Con rơi vào trạng thái bất lực học thuật, tin rằng bản thân không có năng khiếu ngoại ngữ và buông xuôi từ sớm.</span>
                </div>
              </div>

              {/* Triệu chứng 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-[#C43838] font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      02
                    </span>
                    <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Căn bệnh &quot;Khoanh lụi&quot; trắc nghiệm theo cảm tính
                    </h3>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-3">
                    <p className="font-body text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900">Biểu hiện thực tế:</strong> Mỗi khi làm đề cương, con chỉ mất 5 phút để đánh dấu bừa vào các đáp án A, B, C, D cho xong nhiệm vụ. Khi được hỏi &quot;Vì sao con chọn câu này?&quot;, con hoàn toàn im lặng vì không dịch được câu và không hiểu bản chất ngữ pháp.
                    </p>
                  </div>
                </div>

                <div className="font-mono uppercase text-xs tracking-wider text-[#C43838] font-bold flex items-start gap-1.5 pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Hệ lụy: Điểm kiểm tra định kỳ rơi tự do xuống mức 3–4 điểm, kéo tụt xếp loại học bạ THCS và mất điểm xét tuyển lớp 10.</span>
                </div>
              </div>

              {/* Triệu chứng 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-[#C43838] font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      03
                    </span>
                    <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Tâm lý sợ sai, thu mình và chống đối tuổi dậy thì
                    </h3>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-3">
                    <p className="font-body text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900">Biểu hiện thực tế:</strong> Khi mẹ đi làm về mệt mỏi và bắt đầu tra khảo, nhắc nhở, con liền tỏ thái độ cáu gắt, giấu giếm bài kiểm tra và đóng sập cửa phòng.
                    </p>
                  </div>
                </div>

                <div className="font-mono uppercase text-xs tracking-wider text-[#C43838] font-bold flex items-start gap-1.5 pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Hệ lụy: Bữa tối gia đình luôn ngột ngạt; người mẹ bị kiệt sức trong vai trò &quot;cảnh sát học tập&quot;, khoảng cách mẹ con ngày càng xa cách.</span>
                </div>
              </div>

              {/* Triệu chứng 4 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-red-100 text-[#C43838] font-mono text-sm font-bold flex items-center justify-center shrink-0">
                      04
                    </span>
                    <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Mất tiền oan tại các trung tâm hào nhoáng và lớp đại trà
                    </h3>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-3">
                    <p className="font-body text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-900">Biểu hiện thực tế:</strong> Gia đình từng chi hàng chục triệu đồng cho các trung tâm lớn hoặc học với giáo viên nước ngoài, nhưng lớp học quá đông (20–30 học sinh) khiến con dễ dàng &quot;ẩn nấp&quot; ở bàn cuối.
                    </p>
                  </div>
                </div>

                <div className="font-mono uppercase text-xs tracking-wider text-[#C43838] font-bold flex items-start gap-1.5 pt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Hệ lụy: Thời gian trống quá lớn, giáo viên không thể kèm sát từng lỗi chia động từ, khiến con đi học như &quot;vịt nghe sấm&quot;, tiền mất mà điểm dậm chân tại chỗ.</span>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SECTION KHỐI TƯƠNG PHẢN NỀN TỐI (OFFERS/ALERTS THEO SHOFU)
                bg-slate-900 bg-grid-pattern text-white với vòm sáng cyan mờ
            ────────────────────────────────────────────────────────────── */}
            <div className="relative rounded-2xl bg-slate-900 bg-grid-pattern text-white p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden border border-slate-800">
              {/* Vòm sáng cyan mờ & đỏ Sota */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#00ADEF]/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#C43838]/20 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C43838] animate-pulse" />
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-white text-sm sm:text-base">
                      Sự Thật Cảnh Tỉnh Dành Cho Phụ Huynh Tại Quận Sơn Trà
                    </h4>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[#C43838] text-white">
                    Dữ Liệu Thi Lớp 10 Năm 2026
                  </span>
                </div>

                <p className="font-body text-slate-300 leading-relaxed text-xs sm:text-sm">
                  <strong className="text-white">Đừng để sự chủ quan đánh mất tấm vé vào Lớp 10 Công lập của con!</strong> Trong kỳ thi tuyển sinh vào lớp 10 tại Đà Nẵng năm học 2026–2027, điểm chuẩn các trường THPT công lập trên địa bàn quận Sơn Trà đã tăng vọt: <strong className="text-[#00ADEF]">THPT Hoàng Hoa Thám lên tới 33,25 điểm</strong>, <strong className="text-[#00ADEF]">THPT Sơn Trà vọt lên 27,00 điểm (+7,75đ)</strong>, và <strong className="text-[#00ADEF]">THPT Ngô Quyền tăng gấp đôi lên 24,00 điểm (+13,00đ)</strong>.
                </p>

                <p className="font-body text-slate-300 leading-relaxed text-xs sm:text-sm">
                  Với quy chế tính điểm mới đặt môn Tiếng Anh ngang hàng tuyệt đối với môn Toán và Văn (hệ số 1:1:1) cùng cấu trúc đề thi 36 câu khắc nghiệt của Sở GD&amp;ĐT Đà Nẵng, một học sinh giữ thói quen &quot;khoanh lụi&quot; sẽ đối mặt trực tiếp với nguy cơ rớt trường công lập, tạo ra gánh nặng học phí trường tư thục lên đến hàng trăm triệu đồng trong 3 năm cấp 3.
                </p>

                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 backdrop-blur-sm">
                  <p className="font-body text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    ❤️ <strong className="text-[#00ADEF]">Nhưng lỗi hoàn toàn không phải do các con thiếu thông minh!</strong> Tiếng lòng sâu thẳm của các con là: <em>&quot;Con không ghét Tiếng Anh, con chỉ sợ cảm giác bất lực khi không hiểu bài và sợ ánh mắt thất vọng khi mẹ đứng sau quát mắng&quot;</em>. Thứ duy nhất con đang thiếu là một <strong className="text-white">PHƯƠNG PHÁP BÓC TÁCH ĐÚNG BẢN CHẤT</strong> và một <strong className="text-white">MÔI TRƯỜNG AN TOÀN ĐỂ XÂY DỰNG LẠI SỰ TỰ TIN</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 3: GIẢI PHÁP ĐỘT PHÁ & HỆ THỐNG 5 PHƯƠNG PHÁP ĐỘC QUYỀN
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 border-t border-slate-200">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-8">
            {/* Header Khối 3 */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm font-mono text-xs text-[#00ADEF] uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#00ADEF] animate-pulse" />
                <span>The Unique Mechanism – Giải Pháp Độc Quyền</span>
              </div>
              <h2 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-xl sm:text-2xl md:text-3xl">
                LỚP TIẾNG ANH CÔ NGHI – TRẠM CỨU HỘ HỌC THUẬT &amp; KIẾN TẠO ĐỘNG LỰC VỚI SĨ SỐ VÀNG 12 HỌC SINH
              </h2>
              <p className="font-body text-slate-600 leading-relaxed text-xs sm:text-sm">
                Không vận hành như một trung tâm thương mại đại trà hay một lò luyện thi nhồi nhét, Lớp Tiếng Anh Cô Nghi tại 866/25 Ngô Quyền được thiết kế theo mô hình <strong>Giám sát Vi mô (Micro-Class Mentorship)</strong>. Sự khác biệt cốt lõi dưới đây giải thích vì sao học sinh từng sợ hãi Tiếng Anh lại có thể bứt phá điểm số chỉ sau 90 ngày:
              </p>
            </div>

            {/* Bảng đối chiếu 3 cột (Shofu Table Card) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-md overflow-x-auto">
              <table className="w-full min-w-[640px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-3 font-mono text-xs uppercase tracking-wider text-slate-400 w-[22%]">
                      Tiêu Chí Đối Chiếu
                    </th>
                    <th className="py-3 px-3 font-mono text-xs uppercase tracking-wider text-slate-600 w-[26%] bg-slate-50 rounded-t-xl">
                      Lớp Đại Trà (25–30 em)
                    </th>
                    <th className="py-3 px-3 font-mono text-xs uppercase tracking-wider text-slate-600 w-[26%]">
                      Trung Tâm Thương Mại Lớn
                    </th>
                    <th className="py-3 px-3 font-mono text-xs uppercase tracking-wider font-bold text-white w-[26%] bg-[#00ADEF] rounded-t-xl shadow-xs">
                      Lớp Cô Nghi (Tối đa 12 em)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  <tr>
                    <td className="py-4 px-3 font-heading font-extrabold text-slate-900">Mức độ quan tâm &amp; Sửa lỗi</td>
                    <td className="py-4 px-3 font-body text-slate-600 bg-slate-50/50">
                      Giáo viên chép đáp án lên bảng; học sinh yếu ngồi bàn cuối giấu dốt, chép bài đối phó.
                    </td>
                    <td className="py-4 px-3 font-body text-slate-600">
                      Học phí đắt đỏ nhưng lớp đông, thời gian chết lớn; không sửa chi tiết ngữ pháp.
                    </td>
                    <td className="py-4 px-3 font-body font-semibold text-slate-900 bg-sky-50/60">
                      ✨ <strong className="text-[#00ADEF]">Kèm vi mô 1-1 từng em:</strong> Cô Nghi trực tiếp bắt bệnh và sửa tỉ mỉ từng lỗi sai ngay tại bàn.
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 font-heading font-extrabold text-slate-900">Phương pháp xử lý bài tập</td>
                    <td className="py-4 px-3 font-body text-slate-600 bg-slate-50/50">
                      Giải đề số lượng lớn theo kiểu học vẹt công thức; học sinh tiếp tục khoanh lụi.
                    </td>
                    <td className="py-4 px-3 font-body text-slate-600">
                      Tập trung nghe nói bề nổi; bỏ trống hoàn toàn kỹ năng Word Form và Writing trên trường.
                    </td>
                    <td className="py-4 px-3 font-body font-semibold text-slate-900 bg-sky-50/60">
                      ✨ <strong className="text-[#00ADEF]">&quot;Bóc tách 4 bước&quot; &amp; &quot;Dịch bắt buộc&quot;:</strong> Hiểu sâu bản chất, giải thích được lý do chọn đáp án.
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 font-heading font-extrabold text-slate-900">Tâm lý &amp; Động lực của con</td>
                    <td className="py-4 px-3 font-body text-slate-600 bg-slate-50/50">
                      Căng thẳng, sợ bị gọi tên trả bài, dễ chán nản và bỏ cuộc.
                    </td>
                    <td className="py-4 px-3 font-body text-slate-600">
                      Vui vẻ lúc chơi trò chơi nhưng về nhà vẫn sợ đề kiểm tra trên trường.
                    </td>
                    <td className="py-4 px-3 font-body font-semibold text-slate-900 bg-sky-50/60">
                      ✨ <strong className="text-[#00ADEF]">Chữa lành tâm lý &amp; Game hóa 100 Tokens:</strong> Không la mắng; kích hoạt động lực tự giác từ bên trong.
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 font-heading font-extrabold text-slate-900">Bám sát đề thi tại Đà Nẵng</td>
                    <td className="py-4 px-3 font-body text-slate-600 bg-slate-50/50">
                      Tài liệu chung chung, thiếu tính cập nhật theo từng trường cụ thể.
                    </td>
                    <td className="py-4 px-3 font-body text-slate-600">
                      Giáo trình quốc tế xa rời cấu trúc thi của Sở GD&amp;ĐT Đà Nẵng.
                    </td>
                    <td className="py-4 px-3 font-body font-semibold text-slate-900 bg-sky-50/60">
                      ✨ <strong className="text-[#00ADEF]">Thực chiến 100% Sơn Trà:</strong> Sửa trọn bộ đề cương các trường THCS Lê Độ, Ngô Quyền, Nguyễn Chí Thanh...
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-3 font-heading font-extrabold text-slate-900">Vai trò của Phụ huynh</td>
                    <td className="py-4 px-3 font-body text-slate-600 bg-slate-50/50">
                      Mẹ không nắm được tình hình học của con cho đến khi nhận điểm thi thấp.
                    </td>
                    <td className="py-4 px-3 font-body text-slate-600">
                      Tư vấn viên chỉ gọi điện khi đến kỳ đóng tiền khóa mới.
                    </td>
                    <td className="py-4 px-3 font-body font-semibold text-slate-900 bg-sky-50/60">
                      ✨ <strong className="text-[#00ADEF]">LMS tự động báo cáo qua Zalo lúc 20h00</strong> + Kênh Cứu trợ SOS 1:1 giải bài tập tối cho con.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5 Vũ Khí Sư Phạm Độc Quyền (Shofu Cards) */}
            <div className="space-y-4">
              <div className="text-center pt-2">
                <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg sm:text-xl md:text-2xl">
                  5 Vũ Khí Sư Phạm Độc Quyền Giúp Con Học &quot;Siêu Dễ Hiểu – Nhớ Siêu Lâu&quot;
                </h3>
                <p className="font-body text-slate-600 text-xs sm:text-sm mt-1">
                  Được thiết kế dựa trên khoa học hành vi và thực tế đề thi tại Đà Nẵng
                </p>
              </div>

              {/* Vũ khí 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#00ADEF]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00ADEF] border border-sky-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs tracking-wider text-[#00ADEF] font-bold block mb-1">
                      VŨ KHÍ 01
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Phương pháp &quot;Bóc tách 4 bước &amp; Trợ giảng đồng đẳng&quot; + &quot;Dịch bắt buộc&quot;
                    </h4>
                    <p className="font-body text-slate-600 text-xs mt-1 leading-relaxed">
                      Học sinh thực hành quy trình 4 bước: Chủ động khoanh vùng từ mới ➔ Thảo luận đồng đẳng cùng bạn học ➔ Giải bài tập dựa trên cấu trúc nền tảng ➔ Dịch sâu nối tiếp từng câu và giải thích trước Cô Nghi: <em>&quot;Tại sao chọn đáp án A mà không chọn B, C, D?&quot;</em>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs uppercase tracking-wider text-[#00ADEF] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Chấm dứt 100% thói quen khoanh lụi &amp; đọc đoán mò
                </div>
              </div>

              {/* Vũ khí 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#00ADEF]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00ADEF] border border-sky-100 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs tracking-wider text-[#00ADEF] font-bold block mb-1">
                      VŨ KHÍ 02
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Hệ thống Game hóa Kỷ luật &quot;100 Tokens&quot; &amp; Triết lý &quot;Small Win&quot;
                    </h4>
                    <p className="font-body text-slate-600 text-xs mt-1 leading-relaxed">
                      Khởi động/kết thúc buổi học bằng Quizizz kịch tính. Điểm thưởng trong sổ &quot;100 Tokens&quot; tính theo tỷ lệ: 50% Kết quả bài làm + 30% Thái độ, nỗ lực + 20% Top Quizizz, kèm Kickstart Bonus nhân đôi/nhân ba điểm tuần đầu giúp đạt ngay 15–20% mốc đổi quà lớn.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs uppercase tracking-wider text-[#00ADEF] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Kích thích Dopamine, tự giác làm bài không cần giục
                </div>
              </div>

              {/* Vũ khí 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#00ADEF]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00ADEF] border border-sky-100 flex items-center justify-center shrink-0">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs tracking-wider text-[#00ADEF] font-bold block mb-1">
                      VŨ KHÍ 03
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Chuẩn hóa Phát âm IPA, Quy tắc Trọng âm &amp; Spaced Repetition
                    </h4>
                    <p className="font-body text-slate-600 text-xs mt-1 leading-relaxed">
                      Hướng dẫn nhận diện bảng phiên âm quốc tế IPA cơ bản, quy tắc dấu nhấn trọng âm và kỹ thuật bật âm cuối kết hợp ôn tập từ vựng lặp lại ngắt quãng.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs uppercase tracking-wider text-[#00ADEF] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Đọc chuẩn, nhớ chắc 80–90% từ vựng SGK mới
                </div>
              </div>

              {/* Vũ khí 4 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#00ADEF]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00ADEF] border border-sky-100 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs tracking-wider text-[#00ADEF] font-bold block mb-1">
                      VŨ KHÍ 04
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Giảng dạy Ngữ pháp trong Ngữ cảnh &amp; Thực chiến Đề cương Sơn Trà
                    </h4>
                    <p className="font-body text-slate-600 text-xs mt-1 leading-relaxed">
                      Đặt ngữ pháp vào đúng ngữ cảnh câu của SGK Global Success / Friends Plus và ma trận 36 câu thi vào lớp 10 Đà Nẵng. Học sinh được tặng bộ chuẩn bị Speaking &amp; Writing và sửa chi tiết 100% đề cương của chính trường con đang học.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs uppercase tracking-wider text-[#00ADEF] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Làm chủ Word Form &amp; đề thi thật tại Sơn Trà
                </div>
              </div>

              {/* Vũ khí 5 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#00ADEF]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#00ADEF] border border-sky-100 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs tracking-wider text-[#00ADEF] font-bold block mb-1">
                      VŨ KHÍ 05
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-sm sm:text-base">
                      Hệ sinh thái Công nghệ LMS Độc quyền &amp; &quot;Cứu trợ SOS 1:1&quot;
                    </h4>
                    <p className="font-body text-slate-600 text-xs mt-1 leading-relaxed">
                      Đúng 20h00 sau mỗi buổi học, hệ thống LMS tự động gửi báo cáo chi tiết về điểm số và tình trạng bài tập của con về thẳng Zalo của mẹ. Khi ở nhà gặp bài khó, con nhắn vào kênh Zalo SOS 1:1 để được hướng dẫn tháo gỡ.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs uppercase tracking-wider text-[#00ADEF] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Mẹ thảnh thơi buổi tối, trả lại sự bình yên gia đình
                </div>
              </div>
            </div>

            {/* CTA Chuyển tiếp */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleOpenRegisterModal}
                className="px-8 py-4 rounded-xl bg-[#00ADEF] text-white font-mono text-sm font-bold uppercase tracking-wider hover:bg-sky-500 transition-all shadow-xl shadow-sky-500/30 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>ĐẶT LỊCH PHIÊN TEST 1-1 CÙNG CÔ NGHI NGAY</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL ĐĂNG KÝ PHIÊN CHẨN ĐOÁN 1-1 (LEAD CAPTURE MODAL THEO SHOFU)
      ────────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[92vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!registrationSubmitted ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C43838] animate-pulse" />
                  <span className="font-mono uppercase text-xs tracking-wider text-[#C43838] font-bold">
                    Chỉ Còn 08 Suất Test Trong Tuần Này
                  </span>
                </div>

                <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg sm:text-xl">
                  Đăng Ký Phiên Chẩn Đoán Năng Lực 1-1 Miễn Phí (45 Phút)
                </h3>
                <p className="font-body text-slate-600 text-xs mt-1 leading-relaxed">
                  Trực tiếp cùng Cô Nghi tại 866/25 Ngô Quyền, Sơn Trà. Nhận ngay Bản Phác Đồ Lộ Trình &amp; Bộ Sổ Tay Ma Thuật.
                </p>

                <form onSubmit={handleSubmitForm} className="mt-5 space-y-3.5">
                  <div>
                    <label className="block font-mono uppercase text-xs tracking-wider text-slate-700 font-bold mb-1">
                      1. Họ và tên Phụ huynh (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Mẹ Thảo Nguyên..."
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#00ADEF] focus:ring-1 focus:ring-[#00ADEF] text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-xs tracking-wider text-slate-700 font-bold mb-1">
                      2. Số điện thoại Zalo (*)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Nhập SĐT Zalo để nhận Phác đồ & Sổ tay PDF..."
                      value={formData.phoneZalo}
                      onChange={(e) => setFormData({ ...formData, phoneZalo: e.target.value })}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#00ADEF] focus:ring-1 focus:ring-[#00ADEF] text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-xs tracking-wider text-slate-700 font-bold mb-1">
                      3. Họ tên con &amp; Khối lớp hiện tại (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Nguyễn Minh An - Lớp 8..."
                      value={formData.studentNameAndGrade}
                      onChange={(e) =>
                        setFormData({ ...formData, studentNameAndGrade: e.target.value })
                      }
                      className="w-full text-xs px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#00ADEF] focus:ring-1 focus:ring-[#00ADEF] text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-xs tracking-wider text-slate-700 font-bold mb-1">
                      4. Trường THCS con đang học tại Đà Nẵng
                    </label>
                    <select
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#00ADEF] focus:ring-1 focus:ring-[#00ADEF] text-slate-900 transition-colors"
                    >
                      <option value="THCS Lê Độ">THCS Lê Độ (Sơn Trà)</option>
                      <option value="THCS Ngô Quyền">THCS Ngô Quyền (Sơn Trà)</option>
                      <option value="THCS Nguyễn Chí Thanh">THCS Nguyễn Chí Thanh (Sơn Trà)</option>
                      <option value="THCS Phạm Ngọc Thạch">THCS Phạm Ngọc Thạch (Sơn Trà)</option>
                      <option value="THCS Phan Bội Châu">THCS Phan Bội Châu (Sơn Trà)</option>
                      <option value="THCS Lý Tự Trọng">THCS Lý Tự Trọng</option>
                      <option value="Khác">Trường khác tại Đà Nẵng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-xs tracking-wider text-slate-700 font-bold mb-1">
                      5. Nhu cầu ưu tiên của Phụ huynh
                    </label>
                    <div className="space-y-1.5 text-xs">
                      {[
                        "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
                        "Tư vấn Lộ trình 90 ngày (Bứt phá 1-3 điểm)",
                        "Tư vấn Trại Ôn Thi Cấp Tốc 14 Ngày (Gỡ điểm cấp tốc)",
                      ].map((choice, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer text-slate-800 hover:bg-sky-50/50 hover:border-sky-200 transition-colors"
                        >
                          <input
                            type="radio"
                            name="priority"
                            checked={formData.priorityChoice === choice}
                            onChange={() => setFormData({ ...formData, priorityChoice: choice })}
                            className="text-[#00ADEF] focus:ring-[#00ADEF]"
                          />
                          <span className="font-body text-xs leading-tight">{choice}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 px-4 rounded-xl bg-[#00ADEF] hover:bg-sky-500 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>XÁC NHẬN ĐĂNG KÝ – GIỮ LỊCH TEST 1-1 MIỄN PHÍ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="font-body text-[11px] text-center text-slate-500">
                    ⚡ Cô Nghi sẽ trực tiếp liên hệ qua Zalo hoặc điện thoại trong vòng 15 phút để xác nhận lịch hẹn!
                  </p>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-sky-100 text-[#00ADEF] mx-auto flex items-center justify-center border-2 border-sky-300 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg">
                  Đăng Ký Thành Công!
                </h4>
                <p className="font-body text-xs text-slate-600 leading-relaxed">
                  Cảm ơn phụ huynh <strong>{formData.parentName}</strong> đã gửi gắm thông tin của bé <strong>{formData.studentNameAndGrade}</strong>.
                </p>
                <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-slate-800">
                  Cô Nghi sẽ liên hệ qua Zalo số <strong>{formData.phoneZalo}</strong> để gửi Bản Phác Đồ Lộ Trình &amp; chốt khung giờ test 1-1 phù hợp nhất với lịch học của con.
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
