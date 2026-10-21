import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  X,
  Check,
  Camera,
  Upload,
  Quote,
  TrendingUp,
  School,
  Heart,
  Scale,
  MessageCircle,
} from "lucide-react";
import { ComparisonBookCards } from "../components/ComparisonBookCards";


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

const SYMPTOMS_DATA: {
  id: string;
  tag: string;
  title: string;
  image?: string;
  behavior: string;
  consequence: string;
}[] = [
  {
    id: "01",
    tag: "Triệu chứng học thuật #1",
    title: 'Học trước quên sau, "bay màu" kiến thức trong phòng thi',
    image: "/image/hoc-truoc-quen-sau.webp",
    behavior:
      "Ở nhà mẹ bắt ngồi học thuộc lòng từ vựng hàng giờ đồng hồ, nhưng hôm sau lên lớp kiểm tra 15 phút hay 1 tiết thì con quên sạch toàn bộ, nhìn trang giấy trắng mà không biết viết gì.",
    consequence:
      "Con rơi vào trạng thái bất lực học thuật, tin rằng bản thân không có năng khiếu ngoại ngữ và buông xuôi từ sớm.",
  },
  {
    id: "02",
    tag: "Triệu chứng học thuật #2",
    title: 'Thói quen "Khoanh lụi" trắc nghiệm theo cảm tính',
    image: "/image/thoi-quen-khoanh-lui.webp",
    behavior:
      'Mỗi khi làm đề cương, con chỉ mất 5 phút để đánh dấu bừa vào các đáp án A, B, C, D cho xong nhiệm vụ. Khi được hỏi "Vì sao con chọn câu này?", con hoàn toàn im lặng vì không dịch được câu và không hiểu bản chất ngữ pháp.',
    consequence:
      "Điểm kiểm tra định kỳ rơi tự do xuống mức 3–4 điểm, kéo tụt xếp loại học bạ THCS và mất điểm xét tuyển lớp 10.",
  },
  {
    id: "03",
    tag: "Triệu chứng tâm lý #3",
    title: "Tâm lý sợ sai, thu mình và chống đối tuổi dậy thì",
    image: "/image/tam-ly-tuoi-day-thi.webp",
    behavior:
      "Khi mẹ đi làm về mệt mỏi và bắt đầu tra khảo, nhắc nhở, con liền tỏ thái độ cáu gắt, giấu giếm bài kiểm tra và đóng sập cửa phòng.",
    consequence:
      'Bữa tối gia đình luôn ngột ngạt; người mẹ bị kiệt sức trong vai trò "cảnh sát học tập", khoảng cách mẹ con ngày càng xa cách.',
  },
  {
    id: "04",
    tag: "Triệu chứng sai lầm #4",
    title: "Mất tiền oan tại các trung tâm hào nhoáng và lớp đại trà",
    image: "/image/tang-hinh-trong-lop.webp",
    behavior:
      'Gia đình từng chi hàng chục triệu đồng cho các trung tâm lớn hoặc học với giáo viên nước ngoài, nhưng lớp học quá đông (20–30 học sinh) khiến con dễ dàng "ẩn nấp" ở bàn cuối.',
    consequence:
      'Thời gian trống quá lớn, giáo viên không thể kèm sát từng lỗi chia động từ, khiến con đi học như "vịt nghe sấm", tiền mất mà điểm dậm chân tại chỗ.',
  },
];

export const LandingPage: React.FC = () => {
  const [isPlayingVsl, setIsPlayingVsl] = useState(false);
  const [isVslMuted, setIsVslMuted] = useState(true);
  const [isVslLoaded, setIsVslLoaded] = useState(false);

  const handleUnmuteVsl = () => {
    const iframe = document.getElementById("vsl-vimeo-iframe") as HTMLIFrameElement | null;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({ method: "setMuted", value: false }), "*");
      iframe.contentWindow.postMessage(JSON.stringify({ method: "setVolume", value: 1 }), "*");
      iframe.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
    }
    setIsVslMuted(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [teacherPhoto, setTeacherPhoto] = useState<string>(() => {
    try {
      return (
        localStorage.getItem("co_nghi_hero_photo") ||
        "/image/lop-tieng-anh-co-nghi-thac-si-tesol.webp"
      );
    } catch {
      return "/image/lop-tieng-anh-co-nghi-thac-si-tesol.webp";
    }
  });
  const [vslThumbnail, setVslThumbnail] = useState<string>(() => {
    try {
      return (
        localStorage.getItem("co_nghi_vsl_thumbnail") ||
        "/image/vsl-thumbnail-final.webp"
      );
    } catch {
      return "/image/vsl-thumbnail-final.webp";
    }
  });

  // Form state
  const [formData, setFormData] = useState({
    parentName: "",
    phoneZalo: "",
    studentNameAndGrade: "",
    school: "THCS Lê Độ",
    problems: ["Mất gốc hoàn toàn, học trước quên sau"],
    priorityChoice: "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
  });

  // State cho slide 4 triệu chứng (cuộn tròn liên tục 1->4->1, PC 2 thẻ, Mobile full-width 1 thẻ)
  const [symptomSlideIndex, setSymptomSlideIndex] = useState(4); // Vị trí trung tâm trong 3 bộ thẻ (0..3, 4..7, 8..11)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isSymptomPaused, setIsSymptomPaused] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return false;
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNextSymptom = () => {
    setOpenDropdowns({});
    setIsTransitionEnabled(true);
    setSymptomSlideIndex((prev) => prev + 1);
  };

  const handlePrevSymptom = () => {
    setOpenDropdowns({});
    setIsTransitionEnabled(true);
    setSymptomSlideIndex((prev) => prev - 1);
  };

  const handleSymptomTransitionEnd = () => {
    if (symptomSlideIndex >= 8) {
      setIsTransitionEnabled(false);
      setSymptomSlideIndex((prev) => prev - 4);
    } else if (symptomSlideIndex < 4) {
      setIsTransitionEnabled(false);
      setSymptomSlideIndex((prev) => prev + 4);
    }
  };

  useEffect(() => {
    if (!isTransitionEnabled) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitionEnabled]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Khi dropdown đang mở thì tạm ngừng auto cuộn
  const hasOpenDropdown = Object.values(openDropdowns).some(Boolean);

  useEffect(() => {
    if (isSymptomPaused || hasOpenDropdown) return;
    const interval = setInterval(() => {
      handleNextSymptom();
    }, 6750); // Giảm tốc độ auto cuộn thêm 50%
    return () => clearInterval(interval);
  }, [isSymptomPaused, hasOpenDropdown]);

  const handleVslThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) {
          setVslThumbnail(res);
          try {
            localStorage.setItem("co_nghi_vsl_thumbnail", res);
          } catch {
            // ignore
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenRegisterModal = () => {
    setIsModalOpen(true);
    setRegistrationSubmitted(false);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationSubmitted(true);
  };

  const infiniteSymptomItems = [...SYMPTOMS_DATA, ...SYMPTOMS_DATA, ...SYMPTOMS_DATA];

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern text-slate-900 selection:bg-sky-200 selection:text-sky-900 relative overflow-x-clip font-body pb-24">
      {/* ─────────────────────────────────────────────────────────────
          1. HIỆU ỨNG TẢN QUANG (AMBIENT GLOW)
          1 đốm Cyan (#0A78F3) và 1 đốm Sota-Red (#C43838)
      ────────────────────────────────────────────────────────────── */}
      <div className="absolute top-12 left-1/4 w-[480px] h-[480px] bg-[#0A78F3] opacity-15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-[#C43838] opacity-15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[1500px] left-10 w-[420px] h-[420px] bg-[#0A78F3] opacity-10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────
          STICKY TOP HEADER (MÀU NỀN CÔNG NGHIỆP #2d3436 NỔI BẬT THEO DESIGN SYSTEM)
      ────────────────────────────────────────────────────────────── */}
      <aside
        aria-label="Thông tin lớp học Cô Nghi"
        className="sticky top-0 z-50 bg-[#2d3436] text-white border-b border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.18)] backdrop-blur-md"
      >
        <div className="w-[92%] sm:w-[90%] lg:w-[80%] mx-auto py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Bên trái: 2 dòng duy nhất không xuống hàng */}
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="font-heading font-extrabold uppercase tracking-tight text-white text-xs sm:text-base leading-tight whitespace-nowrap">
              LỚP TIẾNG ANH CÔ NGHI
            </span>
            <span className="font-mono uppercase text-[9.5px] sm:text-[11px] tracking-wider text-sky-400 font-bold flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff4757] shrink-0" />
              <span>SƠN TRÀ, ĐÀ NẴNG</span>
            </span>
          </div>

          {/* Bên phải: 2 dòng duy nhất không xuống hàng */}
          <div className="text-right flex flex-col items-end shrink-0 min-w-0">
            <div className="font-body text-[10px] sm:text-sm text-slate-200 leading-tight whitespace-nowrap">
              <span className="text-slate-400 font-medium">Giáo viên:</span>{" "}
              <strong className="font-bold text-white">Thạc sĩ TESOL Quốc tế</strong>
            </div>
            <div className="font-mono text-[9.5px] sm:text-xs uppercase tracking-wider font-bold text-[#ff6b81] flex items-center justify-end gap-1 mt-0.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4757] animate-pulse shrink-0" />
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
          <div className="w-[95%] sm:w-[90%] lg:w-[80%] mx-auto space-y-6 sm:space-y-8">
            {/* ── BỐ CỤC HERO: DESKTOP 70:30 (TRÁI NỘI DUNG, PHẢI ẢNH), MOBILE ẢNH NẰM GIỮA HEADLINE VÀ BODY TEXT ── */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 sm:gap-6 lg:gap-x-8 lg:gap-y-5 items-center">
              {/* 1. Eyebrow Tag: Desktop col 1-7 row 1; Mobile vị trí 1 */}
              <div className="w-full flex justify-center lg:justify-start px-1 sm:px-0 lg:col-span-7 lg:col-start-1 lg:row-start-1">
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

              {/* 2. Tiêu đề chính H1: Desktop col 1-7 row 2; Mobile vị trí 2 */}
              <h1 className="font-heading font-extrabold uppercase tracking-tight text-center lg:text-left w-full flex flex-col items-center lg:items-start gap-1 sm:gap-2 lg:col-span-7 lg:col-start-1 lg:row-start-2">
                {/* Dòng 1 */}
                <span className="text-[19px] min-[390px]:text-[21.5px] min-[430px]:text-[23.5px] sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] leading-tight text-center lg:text-left text-slate-900 tracking-tight whitespace-nowrap sm:whitespace-normal">
                  CHẤM DỨT THÓI QUEN{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A78F3] via-sky-500 to-blue-600">
                    &quot;KHOANH LỤI&quot;
                  </span>
                </span>

                {/* Dòng 2 */}
                <span className="text-[21px] xs:text-[25px] sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] leading-tight text-center lg:text-left text-slate-900 tracking-tight">
                  GIÚP CON{" "}
                  <span className="text-[#0A78F3] bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200 shadow-2xs font-black">
                    TỰ GIÁC
                  </span>{" "}
                  HỌC TẬP
                </span>

                {/* Dòng 3 */}
                <span className="text-[13px] xs:text-[14.5px] sm:text-xl md:text-2xl lg:text-[22px] xl:text-[24px] leading-snug font-bold text-slate-700 mt-0.5 sm:mt-1 normal-case text-center lg:text-left flex items-center justify-center lg:justify-start gap-1 flex-wrap sm:flex-nowrap">
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

              {/* 3. KHUNG HÌNH ẢNH CÔ NGHI: Mobile full width nằm giữa Headline và Body text; Desktop 30% bên phải (col 8-10, row 1-3) */}
              <div className="w-full lg:col-span-3 lg:col-start-8 lg:row-start-1 lg:row-end-4 self-center">
                <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white shadow-[0_12px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.7)] hover:shadow-[0_16px_36px_rgba(10,120,243,0.15)] transition-all bg-slate-900 group aspect-[4/5] sm:aspect-[3/4] lg:aspect-[3/4]">
                  {/* Hình ảnh Cô Nghi hiển thị full box với borderline màu trắng dày gấp đôi (border-2) */}
                  <img
                    src={teacherPhoto}
                    alt="Phương pháp kèm cặp độc quyền"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                  />

                  {/* Tag chứng nhận nổi trên góc ảnh */}
                  <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10.5px] font-bold text-slate-800 uppercase tracking-wider">
                      Thạc sĩ TESOL
                    </span>
                  </div>

                  {/* Gradient Overlay & Metadata thông tin chân dung phía dưới phủ lên ảnh full box */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-4 sm:p-5 pt-12 text-white flex flex-col justify-end">
                    <div className="flex items-center">
                      <span className="text-[11px] sm:text-xs font-bold font-mono text-sky-300 tracking-tight whitespace-nowrap">
                        Phương pháp kèm cặp độc quyền
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-slate-300 font-body">
                      <MapPin className="w-3.5 h-3.5 text-[#ff4757] shrink-0" />
                      <span>866/25 Ngô Quyền, Sơn Trà</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Tiêu đề phụ (Body text - 2 đoạn): Desktop col 1-7 row 3; Mobile vị trí 4 (sau hình ảnh) */}
              <div className="space-y-3 sm:space-y-3.5 w-full lg:col-span-7 lg:col-start-1 lg:row-start-3 text-center lg:text-left">
                {/* Đoạn 1: Phương pháp & Nền tảng đề thi Đà Nẵng */}
                <p className="font-body text-slate-600 leading-relaxed text-[17px] sm:text-[19px]">
                  Phương pháp <strong className="text-[#0A78F3] font-bold">&quot;Bóc tách 4 bước&quot;</strong> &amp;{" "}
                  <strong className="text-[#0A78F3] font-bold">&quot;Dịch bắt buộc&quot;</strong> từ Thạc sĩ TESOL giúp con lấy lại nền tảng sách giáo khoa mới (Global Success, Friends Plus) và làm chủ <strong className="text-slate-900 font-semibold">ma trận 36 câu đề thi vào lớp 10</strong> của Sở GD&amp;ĐT Đà Nẵng.
                </p>

                {/* Đoạn 2: Chữa lành áp lực & Tự động báo cáo LMS */}
                <p className="font-body text-slate-600 leading-relaxed text-[17px] sm:text-[19px]">
                  <strong className="text-slate-900 font-medium">Không nhồi nhét chép phạt, không la mắng áp lực</strong> –{" "}
                  Báo cáo tiến độ tự động <strong className="text-[#C43838] font-semibold">về Zalo của mẹ lúc 20h00 mỗi tối</strong> qua <strong className="text-[#0A78F3] font-semibold">hệ thống LMS độc quyền</strong>!
                </p>
              </div>
            </div>

            {/* 3 Huy hiệu Bảo Chứng Đầu Trang (Modern Tactile USP Cards) */}
            {/* 3 Huy hiệu Bảo Chứng Đầu Trang (Modern Tactile 2-Block USP Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: BẢO CHỨNG CHUYÊN MÔN (Chia thành 2 khối riêng biệt) */}
              <div className="relative bg-slate-100/80 p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(10,120,243,0.06)] hover:shadow-[0_14px_34px_rgba(10,120,243,0.14)] hover:border-sky-300/80 hover:-translate-y-1 transition-all duration-300 group flex flex-col gap-1 sm:gap-1.5">
                {/* ── KHỐI 1 (PHẦN TRÊN): Icon, Badge và Tiêu đề ── */}
                <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs overflow-hidden">
                  {/* Dải line màu nhận diện trên đỉnh khối */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#0A78F3] via-sky-400 to-blue-500" />
                  {/* Đốm sáng nền nhẹ góc thẻ */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-100/60 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                  <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* Cột trái: Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 text-[#0A78F3] border border-sky-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(10,120,243,0.12)] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">
                      <Award className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    {/* Cột phải: 2 hàng căn lề phải */}
                    <div className="flex-1 min-w-0 flex flex-col items-end text-right">
                      {/* Hàng 1: Badge nằm góc trên bên phải */}
                      <div className="flex justify-end items-center">
                        <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[10px] tracking-wider font-bold text-[#0A78F3] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/70 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A78F3] animate-pulse" />
                          CHỨNG NHẬN
                        </span>
                      </div>

                      {/* Hàng 2: Tiêu đề USP căn lề phải */}
                      <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg leading-snug mt-1 text-right">
                        Bảo Chứng Chuyên Môn
                      </h4>
                    </div>
                  </div>
                </div>

                {/* ── KHỐI 2 (PHẦN DƯỚI): Nội dung còn lại ── */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
                  <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                    Cử nhân Biên dịch Tiếng Anh (<strong className="text-slate-900 font-bold">GPA 8.17/10</strong>) –{" "}
                    <strong className="text-slate-900 font-bold">Thạc sĩ TESOL Quốc tế</strong> – Sáng lập dự án Hopepath Academy.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs sm:text-[13px] font-mono text-[#0A78F3] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Trực tiếp Cô Nghi đứng lớp 100%</span>
                  </div>
                </div>
              </div>

              {/* Card 2: SĨ SỐ VÀNG (Chia thành 2 khối riêng biệt) */}
              <div className="relative bg-slate-100/80 p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-[0_14px_34px_rgba(16,185,129,0.14)] hover:border-emerald-300/80 hover:-translate-y-1 transition-all duration-300 group flex flex-col gap-1 sm:gap-1.5">
                {/* ── KHỐI 1 (PHẦN TRÊN): Icon, Badge và Tiêu đề ── */}
                <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs overflow-hidden">
                  {/* Dải line màu nhận diện trên đỉnh khối */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-[#0A78F3]" />
                  {/* Đốm sáng nền nhẹ góc thẻ */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                  <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* Cột trái: Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(16,185,129,0.12)] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">
                      <Users className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    {/* Cột phải: 2 hàng căn lề phải */}
                    <div className="flex-1 min-w-0 flex flex-col items-end text-right">
                      {/* Hàng 1: Badge nằm góc trên bên phải */}
                      <div className="flex justify-end items-center">
                        <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[10px] tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          SĨ SỐ VÀNG
                        </span>
                      </div>

                      {/* Hàng 2: Tiêu đề USP căn lề phải */}
                      <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg leading-snug mt-1 text-right">
                        Giám Sát Vi Mô 1-1
                      </h4>
                    </div>
                  </div>
                </div>

                {/* ── KHỐI 2 (PHẦN DƯỚI): Nội dung còn lại ── */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
                  <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                    Quy mô <strong className="text-slate-900 font-bold">tối đa 12 học sinh/lớp</strong> – Bắt đúng bệnh, sửa tỉ mỉ từng lỗi sai ngữ pháp &amp; phát âm cho từng em ngay tại bàn.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs sm:text-[13px] font-mono text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Không dạy đại trà 25–30 em</span>
                  </div>
                </div>
              </div>

              {/* Card 3: RỦI RO BẰNG 0 (Chia thành 2 khối riêng biệt) */}
              <div className="relative bg-slate-100/80 p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(196,56,56,0.06)] hover:shadow-[0_14px_34px_rgba(196,56,56,0.14)] hover:border-rose-300/80 hover:-translate-y-1 transition-all duration-300 group flex flex-col gap-1 sm:gap-1.5">
                {/* ── KHỐI 1 (PHẦN TRÊN): Icon, Badge và Tiêu đề ── */}
                <div className="relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs overflow-hidden">
                  {/* Dải line màu nhận diện trên đỉnh khối */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#C43838] via-rose-500 to-amber-500" />
                  {/* Đốm sáng nền nhẹ góc thẻ */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100/50 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                  <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* Cột trái: Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 text-[#C43838] border border-red-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(196,56,56,0.12)] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300">
                      <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    {/* Cột phải: 2 hàng căn lề phải */}
                    <div className="flex-1 min-w-0 flex flex-col items-end text-right">
                      {/* Hàng 1: Badge nằm góc trên bên phải */}
                      <div className="flex justify-end items-center">
                        <span className="inline-flex items-center gap-1.5 font-mono uppercase text-[10px] tracking-wider font-bold text-[#C43838] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/70 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C43838] animate-pulse" />
                          RỦI RO BẰNG 0
                        </span>
                      </div>

                      {/* Hàng 2: Tiêu đề USP căn lề phải */}
                      <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg leading-snug mt-1 text-right">
                        Bảo Hiểm Học Tập 2 Lớp
                      </h4>
                    </div>
                  </div>
                </div>

                {/* ── KHỐI 2 (PHẦN DƯỚI): Nội dung còn lại ── */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
                  <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                    <strong className="text-slate-900 font-bold">Hoàn 100% học phí</strong> trong 7 ngày đầu nếu con không hào hứng + <strong className="text-slate-900 font-bold">Phụ đạo 1-1 MIỄN PHÍ</strong> ngoài giờ đến khi tiến bộ.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs sm:text-[13px] font-mono text-[#C43838] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C43838]" />
                    <span>Cam kết hoàn tiền & phụ đạo 1-1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CTA BUTTON BÊN DƯỚI 3 BOX USPS (HIỂN THỊ CẢ MOBILE & DESKTOP) ── */}
            <div className="flex flex-col items-center justify-center pt-3 pb-1">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-[#0A78F3] hover:bg-[#096ad8] text-white shadow-[0_10px_25px_rgba(10,120,243,0.35)] hover:shadow-[0_14px_32px_rgba(10,120,243,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3.5 group cursor-pointer border-none outline-none"
              >
                <div className="flex flex-col items-center text-center leading-snug">
                  <span className="font-heading font-extrabold text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                    ĐĂNG KÝ TEST HỌC LỰC TIẾNG ANH 1-1 MIỄN PHÍ
                  </span>
                  <span className="font-body text-[10px] min-[390px]:text-[11px] sm:text-sm font-medium text-sky-100 normal-case mt-0.5 whitespace-nowrap tracking-tight">
                    Tặng kèm lộ trình học tập cá nhân hoá &amp; bộ sổ tay ma thuật
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHU VỰC VSL (SECTION FULL-WIDTH VỚI MÀU NỀN TÁCH BIỆT & CHUYỂN TIẾP MỀM MẠI)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-12 sm:py-16 bg-[#dce8f5] bg-grid-pattern relative">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-6 sm:space-y-8 relative z-10">
            {/* ── TIÊU ĐỀ SECTION RIÊNG BIỆT NẰM Ở ĐẦU TIÊN CĂN GIỮA TOÀN BỘ ── */}
            <div className="w-full text-center max-w-5xl mx-auto">
              <h2 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 w-full flex flex-col items-center text-center gap-1 sm:gap-2">
                <span className="text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] leading-tight text-center text-slate-900 tracking-tight">
                  <span className="block sm:inline">ĐỪNG VỘI ĐÓNG TIỀN </span>
                  <span className="block sm:inline">
                    CHO <span className="text-[#C43838]">TRUNG TÂM LỚN</span>
                  </span>
                </span>
                <span className="text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] leading-tight text-center tracking-tight">
                  <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#0A78F3] via-sky-500 to-blue-600">
                    CHO ĐẾN KHI BA MẸ{" "}
                  </span>
                  <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#0A78F3] via-sky-500 to-blue-600">
                    XEM HẾT VIDEO 2.5 PHÚT NÀY!
                  </span>
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-10 items-start">
              {/* ── CỘT TRÁI (40%): VIDEO VSL TỈ LỆ 9:16 ── */}
              <div className="w-full lg:col-span-4 flex justify-center lg:justify-start lg:mt-3">
                <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.18)] bg-slate-950 group">
                  {isPlayingVsl ? (
                    <div className="relative w-full h-full">
                      <iframe
                        id="vsl-vimeo-iframe"
                        src="https://player.vimeo.com/video/1237187894?autoplay=1&playsinline=1&api=1&title=0&byline=0&portrait=0&badge=0&autopause=0"
                        className="w-full h-full border-0 absolute inset-0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        title="Master VSL (3.5 Phút): Thông Điệp Trực Tiếp Từ Cô Nghi"
                        onLoad={() => setIsVslLoaded(true)}
                      />

                      {/* Nút "Mở âm thanh" hiển thị ngay chính giữa video khi video đã tải */}
                      {isVslMuted && isVslLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none p-4">
                          <button
                            type="button"
                            onClick={handleUnmuteVsl}
                            className="pointer-events-auto flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full bg-[#ff4757] hover:bg-[#e03949] text-white font-bold text-sm sm:text-base shadow-[0_8px_30px_rgba(255,71,87,0.7)] border-2 border-white active:scale-95 transition-all duration-300 animate-pulse cursor-pointer whitespace-nowrap"
                            aria-label="Mở âm thanh video VSL"
                          >
                            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0 animate-bounce" />
                            <span>Mở âm thanh</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Thumbnail hiển thị trước khi phát */
                    <div
                      className="relative w-full h-full select-none"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setVslThumbnail(res);
                              try {
                                localStorage.setItem("co_nghi_vsl_thumbnail", res);
                              } catch {
                                // ignore
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    >
                      <img
                        src={vslThumbnail}
                        alt="Thumbnail Video VSL 2.5 Phút - Cô Nghi"
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src.includes("vsl-thumbnail-final.webp")) {
                            target.src = "/image/vsl-thumbnail.webp";
                          } else if (!target.src.includes("lop-tieng-anh")) {
                            target.src = "/image/lop-tieng-anh-co-nghi-thac-si-tesol.webp";
                          }
                        }}
                      />
                      {/* Lớp gradient nhẹ bảo vệ độ tương phản của nút Play */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-slate-950/15" />


                      {/* Nút Play trung tâm */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlayingVsl(true);
                            setIsVslMuted(true);
                            setIsVslLoaded(false);
                          }}
                          className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0A78F3] hover:bg-[#096ad8] active:scale-95 text-white shadow-[0_10px_30px_rgba(10,120,243,0.5)] transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-white/90 group/btn"
                          aria-label="Phát video VSL Cô Nghi"
                        >
                          <span className="absolute inset-0 rounded-full bg-[#0A78F3] animate-ping opacity-35 pointer-events-none" />
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-white text-white group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Duy nhất một đường viền trắng inline thanh lịch, giảm 1/2 độ dày, khớp 100% độ cong góc bo */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-white z-20"
                  />
                </div>
              </div>

              {/* ── CỘT PHẢI (60%): HỘP THOẠI, BODY TEXT & CTA ── */}
              <div className="w-full lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left">
                {/* Hộp thoại Thông điệp với nhãn dấu ngoặc kép 50% trong 50% ngoài */}
                <div className="relative mt-3 pt-4 sm:pt-4.5 pb-3.5 px-3.5 sm:px-4 bg-gradient-to-br from-sky-50/90 via-white to-blue-50/50 rounded-2xl border border-sky-200/90 shadow-[0_4px_16px_rgba(10,120,243,0.08)] text-left">
                  {/* Biểu tượng dấu ngoặc kép lớn nằm 50% trong, 50% ngoài dạng nhãn */}
                  <div className="absolute -top-4 left-4 sm:left-5 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#0A78F3] to-sky-600 text-white flex items-center justify-center shadow-[0_4px_12px_rgba(10,120,243,0.35)] border-2 border-white select-none">
                    <Quote className="w-4 h-4 fill-white text-white" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1.5 pl-8 sm:pl-9 pb-2 mb-2 border-b border-sky-100">
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-slate-900">
                      Thông điệp từ Cô Nghi
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#0A78F3] bg-sky-100/90 px-2 py-0.5 rounded-full border border-sky-200">
                      Cử nhân GPA 8.17 • Thạc sĩ TESOL
                    </span>
                  </div>

                  <div className="space-y-3 font-body text-slate-700 text-[16px] sm:text-[18px] leading-relaxed italic">
                    <p>
                      &ldquo;Ba mẹ ạ, lỗi hoàn toàn không phải do các con thiếu năng lực. Trẻ ở lứa tuổi dậy thì có cái tôi rất lớn, các con cực kỳ sợ sai và sợ bị đánh giá trước đám đông...
                    </p>
                    <p>
                      Môn Tiếng Anh cấp 2 đôi khi tạo ra nhiều thử thách cho các con khi lượng từ vựng ngày càng lớn. Việc ghi nhớ máy móc thường khiến các con dễ quên nhanh, dẫn đến tâm lý đối phó khi làm các bài kiểm tra trắc nghiệm tại trường...&rdquo;
                    </p>
                  </div>
                </div>

                {/* 3. Body Text: Ngắn gọn, đơn giản, dễ hiểu */}
                <div className="space-y-2.5 pt-1 text-left font-body text-[15.5px] sm:text-[17px] text-slate-700 leading-relaxed">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-start gap-2.5">
                    <span className="text-[#C43838] font-bold shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-900">Lỗi không phải do con:</strong> Học vẹt nhanh quên, lớp đông 20–30 em khiến con sợ bị chê cười và chọn cách &quot;khoanh lụi&quot; đối phó.
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-start gap-2.5">
                    <span className="text-[#0A78F3] font-bold shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-900">Trị dứt điểm đoán mò:</strong> Phương pháp <strong className="text-[#0A78F3]">&quot;Bóc tách 4 bước&quot;</strong> giúp con tự hiểu bản chất ngữ pháp và tự tin làm đề thi vào lớp 10.
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-start gap-2.5">
                    <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-900">Tự giác &amp; Minh bạch:</strong> Tích 100 Tokens đổi quà tạo động lực tự học; hệ thống gửi báo cáo điểm về Zalo mẹ mỗi tối lúc 20h00.
                    </div>
                  </div>

                  <div className="p-3 sm:p-3.5 rounded-xl bg-white/70 border border-slate-200/80 shadow-2xs flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                    <div>
                      <strong className="text-slate-900">Cam kết an tâm:</strong> Sĩ số tối đa 12 em/lớp, hoàn 100% học phí sau 7 ngày nếu không hợp, phụ đạo 1-1 miễn phí đến khi tiến bộ.
                    </div>
                  </div>
                </div>

                {/* 4. Nút Kêu gọi Hành động (CTA) */}
                <div className="pt-2 flex flex-col items-center lg:items-start">
                  <button
                    type="button"
                    onClick={handleOpenRegisterModal}
                    className="w-full sm:w-auto px-4 py-2.5 sm:px-7 sm:py-3 rounded-2xl bg-[#0A78F3] hover:bg-[#096ad8] text-white shadow-[0_10px_25px_rgba(10,120,243,0.35)] hover:shadow-[0_14px_32px_rgba(10,120,243,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3.5 group cursor-pointer border-none outline-none"
                  >
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-snug">
                      <span className="font-heading font-extrabold text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                        ĐĂNG KÝ TEST HỌC LỰC TIẾNG ANH 1-1 MIỄN PHÍ
                      </span>
                      <span className="font-body text-[10px] min-[390px]:text-[11px] sm:text-sm font-medium text-sky-100 normal-case mt-0.5 whitespace-nowrap tracking-tight">
                        Tặng kèm lộ trình học tập cá nhân hoá &amp; bộ sổ tay ma thuật
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
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
            <div className="text-center max-w-4xl mx-auto space-y-4">
              {/* 1. Badge "Thấu hiểu nỗi niềm ba mẹ" */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-[#C43838] border border-rose-300 shadow-sm font-bold text-xs sm:text-[13px] tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#C43838] animate-pulse shrink-0" />
                <span>Thấu hiểu nỗi niềm ba mẹ</span>
              </div>

              {/* 2. Headline kích thước đồng bộ các headline phía trên với keywords nổi bật */}
              <h2 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[42px] leading-tight text-center max-w-4xl mx-auto">
                <span>CÓ PHẢI MỖI BUỔI TỐI TẠI GIA ĐÌNH ĐANG BIẾN THÀNH </span>
                <span className="text-[#C43838] font-black underline decoration-[#C43838]/60 decoration-2 underline-offset-4">
                  &quot;CHIẾN TRƯỜNG&quot;
                </span>{" "}
                <span>CHỈ VÌ </span>
                <span className="text-[#0A78F3] bg-sky-50 px-2.5 py-0.5 rounded-xl border border-sky-200 shadow-2xs font-black inline-block mt-1 sm:mt-0">
                  MÔN TIẾNG ANH CỦA CON?
                </span>
              </h2>

              {/* 3. Text mô tả với các keywords giá trị được in đậm & tô màu nổi bật */}
              <p className="font-body text-slate-600 leading-relaxed text-[15px] sm:text-base md:text-[17px] max-w-3xl mx-auto text-center">
                Nhiều phụ huynh có con đang học tại các trường{" "}
                <strong className="text-slate-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 shadow-2xs">
                  THCS Lê Độ, Nguyễn Chí Thanh, Phạm Ngọc Thạch, Phan Bội Châu, Lý Tự Trọng hay Ngô Quyền...
                </strong>{" "}
                tìm đến{" "}
                <strong className="text-[#0A78F3] font-bold">
                  Lớp Tiếng Anh Cô Nghi
                </strong>{" "}
                trong tâm trạng{" "}
                <strong className="text-[#C43838] font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200/60">
                  mệt mỏi và bế tắc
                </strong>{" "}
                khi chứng kiến{" "}
                <strong className="text-slate-900 font-bold underline decoration-[#C43838] decoration-2 underline-offset-2">
                  bốn triệu chứng học thuật và tâm lý
                </strong>{" "}
                ngày càng trầm trọng ở con:
              </p>
            </div>

            {/* 4. Slide 4 Triệu chứng: cuộn 1 thẻ/lần, PC 2 thẻ hiển thị, Mobile full width 1 thẻ, dropdown biểu hiện/hệ luỵ */}
            <div
              className="relative max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto px-0 sm:px-6"
              onMouseEnter={() => setIsSymptomPaused(true)}
              onMouseLeave={() => setIsSymptomPaused(false)}
              onTouchStart={() => setIsSymptomPaused(true)}
              onTouchEnd={() => setIsSymptomPaused(false)}
            >
              {/* Mũi tên điều hướng Trái */}
              <button
                type="button"
                onMouseEnter={() => setIsSymptomPaused(true)}
                onMouseLeave={() => setIsSymptomPaused(false)}
                onTouchStart={() => setIsSymptomPaused(true)}
                onTouchEnd={() => setIsSymptomPaused(false)}
                onClick={handlePrevSymptom}
                className="absolute left-1 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#C43838] border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Triệu chứng trước"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>

              {/* Mũi tên điều hướng Phải */}
              <button
                type="button"
                onMouseEnter={() => setIsSymptomPaused(true)}
                onMouseLeave={() => setIsSymptomPaused(false)}
                onTouchStart={() => setIsSymptomPaused(true)}
                onTouchEnd={() => setIsSymptomPaused(false)}
                onClick={handleNextSymptom}
                className="absolute right-1 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-[#C43838] border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Triệu chứng tiếp theo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
              </button>

              {/* Khung trượt chứa slide (cuộn tròn 1 slide/lần, PC 2 thẻ, Mobile 1 thẻ full width) */}
              <div
                className="overflow-hidden py-1 w-full"
                onMouseEnter={() => setIsSymptomPaused(true)}
                onMouseLeave={() => setIsSymptomPaused(false)}
                onTouchStart={() => setIsSymptomPaused(true)}
                onTouchEnd={() => setIsSymptomPaused(false)}
              >
                <div
                  className={`flex items-start ${isTransitionEnabled ? "transition-transform duration-500 ease-in-out" : ""}`}
                  style={{
                    transform: `translateX(-${symptomSlideIndex * (isDesktop ? 50 : 100)}%)`,
                  }}
                  onTransitionEnd={handleSymptomTransitionEnd}
                >
                  {infiniteSymptomItems.map((item, itemIdx) => (
                    <div
                      key={`infinite-${item.id}-${itemIdx}`}
                      className="w-full min-w-full md:w-1/2 md:min-w-[50%] shrink-0 px-1 sm:px-3 self-start"
                    >
                      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-auto">
                        <div>
                          {/* Header thẻ */}
                          <div className="flex items-center gap-3 mb-3.5">
                            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-[#C43838] font-mono text-sm sm:text-base font-bold flex items-center justify-center shrink-0 border border-red-200/80 shadow-2xs">
                              {item.id}
                            </span>
                            <div>
                              <span className="font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C43838]">
                                {item.tag}
                              </span>
                              <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg md:text-xl leading-snug">
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          {/* Khung hình ảnh minh hoạ tỉ lệ 16:9 */}
                          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-3.5 group/img flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400 bg-gradient-to-br from-slate-50 via-slate-100/70 to-slate-100">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-400">
                                  <Camera className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="font-mono text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide">
                                  Hình minh hoạ (16:9)
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Dropdown 1: Biểu hiện thực tế - Size text đồng bộ body text */}
                          <div className="mt-3.5">
                            <button
                              type="button"
                              onClick={() => toggleDropdown(`${item.id}-behavior`)}
                              className="w-full py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-[15px] sm:text-[16.5px] font-bold flex items-center justify-between transition-colors border border-slate-200 cursor-pointer select-none group/dd"
                              aria-expanded={!!openDropdowns[`${item.id}-behavior`]}
                            >
                              <span className="flex items-center gap-2.5 text-slate-800 group-hover/dd:text-slate-900">
                                <span className="w-2 h-2 rounded-full bg-[#0A78F3] shrink-0" />
                                Bấm xem biểu hiện thực tế
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                                  openDropdowns[`${item.id}-behavior`] ? "rotate-180 text-[#0A78F3]" : ""
                                }`}
                              />
                            </button>
                            {openDropdowns[`${item.id}-behavior`] && (
                              <div className="mt-2.5 bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-4.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <p className="font-body text-[15px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                                  {item.behavior}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Dropdown 2: Hệ luỵ tất yếu - Size text đồng bộ body text */}
                          <div className="mt-2.5">
                            <button
                              type="button"
                              onClick={() => toggleDropdown(`${item.id}-consequence`)}
                              className="w-full py-3 px-4 sm:py-3.5 sm:px-4.5 rounded-xl bg-rose-50/70 hover:bg-rose-100/70 text-[#C43838] text-[15px] sm:text-[16.5px] font-bold flex items-center justify-between transition-colors border border-rose-200/70 cursor-pointer select-none group/dd"
                              aria-expanded={!!openDropdowns[`${item.id}-consequence`]}
                            >
                              <span className="flex items-center gap-2.5 text-[#C43838] group-hover/dd:text-red-700">
                                <span className="w-2 h-2 rounded-full bg-[#C43838] shrink-0" />
                                Bấm xem hệ luỵ tất yếu
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-[#C43838] transition-transform duration-200 shrink-0 ${
                                  openDropdowns[`${item.id}-consequence`] ? "rotate-180 text-[#C43838]" : ""
                                }`}
                              />
                            </button>
                            {openDropdowns[`${item.id}-consequence`] && (
                              <div className="mt-2.5 bg-rose-50/50 border border-red-200/70 rounded-xl p-4 sm:p-4.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                <p className="font-body text-[15px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                                  {item.consequence}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thanh điều hướng trang (Dots indicators: vòng lặp 1->4) */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setOpenDropdowns({});
                      setIsTransitionEnabled(true);
                      setSymptomSlideIndex(4 + idx);
                    }}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      (symptomSlideIndex % 4) === idx
                        ? "w-8 h-2.5 bg-[#C43838]"
                        : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Chuyển đến thẻ ${idx + 1}`}
                  />
                ))}
                <span className="font-mono text-xs text-slate-500 font-bold ml-2">
                  0{(symptomSlideIndex % 4) + 1} / 04
                </span>
              </div>

              {/* 3. CTA Button đồng bộ ngay bên dưới slideshow */}
              <div className="flex flex-col items-center justify-center pt-5 pb-1">
                <button
                  type="button"
                  onClick={handleOpenRegisterModal}
                  className="w-full sm:w-auto px-4 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-[#0A78F3] hover:bg-[#096ad8] text-white shadow-[0_10px_25px_rgba(10,120,243,0.35)] hover:shadow-[0_14px_32px_rgba(10,120,243,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3.5 group cursor-pointer border-none outline-none"
                >
                  <div className="flex flex-col items-center text-center leading-snug">
                    <span className="font-heading font-extrabold text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                      ĐĂNG KÝ TEST HỌC LỰC TIẾNG ANH 1-1 MIỄN PHÍ
                    </span>
                    <span className="font-body text-[10px] min-[390px]:text-[11px] sm:text-sm font-medium text-sky-100 normal-case mt-0.5 whitespace-nowrap tracking-tight">
                      Tặng kèm lộ trình học tập cá nhân hoá &amp; bộ sổ tay ma thuật
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION RIÊNG BIỆT FULL-WIDTH: THÔNG TIN QUAN TRỌNG DÀNH CHO PHỤ HUYNH TẠI SƠN TRÀ, ĐÀ NẴNG
            Toàn bộ background dark trải dài full 2 bên mép màn hình, nội dung mở rộng full width
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-[#1e272e] bg-grid-pattern text-white relative overflow-hidden border-y border-slate-700/80 w-full">
          {/* Đèn vòm quang học & chi tiết máy */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0A78F3]/25 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ff4757]/20 rounded-full blur-[130px] pointer-events-none" />

          {/* Chi tiết ốc vít kỹ thuật ở 4 góc */}
          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-slate-600 shadow-inner" />
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-slate-600 shadow-inner" />
          <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-slate-600 shadow-inner" />
          <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-slate-600 shadow-inner" />

          <div className="w-[92%] sm:w-[90%] lg:w-[80%] mx-auto relative z-10 space-y-6 sm:space-y-8">
                {/* ── HEADER CỦA SECTION ── */}
                <div className="text-center space-y-4 pb-6 border-b border-slate-700/80 flex flex-col items-center justify-center">
                  {/* 1. Badge Dữ liệu thi lớp 10 năm 2026 (text và borderline màu trắng) */}
                  <div className="flex justify-center items-center">
                    <span className="inline-flex items-center gap-2 font-sans text-xs sm:text-[13px] font-bold px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-xs">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      <span>Dữ liệu thi lớp 10 năm 2026</span>
                    </span>
                  </div>

                  {/* 2. Tiêu đề chính: 38px ở PC, Mobile 3 dòng, PC 2 dòng */}
                  <h3 className="font-heading font-extrabold uppercase tracking-tight text-white text-[22px] min-[390px]:text-[25px] sm:text-[30px] md:text-[38px] lg:text-[38px] xl:text-[38px] leading-tight sm:leading-snug text-center max-w-4xl mx-auto flex flex-col items-center gap-1.5 sm:gap-2.5">
                    {/* Dòng 1 & Dòng 2 trên mobile; gộp chung dòng 1 trên PC */}
                    <span className="text-[22px] min-[390px]:text-[25px] sm:text-[30px] md:text-[38px] lg:text-[38px] leading-tight text-center">
                      <span className="block sm:inline">
                        THÔNG TIN{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400 font-black">
                          QUAN TRỌNG
                        </span>
                      </span>
                      <span className="block sm:inline sm:ml-2">
                        DÀNH CHO PHỤ HUYNH
                      </span>
                    </span>
                    {/* Dòng 3 trên mobile; dòng 2 trên PC */}
                    <span className="text-[22px] min-[390px]:text-[25px] sm:text-[30px] md:text-[38px] lg:text-[38px] leading-tight normal-case text-center">
                      <span className="text-slate-200 lowercase font-medium">tại </span>
                      <span className="uppercase text-[#ff6b81] font-black underline decoration-[#ff4757]/80 decoration-2 sm:decoration-4 underline-offset-4">
                        SƠN TRÀ, ĐÀ NẴNG
                      </span>
                    </span>
                  </h3>

                  {/* 3. Tiêu đề phụ: Mobile 2 dòng (Dòng 1: Đừng để sự chủ quan đánh mất, Dòng 2: tấm vé vào lớp 10 công lập của con!) */}
                  <div className="text-center max-w-3xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl font-medium text-slate-200 leading-snug">
                    <span className="block sm:inline">
                      <span>Đừng để </span>
                      <strong className="text-[#ff6b81] font-bold bg-rose-950/70 px-2 py-0.5 rounded-lg border border-rose-800/80 shadow-2xs">
                        sự chủ quan
                      </strong>
                      <span> đánh mất </span>
                    </span>
                    <span className="block sm:inline">
                      <strong className="text-amber-300 font-bold underline decoration-amber-400/80 decoration-2 underline-offset-2">
                        tấm vé vào lớp 10 công lập
                      </strong>
                      <span> của con!</span>
                    </span>
                  </div>
                </div>

                {/* ── GRID: MOBILE 2 HÀNG RIÊNG (GRID-COLS-1), PC 2 CỘT (MD:GRID-COLS-2) ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
                  {/* ════════════════════════════════════════════════════════════════
                      KHỐI 1: BIỂU ĐỒ CỘT ĐIỂM CHUẨN CŨ VÀ MỚI (3 TRƯỜNG THPT SƠN TRÀ)
                      ════════════════════════════════════════════════════════════════ */}
                  <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-6 border border-slate-700/80 shadow-lg flex flex-col justify-between">
                    <div>
                      {/* Header Cột 1 */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                        <div className="flex items-center gap-2">
                          <School className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 shrink-0" />
                          <h4 className="font-heading font-extrabold text-base sm:text-lg md:text-xl uppercase tracking-tight text-white leading-tight">
                            Biểu đồ điểm chuẩn 2026-2027
                          </h4>
                        </div>
                      </div>

                      {/* Chú thích màu cột (Legend) */}
                      <div className="flex items-center justify-center gap-5 my-3 text-xs sm:text-sm font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-xs bg-slate-600 inline-block border border-slate-500" />
                          <span className="text-slate-300 font-medium">Điểm cũ</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-xs bg-gradient-to-t from-red-600 to-[#ff4757] inline-block border border-white/40 shadow-xs" />
                          <span className="text-white font-bold">Năm 2026</span>
                        </div>
                      </div>

                      {/* KHUNG BIỂU ĐỒ CỘT (VERTICAL BAR CHART) */}
                      <div className="relative pt-7 pb-4 px-3 sm:px-4 bg-slate-900/90 rounded-xl border border-slate-700/80 shadow-inner">
                        {/* Lưới đường kẻ ngang tham chiếu */}
                        <div className="absolute inset-x-3 top-7 border-b border-dashed border-slate-700/60 pointer-events-none" />
                        <div className="absolute inset-x-3 top-24 sm:top-28 border-b border-dashed border-slate-700/60 pointer-events-none" />

                        {/* 3 Cụm Cột đại diện cho 3 trường */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end">
                          {/* Cụm 1: THPT Ngô Quyền */}
                          <div className="flex flex-col items-center">
                            {/* Cột điểm */}
                            <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 w-full h-32 sm:h-40 pb-1">
                              {/* Cột Cũ: 11.00đ */}
                              <div className="flex flex-col items-center flex-1 max-w-[28px] sm:max-w-[36px]">
                                <span className="text-xs sm:text-sm font-mono text-slate-300 font-semibold leading-none mb-1">
                                  11
                                </span>
                                <div
                                  style={{ height: "42px" }}
                                  className="w-full bg-slate-600 rounded-t-md border border-slate-500/80 transition-all"
                                  title="THPT Ngô Quyền điểm cũ: 11.00đ"
                                />
                              </div>
                              {/* Cột Mới: 24.00đ */}
                              <div className="flex flex-col items-center flex-1 max-w-[28px] sm:max-w-[36px]">
                                <span className="text-sm sm:text-base font-mono font-black text-amber-300 leading-none mb-1">
                                  24
                                </span>
                                <div
                                  style={{ height: "92px" }}
                                  className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md border border-amber-300/60 shadow-[0_0_10px_rgba(251,191,36,0.35)] transition-all"
                                  title="THPT Ngô Quyền điểm mới: 24.00đ"
                                />
                              </div>
                            </div>
                            {/* Đường chân biểu đồ & Tên trường trọn vẹn bên trong */}
                            <div className="w-full border-t border-slate-700/80 pt-2 text-center">
                              <span className="text-xs sm:text-sm md:text-base font-bold text-slate-100 leading-tight block">
                                Ngô Quyền
                              </span>
                            </div>
                          </div>

                          {/* Cụm 2: THPT Sơn Trà */}
                          <div className="flex flex-col items-center">
                            {/* Cột điểm */}
                            <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 w-full h-32 sm:h-40 pb-1">
                              {/* Cột Cũ: 19.25đ */}
                              <div className="flex flex-col items-center flex-1 max-w-[28px] sm:max-w-[36px]">
                                <span className="text-xs sm:text-sm font-mono text-slate-300 font-semibold leading-none mb-1">
                                  19.2
                                </span>
                                <div
                                  style={{ height: "72px" }}
                                  className="w-full bg-slate-600 rounded-t-md border border-slate-500/80 transition-all"
                                  title="THPT Sơn Trà điểm cũ: 19.25đ"
                                />
                              </div>
                              {/* Cột Mới: 27.00đ */}
                              <div className="flex flex-col items-center flex-1 max-w-[28px] sm:max-w-[36px]">
                                <span className="text-sm sm:text-base font-mono font-black text-[#ff6b81] leading-none mb-1">
                                  27
                                </span>
                                <div
                                  style={{ height: "106px" }}
                                  className="w-full bg-gradient-to-t from-red-600 to-[#ff4757] rounded-t-md border border-rose-300/60 shadow-[0_0_10px_rgba(255,71,87,0.4)] transition-all"
                                  title="THPT Sơn Trà điểm mới: 27.00đ"
                                />
                              </div>
                            </div>
                            {/* Đường chân biểu đồ & Tên trường trọn vẹn bên trong */}
                            <div className="w-full border-t border-slate-700/80 pt-2 text-center">
                              <span className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight block">
                                Sơn Trà
                              </span>
                            </div>
                          </div>

                          {/* Cụm 3: THPT Hoàng Hoa Thám */}
                          <div className="flex flex-col items-center">
                            {/* Cột điểm */}
                            <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 w-full h-32 sm:h-40 pb-1">
                              {/* Cột Cũ: 31.00đ */}
                              <div className="flex flex-col items-center flex-1 max-w-[28px] sm:max-w-[36px]">
                                <span className="text-xs sm:text-sm font-mono text-slate-300 font-semibold leading-none mb-1">
                                  31
                                </span>
                                <div
                                  style={{ height: "118px" }}
                                  className="w-full bg-slate-600 rounded-t-md border border-slate-500/80 transition-all"
                                  title="THPT Hoàng Hoa Thám điểm cũ: 31.00đ"
                                />
                              </div>
                              {/* Cột Mới: 33.25đ */}
                              <div className="flex flex-col items-center flex-1 max-w-[28px] sm:max-w-[36px]">
                                <span className="text-sm sm:text-base font-mono font-black text-sky-400 leading-none mb-1">
                                  33.2
                                </span>
                                <div
                                  style={{ height: "128px" }}
                                  className="w-full bg-gradient-to-t from-blue-600 via-sky-500 to-sky-400 rounded-t-md border border-sky-300/60 shadow-[0_0_10px_rgba(56,189,248,0.4)] transition-all"
                                  title="THPT Hoàng Hoa Thám điểm mới: 33.25đ"
                                />
                              </div>
                            </div>
                            {/* Đường chân biểu đồ & Tên trường trọn vẹn bên trong */}
                            <div className="w-full border-t border-slate-700/80 pt-2 text-center">
                              <span className="text-xs sm:text-sm md:text-base font-bold text-sky-300 leading-tight block">
                                H.H.Thám
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KHUNG THÔNG TIN GHI CHÚ BÊN DƯỚI BIỂU ĐỒ */}
                    <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-700/80">
                      <div className="p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 text-center">
                        <p className="font-body text-[14.5px] sm:text-base text-slate-200 leading-relaxed">
                          Trong kỳ thi tuyển sinh vào lớp 10 tại Đà Nẵng năm học 2026–2027, điểm chuẩn các trường THPT công lập trên địa bàn quận Sơn Trà đã <strong className="text-[#ff6b81] font-bold">tăng vọt</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ════════════════════════════════════════════════════════════════
                      KHỐI 2: SƠ ĐỒ & BẢNG BIỂU MA TRẬN RỦI RO QUY CHẾ MỚI "KHOANH LỤI"
                      ════════════════════════════════════════════════════════════════ */}
                  <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-6 border border-slate-700/80 shadow-lg flex flex-col justify-between">
                    <div>
                      {/* Header Cột 2 */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                        <div className="flex items-center gap-2">
                          <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0" />
                          <h4 className="font-heading font-extrabold text-base sm:text-lg md:text-xl uppercase tracking-tight text-white leading-tight">
                            Quy chế mới &amp; Ma trận rủi ro
                          </h4>
                        </div>
                      </div>

                      {/* BẢNG BIỂU SO SÁNH: TRƯỚC ĐÂY VS NĂM 2026 */}
                      <div className="my-3 sm:my-4 bg-slate-900/90 rounded-xl p-3 sm:p-4 border border-slate-700/80 space-y-2.5">
                        {/* Dòng 1: Quy chế tính điểm */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                          <div className="text-[14px] sm:text-[15.5px] text-slate-200 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                            <span>Hệ số điểm:</span>
                          </div>
                          <div className="text-[13.5px] sm:text-[15px] font-mono font-bold text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-800">
                            Toán 1 : Văn 1 : Anh 1
                          </div>
                        </div>

                        {/* Dòng 2: Cấu trúc đề Đà Nẵng */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                          <div className="text-[14px] sm:text-[15.5px] text-slate-200 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                            <span>Đề thi Sở GD:</span>
                          </div>
                          <div className="text-[13.5px] sm:text-[15px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800">
                            36 câu (Tự viết từ + dịch)
                          </div>
                        </div>

                        {/* Dòng 3: Đánh giá khả năng "khoanh lụi" */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[14px] sm:text-[15.5px] text-slate-200 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#ff4757] shrink-0" />
                            <span>Cơ hội may mắn:</span>
                          </div>
                          <div className="text-[13.5px] sm:text-[15px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-800">
                            0% (Triệt tiêu khoanh lụi)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KHUNG THÔNG TIN CẢNH BÁO / TỔNG KẾT RỦI RO */}
                    <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-700/80">
                      <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 border border-rose-900/60 shadow-inner">
                        <p className="font-body text-[14.5px] sm:text-base text-slate-200 leading-relaxed text-center sm:text-left">
                          Với <strong className="text-amber-300 font-bold">quy chế mới (hệ số 1:1:1)</strong> cùng cấu trúc đề 36 câu khắt khe, thói quen <strong className="text-[#ff6b81] font-bold">"khoanh lụi"</strong> trực tiếp đẩy học sinh vào nguy cơ <strong className="text-rose-200 font-bold">rớt trường công lập</strong> — tạo gánh nặng học phí trường tư <strong className="text-amber-300 font-extrabold">hàng trăm triệu đồng</strong> suốt 3 năm cấp 3.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── KHỐI 3: LỜI TÂM SỰ CỦA CON & GIẢI PHÁP ── */}
                <div className="space-y-4 sm:space-y-5 pt-2">
                  {/* Bong bóng trò chuyện của con (Speech Bubble) */}
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Avatar con */}
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold flex items-center justify-center shadow-md border-2 border-white/80">
                        <span className="text-base sm:text-lg">👦</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 whitespace-nowrap">Con yêu</span>
                    </div>

                    {/* Bong bóng chat */}
                    <div className="relative flex-1 bg-white text-slate-800 p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-lg border border-slate-200">
                      {/* Mũi nhọn speech bubble */}
                      <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />
                      
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 mb-1.5">
                        <Quote className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Tâm sự của con</span>
                      </div>
                      
                      <p className="font-body text-[15px] sm:text-[17px] text-slate-800 leading-relaxed italic font-medium">
                        &ldquo;Con không ghét Tiếng Anh, con chỉ sợ cảm giác bất lực khi không hiểu bài và sợ ánh mắt thất vọng khi mẹ đứng sau quát mắng.&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Lời giải đáp & Thấu hiểu ấm áp từ Cô Nghi */}
                  <div className="p-3.5 sm:p-6 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md text-center flex flex-col items-center">
                    {/* Badge Thạc sĩ TESOL (đã bỏ icon) */}
                    {/* Badge Thạc sĩ TESOL (2 dòng trên mobile) */}
                    <div className="inline-flex flex-col sm:flex-row items-center px-3.5 py-1.5 sm:py-1 rounded-xl sm:rounded-full bg-slate-700/80 border border-slate-600 text-sky-300 text-xs sm:text-sm font-semibold mb-3 shadow-2xs text-center leading-snug">
                      <span className="block sm:inline">Nghiên cứu tâm lý giáo dục</span>
                      <span className="hidden sm:inline"> </span>
                      <span className="block sm:inline">từ chương trình Thạc sĩ TESOL cho thấy</span>
                    </div>

                    {/* Text nhỏ phía trên */}
                    <p className="font-body text-xs sm:text-sm text-slate-300 font-medium mb-1">
                      Con chưa học tốt môn Tiếng Anh
                    </p>

                    {/* Dòng 1: Viết hoa toàn bộ */}
                    <p className="font-heading font-black uppercase text-[13px] min-[360px]:text-[14px] min-[390px]:text-[15.5px] sm:text-2xl md:text-[26px] text-white tracking-tight leading-snug whitespace-nowrap px-0.5">
                      KHÔNG PHẢI DO CON THIẾU THÔNG MINH.
                    </p>

                    {/* Dòng 2: Thứ duy nhất con đang thiếu là */}
                    <p className="font-body text-xs sm:text-base text-slate-300 italic mt-2">
                      Thứ duy nhất con đang thiếu là
                    </p>

                    {/* Dòng 3: PHƯƠNG PHÁP KÈM CẶP BÓC TÁCH ĐÚNG BẢN CHẤT (2 dòng trên mobile) */}
                    <div className="mt-2.5 w-full sm:w-auto">
                      <span className="inline-block px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-sky-950/80 border border-sky-500/50 text-sky-300 font-heading font-extrabold text-[12.5px] min-[370px]:text-[13.5px] sm:text-base md:text-lg tracking-wide shadow-sm text-center leading-snug">
                        <span className="block sm:inline">PHƯƠNG PHÁP KÈM CẶP</span>
                        <span className="hidden sm:inline"> </span>
                        <span className="block sm:inline">BÓC TÁCH ĐÚNG BẢN CHẤT</span>
                      </span>
                    </div>

                    {/* Dòng 4: và */}
                    <span className="font-body text-xs sm:text-sm text-slate-400 my-0.5 sm:my-1 font-medium">
                      và
                    </span>

                    {/* Dòng 5: MÔI TRƯỜNG AN TOÀN ĐỂ XÂY DỰNG LẠI SỰ TỰ TIN. (2 dòng trên mobile) */}
                    <div className="w-full sm:w-auto">
                      <span className="inline-block px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 font-heading font-extrabold text-[12.5px] min-[370px]:text-[13.5px] sm:text-base md:text-lg tracking-wide shadow-sm text-center leading-snug">
                        <span className="block sm:inline">MÔI TRƯỜNG AN TOÀN</span>
                        <span className="hidden sm:inline"> </span>
                        <span className="block sm:inline">ĐỂ XÂY DỰNG LẠI SỰ TỰ TIN.</span>
                      </span>
                    </div>
                  </div>

                  {/* CTA Button màu xanh đồng bộ */}
                  <div className="flex flex-col items-center justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleOpenRegisterModal}
                      className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-[#0A78F3] hover:bg-[#096ad8] text-white shadow-[0_10px_25px_rgba(10,120,243,0.35)] hover:shadow-[0_14px_32px_rgba(10,120,243,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3.5 group cursor-pointer border-none outline-none"
                    >
                      <div className="flex flex-col items-center text-center leading-snug">
                        <span className="font-heading font-extrabold text-[12.5px] min-[390px]:text-[13.5px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                          ĐĂNG KÝ TEST HỌC LỰC TIẾNG ANH 1-1 MIỄN PHÍ
                        </span>
                        <span className="font-body text-[10.5px] min-[390px]:text-[11.5px] sm:text-sm font-medium text-sky-100 normal-case mt-0.5 whitespace-nowrap tracking-tight">
                          Tặng kèm lộ trình học tập cá nhân hoá &amp; bộ sổ tay ma thuật
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </button>
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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm font-mono text-xs text-[#0A78F3] uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>The Unique Mechanism – Giải Pháp Độc Quyền</span>
              </div>
              <h2 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-xl sm:text-2xl md:text-3xl">
                LỚP TIẾNG ANH CÔ NGHI – TRẠM CỨU HỘ HỌC THUẬT &amp; KIẾN TẠO ĐỘNG LỰC VỚI SĨ SỐ VÀNG 12 HỌC SINH
              </h2>
              <p className="font-body text-slate-600 leading-relaxed text-[15px] sm:text-base">
                Không vận hành như một trung tâm thương mại đại trà hay một lò luyện thi nhồi nhét, Lớp Tiếng Anh Cô Nghi tại 866/25 Ngô Quyền được thiết kế theo mô hình <strong>Giám sát Vi mô (Micro-Class Mentorship)</strong>. Sự khác biệt cốt lõi dưới đây giải thích vì sao học sinh từng sợ hãi Tiếng Anh lại có thể bứt phá điểm số chỉ sau 90 ngày:
              </p>
            </div>

            {/* 3 Thẻ Lật Như Lật Sách Đối Chiếu (Book Flip Comparison Cards) */}
            <ComparisonBookCards onRegisterClick={handleOpenRegisterModal} />


            {/* 5 Vũ Khí Sư Phạm Độc Quyền (Shofu Cards) */}
            <div className="space-y-4">
              <div className="text-center pt-2">
                <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg sm:text-xl md:text-2xl">
                  5 Vũ Khí Sư Phạm Độc Quyền Giúp Con Học &quot;Siêu Dễ Hiểu – Nhớ Siêu Lâu&quot;
                </h3>
                <p className="font-body text-slate-600 text-[15px] sm:text-base mt-1">
                  Được thiết kế dựa trên khoa học hành vi và thực tế đề thi tại Đà Nẵng
                </p>
              </div>

              {/* Vũ khí 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#0A78F3]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0A78F3] border border-sky-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs sm:text-[13px] tracking-wider text-[#0A78F3] font-bold block mb-1">
                      VŨ KHÍ 01
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg">
                      Phương pháp &quot;Bóc tách 4 bước &amp; Trợ giảng đồng đẳng&quot; + &quot;Dịch bắt buộc&quot;
                    </h4>
                    <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] mt-1.5 leading-relaxed">
                      Học sinh thực hành quy trình 4 bước: Chủ động khoanh vùng từ mới ➔ Thảo luận đồng đẳng cùng bạn học ➔ Giải bài tập dựa trên cấu trúc nền tảng ➔ Dịch sâu nối tiếp từng câu và giải thích trước Cô Nghi: <em>&quot;Tại sao chọn đáp án A mà không chọn B, C, D?&quot;</em>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs sm:text-[13px] uppercase tracking-wider text-[#0A78F3] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Chấm dứt 100% thói quen khoanh lụi &amp; đọc đoán mò
                </div>
              </div>

              {/* Vũ khí 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#0A78F3]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0A78F3] border border-sky-100 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs sm:text-[13px] tracking-wider text-[#0A78F3] font-bold block mb-1">
                      VŨ KHÍ 02
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg">
                      Hệ thống Game hóa Kỷ luật &quot;100 Tokens&quot; &amp; Triết lý &quot;Small Win&quot;
                    </h4>
                    <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] mt-1.5 leading-relaxed">
                      Khởi động/kết thúc buổi học bằng Quizizz kịch tính. Điểm thưởng trong sổ &quot;100 Tokens&quot; tính theo tỷ lệ: 50% Kết quả bài làm + 30% Thái độ, nỗ lực + 20% Top Quizizz, kèm Kickstart Bonus nhân đôi/nhân ba điểm tuần đầu giúp đạt ngay 15–20% mốc đổi quà lớn.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs sm:text-[13px] uppercase tracking-wider text-[#0A78F3] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Kích thích Dopamine, tự giác làm bài không cần giục
                </div>
              </div>

              {/* Vũ khí 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#0A78F3]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0A78F3] border border-sky-100 flex items-center justify-center shrink-0">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs sm:text-[13px] tracking-wider text-[#0A78F3] font-bold block mb-1">
                      VŨ KHÍ 03
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg">
                      Chuẩn hóa Phát âm IPA, Quy tắc Trọng âm &amp; Spaced Repetition
                    </h4>
                    <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] mt-1.5 leading-relaxed">
                      Hướng dẫn nhận diện bảng phiên âm quốc tế IPA cơ bản, quy tắc dấu nhấn trọng âm và kỹ thuật bật âm cuối kết hợp ôn tập từ vựng lặp lại ngắt quãng.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs sm:text-[13px] uppercase tracking-wider text-[#0A78F3] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Đọc chuẩn, nhớ chắc 80–90% từ vựng SGK mới
                </div>
              </div>

              {/* Vũ khí 4 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#0A78F3]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0A78F3] border border-sky-100 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs sm:text-[13px] tracking-wider text-[#0A78F3] font-bold block mb-1">
                      VŨ KHÍ 04
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg">
                      Giảng dạy Ngữ pháp trong Ngữ cảnh &amp; Thực chiến Đề cương Sơn Trà
                    </h4>
                    <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] mt-1.5 leading-relaxed">
                      Đặt ngữ pháp vào đúng ngữ cảnh câu của SGK Global Success / Friends Plus và ma trận 36 câu thi vào lớp 10 Đà Nẵng. Học sinh được tặng bộ chuẩn bị Speaking &amp; Writing và sửa chi tiết 100% đề cương của chính trường con đang học.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs sm:text-[13px] uppercase tracking-wider text-[#0A78F3] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Làm chủ Word Form &amp; đề thi thật tại Sơn Trà
                </div>
              </div>

              {/* Vũ khí 5 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-[#0A78F3]/60 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0A78F3] border border-sky-100 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono uppercase text-xs sm:text-[13px] tracking-wider text-[#0A78F3] font-bold block mb-1">
                      VŨ KHÍ 05
                    </span>
                    <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg">
                      Hệ sinh thái Công nghệ LMS Độc quyền &amp; &quot;Cứu trợ SOS 1:1&quot;
                    </h4>
                    <p className="font-body text-slate-600 text-[15.5px] sm:text-[16.5px] mt-1.5 leading-relaxed">
                      Đúng 20h00 sau mỗi buổi học, hệ thống LMS tự động gửi báo cáo chi tiết về điểm số và tình trạng bài tập của con về thẳng Zalo của mẹ. Khi ở nhà gặp bài khó, con nhắn vào kênh Zalo SOS 1:1 để được hướng dẫn tháo gỡ.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto font-mono text-xs sm:text-[13px] uppercase tracking-wider text-[#0A78F3] font-bold bg-sky-50 border border-sky-200 px-3.5 py-2 rounded-xl">
                  Mẹ thảnh thơi buổi tối, trả lại sự bình yên gia đình
                </div>
              </div>
            </div>

            {/* CTA Chuyển tiếp */}
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-[#0A78F3] hover:bg-[#096ad8] text-white shadow-[0_10px_25px_rgba(10,120,243,0.35)] hover:shadow-[0_14px_32px_rgba(10,120,243,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3.5 group cursor-pointer border-none outline-none"
              >
                <div className="flex flex-col items-center text-center leading-snug">
                  <span className="font-heading font-extrabold text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                    ĐĂNG KÝ TEST HỌC LỰC TIẾNG ANH 1-1 MIỄN PHÍ
                  </span>
                  <span className="font-body text-[10px] min-[390px]:text-[11px] sm:text-sm font-medium text-sky-100 normal-case mt-0.5 whitespace-nowrap tracking-tight">
                    Tặng kèm lộ trình học tập cá nhân hoá &amp; bộ sổ tay ma thuật
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          STICKY BOTTOM FLOATING CTA (MOBILE: NÚT RỘNG THEO NỘI DUNG 90%, CÁCH CHÂN TRANG)
      ────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 flex justify-center md:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={handleOpenRegisterModal}
          className="pointer-events-auto w-[90%] py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-[#C43838] via-rose-500 to-amber-500 hover:from-[#b33131] hover:to-amber-600 active:scale-[0.98] text-white shadow-[0_8px_24px_rgba(196,56,56,0.38)] transition-all flex flex-col items-center justify-center cursor-pointer border-none outline-none animate-subtle-zoom"
        >
          <span className="font-heading font-extrabold uppercase tracking-tight text-xs sm:text-sm leading-tight flex items-center gap-1.5 text-white">
            <span>ĐĂNG KÝ TEST HỌC LỰC TIẾNG ANH 1-1</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 text-white" />
          </span>
          <span className="font-mono text-[10.5px] tracking-wide text-amber-100 flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
            <span className="font-semibold text-white">Miễn phí - Chỉ còn 6 suất tuần này</span>
          </span>
        </button>
      </div>

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
                <p className="font-body text-slate-600 text-sm sm:text-[15px] mt-1.5 leading-relaxed">
                  Trực tiếp cùng Cô Nghi tại 866/25 Ngô Quyền, Sơn Trà. Nhận ngay Bản Phác Đồ Lộ Trình &amp; Bộ Sổ Tay Ma Thuật.
                </p>

                <form onSubmit={handleSubmitForm} className="mt-5 space-y-3.5">
                  <div>
                    <label className="block font-mono uppercase text-xs sm:text-[13px] tracking-wider text-slate-700 font-bold mb-1">
                      1. Họ và tên Phụ huynh (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Mẹ Thảo Nguyên..."
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0A78F3] focus:ring-1 focus:ring-[#0A78F3] text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-xs sm:text-[13px] tracking-wider text-slate-700 font-bold mb-1">
                      2. Số điện thoại Zalo (*)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Nhập SĐT Zalo để nhận Phác đồ & Sổ tay PDF..."
                      value={formData.phoneZalo}
                      onChange={(e) => setFormData({ ...formData, phoneZalo: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0A78F3] focus:ring-1 focus:ring-[#0A78F3] text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-xs sm:text-[13px] tracking-wider text-slate-700 font-bold mb-1">
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
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0A78F3] focus:ring-1 focus:ring-[#0A78F3] text-slate-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-xs sm:text-[13px] tracking-wider text-slate-700 font-bold mb-1">
                      4. Trường THCS con đang học tại Đà Nẵng
                    </label>
                    <select
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0A78F3] focus:ring-1 focus:ring-[#0A78F3] text-slate-900 transition-colors"
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
                    <label className="block font-mono uppercase text-xs sm:text-[13px] tracking-wider text-slate-700 font-bold mb-1">
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
                            className="text-[#0A78F3] focus:ring-[#0A78F3]"
                          />
                          <span className="font-body text-[13.5px] sm:text-[15px] leading-snug">{choice}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-4 px-4 rounded-xl bg-[#0A78F3] hover:bg-sky-500 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>XÁC NHẬN ĐĂNG KÝ – GIỮ LỊCH TEST 1-1 MIỄN PHÍ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="font-body text-xs sm:text-[13px] text-center text-slate-500">
                    ⚡ Cô Nghi sẽ trực tiếp liên hệ qua Zalo hoặc điện thoại trong vòng 15 phút để xác nhận lịch hẹn!
                  </p>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-sky-100 text-[#0A78F3] mx-auto flex items-center justify-center border-2 border-sky-300 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg">
                  Đăng Ký Thành Công!
                </h4>
                <p className="font-body text-sm sm:text-base text-slate-600 leading-relaxed">
                  Cảm ơn phụ huynh <strong>{formData.parentName}</strong> đã gửi gắm thông tin của bé <strong>{formData.studentNameAndGrade}</strong>.
                </p>
                <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-sm sm:text-base text-slate-800">
                  Cô Nghi sẽ liên hệ qua Zalo số <strong>{formData.phoneZalo}</strong> để gửi Bản Phác Đồ Lộ Trình &amp; chốt khung giờ test 1-1 phù hợp nhất với lịch học của con.
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
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
