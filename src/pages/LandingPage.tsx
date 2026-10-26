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
  ArrowDown,
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
  GraduationCap,
  Calendar,
  Zap,
  Flame,
  Gift,
  Compass,
  FileCheck,
  Target,
  Lock,
  HelpCircle,
  Send,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { ComparisonBookCards } from "../components/ComparisonBookCards";
import { submitLead } from "../lib/leadService";
import { GoogleSheetConfigModal } from "../components/GoogleSheetConfigModal";
import { SubmissionData } from "./ThankYouPage";

export interface LandingPageProps {
  onNavigateToThanks?: (data: SubmissionData) => void;
}


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

interface WeaponStep {
  step: number;
  title: string;
  desc: string;
}

interface WeaponColorConfig {
  gradientLine: string;
  topBorderColor: string;
  glow: string;
  watermark: string;
  categoryText: string;
  stepBadgeBg: string;
  resultBadgeBg: string;
  resultBoxBg: string;
  resultBoxBorder: string;
  resultText: string;
}

interface WeaponItem {
  number: string;
  category: string;
  title: string;
  steps: WeaponStep[];
  calloutLabel: string;
  calloutText: string;
  resultText: string;
  colorConfig: WeaponColorConfig;
}

const WEAPONS_DATA: WeaponItem[] = [
  {
    number: "01",
    category: "VŨ KHÍ 01 · PHƯƠNG PHÁP HỌC",
    title: "“BÓC TÁCH 4 BƯỚC & TRỢ GIẢNG ĐỒNG ĐẲNG” + “DỊCH BẮT BUỘC”",
    steps: [
      {
        step: 1,
        title: "Khoanh vùng từ mới",
        desc: "Chủ động, không đợi cô nhắc",
      },
      {
        step: 2,
        title: "Thảo luận đồng đẳng",
        desc: "Cùng bạn học tranh luận",
      },
      {
        step: 3,
        title: "Giải bài theo cấu trúc",
        desc: "Dựa trên nền tảng, không đoán",
      },
      {
        step: 4,
        title: "Dịch sâu & giải thích",
        desc: "Dịch nối tiếp từng câu trước lớp",
      },
    ],
    calloutLabel: "CÔ NGHI HỎI TRONG LỚP",
    calloutText: "“Tại sao chọn đáp án A mà không chọn B, C, D?”",
    resultText: "CHẤM DỨT 100% THÓI QUEN KHOANH LỤI & ĐỌC ĐOÁN MÒ",
    colorConfig: {
      gradientLine: "from-[#0A78F3] via-sky-400 to-blue-600",
      topBorderColor: "border-[#0A78F3]",
      glow: "bg-sky-100/60",
      watermark: "text-[#0A78F3]/18",
      categoryText: "text-[#0A78F3]",
      stepBadgeBg: "bg-[#0A78F3]",
      resultBadgeBg: "bg-[#0A78F3]",
      resultBoxBg: "bg-[#eff6ff]",
      resultBoxBorder: "border-sky-200/90",
      resultText: "text-[#0A78F3]",
    },
  },
  {
    number: "02",
    category: "VŨ KHÍ 02 · GAME HÓA KỶ LUẬT",
    title: "HỆ THỐNG GAME HÓA KỶ LUẬT “100 TOKENS” & TRIẾT LÝ “SMALL WIN”",
    steps: [
      {
        step: 1,
        title: "Khởi động Quizizz",
        desc: "Đấu trí kịch tính đầu buổi học",
      },
      {
        step: 2,
        title: "50% Kết quả bài làm",
        desc: "Chấm điểm minh bạch theo năng lực",
      },
      {
        step: 3,
        title: "30% Thái độ & nỗ lực",
        desc: "Ghi nhận chuyên cần và tiến bộ",
      },
      {
        step: 4,
        title: "20% Top đua hạng",
        desc: "Thưởng nóng, tích luỹ đổi quà lớn",
      },
    ],
    calloutLabel: "CƠ CHẾ KICKSTART BONUS",
    calloutText: "“Nhân đôi & nhân ba Tokens tuần đầu để con nếm vị chiến thắng sớm!”",
    resultText: "KÍCH THÍCH DOPAMINE, TỰ GIÁC LÀM BÀI KHÔNG CẦN GIỤC",
    colorConfig: {
      gradientLine: "from-emerald-500 via-teal-400 to-emerald-600",
      topBorderColor: "border-emerald-500",
      glow: "bg-emerald-100/60",
      watermark: "text-emerald-500/18",
      categoryText: "text-emerald-700",
      stepBadgeBg: "bg-emerald-600",
      resultBadgeBg: "bg-emerald-600",
      resultBoxBg: "bg-emerald-50/80",
      resultBoxBorder: "border-emerald-200/90",
      resultText: "text-emerald-700",
    },
  },
  {
    number: "03",
    category: "VŨ KHÍ 03 · KHOA HỌC TRÍ NHỚ",
    title: "CHUẨN HÓA PHÁT ÂM IPA, QUY TẮC TRỌNG ÂM & SPACED REPETITION",
    steps: [
      {
        step: 1,
        title: "Nhận diện IPA chuẩn",
        desc: "Bẻ khóa 44 âm vị quốc tế cơ bản",
      },
      {
        step: 2,
        title: "Bật âm đuôi & nối âm",
        desc: "Trị triệt để tật nuốt phụ âm cuối",
      },
      {
        step: 3,
        title: "Quy tắc trọng âm",
        desc: "Bắt trọn điểm câu nhấn âm đề thi",
      },
      {
        step: 4,
        title: "Lặp lại ngắt quãng",
        desc: "Spaced Repetition ghim sâu trí nhớ",
      },
    ],
    calloutLabel: "BẢO CHỨNG PHƯƠNG PHÁP",
    calloutText: "“Đọc chuẩn phát âm thì ắt nhớ từ vựng sâu – không cần chép phạt học vẹt!”",
    resultText: "ĐỌC CHUẨN, NHỚ CHẮC 80–90% TỪ VỰNG SGK MỚI",
    colorConfig: {
      gradientLine: "from-purple-600 via-violet-400 to-indigo-600",
      topBorderColor: "border-purple-500",
      glow: "bg-purple-100/60",
      watermark: "text-purple-500/18",
      categoryText: "text-purple-700",
      stepBadgeBg: "bg-purple-600",
      resultBadgeBg: "bg-purple-600",
      resultBoxBg: "bg-purple-50/80",
      resultBoxBorder: "border-purple-200/90",
      resultText: "text-purple-700",
    },
  },
  {
    number: "04",
    category: "VŨ KHÍ 04 · THỰC CHIẾN ĐỀ THI",
    title: "GIẢNG DẠY NGỮ PHÁP TRONG NGỮ CẢNH & THỰC CHIẾN ĐỀ CƯƠNG",
    steps: [
      {
        step: 1,
        title: "Ngữ pháp ngữ cảnh",
        desc: "Bám sát SGK Global Success / Friends Plus",
      },
      {
        step: 2,
        title: "Bẻ khóa Word Form",
        desc: "Nhận diện vị trí danh, tính, động từ",
      },
      {
        step: 3,
        title: "Giải đề cương trường",
        desc: "Sửa chi tiết 100% bài kiểm tra trên lớp",
      },
      {
        step: 4,
        title: "Ma trận 36 câu thi",
        desc: "Luyện phản xạ cấu trúc đề thi vào lớp 10",
      },
    ],
    calloutLabel: "KÈM CẶP TẬN TAY",
    calloutText: "“Trực tiếp sửa từng lỗi ngữ pháp trong đề cương trường của chính con!”",
    resultText: "LÀM CHỦ WORD FORM & TỰ TIN ĐẠT ĐIỂM CAO ĐỀ THI THẬT",
    colorConfig: {
      gradientLine: "from-[#ff4757] via-rose-400 to-red-600",
      topBorderColor: "border-[#ff4757]",
      glow: "bg-rose-100/60",
      watermark: "text-rose-500/18",
      categoryText: "text-[#ff4757]",
      stepBadgeBg: "bg-[#ff4757]",
      resultBadgeBg: "bg-[#ff4757]",
      resultBoxBg: "bg-rose-50/80",
      resultBoxBorder: "border-rose-200/90",
      resultText: "text-[#ff4757]",
    },
  },
  {
    number: "05",
    category: "VŨ KHÍ 05 · CÔNG NGHỆ & ĐỒNG HÀNH",
    title: "HỆ SINH THÁI CÔNG NGHỆ LMS ĐỘC QUYỀN & “CỨU TRỢ SOS 1:1”",
    steps: [
      {
        step: 1,
        title: "LMS ghi nhận dữ liệu",
        desc: "Theo dõi bài tập và điểm số từng buổi",
      },
      {
        step: 2,
        title: "Báo cáo Zalo 20h00",
        desc: "Tự động gửi bảng điểm về điện thoại mẹ",
      },
      {
        step: 3,
        title: "Kênh Zalo SOS 1:1",
        desc: "Con gặp bài khó ở nhà được gỡ rối ngay",
      },
      {
        step: 4,
        title: "Phụ đạo thêm miễn phí",
        desc: "Lấp lỗ hổng kiến thức trước kỳ thi",
      },
    ],
    calloutLabel: "TIÊU CHUẨN MINH BẠCH",
    calloutText: "“Đúng 20h00 mỗi tối sau buổi học: mẹ mở Zalo là nắm trọn tiến độ của con!”",
    resultText: "MẸ THẢNH THƠI BUỔI TỐI, TRẢ LẠI SỰ BÌNH YÊN GIA ĐÌNH",
    colorConfig: {
      gradientLine: "from-amber-500 via-orange-400 to-amber-600",
      topBorderColor: "border-amber-500",
      glow: "bg-amber-100/60",
      watermark: "text-amber-500/18",
      categoryText: "text-amber-700",
      stepBadgeBg: "bg-amber-600",
      resultBadgeBg: "bg-amber-600",
      resultBoxBg: "bg-amber-50/80",
      resultBoxBorder: "border-amber-200/90",
      resultText: "text-amber-800",
    },
  },
];

interface FeedbackSlideItem {
  id: number;
  title: string;
  image: string;
}

const FEEDBACK_SLIDES: FeedbackSlideItem[] = [
  { id: 1, title: "Ảnh tin nhắn Zalo 01 - Phụ huynh báo điểm", image: "/image/feedback-1.webp" },
  { id: 2, title: "Ảnh tin nhắn Zalo 02 - Phụ huynh cảm ơn", image: "/image/feedback-2.webp" },
  { id: 3, title: "Ảnh tin nhắn Zalo 03 - Học sinh tiến bộ", image: "/image/feedback-3.webp" },
  { id: 4, title: "Ảnh tin nhắn Zalo 04 - Bứt phá điểm số", image: "/image/feedback-4.webp" },
  { id: 5, title: "Ảnh tin nhắn Zalo 05 - Tự giác học tập", image: "/image/feedback-5.webp" },
];

const infiniteFeedbackSlides = [
  ...FEEDBACK_SLIDES.map((s, idx) => ({ ...s, cloneKey: `fb-c1-${idx}` })),
  ...FEEDBACK_SLIDES.map((s, idx) => ({ ...s, cloneKey: `fb-c2-${idx}` })),
  ...FEEDBACK_SLIDES.map((s, idx) => ({ ...s, cloneKey: `fb-c3-${idx}` })),
  ...FEEDBACK_SLIDES.map((s, idx) => ({ ...s, cloneKey: `fb-c4-${idx}` })),
  ...FEEDBACK_SLIDES.map((s, idx) => ({ ...s, cloneKey: `fb-c5-${idx}` })),
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToThanks }) => {
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
    studentName: "",
    studentGrade: "",
    studentNameAndGrade: "",
    school: "",
    problems: ["Mất gốc hoàn toàn, học trước quên sau"],
    priorityChoice: "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
  });
  const [otherProblemText, setOtherProblemText] = useState("");
  const [isOtherProblemChecked, setIsOtherProblemChecked] = useState(false);
  const [otherPriorityText, setOtherPriorityText] = useState("");
  const [isOtherPriority, setIsOtherPriority] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isOnPageSubmitted, setIsOnPageSubmitted] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isSheetConfigOpen, setIsSheetConfigOpen] = useState(false);

  const handleToggleProblem = (problem: string) => {
    setFormData((prev) => {
      const exists = prev.problems.includes(problem);
      if (exists) {
        return { ...prev, problems: prev.problems.filter((p) => p !== problem) };
      } else {
        return { ...prev, problems: [...prev.problems, problem] };
      }
    });
  };

  const handleOnPageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    try {
      const cleanProblems = formData.problems.filter((p) => !p.startsWith("Khác:"));
      const allProblems = Array.from(
        new Set([
          ...cleanProblems,
          ...(isOtherProblemChecked && otherProblemText.trim()
            ? [`Khác: ${otherProblemText.trim()}`]
            : []),
        ].filter(Boolean))
      );
      const finalPriority =
        isOtherPriority && otherPriorityText.trim()
          ? `Khác: ${otherPriorityText.trim()}`
          : formData.priorityChoice;

      const submissionPayload: SubmissionData = {
        parentName: formData.parentName.trim(),
        phoneZalo: formData.phoneZalo.trim(),
        studentName: (
          formData.studentName ||
          (formData.studentNameAndGrade ? formData.studentNameAndGrade.split("-")[0].trim() : "")
        ).trim(),
        studentGrade: (
          formData.studentGrade ||
          (formData.studentNameAndGrade && formData.studentNameAndGrade.includes("-")
            ? formData.studentNameAndGrade.split("-")[1].trim()
            : "")
        ).trim(),
        studentNameAndGrade:
          formData.studentNameAndGrade ||
          `${formData.studentName}${formData.studentGrade ? ` - ${formData.studentGrade}` : ""}`,
        school: formData.school.trim(),
        problems: allProblems,
        priorityChoice: finalPriority,
        ticketCode: `CN-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt:
          new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
          ", " +
          new Date().toLocaleDateString("vi-VN"),
      };

      await submitLead(
        {
          ...formData,
          problems: allProblems,
          priorityChoice: finalPriority,
        },
        "on_page_form"
      );

      try {
        sessionStorage.setItem("co_nghi_last_submission", JSON.stringify(submissionPayload));
        localStorage.setItem("co_nghi_last_submission", JSON.stringify(submissionPayload));
      } catch {
        // ignore
      }

      setIsOnPageSubmitted(true);

      if (onNavigateToThanks) {
        onNavigateToThanks(submissionPayload);
      } else {
        window.history.pushState({ route: "thanks" }, "", "/thanks");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (err) {
      console.error("Lỗi gửi đăng ký:", err);
      setIsOnPageSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

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
  // State cho slide feedback tin nhắn Zalo (cuộn tròn liên tục 1->5->1 với tốc độ chậm, căn giữa mobile)
  const [feedbackSlideIndex, setFeedbackSlideIndex] = useState(10); // Vị trí trung tâm trong 5 bộ thẻ (bộ 3: 10..14)
  const [isFeedbackTransitionEnabled, setIsFeedbackTransitionEnabled] = useState(true);
  const [isFeedbackPaused, setIsFeedbackPaused] = useState(false);
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const pauseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const triggerPauseOnInteraction = () => {
    setIsFeedbackPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsFeedbackPaused(false);
    }, 12000);
  };

  const handleNextFeedback = (isUserAction = false) => {
    if (isUserAction) triggerPauseOnInteraction();
    setIsFeedbackTransitionEnabled(true);
    setFeedbackSlideIndex((prev) => prev + 1);
  };

  const handlePrevFeedback = () => {
    triggerPauseOnInteraction();
    setIsFeedbackTransitionEnabled(true);
    setFeedbackSlideIndex((prev) => prev - 1);
  };

  const handleFeedbackTransitionEnd = () => {
    if (feedbackSlideIndex >= 15) {
      setIsFeedbackTransitionEnabled(false);
      setFeedbackSlideIndex((prev) => prev - 5);
    } else if (feedbackSlideIndex < 10) {
      setIsFeedbackTransitionEnabled(false);
      setFeedbackSlideIndex((prev) => prev + 5);
    }
  };

  const handleFeedbackTouchStart = (e: React.TouchEvent) => {
    triggerPauseOnInteraction();
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setTouchDeltaX(0);
  };

  const handleFeedbackTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setTouchDeltaX(diffX);
    }
  };

  const handleFeedbackTouchEnd = () => {
    triggerPauseOnInteraction();
    if (touchStartXRef.current !== null) {
      if (touchDeltaX < -40) {
        handleNextFeedback(true);
      } else if (touchDeltaX > 40) {
        handlePrevFeedback();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setTouchDeltaX(0);
  };

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

  // Khôi phục transition sau khi snap vị trí vòng tròn feedback
  useEffect(() => {
    if (!isFeedbackTransitionEnabled) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsFeedbackTransitionEnabled(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isFeedbackTransitionEnabled]);

  // Auto cuộn vòng tròn liên tục với tốc độ chậm (6.5s/slide), pause khi tương tác/hover/background tab
  useEffect(() => {
    if (isFeedbackPaused) return;
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      handleNextFeedback(false);
    }, 6500); // Giảm tốc độ từ 4000ms xuống 6500ms theo yêu cầu
    return () => clearInterval(interval);
  }, [isFeedbackPaused]);



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

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    try {
      const cleanProblems = formData.problems.filter((p) => !p.startsWith("Khác:"));
      const allProblems = Array.from(
        new Set([
          ...cleanProblems,
          ...(isOtherProblemChecked && otherProblemText.trim()
            ? [`Khác: ${otherProblemText.trim()}`]
            : []),
        ].filter(Boolean))
      );
      const finalPriority =
        isOtherPriority && otherPriorityText.trim()
          ? `Khác: ${otherPriorityText.trim()}`
          : formData.priorityChoice;

      const submissionPayload: SubmissionData = {
        parentName: formData.parentName.trim(),
        phoneZalo: formData.phoneZalo.trim(),
        studentName: (
          formData.studentName ||
          (formData.studentNameAndGrade ? formData.studentNameAndGrade.split("-")[0].trim() : "")
        ).trim(),
        studentGrade: (
          formData.studentGrade ||
          (formData.studentNameAndGrade && formData.studentNameAndGrade.includes("-")
            ? formData.studentNameAndGrade.split("-")[1].trim()
            : "")
        ).trim(),
        studentNameAndGrade:
          formData.studentNameAndGrade ||
          `${formData.studentName}${formData.studentGrade ? ` - ${formData.studentGrade}` : ""}`,
        school: formData.school.trim(),
        problems: allProblems,
        priorityChoice: finalPriority,
        ticketCode: `CN-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt:
          new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
          ", " +
          new Date().toLocaleDateString("vi-VN"),
      };

      await submitLead(
        {
          ...formData,
          problems: allProblems,
          priorityChoice: finalPriority,
        },
        "cta_popup_modal"
      );

      try {
        sessionStorage.setItem("co_nghi_last_submission", JSON.stringify(submissionPayload));
        localStorage.setItem("co_nghi_last_submission", JSON.stringify(submissionPayload));
      } catch {
        // ignore
      }

      setIsModalOpen(false);
      setRegistrationSubmitted(true);

      if (onNavigateToThanks) {
        onNavigateToThanks(submissionPayload);
      } else {
        window.history.pushState({ route: "thanks" }, "", "/thanks");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch (err) {
      console.error("Lỗi gửi đăng ký modal:", err);
      setRegistrationSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const infiniteSymptomItems = [...SYMPTOMS_DATA, ...SYMPTOMS_DATA, ...SYMPTOMS_DATA];

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern text-slate-900 selection:bg-sky-200 selection:text-sky-900 relative overflow-x-clip font-body pb-0">
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
            <span className="uppercase text-[9.5px] sm:text-[11px] tracking-wider text-sky-400 font-bold flex items-center gap-1 mt-0.5 whitespace-nowrap">
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
            <div className="text-[9.5px] sm:text-xs uppercase tracking-wider font-bold text-[#ff6b81] flex items-center justify-end gap-1 mt-0.5 whitespace-nowrap">
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
                <span className="text-base sm:text-xl md:text-2xl lg:text-[22px] xl:text-[24px] leading-snug font-bold text-slate-700 mt-0.5 sm:mt-1 normal-case text-center lg:text-left block">
                  <span>Bứt phá </span>
                  <span className="text-[#C43838] font-black underline decoration-[#C43838] decoration-2 underline-offset-2">
                    1–3 điểm
                  </span>
                  <span> trên trường </span>
                  <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-300 font-black shadow-2xs inline box-decoration-clone">
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
                    <span className="text-[10.5px] font-bold text-slate-800 uppercase tracking-wider">
                      Thạc sĩ TESOL
                    </span>
                  </div>

                  {/* Gradient Overlay & Metadata thông tin chân dung phía dưới phủ lên ảnh full box */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-4 sm:p-5 pt-12 text-white flex flex-col justify-end">
                    <div className="flex items-center">
                      <span className="text-[11px] sm:text-xs font-bold text-sky-300 tracking-tight whitespace-nowrap">
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
                        <span className="inline-flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-bold text-[#0A78F3] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200/70 shadow-2xs">
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

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs sm:text-[13px] text-[#0A78F3] font-bold">
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
                        <span className="inline-flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 shadow-2xs">
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

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs sm:text-[13px] text-emerald-700 font-bold">
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
                        <span className="inline-flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-bold text-[#C43838] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200/70 shadow-2xs">
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

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs sm:text-[13px] text-[#C43838] font-bold">
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
                <span className="text-base sm:text-xl md:text-2xl lg:text-[22px] xl:text-[24px] leading-tight text-center tracking-tight block">
                  <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-[#0A78F3] via-sky-500 to-blue-600 box-decoration-clone">
                    CHO ĐẾN KHI BA MẸ XEM HẾT VIDEO 2.5 PHÚT NÀY!
                  </span>
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-10">
              {/* ── CỘT TRÁI (40%): VIDEO VSL TỈ LỆ 9:16 (STICKY TRÊN PC CUỘN CÙNG CỘT PHẢI) ── */}
              <div className="w-full lg:col-span-4">
                <div className="lg:sticky lg:top-20 flex justify-center lg:justify-start">
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
            </div>

              {/* ── CỘT PHẢI (60%): HỘP THOẠI, BODY TEXT & CTA ── */}
              <div className="w-full lg:col-span-6 space-y-4 sm:space-y-5 text-center lg:text-left">
                {/* Hộp thoại Thông điệp từ Cô Nghi (2-Block Recessed Box với vỏ ngoài có background opacity nhỏ theo style đính kèm) */}
                <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-1.5 sm:gap-2">
                  {/* ── KHỐI 1 (PHẦN TRÊN): THÔNG ĐIỆP TỪ CÔ NGHI ── */}
                  <div className="relative bg-white/95 rounded-2xl sm:rounded-[22px] p-5 sm:p-6 pt-6 sm:pt-7 border border-white/80 shadow-xs text-left overflow-visible">
                    {/* Nhãn Badge Đỏ San Hô Nổi Khối ở góc trên bên trái */}
                    <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-6 inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#ff4757] text-white shadow-xs border border-white/30 z-10">
                      <Quote className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                      <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                        Thông Điệp Từ Cô Nghi
                      </span>
                    </div>

                    {/* Nội dung trích dẫn với điểm nhấn màu sắc đúng theo UI đính kèm */}
                    <div className="space-y-3 font-body text-slate-700 text-[15.5px] sm:text-[17px] leading-relaxed italic font-medium">
                      <p>
                        &ldquo;Ba mẹ ạ,{" "}
                        <strong className="text-[#ff4757] font-bold not-italic">
                          lỗi hoàn toàn không phải do các con thiếu năng lực
                        </strong>
                        . Trẻ ở lứa tuổi dậy thì có cái tôi rất lớn, các con cực kỳ{" "}
                        <strong className="text-[#0A78F3] font-bold not-italic bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/80 box-decoration-clone inline">
                          sợ sai và sợ bị đánh giá trước đám đông...
                        </strong>
                        &rdquo;
                      </p>
                      <p>
                        &ldquo;Môn Tiếng Anh cấp 2 đôi khi tạo ra nhiều thử thách khi lượng từ vựng ngày càng lớn. Việc ghi nhớ máy móc thường khiến các con <strong className="font-bold not-italic text-slate-900">dễ quên nhanh, dẫn đến tâm lý đối phó</strong> khi làm các bài kiểm tra trắc nghiệm tại trường...&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* ── KHỐI 2 (PHẦN DƯỚI): THÔNG TIN CÔ NGHI & BẰNG CẤP ── */}
                  <div className="bg-white/95 rounded-2xl sm:rounded-[22px] p-4 sm:p-5 border border-white/80 shadow-xs flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-slate-200/80 shadow-xs">
                        <img
                          src="/image/lop-tieng-anh-co-nghi-thac-si-tesol.webp"
                          alt="Cô Nghi - Thạc sĩ TESOL"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-heading font-extrabold uppercase tracking-tight text-base sm:text-lg text-slate-900 leading-snug">
                          Cô Nghi
                        </h4>
                        <h4 className="font-heading font-extrabold tracking-tight text-base sm:text-lg text-slate-600 mt-0.5 leading-snug">
                          Người trực tiếp đứng lớp
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#0A78F3] border border-sky-200 shadow-2xs">
                        Cử nhân GPA 8.17
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#0A78F3] border border-sky-200 shadow-2xs">
                        Thạc sĩ TESOL
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4 Bước Tuần Tự dạng Timeline có Borderline cho từng box & đường phân tách mảnh giữa 2 phần */}
                <div className="relative pt-3 pb-1 text-left space-y-3 sm:space-y-3.5">
                  {/* Đường line kết nối chạy dọc xuyên suốt giữa các điểm mốc tròn */}
                  <div className="absolute left-2.5 sm:left-3 top-6 bottom-7 w-[2px] bg-slate-300 z-0" />

                  {/* Khối 1: VẤN ĐỀ */}
                  <div className="relative pl-7 sm:pl-8 text-left">
                    {/* Dấu chấm tròn mốc 1 */}
                    <div className="absolute left-2.5 sm:left-3 -translate-x-1/2 top-4 w-5 h-5 rounded-full border-2 border-[#ff4757] bg-white flex items-center justify-center shadow-xs z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff4757]" />
                    </div>

                    {/* Box nội dung có borderline */}
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-left">
                      {/* Phần trên: 01 — VẤN ĐỀ & Tiêu đề */}
                      <div>
                        <h4
                          className="font-heading font-extrabold text-base sm:text-lg tracking-tight uppercase !text-[#ff4757] leading-snug"
                          style={{ color: "#ff4757" }}
                        >
                          01 — VẤN ĐỀ
                        </h4>
                        <h4 className="font-heading font-extrabold tracking-tight text-base sm:text-lg text-slate-900 mt-0.5 leading-snug">
                          Lỗi không phải do con
                        </h4>
                      </div>

                      {/* Đường line phân tách tăng độ dày gấp đôi */}
                      <div className="my-2.5 sm:my-3 border-t-2 border-slate-100" />

                      {/* Phần dưới: Mô tả & Tags */}
                      <div>
                        <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                          Học vẹt nhanh quên, lớp đông khiến con sợ bị chê cười và chọn cách &ldquo;khoanh lụi&rdquo; đối phó.
                        </p>

                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                            20–30 em / lớp
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                            &ldquo;khoanh lụi&rdquo; đối phó
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Khối 2: GIẢI PHÁP */}
                  <div className="relative pl-7 sm:pl-8 text-left">
                    {/* Dấu chấm tròn mốc 2 */}
                    <div className="absolute left-2.5 sm:left-3 -translate-x-1/2 top-4 w-5 h-5 rounded-full border-2 border-[#0A78F3] bg-white flex items-center justify-center shadow-xs z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0A78F3]" />
                    </div>

                    {/* Box nội dung có borderline */}
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-left">
                      {/* Phần trên: 02 — GIẢI PHÁP & Tiêu đề */}
                      <div>
                        <h4
                          className="font-heading font-extrabold text-base sm:text-lg tracking-tight uppercase !text-[#0A78F3] leading-snug"
                          style={{ color: "#0A78F3" }}
                        >
                          02 — GIẢI PHÁP
                        </h4>
                        <h4 className="font-heading font-extrabold tracking-tight text-base sm:text-lg text-slate-900 mt-0.5 leading-snug">
                          Trị dứt điểm đoán mò
                        </h4>
                      </div>

                      {/* Đường line phân tách tăng độ dày gấp đôi */}
                      <div className="my-2.5 sm:my-3 border-t-2 border-slate-100" />

                      {/* Phần dưới: Mô tả & Tags */}
                      <div>
                        <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                          Phương pháp <strong className="text-slate-900 font-bold">&ldquo;Bóc tách 4 bước&rdquo;</strong> giúp con tự hiểu bản chất ngữ pháp và tự tin làm đề thi vào lớp 10.
                        </p>

                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-[#0A78F3] border border-sky-200/80">
                            Bóc tách 4 bước
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-[#0A78F3] border border-sky-200/80">
                            Thi vào lớp 10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Khối 3: HỆ THỐNG */}
                  <div className="relative pl-7 sm:pl-8 text-left">
                    {/* Dấu chấm tròn mốc 3 */}
                    <div className="absolute left-2.5 sm:left-3 -translate-x-1/2 top-4 w-5 h-5 rounded-full border-2 border-[#d97706] bg-white flex items-center justify-center shadow-xs z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]" />
                    </div>

                    {/* Box nội dung có borderline */}
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-left">
                      {/* Phần trên: 03 — HỆ THỐNG & Tiêu đề */}
                      <div>
                        <h4
                          className="font-heading font-extrabold text-base sm:text-lg tracking-tight uppercase !text-[#d97706] leading-snug"
                          style={{ color: "#d97706" }}
                        >
                          03 — HỆ THỐNG
                        </h4>
                        <h4 className="font-heading font-extrabold tracking-tight text-base sm:text-lg text-slate-900 mt-0.5 leading-snug">
                          Tự giác &amp; minh bạch
                        </h4>
                      </div>

                      {/* Đường line phân tách tăng độ dày gấp đôi */}
                      <div className="my-2.5 sm:my-3 border-t-2 border-slate-100" />

                      {/* Phần dưới: Mô tả & Tags */}
                      <div>
                        <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                          Tích Tokens đổi quà tạo động lực tự học; hệ thống gửi báo cáo điểm về Zalo mẹ mỗi tối.
                        </p>

                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                            100 Tokens đổi quà
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                            Zalo mẹ · 20h00 mỗi tối
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Khối 4: CAM KẾT */}
                  <div className="relative pl-7 sm:pl-8 text-left">
                    {/* Dấu chấm tròn mốc 4 */}
                    <div className="absolute left-2.5 sm:left-3 -translate-x-1/2 top-4 w-5 h-5 rounded-full border-2 border-[#059669] bg-white flex items-center justify-center shadow-xs z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                    </div>

                    {/* Box nội dung có borderline */}
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-left">
                      {/* Phần trên: 04 — CAM KẾT & Tiêu đề */}
                      <div>
                        <h4
                          className="font-heading font-extrabold text-base sm:text-lg tracking-tight uppercase !text-[#059669] leading-snug"
                          style={{ color: "#059669" }}
                        >
                          04 — CAM KẾT
                        </h4>
                        <h4 className="font-heading font-extrabold tracking-tight text-base sm:text-lg text-slate-900 mt-0.5 leading-snug">
                          Cam kết an tâm
                        </h4>
                      </div>

                      {/* Đường line phân tách tăng độ dày gấp đôi */}
                      <div className="my-2.5 sm:my-3 border-t-2 border-slate-100" />

                      {/* Phần dưới: Mô tả & Tags */}
                      <div>
                        <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                          Sĩ số tối đa 12 em/lớp, hoàn 100% học phí sau 7 ngày nếu không hợp, phụ đạo 1-1 miễn phí đến khi tiến bộ.
                        </p>

                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                            12 em / lớp
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                            Hoàn 100% sau 7 ngày
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                            Phụ đạo 1-1 miễn phí
                          </span>
                        </div>
                      </div>
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
              <p className="font-body text-slate-600 leading-relaxed text-[15.5px] sm:text-base md:text-[17px] max-w-3xl mx-auto text-center">
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
                            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-100 text-[#C43838] font-heading text-sm sm:text-base font-black flex items-center justify-center shrink-0 border border-red-200/80 shadow-2xs">
                              {item.id}
                            </span>
                            <div>
                              <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C43838]">
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
                                <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide">
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
                                <p className="font-body text-[15.5px] sm:text-[16.5px] text-slate-700 leading-relaxed">
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
                                <p className="font-body text-[15.5px] sm:text-[16.5px] text-slate-700 leading-relaxed">
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
                <span className="text-xs text-slate-500 font-bold ml-2">
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
                  <div className="text-center max-w-3xl mx-auto text-base sm:text-xl md:text-2xl lg:text-[22px] xl:text-[24px] font-medium text-slate-200 leading-snug">
                    <span className="block sm:inline">
                      <span>Đừng để </span>
                      <strong className="text-[#ff6b81] font-bold bg-rose-950/70 px-2 py-0.5 rounded-lg border border-rose-800/80 shadow-2xs inline box-decoration-clone">
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
                      <div className="flex items-center justify-center gap-5 my-3 text-xs sm:text-sm">
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
                                <span className="text-xs sm:text-sm text-slate-300 font-semibold leading-none mb-1">
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
                                <span className="text-sm sm:text-base font-black text-amber-300 leading-none mb-1">
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
                                <span className="text-xs sm:text-sm text-slate-300 font-semibold leading-none mb-1">
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
                                <span className="text-sm sm:text-base font-black text-[#ff6b81] leading-none mb-1">
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
                                <span className="text-xs sm:text-sm text-slate-300 font-semibold leading-none mb-1">
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
                                <span className="text-sm sm:text-base font-black text-sky-400 leading-none mb-1">
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
                        <p className="font-body text-[15.5px] sm:text-[16.5px] text-slate-200 leading-relaxed">
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
                          <div className="text-[13.5px] sm:text-[15px] font-bold text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-md border border-sky-800">
                            Toán 1 : Văn 1 : Anh 1
                          </div>
                        </div>

                        {/* Dòng 2: Cấu trúc đề Đà Nẵng */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                          <div className="text-[14px] sm:text-[15.5px] text-slate-200 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                            <span>Đề thi Sở GD:</span>
                          </div>
                          <div className="text-[13.5px] sm:text-[15px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800">
                            36 câu (Tự viết từ + dịch)
                          </div>
                        </div>

                        {/* Dòng 3: Đánh giá khả năng "khoanh lụi" */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[14px] sm:text-[15.5px] text-slate-200 font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#ff4757] shrink-0" />
                            <span>Cơ hội may mắn:</span>
                          </div>
                          <div className="text-[13.5px] sm:text-[15px] font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-800">
                            0% (Triệt tiêu khoanh lụi)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* KHUNG THÔNG TIN CẢNH BÁO / TỔNG KẾT RỦI RO */}
                    <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-700/80">
                      <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 border border-rose-900/60 shadow-inner">
                        <p className="font-body text-[15.5px] sm:text-[16.5px] text-slate-200 leading-relaxed text-center sm:text-left">
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
                      <span className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">Con yêu</span>
                    </div>

                    {/* Bong bóng chat */}
                    <div className="relative flex-1 bg-white text-slate-800 p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-lg border border-slate-200">
                      {/* Mũi nhọn speech bubble */}
                      <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent" />
                      
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1.5">
                        <Quote className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Tâm sự của con</span>
                      </div>
                      
                      <p className="font-body text-[15.5px] sm:text-[17px] text-slate-800 leading-relaxed italic font-medium">
                        &ldquo;Con không ghét Tiếng Anh, con chỉ sợ cảm giác bất lực khi không hiểu bài và sợ ánh mắt thất vọng khi mẹ đứng sau quát mắng.&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Lời giải đáp & Thấu hiểu ấm áp từ Cô Nghi - Tái thiết kế theo UI đính kèm */}
                  <div className="p-5 sm:p-8 md:p-10 rounded-3xl bg-[#0c1424] border border-slate-700/80 shadow-2xl text-center flex flex-col items-center relative overflow-hidden w-full">
                    {/* Ánh sáng glow tinh tế nền */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* 1. Header Badge: ● Nghiên cứu tâm lý giáo dục từ chương trình Thạc sĩ TESOL cho thấy */}
                    <div className="inline-flex items-center gap-2 text-sky-400 text-xs sm:text-sm md:text-[15px] font-bold mb-4 sm:mb-5 tracking-tight">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                      <span>Nghiên cứu tâm lý giáo dục từ chương trình Thạc sĩ TESOL cho thấy</span>
                    </div>

                    {/* 2. Subtitle: Con chưa học tốt môn Tiếng Anh */}
                    <p className="font-heading font-medium text-slate-200 text-base sm:text-xl md:text-2xl mb-1.5 sm:mb-2">
                      Con chưa học tốt môn Tiếng Anh
                    </p>

                    {/* 3. Main Headline: KHÔNG PHẢI DO CON / THIẾU THÔNG MINH. (đồng bộ tuyệt đối size chữ) */}
                    <div className="flex flex-col items-center justify-center my-1 sm:my-2 space-y-1">
                      <div className="font-heading font-black text-white text-2xl sm:text-4xl md:text-5xl lg:text-[48px] tracking-tight uppercase leading-tight text-center">
                        KHÔNG PHẢI DO CON
                      </div>
                      <div className="relative inline-block">
                        <span className="font-heading font-black text-[#ff5b6b] text-2xl sm:text-4xl md:text-5xl lg:text-[48px] tracking-tight uppercase leading-tight text-center block">
                          THIẾU THÔNG MINH.
                        </span>
                        {/* Đường kẻ ngang đỏ xuyên qua chữ THIẾU THÔNG MINH */}
                        <span
                          aria-hidden="true"
                          className="absolute left-[-2%] right-[-2%] top-1/2 -translate-y-1/2 h-[3px] sm:h-[4px] md:h-[5px] bg-[#ff3849] rounded-full pointer-events-none shadow-[0_0_6px_rgba(255,56,73,0.6)]"
                        />
                      </div>
                    </div>

                    {/* 4. Subtitle: Thứ duy nhất con đang thiếu là */}
                    <p className="font-body italic text-slate-300 text-sm sm:text-lg md:text-xl mt-3 sm:mt-5 mb-5 sm:mb-7">
                      Thứ duy nhất con đang thiếu là
                    </p>

                    {/* 5. Hai khối 01 · PHƯƠNG PHÁP và 02 · MÔI TRƯỜNG kết nối bằng chữ "và" (giảm padding, hiển thị 1 dòng trên PC) */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full max-w-4xl">
                      {/* Thẻ 01: PHƯƠNG PHÁP */}
                      <div className="w-full flex-1 bg-[#0b172a] rounded-2xl px-3.5 py-3 sm:px-4 sm:py-3.5 border-2 border-sky-600/90 shadow-[0_4px_20px_rgba(10,120,243,0.15)] text-left transition-all hover:border-sky-500">
                        <div className="font-heading font-extrabold text-[11px] sm:text-xs tracking-wider text-sky-400 uppercase mb-1">
                          01 · PHƯƠNG PHÁP
                        </div>
                        <h5 className="font-heading font-black text-base sm:text-lg md:text-[18px] lg:text-[19px] xl:text-xl text-sky-200 leading-snug md:whitespace-nowrap">
                          Kèm cặp bóc tách đúng bản chất
                        </h5>
                      </div>

                      {/* Nút tròn nối "và" */}
                      <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#182338] border border-slate-600 flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-300 shadow-inner">
                        và
                      </div>

                      {/* Thẻ 02: MÔI TRƯỜNG */}
                      <div className="w-full flex-1 bg-[#1c160c] rounded-2xl px-3.5 py-3 sm:px-4 sm:py-3.5 border-2 border-amber-600/90 shadow-[0_4px_20px_rgba(245,158,11,0.15)] text-left transition-all hover:border-amber-500">
                        <div className="font-heading font-extrabold text-[11px] sm:text-xs tracking-wider text-amber-400 uppercase mb-1">
                          02 · MÔI TRƯỜNG
                        </div>
                        <h5 className="font-heading font-black text-base sm:text-lg md:text-[18px] lg:text-[19px] xl:text-xl text-amber-200 leading-snug md:whitespace-nowrap">
                          An toàn để xây dựng lại sự tự tin.
                        </h5>
                      </div>
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
            <div className="text-center w-full mx-auto space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs sm:text-[13px] text-[#0A78F3] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>Giải pháp kèm cặp độc quyền</span>
              </div>

              {/* Headline 2 dòng */}
              <h2 className="font-heading tracking-tight flex flex-col items-center gap-2.5 sm:gap-3">
                {/* Dòng 1: Tiêu đề chính - 38px ở PC, trên mobile chia 2 dòng */}
                <span className="text-xl min-[430px]:text-2xl sm:text-3xl lg:text-[38px] font-extrabold uppercase leading-tight text-slate-900 tracking-tight flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-2">
                  <span>LỚP TIẾNG ANH CÔ NGHI</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A78F3] to-blue-600 font-black">
                    – THẠC SĨ GIÁO DỤC TESOL
                  </span>
                </span>
                {/* Dòng 2: Tiêu đề phụ - chia dòng 1 & dòng 2 */}
                <span className="text-base sm:text-lg lg:text-[20px] font-semibold text-slate-700 leading-snug normal-case block text-center">
                  <span>Trạm cứu hộ học thuật &amp; kiến tạo động lực học tập </span>
                  <span className="inline">
                    <span>với </span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300 font-bold inline box-decoration-clone">
                      sĩ số vàng – tối đa 12 học sinh
                    </span>
                  </span>
                </span>
              </h2>

              {/* 3 đoạn text nội dung giới thiệu - Thêm khoảng trống thoáng giữa các đoạn */}
              <div className="space-y-3.5 sm:space-y-4 font-body text-slate-600 leading-relaxed text-[15.5px] sm:text-[17px] w-full mx-auto pt-2 sm:pt-3">
                <p>
                  Không vận hành như một <strong className="text-slate-900 font-semibold">trung tâm thương mại đại trà</strong> hay một <strong className="text-slate-900 font-semibold">lò luyện thi nhồi nhét</strong>.
                </p>
                <p>
                  Nghiên cứu tâm lý giáo dục từ chương trình <strong className="text-[#0A78F3] font-semibold">Thạc sĩ TESOL</strong>, cô Nghi thiết kế lớp học theo mô hình <strong className="text-[#0A78F3] font-bold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 inline-block">Giám sát Vi mô (Micro-Class Mentorship)</strong>.
                </p>
                <p>
                  Sự khác biệt cốt lõi dưới đây giải thích vì sao học sinh từng sợ hãi Tiếng Anh lại có thể <strong className="text-[#C43838] font-bold underline decoration-[#C43838] decoration-2 underline-offset-2">bứt phá điểm số chỉ sau 90 ngày</strong>:
                </p>
              </div>
            </div>

          {/* 3 Thẻ Lật Như Lật Sách Đối Chiếu (Book Flip Comparison Cards) */}
          <ComparisonBookCards onRegisterClick={handleOpenRegisterModal} />

          {/* ── CTA BUTTON BÊN DƯỚI BẢNG SO SÁNH (HIỂN THỊ CẢ MOBILE & DESKTOP) ── */}
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-4">
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
          KHỐI 3B: 5 VŨ KHÍ SƯ PHẠM ĐỘC QUYỀN (SECTION RIÊNG BIỆT VỚI MÀU NỀN TÁCH BIỆT & GRID PATTERN)
      ────────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-16 bg-[#eaf2fb] bg-grid-pattern relative border-t border-slate-200 w-full">
        <div className="w-[90%] lg:w-[80%] mx-auto space-y-6 sm:space-y-8 relative z-10">
          {/* Header 5 Vũ Khí Sư Phạm */}
          <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {/* Headline 2 dòng, size 38px ở PC, ĐẶC BIỆT thay cho ĐỘC QUYỀN, dòng 2 vừa vặn 1 hàng trên mobile */}
            <h2 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 leading-tight sm:leading-snug text-center flex flex-col items-center gap-1.5 sm:gap-2">
              <span className="text-[17px] min-[360px]:text-[18.5px] min-[390px]:text-[20.5px] min-[430px]:text-[22px] sm:text-[28px] md:text-[32px] lg:text-[38px] leading-tight text-center whitespace-nowrap">
                5 VŨ KHÍ SƯ PHẠM{" "}
                <span className="text-[#0A78F3] font-black">
                  ĐẶC BIỆT
                </span>
              </span>
              <span className="text-[14.5px] min-[360px]:text-[16px] min-[390px]:text-[17.5px] min-[430px]:text-[19.5px] sm:text-[26px] md:text-[30px] lg:text-[38px] leading-tight text-center whitespace-nowrap">
                GIÚP CON HỌC{" "}
                <span className="text-[#ff4757] font-black underline decoration-[#ff4757]/60 decoration-2 sm:decoration-4 underline-offset-4">
                  &quot;DỄ HIỂU – NHỚ LÂU&quot;
                </span>
              </span>
            </h2>

            {/* Text mô tả: size 20px ở PC, keyword nổi bật */}
            <p className="font-body text-slate-600 text-[15.5px] sm:text-[17px] md:text-[18.5px] lg:text-[20px] leading-relaxed max-w-3xl mx-auto text-center">
              Được thiết kế dựa trên{" "}
              <strong className="text-[#0A78F3] font-bold bg-white px-2.5 py-0.5 rounded-lg border border-sky-200 shadow-2xs inline-block">
                khoa học giáo dục hành vi
              </strong>{" "}
              và{" "}
              <strong className="text-slate-900 font-bold bg-amber-100/90 text-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs inline-block mt-1 sm:mt-0">
                thực tế đề thi trung học cơ sở tại Đà Nẵng
              </strong>
            </p>
          </div>

          {/* 5 Vũ Khí Sư Phạm (Modern Tactile 2-Block Cards với 5 Màu Chủ Đạo Riêng Biệt) */}
          <div className="space-y-8 sm:space-y-10 pt-2 sm:pt-4">
            {WEAPONS_DATA.map((item) => (
              <div
                key={item.number}
                className="relative bg-slate-200/80 p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl border border-slate-300/90 shadow-[0_4px_24px_rgba(10,120,243,0.06)] hover:shadow-[0_14px_36px_rgba(10,120,243,0.14)] hover:border-sky-300/80 transition-all duration-300 group flex flex-col gap-1 sm:gap-1.5"
              >
                {/* ── KHỐI 1 (PHẦN TRÊN): VŨ KHÍ #, TIÊU ĐỀ & WATERMARK LÒI 20% RA NGOÀI PHÍA TRÊN ── */}
                <div className="relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs overflow-visible">
                  {/* Dải line màu nhận diện ôm cong theo 2 góc trên trái & phải, dày 2px (50% của h-1) */}
                  <div className={`absolute -top-px -left-px -right-px h-3.5 rounded-t-2xl border-t-2 border-x-2 border-b-0 ${item.colorConfig.topBorderColor} pointer-events-none`} />
                  
                  {/* Đốm sáng nền nhẹ */}
                  <div className={`absolute -top-10 -right-10 w-28 h-28 ${item.colorConfig.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                  {/* Số thứ tự chìm Watermark mờ: 20% nằm ngoài thẻ (phía trên), 80% nằm trong thẻ */}
                  <span
                    aria-hidden="true"
                    className={`absolute -top-8 sm:-top-11 md:-top-13 right-5 sm:right-8 font-heading font-black text-7xl sm:text-8xl md:text-[106px] ${item.colorConfig.watermark} select-none pointer-events-none tracking-tighter leading-none z-10 drop-shadow-xs`}
                  >
                    {item.number}
                  </span>

                  <div className="relative z-20 pr-0 sm:pr-28">
                    <span className={`uppercase text-xs sm:text-[13px] font-bold ${item.colorConfig.categoryText} tracking-wider block`}>
                      {item.category}
                    </span>
                    <h3 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-base sm:text-lg md:text-xl lg:text-[22px] leading-snug mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* ── KHỐI 2 (PHẦN DƯỚI): PHẦN CÒN LẠI (CÁC BƯỚC & 2 CALLOUTS) ── */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between">
                  {/* GIAO DIỆN PC: 4 BƯỚC NẰM NGANG CÓ MŨI TÊN KẾT NỐI VỚI SỐ THỨ TỰ NẰM TRÊN MÉP KHUNG */}
                  <div className="hidden md:flex items-center gap-3 pt-4">
                    {item.steps.map((st, idx) => (
                      <React.Fragment key={idx}>
                        <div className="relative flex-1 bg-slate-50/80 hover:bg-white border border-slate-200/80 rounded-2xl px-3.5 pt-5 pb-3.5 flex flex-col items-center text-center transition-all shadow-2xs min-h-[102px] justify-start group/step">
                          {/* Số thứ tự bước nằm 50% trong 50% ngoài mép trên */}
                          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${item.colorConfig.stepBadgeBg} text-white text-sm font-bold flex items-center justify-center shadow-md border-2 border-white`}>
                            {st.step}
                          </div>
                          <h4 className="font-heading font-bold text-slate-900 text-[14.5px] lg:text-[15.5px] leading-snug mt-1">
                            {st.title}
                          </h4>
                          <p className="font-body text-slate-600 text-[13px] lg:text-[14px] mt-1.5 leading-relaxed">
                            {st.desc}
                          </p>
                        </div>
                        {idx < item.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* GIAO DIỆN MOBILE: 4 BƯỚC TIMELINE DỌC CÓ ĐƯỜNG NỐI */}
                  <div className="flex md:hidden flex-col pl-1.5 pt-1">
                    {item.steps.map((st, idx) => (
                      <div key={idx} className="relative flex items-start gap-3.5 pb-4 last:pb-1">
                        {idx < item.steps.length - 1 && (
                          <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-slate-200" />
                        )}
                        <div className={`w-8 h-8 rounded-full ${item.colorConfig.stepBadgeBg} text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-xs z-10 border-2 border-white`}>
                          {st.step}
                        </div>
                        <div className="pt-0.5">
                          <h4 className="font-heading font-bold text-slate-900 text-base leading-snug">
                            {st.title}
                          </h4>
                          <p className="font-body text-slate-600 text-[15.5px] leading-relaxed mt-0.5">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* KHỐI CHÚ THÍCH DƯỚI (2 CALLOUTS VỚI TAG NẰM TRÊN MÉP KHUNG) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-4 mt-7 pt-2">
                    {/* Callout 1 (Hổ phách: Lời hỏi trong lớp của Cô Nghi - Đã bỏ vòng tròn đen CN) */}
                    <div className="relative bg-[#fffbeb] border border-amber-200/90 rounded-2xl p-4 sm:p-5 pt-5 sm:pt-6 shadow-2xs flex items-center">
                      {/* Tag nhãn nằm 50% trong 50% ngoài mép trên bên trái */}
                      <div className="absolute -top-3.5 left-4 sm:left-6 px-3.5 py-1 rounded-full bg-[#1e293b] text-white text-[11px] sm:text-xs font-bold tracking-wider shadow-sm border border-slate-700/50">
                        {item.calloutLabel}
                      </div>
                      
                      <p className="font-body text-slate-800 text-[15.5px] sm:text-[16.5px] font-medium leading-relaxed">
                        {item.calloutText}
                      </p>
                    </div>

                    {/* Callout 2 (Kết quả đầu ra - Màu theo chủ đề của từng thẻ) */}
                    <div className={`relative ${item.colorConfig.resultBoxBg} border ${item.colorConfig.resultBoxBorder} rounded-2xl p-4 sm:p-5 pt-5 sm:pt-6 shadow-2xs flex flex-col items-center justify-center text-center`}>
                      {/* Tag nhãn nằm 50% trong 50% ngoài mép trên */}
                      <div className={`absolute -top-3.5 left-4 sm:left-6 px-3.5 py-1 rounded-full ${item.colorConfig.resultBadgeBg} text-white text-[11px] sm:text-xs font-bold tracking-wider shadow-sm border border-white/40`}>
                        KẾT QUẢ
                      </div>

                      <p className={`font-heading font-extrabold uppercase ${item.colorConfig.resultText} text-[13.5px] sm:text-[15px] tracking-tight leading-snug`}>
                        {item.resultText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Chuyển tiếp Khối 3B */}
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

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 4: CHÂN DUNG NHÀ GIÁO DỤC & BẢO CHỨNG CHUYÊN MÔN (AUTHORITY & TRUST)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 border-t border-slate-200 bg-white bg-grid-pattern relative">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-8 sm:space-y-10">
            {/* Header Khối 4 */}
            <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0A78F3] border border-sky-200 shadow-xs text-xs sm:text-[13px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>Đồng hành cùng con</span>
              </div>

              <h2 className="font-heading uppercase tracking-tight text-center max-w-4xl mx-auto">
                <span className="block font-black text-slate-900 text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] leading-tight">
                  NGƯỜI <span className="text-[#0A78F3]">TRỰC TIẾP ĐỒNG HÀNH</span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-800 text-[16px] min-[390px]:text-[18px] sm:text-2xl md:text-[26px] lg:text-[29px] leading-tight mt-1 sm:mt-1.5">
                  <span className="text-[#C43838] font-black underline decoration-[#C43838]/40 decoration-2 underline-offset-4">CHỮA LÀNH TÂM LÝ HỌC TẬP</span> CHO CON<span className="hidden sm:inline"> LÀ AI?</span>
                </span>
              </h2>

              <p className="font-body text-slate-600 text-[15.5px] sm:text-base md:text-[17.5px] lg:text-[18px] leading-relaxed max-w-3xl mx-auto text-center">
                <span className="font-bold text-slate-800 underline decoration-slate-300 decoration-1 underline-offset-2">Không thông qua trợ giảng hay giáo viên thực tập</span>, <strong className="text-[#0A78F3] font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/80 shadow-2xs inline-block">Cô Nghi trực tiếp quan sát</strong> từng cử chỉ, biểu cảm và bài làm của từng học sinh trong suốt khóa học.
              </p>
            </div>

            {/* Bố cục 2 cột: Trái hình ảnh + Bằng cấp, Phải hồ sơ + Triết lý sư phạm */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Cột Trái (5/12): Khung ảnh & 3 Huy hiệu Chuyên môn */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-[0_16px_36px_rgba(0,0,0,0.12)] bg-slate-900 aspect-[3/4] max-w-md mx-auto group">
                  <img
                    src={teacherPhoto}
                    alt="Cô Nghi - Thạc sĩ TESOL Quốc tế"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-3 left-3 bg-[#2d3436]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Thạc sĩ TESOL</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-4 sm:p-5 pt-12 text-white flex flex-col gap-0.5">
                    <span className="text-xs sm:text-sm font-bold text-sky-300">
                      Founder &amp; Lead Educator
                    </span>
                    <span className="text-xs text-slate-200 font-medium">
                      Trạm Cứu Hộ Tiếng Anh Cấp 2
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-300">
                      866/25 Ngô Quyền, Sơn Trà
                    </span>
                  </div>
                </div>

                {/* 3 Thẻ Bảo Chứng Năng Lực Cột Trái (Tactile Debossed Well Cards) */}
                <div className="space-y-2.5 max-w-md mx-auto">
                  <div className="bg-[#d1d9e6]/70 border border-[#babecc]/60 rounded-2xl px-3.5 py-3 flex items-center gap-3 shadow-[var(--shadow-recessed-sm)]">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#0A78F3] flex items-center justify-center shrink-0 shadow-xs border border-sky-100 font-black text-xs sm:text-sm">
                      8.17
                    </div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      Cử nhân biên dịch Tiếng Anh
                    </h4>
                  </div>

                  <div className="bg-[#d1d9e6]/70 border border-[#babecc]/60 rounded-2xl px-3.5 py-3 flex items-center gap-3 shadow-[var(--shadow-recessed-sm)]">
                    <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      Thạc sĩ TESOL quốc tế
                    </h4>
                  </div>

                  <div className="bg-[#d1d9e6]/70 border border-[#babecc]/60 rounded-2xl px-3.5 py-3 flex items-center gap-3 shadow-[var(--shadow-recessed-sm)]">
                    <div className="w-9 h-9 rounded-xl bg-white text-rose-500 flex items-center justify-center shrink-0 shadow-xs border border-rose-100">
                      <Heart className="w-5 h-5 fill-rose-50 text-rose-500" />
                    </div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      Sáng lập dự án Hopepath Academy
                    </h4>
                  </div>
                </div>
              </div>

              {/* Cột Phải (7/12): Chi tiết Triết lý & Năng lực */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-4">
                  {/* Header Tiêu đề (Không nền, không viền + đường line màu xanh bên dưới) */}
                  <div className="space-y-1">
                    <span className="block text-xs sm:text-[13px] font-bold text-[#0A78F3] tracking-normal">
                      Hồ sơ năng lực &amp; tâm huyết sư phạm
                    </span>
                    <h3 className="font-heading font-black text-xl min-[390px]:text-2xl sm:text-3xl text-slate-900 leading-tight uppercase tracking-tight">
                      CÔ NGUYỄN THỊ PHƯƠNG NGHI
                    </h3>
                    {/* Đường line màu xanh có độ dài vừa phải đặt ngay dưới chân text */}
                    <div className="pt-2">
                      <div className="w-20 sm:w-24 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-[#0A78F3] to-sky-400" />
                    </div>
                  </div>

                  {/* Timeline 3 đoạn văn theo UI mẫu (không thêm số thứ tự 1, 2, 3) */}
                  <div className="relative pl-7 sm:pl-8 space-y-6 sm:space-y-7 pt-2">
                    {/* Đường line chạy dọc bên trái xuyên qua tâm các điểm mốc */}
                    <div className="absolute left-[9px] top-2.5 bottom-2.5 w-0.5 bg-slate-200" />

                    {/* Mốc 1: Nền tảng học thuật */}
                    <div className="relative space-y-1.5">
                      <div className="absolute -left-7 sm:-left-8 top-0.5 w-5 h-5 rounded-full border-2 border-sky-300 bg-white flex items-center justify-center shadow-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0A78F3]" />
                      </div>
                      <h4
                        className="font-heading font-black text-xs sm:text-[13.5px] uppercase tracking-wider text-[#0A78F3]"
                        style={{ color: "#0A78F3" }}
                      >
                        NỀN TẢNG HỌC THUẬT
                      </h4>
                      <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                        Sở hữu nền tảng học thuật xuất sắc khi tốt nghiệp Cử nhân chuyên ngành Biên dịch Tiếng Anh với điểm trung bình tích lũy{" "}
                        <span className="bg-sky-50 text-[#0A78F3] font-bold px-1.5 py-0.5 rounded border border-sky-200/80 text-xs sm:text-sm inline-block">
                          GPA 8.17/10
                        </span>{" "}
                        – nền tảng cốt lõi giúp Cô Nghi xây dựng kỹ thuật{" "}
                        <strong className="text-[#0A78F3] font-bold">&ldquo;Dịch bắt buộc&rdquo;</strong>{" "}
                        và{" "}
                        <strong className="text-[#0A78F3] font-bold">&ldquo;Bóc tách cấu trúc&rdquo;</strong>{" "}
                        sắc bén cho học sinh phổ thông.
                      </p>
                    </div>

                    {/* Mốc 2: Đào tạo sau đại học */}
                    <div className="relative space-y-1.5">
                      <div className="absolute -left-7 sm:-left-8 top-0.5 w-5 h-5 rounded-full border-2 border-emerald-300 bg-white flex items-center justify-center shadow-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" style={{ backgroundColor: "#059669" }} />
                      </div>
                      <h4
                        className="font-heading font-black text-xs sm:text-[13.5px] uppercase tracking-wider text-[#059669]"
                        style={{ color: "#059669" }}
                      >
                        ĐÀO TẠO SAU ĐẠI HỌC
                      </h4>
                      <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                        Ở bậc đào tạo sau đại học, Cô Nghi theo đuổi chương trình{" "}
                        <strong className="text-[#0A78F3] font-bold">Thạc sĩ TESOL</strong>{" "}
                        (Teaching English to Speakers of Other Languages), nghiên cứu chuyên sâu về ngôn ngữ học ứng dụng, tâm lý học hành vi lứa tuổi thiếu niên và khoa học thiết kế giáo trình cá nhân hoá cho học sinh mất gốc.
                      </p>
                    </div>

                    {/* Mốc 3: Tâm huyết ngoài chuyên môn */}
                    <div className="relative space-y-1.5">
                      <div className="absolute -left-7 sm:-left-8 top-0.5 w-5 h-5 rounded-full border-2 border-rose-300 bg-white flex items-center justify-center shadow-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff4757]" style={{ backgroundColor: "#ff4757" }} />
                      </div>
                      <h4
                        className="font-heading font-black text-xs sm:text-[13.5px] uppercase tracking-wider text-[#ff4757]"
                        style={{ color: "#ff4757" }}
                      >
                        TÂM HUYẾT NGOÀI CHUYÊN MÔN
                      </h4>
                      <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed">
                        Bên cạnh năng lực chuyên môn, với vai trò là{" "}
                        <strong className="text-[#0A78F3] font-bold">Nhà sáng lập (Founder)</strong>{" "}
                        dự án giáo dục thiện nguyện{" "}
                        <strong className="text-[#0A78F3] font-bold">Hopepath Academy</strong>
                        , Cô Nghi mang trọn vẹn sự kiên nhẫn, lòng yêu thương và sự thấu cảm vào từng tiết học.
                      </p>
                    </div>
                  </div>
                </div>

                {/* KHỐI TRIẾT LÝ SƯ PHẠM (2-Block Recessed Well Box theo style USPS Hero - vỏ ngoài trong mờ tinh tế) */}
                <div className="relative mt-7 bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2">
                  {/* ── KHỐI 1: TRIẾT LÝ GIÁO DỤC ── */}
                  <div className="relative bg-white/95 rounded-2xl p-4 sm:p-6 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                    {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                    <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-6 inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-[#ff4757] text-white shadow-xs border border-white/30 z-10">
                      <Quote className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                      <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                        Triết Lý Giáo Dục Của Cô Nghi
                      </span>
                    </div>

                    <p className="font-body text-[15.5px] sm:text-[16.5px] text-[#1a1a1a] leading-relaxed italic font-medium">
                      &ldquo;Trước khi dạy chữ, người thầy phải <strong className="text-[#ff4757] font-bold not-italic">xoa dịu được tâm trí đang tổn thương và tự ti</strong> của đứa trẻ. Một học sinh cấp 2 bị điểm 4 <strong className="text-slate-900 font-bold not-italic">không phải vì em kém cỏi</strong>, mà vì em chưa từng được ai <strong className="text-[#0A78F3] font-bold not-italic bg-sky-50/80 px-1.5 py-0.5 rounded border border-sky-200/60">kiên nhẫn ngồi xuống chỉ cho cách bóc tách</strong> một câu tiếng Anh từ gốc rễ.&rdquo;
                    </p>
                  </div>

                  {/* ── KHỐI 2: 3 NGUYÊN TẮC BẤT DI BẤT DỊCH TẠI LỚP HỌC ── */}
                  <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs">
                    <p className="font-body text-xs sm:text-sm font-bold text-[#ff4757] uppercase tracking-wide">
                      3 NGUYÊN TẮC BẤT DI BẤT DỊCH TẠI LỚP HỌC:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 mt-4">
                      <div className="relative bg-[#f8fafc] rounded-xl pt-4 pb-2.5 px-2.5 border border-slate-200/80 text-center shadow-2xs">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#ff4757] text-white text-[11px] font-black flex items-center justify-center shadow-xs border-2 border-white">
                          1
                        </div>
                        <span className="block text-xs font-bold text-slate-800">
                          Tuyệt đối không la mắng
                        </span>
                      </div>
                      <div className="relative bg-[#f8fafc] rounded-xl pt-4 pb-2.5 px-2.5 border border-slate-200/80 text-center shadow-2xs">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0A78F3] text-white text-[11px] font-black flex items-center justify-center shadow-xs border-2 border-white">
                          2
                        </div>
                        <span className="block text-xs font-bold text-slate-800">
                          Không bỏ rơi học sinh nào
                        </span>
                      </div>
                      <div className="relative bg-[#f8fafc] rounded-xl pt-4 pb-2.5 px-2.5 border border-slate-200/80 text-center shadow-2xs">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center shadow-xs border-2 border-white">
                          3
                        </div>
                        <span className="block text-xs font-bold text-slate-800">
                          Kiên trì sửa từng lỗi nhỏ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Phụ */}
                <div className="pt-2 flex items-center">
                  <button
                    type="button"
                    onClick={handleOpenRegisterModal}
                    className="w-full sm:w-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer active:scale-98"
                  >
                    <div className="flex flex-col items-center text-center leading-snug min-w-0">
                      <span className="font-heading font-extrabold text-[10.5px] min-[360px]:text-[11.5px] min-[390px]:text-[12.5px] sm:text-sm uppercase tracking-tight sm:tracking-wider whitespace-nowrap">
                        GẶP CÔ NGHI TRONG PHIÊN CHẨN ĐOÁN 1-1 MIỄN PHÍ
                      </span>
                      <span className="font-body text-[9.5px] min-[360px]:text-[10px] min-[390px]:text-[11px] sm:text-xs font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                        Nhận lộ trình học tập cá nhân hoá &amp; bộ sổ tay ma thuật
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 5: BẢN ĐỒ CHUYỂN ĐỔI 90 NGÀY & CÁC GÓI LỘ TRÌNH ĐÀO TẠO (ROADMAP & GRAND SLAM OFFERS)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-[#eef3f9] bg-grid-pattern relative border-t border-slate-200">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-10 sm:space-y-12">
            {/* Header Khối 5 đồng bộ chuẩn Section 'Đồng hành cùng con' */}
            <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0A78F3] border border-sky-200 shadow-xs text-xs sm:text-[13px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>Lộ trình đo lường thực tế</span>
              </div>

              <h2 className="font-heading uppercase tracking-tight text-center max-w-4xl mx-auto">
                <span className="block font-black text-slate-900 text-[21px] min-[390px]:text-[23px] sm:text-3xl md:text-4xl lg:text-[38px] leading-tight">
                  BẢN ĐỒ CHUYỂN ĐỔI <span className="text-[#0A78F3]">CỦA CON</span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-800 text-[16px] min-[390px]:text-[18px] sm:text-2xl md:text-[26px] lg:text-[29px] leading-tight mt-1 sm:mt-1.5">
                  THEO <span className="text-[#ff4757] font-black underline decoration-[#ff4757]/40 decoration-2 underline-offset-4">TỪNG CỘT MỐC ĐO LƯỜNG</span> THỜI GIAN CỤ THỂ
                </span>
              </h2>

              <p className="font-body text-slate-600 text-[15.5px] sm:text-base md:text-[17.5px] lg:text-[18px] leading-relaxed max-w-3xl mx-auto text-center">
                Phụ huynh <span className="font-bold text-slate-800">không cần phải chờ đợi mơ hồ hàng năm trời</span>. <strong className="text-[#0A78F3] font-bold">Lộ trình 03 tháng</strong> tại Lớp Tiếng Anh Cô Nghi được thiết lập với <strong className="text-[#ff4757] font-bold">chỉ số đo lường thực tế</strong> rõ ràng qua từng chặng:
              </p>
            </div>

            {/* TIMELINE 3 CỘT MỐC: MOBILE SÁT LỀ TRÁI, PC BỐ TRÍ SO LE 2 BÊN VỚI ĐƯỜNG LINE Ở GIỮA */}
            <div className="relative w-full max-w-5xl lg:max-w-6xl mx-auto py-4">
              {/* Đường line dọc: Mobile nằm sát lề trái, PC nằm chính giữa */}
              <div className="absolute left-2 sm:left-2.5 md:left-1/2 top-6 bottom-6 -translate-x-1/2 w-0.5 md:w-1 bg-gradient-to-b from-[#0A78F3] via-emerald-500 to-[#ff4757] rounded-full opacity-60 pointer-events-none z-0" />

              {/* CỘT MỐC 1 (MOBILE: SÁT LỀ TRÁI / PC: BÊN TRÁI ĐƯỜNG LINE) */}
              <div className="relative flex items-start w-full">
                {/* Điểm mốc tròn: Mobile ở lề trái (left-2), PC ở chính giữa (md:left-1/2) */}
                <div className="absolute left-2 sm:left-2.5 md:left-1/2 top-7 sm:top-8 -translate-x-1/2 w-4 h-4 md:w-7 md:h-7 rounded-full bg-white border border-[#0A78F3] md:border-2 shadow-sm md:shadow-md flex items-center justify-center z-20">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#0A78F3] shadow-xs" />
                </div>

                {/* Box cột mốc 1 */}
                <div className="w-full pl-6 sm:pl-8 md:pl-0 md:w-[calc(50%-2rem)] md:mr-auto z-10">
                  <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg">
                    {/* ── KHỐI 1 (TRÊN): HEADER CỘT MỐC & TAG NỔI KHỐI ── */}
                    <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                      <div className="absolute -top-3.5 left-4 sm:left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0A78F3] text-white shadow-xs border border-white/30 z-10">
                        <span className="font-heading font-extrabold text-[10.5px] sm:text-xs uppercase tracking-wider">
                          CỘT MỐC 01
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-slate-900 leading-snug">
                        Sau 1 tuần đầu tiên
                      </h3>

                      <div className="pt-2">
                        <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#0A78F3] to-sky-400" />
                      </div>
                    </div>

                    {/* ── KHỐI 2 (DƯỚI): NỘI DUNG CHI TIẾT & KẾT QUẢ ĐẦU RA ── */}
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="flex flex-col gap-3.5 font-body text-[15px] sm:text-[16px] leading-relaxed">
                        {/* Hộp Thái độ & Tâm lý */}
                        <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 shadow-2xs">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide inline-block">
                              Thái độ &amp; tâm lý học tập
                            </span>
                            <div className="w-8 h-0.5 rounded-full bg-slate-400 mt-1" />
                          </div>
                          <p className="text-slate-700">
                            Phá băng hoàn toàn cảm giác sợ hãi và chống đối; con <strong className="text-slate-900 font-bold">hào hứng đi học</strong> mà không cần bố mẹ giục giã hay càu nhàu.
                          </p>
                        </div>

                        {/* Hộp Bứt phá học thuật */}
                        <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/80 shadow-2xs">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-[#0A78F3] uppercase tracking-wide inline-block">
                              Bứt phá học thuật
                            </span>
                            <div className="w-8 h-0.5 rounded-full bg-[#0A78F3] mt-1" />
                          </div>
                          <p className="text-slate-700">
                            Chủ động tham gia trò chơi Quizizz và tích lũy ngay <strong className="text-[#0A78F3] font-bold">15–20% chặng đường đổi quà lớn</strong> nhờ điểm thưởng Kickstart Bonus trong cuốn sổ 100 Tokens.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#0A78F3] font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Xoá bỏ rào cản sợ môn Tiếng Anh</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT MỐC 2 (MOBILE: SÁT LỀ TRÁI / PC: BÊN PHẢI ĐƯỜNG LINE, BẮT ĐẦU Ở 1/3 DƯỚI BOX 1) */}
              <div className="relative flex items-start w-full mt-6 sm:mt-8 md:-mt-24 lg:-mt-28">
                {/* Điểm mốc tròn: Mobile ở lề trái (left-2), PC ở chính giữa (md:left-1/2) */}
                <div className="absolute left-2 sm:left-2.5 md:left-1/2 top-7 sm:top-8 -translate-x-1/2 w-4 h-4 md:w-7 md:h-7 rounded-full bg-white border border-emerald-500 md:border-2 shadow-sm md:shadow-md flex items-center justify-center z-20">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-600 shadow-xs" />
                </div>

                {/* Box cột mốc 2 */}
                <div className="w-full pl-6 sm:pl-8 md:pl-0 md:w-[calc(50%-2rem)] md:ml-auto z-10">
                  <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg">
                    {/* ── KHỐI 1 (TRÊN): HEADER CỘT MỐC & TAG NỔI KHỐI ── */}
                    <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                      <div className="absolute -top-3.5 left-4 sm:left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white shadow-xs border border-white/30 z-10">
                        <span className="font-heading font-extrabold text-[10.5px] sm:text-xs uppercase tracking-wider">
                          CỘT MỐC 02
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-slate-900 leading-snug">
                        Sau 1 tháng đầu tiên
                      </h3>

                      <div className="pt-2">
                        <div className="w-14 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                      </div>
                    </div>

                    {/* ── KHỐI 2 (DƯỚI): NỘI DUNG CHI TIẾT & KẾT QUẢ ĐẦU RA ── */}
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="flex flex-col gap-3.5 font-body text-[15px] sm:text-[16px] leading-relaxed">
                        <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 shadow-2xs">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide inline-block">
                              Thái độ &amp; tâm lý học tập
                            </span>
                            <div className="w-8 h-0.5 rounded-full bg-slate-400 mt-1" />
                          </div>
                          <p className="text-slate-700">
                            Con <strong className="text-slate-900 font-bold">tự giác hoàn thành bài tập</strong> về nhà và tự ôn từ vựng theo phương pháp lặp lại ngắt quãng (Spaced Repetition) mỗi tối.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide inline-block">
                              Bứt phá học thuật
                            </span>
                            <div className="w-8 h-0.5 rounded-full bg-emerald-600 mt-1" />
                          </div>
                          <p className="text-slate-700">
                            Chuẩn hóa phát âm IPA, biết bật âm cuối; thuộc lòng <strong className="text-emerald-700 font-bold">80–90% từ vựng cốt lõi</strong> các Unit trên trường; hiểu rõ bản chất ngữ pháp.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Xây dựng thói quen tự giác mỗi tối</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT MỐC 3 (MOBILE: SÁT LỀ TRÁI / PC: BÊN TRÁI ĐƯỜNG LINE, BẮT ĐẦU Ở 1/3 DƯỚI BOX 2) */}
              <div className="relative flex items-start w-full mt-6 sm:mt-8 md:-mt-24 lg:-mt-28">
                {/* Điểm mốc tròn: Mobile ở lề trái (left-2), PC ở chính giữa (md:left-1/2) */}
                <div className="absolute left-2 sm:left-2.5 md:left-1/2 top-7 sm:top-8 -translate-x-1/2 w-4 h-4 md:w-7 md:h-7 rounded-full bg-white border border-[#ff4757] md:border-2 shadow-sm md:shadow-md flex items-center justify-center z-20">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#ff4757] shadow-xs" />
                </div>

                {/* Box cột mốc 3 */}
                <div className="w-full pl-6 sm:pl-8 md:pl-0 md:w-[calc(50%-2rem)] md:mr-auto z-10">
                  <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border-2 border-[#ff4757]/60 shadow-[0_10px_30px_rgba(255,71,87,0.12)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-xl">
                    {/* ── KHỐI 1 (TRÊN): HEADER CỘT MỐC & TAG NỔI KHỐI ── */}
                    <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                      <div className="absolute -top-3.5 left-4 sm:left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ff4757] text-white shadow-xs border border-white/30 z-10">
                        <Flame className="w-3 h-3 fill-white" />
                        <span className="font-heading font-extrabold text-[10.5px] sm:text-xs uppercase tracking-wider">
                          CỘT MỐC VÀNG 03
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-slate-900 leading-snug">
                        Sau 3 tháng (90 ngày)
                      </h3>

                      <div className="pt-2">
                        <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#ff4757] to-amber-500" />
                      </div>
                    </div>

                    {/* ── KHỐI 2 (DƯỚI): NỘI DUNG CHI TIẾT & KẾT QUẢ ĐẦU RA ── */}
                    <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between space-y-3.5">
                      <div className="flex flex-col gap-3.5 font-body text-[15px] sm:text-[16px] leading-relaxed">
                        <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 shadow-2xs">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide inline-block">
                              Thái độ &amp; tâm lý học tập
                            </span>
                            <div className="w-8 h-0.5 rounded-full bg-slate-400 mt-1" />
                          </div>
                          <p className="text-slate-700">
                            Hình thành <strong className="text-slate-900 font-bold">sự tự tin vững chắc</strong>, chủ động giơ tay phát biểu trên lớp và hoàn toàn làm chủ áp lực phòng thi.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 shadow-2xs">
                          <div className="mb-2">
                            <span className="text-xs font-bold text-[#ff4757] uppercase tracking-wide inline-block">
                              Bứt phá học thuật
                            </span>
                            <div className="w-8 h-0.5 rounded-full bg-[#ff4757] mt-1" />
                          </div>
                          <p className="text-slate-700">
                            <strong className="text-[#ff4757] font-bold">Tăng từ 1,0 đến 3,0 điểm</strong> bài kiểm tra định kỳ; tăng 30% độ chính xác dạng bài vận dụng; dịch trôi chảy đọc hiểu dài không cần đoán mò.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-rose-100 flex items-center gap-1.5 text-xs text-[#ff4757] font-bold">
                        <CheckCircle2 className="w-4 h-4 text-[#ff4757] shrink-0" />
                        <span>Bứt phá điểm số thi giữa kỳ, cuối kỳ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CTA BUTTON CHÈN GIỮA SECTION (ĐỒNG BỘ CHUẨN SECTION 'ĐỒNG HÀNH CÙNG CON') ── */}
            <div className="flex flex-col items-center justify-center pt-2 sm:pt-4">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3.5 group cursor-pointer border-none outline-none active:scale-98"
              >
                <div className="flex flex-col items-center text-center leading-snug min-w-0">
                  <span className="font-heading font-extrabold text-[11px] min-[360px]:text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                    ĐĂNG KÝ ĐÁNH GIÁ HỌC LỰC 1-1 MIỄN PHÍ
                  </span>
                  <span className="font-body text-[9.5px] min-[360px]:text-[10px] min-[390px]:text-[11px] sm:text-xs font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                    Thiết kế phác đồ học tập cá nhân hoá cùng Thạc sĩ TESOL
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 5B: HỌC PHÍ MINH BẠCH · TRỌN GÓI 90 NGÀY (PRICING & GRAND SLAM OFFERS)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-[#e0e5ec] bg-grid-pattern relative border-t border-slate-300/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-8 sm:space-y-10 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#0A78F3] border border-sky-200 shadow-xs text-xs sm:text-[13px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>Học phí minh bạch</span>
              </div>

              <h3 className="font-heading uppercase tracking-tight text-center max-w-3xl mx-auto">
                <span className="block font-black text-slate-900 text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-[34px] leading-tight">
                  LỰA CHỌN <span className="text-[#0A78F3]">LỘ TRÌNH ĐÀO TẠO</span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-800 text-[15px] min-[390px]:text-[17px] sm:text-xl md:text-[23px] leading-tight mt-1 sm:mt-1.5">
                  PHÙ HỢP CHO <span className="text-[#ff4757] font-black underline decoration-[#ff4757]/40 decoration-2 underline-offset-4">TỪNG KHỐI LỚP</span> CỦA CON
                </span>
              </h3>

              <p className="font-body text-slate-600 text-[15.5px] sm:text-base md:text-[17px] leading-relaxed max-w-2xl mx-auto text-center">
                <strong className="text-slate-900 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs inline-block">Trọn gói 3 tháng</strong> – <strong className="text-[#ff4757] font-bold">Cam kết minh bạch tuyệt đối</strong>, không phát sinh bất kỳ khoản phụ phí nào.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* ── GÓI 1: SMALL WIN BLUEPRINT (LỚP 6, 7, 8) THEO 2-BLOCK RECESSED WELL CARD ── */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2">
                {/* ── KHỐI 1 (TRÊN): HEADER & HỌC PHÍ ── */}
                <div className="relative bg-white/95 rounded-2xl p-5 sm:p-6 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  <div className="absolute -top-3.5 left-4 sm:left-6 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0A78F3] text-white text-[11px] sm:text-xs font-heading font-extrabold uppercase tracking-wider shadow-xs border border-white/30 z-10">
                    <span>DÀNH CHO LỚP 6 – 7 – 8</span>
                  </div>

                  <div className="hidden sm:block absolute -top-3 right-4 sm:right-6 bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 text-xs font-bold shadow-2xs">
                    Sĩ số: Tối đa 12 em
                  </div>

                  <h4 className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-tight mt-1">
                    GÓI 1: &ldquo;SMALL WIN BLUEPRINT&rdquo;
                  </h4>
                  <p
                    className="text-[11.5px] min-[360px]:text-[12.5px] min-[390px]:text-[13.5px] sm:text-base font-extrabold uppercase tracking-tight sm:tracking-wide mt-1 !text-[#0A78F3] whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ color: "#0A78F3" }}
                  >
                    Tái Thiết Căn Bản &amp; Xoá Mất Gốc Cấp 2
                  </p>
                  <div className="w-14 h-1 rounded-full bg-[#0A78F3] mt-2 mb-1" style={{ backgroundColor: "#0A78F3" }} />

                  {/* Hộp Học Phí (Chỉ text, không background xám, không viền) */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight">
                        600.000
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-bold text-slate-600 uppercase">
                        VNĐ / tháng
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 font-medium">
                      Học phí 3 tháng: <span className="font-bold text-slate-900">1.600.000 VNĐ</span>
                    </p>
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): NỘI DUNG & VALUE STACK ── */}
                <div className="bg-white/95 rounded-2xl p-5 sm:p-6 border border-white/80 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    {/* Mục Tiêu & Thời Lượng */}
                    <div className="space-y-2.5 font-body text-[15.5px] sm:text-[16.5px] leading-relaxed">
                      <div className="flex items-start gap-2.5 text-slate-700">
                        <Target className="w-5 h-5 text-[#0A78F3] shrink-0 mt-0.5" />
                        <span><strong className="text-slate-900 font-bold">Mục tiêu:</strong> Trị dứt điểm mất gốc SGK Global Success / Friends Plus, xóa bệnh khoanh lụi, tăng 1.0 – 3.0 điểm trên trường.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-slate-700">
                        <Calendar className="w-5 h-5 text-[#0A78F3] shrink-0 mt-0.5" />
                        <span><strong className="text-slate-900 font-bold">Thời lượng:</strong> 90 ngày (24 buổi học, 2 buổi/tuần, 90 phút/buổi).</span>
                      </div>
                    </div>

                    {/* Nội Dung Đào Tạo Cốt Lõi */}
                    <div className="space-y-2.5 pt-3.5 border-t-2 border-slate-200">
                      <span className="text-xs sm:text-sm uppercase font-extrabold tracking-wider text-slate-800 block">
                        Nội Dung Đào Tạo Cốt Lõi:
                      </span>
                      <ul className="space-y-2 font-body text-[15.5px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                        <li className="flex items-start gap-2.5">
                          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Chuẩn hóa phát âm IPA, trọng âm &amp; từ vựng Spaced Repetition.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Ngữ pháp trong ngữ cảnh &amp; kỹ thuật Bóc tách 4 bước – Dịch bắt buộc.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Sửa chi tiết 100% đề cương ôn tập các trường THCS tại Sơn Trà.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Value Stack Bonuses */}
                    <div className="space-y-2.5 pt-3.5 border-t-2 border-slate-200">
                      <span className="text-xs sm:text-sm uppercase font-extrabold tracking-wider text-[#0A78F3] block">
                        🎁 Trọn Bộ 4 Đặc Quyền Giá Trị Đi Kèm:
                      </span>
                      <div className="space-y-2.5 font-body text-[15.5px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100">
                          <strong>Bonus 1:</strong> Tài khoản VIP Hệ thống LMS báo cáo Zalo tự động mỗi tối lúc 20h00.
                        </div>
                        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100">
                          <strong>Bonus 2:</strong> Kênh Zalo SOS 1:1 giải bài tập khó buổi tối ở nhà cùng cô giáo.
                        </div>
                        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100">
                          <strong>Bonus 3:</strong> &ldquo;Kho vũ khí&rdquo; Ngân hàng đề thi THCS Sơn Trà + Bộ Speaking &amp; Writing.
                        </div>
                        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100">
                          <strong>Bonus 4:</strong> Sổ tích điểm &ldquo;100 Tokens&rdquo; + Bộ dụng cụ học tập/Balo in logo.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút Đăng Ký Gói 1 */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleOpenRegisterModal}
                      className="w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-2xl bg-[#0A78F3] hover:bg-[#096ad8] text-white font-heading font-extrabold text-[10.5px] min-[360px]:text-[11.5px] min-[390px]:text-xs sm:text-sm uppercase tracking-tight sm:tracking-wider shadow-[0_8px_20px_rgba(10,120,243,0.35)] hover:shadow-[0_12px_28px_rgba(10,120,243,0.45)] transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 border-none outline-none"
                    >
                      <span className="whitespace-nowrap">ĐĂNG KÝ TEST 1-1 &amp; GIỮ CHỖ GÓI LỚP 6 – 8</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── GÓI 2: PRE-GRADE 10 SPRINT (LỚP 9) THEO 2-BLOCK RECESSED WELL CARD ── */}
              <div className="relative bg-[#ff4757]/10 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border-2 border-[#ff4757]/60 shadow-[0_10px_30px_rgba(255,71,87,0.12)] flex flex-col gap-1.5 sm:gap-2">
                {/* ── KHỐI 1 (TRÊN): HEADER & HỌC PHÍ ── */}
                <div className="relative bg-white/95 rounded-2xl p-5 sm:p-6 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  <div className="absolute -top-3.5 left-4 sm:left-6 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ff4757] text-white text-[11px] sm:text-xs font-heading font-extrabold uppercase tracking-wider shadow-xs border border-white/30 z-10">
                    <span>CHUYÊN BIỆT LỚP 9</span>
                  </div>

                  <div className="hidden sm:flex absolute -top-3.5 right-4 sm:right-6 bg-[#ff4757] text-white text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm items-center gap-1 border border-white/30">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>MỤC TIÊU VÀO 10 CÔNG LẬP</span>
                  </div>

                  <h4 className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-tight mt-1">
                    GÓI 2: &ldquo;PRE-GRADE 10 SPRINT&rdquo;
                  </h4>
                  <p
                    className="text-[11.5px] min-[360px]:text-[12.5px] min-[390px]:text-[13.5px] sm:text-base font-extrabold uppercase tracking-tight sm:tracking-wide mt-1 !text-[#ff4757] whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ color: "#ff4757" }}
                  >
                    Tăng Tốc Luyện Thi Vào Lớp 10 Công Lập
                  </p>
                  <div className="w-14 h-1 rounded-full bg-[#ff4757] mt-2 mb-1" style={{ backgroundColor: "#ff4757" }} />

                  {/* Hộp Học Phí (Chỉ text, không background xám, không viền) */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight">
                        800.000
                      </span>
                      <span className="text-sm sm:text-base md:text-lg font-bold text-slate-600 uppercase">
                        VNĐ / tháng
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 font-medium">
                      Học phí 3 tháng: <span className="font-bold text-slate-900">2.100.000 VNĐ</span>
                    </p>
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): NỘI DUNG & VALUE STACK ── */}
                <div className="bg-white/95 rounded-2xl p-5 sm:p-6 border border-white/80 shadow-xs flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    {/* Mục Tiêu & Thời Lượng */}
                    <div className="space-y-2.5 font-body text-[15.5px] sm:text-[16.5px] leading-relaxed">
                      <div className="flex items-start gap-2.5 text-slate-700">
                        <Target className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" />
                        <span><strong className="text-slate-900 font-bold">Mục tiêu:</strong> Làm chủ ma trận 36 câu Sở GD&amp;ĐT Đà Nẵng, nắm chắc tối thiểu 70% phổ điểm để đỗ THPT Công lập.</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-slate-700">
                        <Calendar className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" />
                        <span><strong className="text-slate-900 font-bold">Thời lượng:</strong> 90 ngày (24 buổi học, 2 buổi/tuần, 90 phút/buổi).</span>
                      </div>
                    </div>

                    {/* Nội Dung Đào Tạo 3 Tháng Lớp 9 */}
                    <div className="space-y-2.5 pt-3.5 border-t-2 border-slate-200">
                      <span className="text-xs sm:text-sm uppercase font-extrabold tracking-wider text-slate-800 block">
                        Lộ Trình Đào Tạo Thực Chiến 3 Tháng:
                      </span>
                      <ul className="space-y-2 font-body text-[15.5px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                        <li className="flex items-start gap-2.5">
                          <Check className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" />
                          <span><strong className="text-slate-900 font-bold">Tháng 1:</strong> Hệ thống hóa ngữ pháp cốt lõi &amp; kỹ thuật Dịch bắt buộc.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Check className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" />
                          <span><strong className="text-slate-900 font-bold">Tháng 2:</strong> Trị dứt điểm Word Form, Verb Tense &amp; Viết lại câu.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <Check className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" />
                          <span><strong className="text-slate-900 font-bold">Tháng 3:</strong> Luyện đề thực chiến 36 câu chuẩn Sở GD&amp;ĐT Đà Nẵng.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Value Stack Bonuses Gói 2 */}
                    <div className="space-y-2.5 pt-3.5 border-t-2 border-slate-200">
                      <span className="text-xs sm:text-sm uppercase font-extrabold tracking-wider text-[#ff4757] block">
                        🔥 Trọn Bộ Đặc Quyền VIP + 2 Quà Tặng Độc Quyền Lớp 9:
                      </span>
                      <div className="space-y-2.5 font-body text-[15.5px] sm:text-[16.5px] text-slate-700 leading-relaxed">
                        <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200">
                          <strong>Bonus 1–4:</strong> Đầy đủ quyền lợi LMS Zalo 20h, Zalo SOS 1:1, Kho đề thi &amp; Sổ 100 Tokens.
                        </div>
                        <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950">
                          <strong className="text-[#ff4757]">🔥 Đặc quyền Lớp 9 (1):</strong> 3 Buổi Thi thử Thực tế (Mock Tests) mô phỏng 100% áp lực phòng thi thật kèm phân tích lỗ hổng 1-1.
                        </div>
                        <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950">
                          <strong className="text-[#ff4757]">🔥 Đặc quyền Lớp 9 (2):</strong> Cẩm nang Tránh bẫy – Tổng hợp 100 lỗi sai chí mạng học sinh Đà Nẵng hay mất điểm oan.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút Đăng Ký Gói 2 */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleOpenRegisterModal}
                      className="w-full py-3 sm:py-3.5 px-3 sm:px-4 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white font-heading font-extrabold text-[10.5px] min-[360px]:text-[11.5px] min-[390px]:text-xs sm:text-sm uppercase tracking-tight sm:tracking-wider shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 border-none outline-none"
                    >
                      <span className="whitespace-nowrap">ĐĂNG KÝ TEST 1-1 &amp; GIỮ CHỖ GÓI LỚP 9</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── BĂNG RÔN NỔI BẬT: TRẠI ÔN THI CẤP TỐC 14 NGÀY (THEO UI MẪU ĐÍNH KÈM) ── */}
            <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-[#0f172a] text-white border-2 border-amber-500 shadow-[0_16px_40px_rgba(0,0,0,0.25)] relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* ── CỘT TRÁI (7/12): THÔNG TIN CHƯƠNG TRÌNH, CHECKLIST & TAGS TRƯỜNG THCS ── */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
                  <div>
                    {/* Badge Pill viền vàng: Chỉ viết hoa chữ cái đầu tiên */}
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-amber-500/90 bg-amber-950/40 text-amber-400 text-xs sm:text-[13.5px] font-heading font-extrabold tracking-wide">
                      Chương trình đặc biệt ngắn hạn
                    </div>

                    {/* Tiêu đề chính: Dòng 1 'TRẠI ÔN THI CẤP TỐC', Dòng 2 '14 NGÀY' */}
                    <h4
                      className="font-heading font-black uppercase tracking-tight text-white mt-3 sm:mt-4 flex flex-col"
                      style={{ fontSize: "clamp(26px, 4.2vw, 50px)", lineHeight: 1.15 }}
                    >
                      <span>TRẠI ÔN THI CẤP TỐC</span>
                      <span className="text-[#f59e0b] font-black drop-shadow-md">
                        14 NGÀY
                      </span>
                    </h4>

                    {/* Subtitle: Thu nhỏ lại làm phụ đề tinh tế */}
                    <p
                      className="font-heading font-bold uppercase tracking-wider text-slate-200 mt-1.5 sm:mt-2"
                      style={{ fontSize: "clamp(13px, 1.6vw, 18px)" }}
                    >
                      GỠ ĐIỂM GIỮA KỲ / CUỐI KỲ
                    </p>

                    {/* Checklist 2 dòng */}
                    <ul className="space-y-2 mt-4 text-white text-[15px] sm:text-base font-medium font-body">
                      <li className="flex items-center gap-2.5">
                        <span className="font-bold text-white text-base leading-none">✓</span>
                        <span>Khoanh vùng kiến thức trọng tâm</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="font-bold text-white text-base leading-none">✓</span>
                        <span>Bóc tách từng câu trong đề cương thực tế</span>
                      </li>
                    </ul>
                  </div>

                  {/* Đề cương thực tế từ các trường THCS: Chữ màu trắng + đường line ngắn dưới chân */}
                  <div className="pt-2">
                    <span className="text-xs sm:text-[13px] font-heading font-extrabold tracking-wider uppercase text-white block">
                      ĐỀ CƯƠNG THỰC TẾ TỪ CÁC TRƯỜNG THCS
                    </span>
                    <div className="w-12 h-1 rounded-full bg-amber-400 mt-2 mb-3" style={{ backgroundColor: "#f59e0b" }} />
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      {["Lê Độ", "Nguyễn Chí Thanh", "Phạm Ngọc Thạch", "Phan Bội Châu", "Lý Tự Trọng", "Ngô Quyền", "..."].map((school, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-white text-xs sm:text-sm font-semibold shadow-xs"
                        >
                          {school}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── CỘT PHẢI (5/12): THẺ VÀNG GIÁ ƯU ĐÃI & HỘP CAM KẾT XANH LÁ (CĂN TỪ DƯỚI, KHÔNG KÉO GIÃN) ── */}
                <div className="lg:col-span-5 flex flex-col justify-end gap-3.5 sm:gap-4">
                  {/* Card Vàng Chi Phí Ưu Đãi: Chiều cao tự nhiên, không bị giãn */}
                  <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-[#f59e0b] text-slate-950 flex flex-col shadow-md">
                    <div>
                      <span className="font-heading font-extrabold text-xs sm:text-[13px] tracking-wider uppercase text-slate-950 block">
                        CHI PHÍ ƯU ĐÃI - TRỌN KHÓA
                      </span>
                      <div className="font-heading font-black text-4xl sm:text-[44px] text-slate-950 mt-2 sm:mt-2.5 leading-none tracking-tight">
                        285.000đ
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenRegisterModal}
                      className="w-full mt-4 sm:mt-5 py-3 sm:py-3.5 px-4 rounded-2xl bg-[#111827] hover:bg-black text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border-none outline-none"
                    >
                      <span>ĐĂNG KÝ NGAY</span>
                      <span className="text-base font-bold leading-none">→</span>
                    </button>
                  </div>

                  {/* Hộp Cam Kết Xanh Lá: Size text đồng bộ body text sale page ([15.5px] sm:[16.5px]) */}
                  <div className="relative mt-2 rounded-2xl bg-[#064e3b]/30 border border-emerald-500/80 p-4 pt-5 sm:p-5 sm:pt-5.5 shadow-xs">
                    <div className="absolute -top-3.5 left-4 sm:left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] sm:text-xs font-bold tracking-wide shadow-sm border border-emerald-400/50">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Cam kết đặc biệt</span>
                    </div>
                    <p className="font-body text-[15.5px] sm:text-[16.5px] text-emerald-100 font-medium leading-relaxed">
                      Hoàn tiền 100% nếu điểm thi của con không tăng từ 1,5 – 3,0 điểm!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 6: BẰNG CHỨNG XÃ HỘI & CÂU CHUYỆN CHUYỂN ĐỔI THỰC TẾ (SOCIAL PROOF & CASE STUDIES)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-white bg-grid-pattern relative border-t border-slate-200">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-10 sm:space-y-12">
            {/* Header Khối 6 đồng bộ chuẩn Section 'Đồng hành cùng con' */}
            <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs text-xs sm:text-[13px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Người thật · việc thật · kết quả thật</span>
              </div>

              <h2 className="font-heading uppercase tracking-tight text-center max-w-4xl mx-auto">
                <span className="block font-black text-slate-900 text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] leading-tight">
                  NHỮNG <span className="text-[#0A78F3]">&ldquo;CHIẾN THẮNG NHỎ&rdquo;</span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-800 text-[16px] min-[390px]:text-[18px] sm:text-2xl md:text-[26px] lg:text-[29px] leading-tight mt-1 sm:mt-1.5">
                  TẠO NÊN <span className="text-[#ff4757] font-black underline decoration-[#ff4757]/40 decoration-2 underline-offset-4">BƯỚC NHẢY VỌT LỚN</span> TỪ HỌC SINH TẠI SƠN TRÀ
                </span>
              </h2>

              <p className="font-body text-slate-600 text-[15.5px] sm:text-base md:text-[17.5px] lg:text-[18px] leading-relaxed max-w-3xl mx-auto text-center">
                <span className="font-bold text-slate-800 underline decoration-slate-300 decoration-1 underline-offset-2">Minh chứng thực tế từ học sinh</span> từng bế tắc, sợ hãi môn Tiếng Anh đã lấy lại tự tin và <strong className="text-[#ff4757] font-bold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200/80 shadow-2xs inline-block">bứt phá từ 2.5 – 3.5 điểm</strong> sau khi được <strong className="text-[#0A78F3] font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/80 shadow-2xs inline-block">Cô Nghi trực tiếp kèm sát 1-1</strong>:
              </p>
            </div>

            {/* 2 CASE STUDIES CHI TIẾT THEO 2-BLOCK RECESSED WELL CARD VÀ DESIGN SYSTEM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* ── CASE STUDY 1: EM HÂN (LỚP 7 TẠI SƠN TRÀ) ── */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg">
                {/* ── KHỐI 1 (TRÊN): SCORE TRANSFORMATION FLOW & CASE STUDY HEADER THEO MOCKUP ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Tag nổi khối 50% trong 50% ngoài theo mockup */}
                  <div className="absolute -top-3.5 left-4 sm:left-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#117a55] text-white shadow-xs border border-white/30 z-10">
                    <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                      CASE STUDY #01 · LỚP 7 SƠN TRÀ
                    </span>
                  </div>

                  {/* Flow Điểm số biến đổi theo mockup */}
                  <div className="flex items-center justify-between gap-2 sm:gap-4 pt-1">
                    {/* Box điểm bắt đầu */}
                    <div className="w-[84px] min-[390px]:w-24 sm:w-28 py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl border-2 border-amber-400 bg-white flex flex-col items-center justify-center shrink-0 shadow-2xs">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#0f2444] leading-tight">
                        6.0
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                        Giữa kỳ
                      </span>
                    </div>

                    {/* Mũi tên chuyển đổi */}
                    <div className="flex-1 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 text-amber-500 stroke-[2.5] shrink-0" />
                    </div>

                    {/* Box điểm đạt được (Đỏ sậm) */}
                    <div className="w-[84px] min-[390px]:w-24 sm:w-28 py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-[#780d15] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                      <span className="text-2xl sm:text-3xl font-black font-mono leading-none text-white">
                        8.5
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-white/95 mt-1 whitespace-nowrap">
                        Cuối kỳ I
                      </span>
                    </div>
                  </div>

                  {/* Headline theo mockup */}
                  <h3 className="text-base sm:text-lg font-bold text-[#0f2d59] leading-snug mt-4 sm:mt-5 text-left">
                    Từ 6.0 Giữa kỳ vọt lên 8.5 Cuối kỳ I
                  </h3>

                  {/* Đường kẻ ngang separator */}
                  <div className="w-full h-px bg-slate-200/80 mt-2 mb-3 sm:mb-3.5" />

                  {/* Metadata trường học & đồng hành */}
                  <div className="space-y-1.5 text-xs sm:text-sm text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#556987] font-medium">Trường:</span>
                      <strong className="text-[#0f2444] font-bold">THCS Sơn Trà</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#556987] font-medium">Đồng hành:</span>
                      <strong className="text-[#0f2444] font-bold">Cô Nghi</strong>
                    </div>
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): NỘI DUNG 3 BƯỚC BÓC TÁCH THỰC TẾ ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="flex flex-col gap-3 font-body text-[15px] sm:text-[16px] leading-relaxed">
                    {/* Sub-box 1: Trạng thái trước khi học */}
                    <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 shadow-2xs">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-rose-700 uppercase tracking-wide inline-flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          Trạng thái trước khi học
                        </span>
                        <div className="w-8 h-0.5 rounded-full bg-rose-400 mt-1" />
                      </div>
                      <p className="text-slate-700">
                        Điểm Giữa kỳ I dừng ở <strong className="text-slate-900 font-bold">6,0 điểm</strong>. Trên lớp luôn thu mình vì sợ bị gọi trả bài, sợ phát âm sai và thường xuyên <strong className="text-rose-700 font-bold">quên từ vựng ngay sau khi học</strong>.
                      </p>
                    </div>

                    {/* Sub-box 2: Phác đồ can thiệp */}
                    <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/80 shadow-2xs">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-[#0A78F3] uppercase tracking-wide inline-flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#0A78F3]" />
                          Phác đồ can thiệp vi mô tại lớp
                        </span>
                        <div className="w-8 h-0.5 rounded-full bg-[#0A78F3] mt-1" />
                      </div>
                      <p className="text-slate-700">
                        Ôn luyện từ vựng bóc tách kết hợp <strong className="text-[#0A78F3] font-bold">lặp lại ngắt quãng (Spaced Repetition)</strong> qua Quizizz, kiên nhẫn sửa chi tiết từng câu trong đề cương trường và luyện nghe chuyên sâu <strong className="text-slate-900 font-bold">không hề trách phạt khi làm sai</strong>.
                      </p>
                    </div>

                    {/* Sub-box 3: Kết quả điểm số & Tâm lý */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Kết quả điểm số &amp; Tâm lý
                        </span>
                        <div className="w-8 h-0.5 rounded-full bg-emerald-600 mt-1" />
                      </div>
                      <p className="text-slate-800 italic font-medium">
                        &ldquo;Con sướng nhất vì ở lớp cô không bị la khi làm sai, được chơi game tích Token và hiểu bài từ gốc&rdquo; — Ba mẹ <strong className="text-emerald-800 font-bold not-italic">giải tỏa hoàn toàn áp lực</strong> canh con học mỗi tối.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tăng vọt +2.5 điểm thi cuối kỳ I</span>
                  </div>
                </div>
              </div>

              {/* ── CASE STUDY 2: EM VIỆT (HỌC VIÊN PHỔ THÔNG MỞ RỘNG) ── */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg">
                {/* ── KHỐI 1 (TRÊN): SCORE TRANSFORMATION FLOW & CASE STUDY HEADER THEO MOCKUP ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Tag nổi khối 50% trong 50% ngoài theo mockup */}
                  <div className="absolute -top-3.5 left-4 sm:left-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#117a55] text-white shadow-xs border border-white/30 z-10">
                    <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                      CASE STUDY #02 · BỨT PHÁ 9.0 ĐIỂM
                    </span>
                  </div>

                  {/* Flow Điểm số biến đổi theo mockup */}
                  <div className="flex items-center justify-between gap-2 sm:gap-4 pt-1">
                    {/* Box điểm bắt đầu */}
                    <div className="w-[84px] min-[390px]:w-24 sm:w-28 py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl border-2 border-amber-400 bg-white flex flex-col items-center justify-center shrink-0 shadow-2xs">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#0f2444] leading-tight">
                        5.5
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                        Giữa kỳ
                      </span>
                    </div>

                    {/* Mũi tên chuyển đổi */}
                    <div className="flex-1 flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 text-amber-500 stroke-[2.5] shrink-0" />
                    </div>

                    {/* Box điểm đạt được (Đỏ sậm) */}
                    <div className="w-[84px] min-[390px]:w-24 sm:w-28 py-2.5 sm:py-3 px-2 rounded-xl sm:rounded-2xl bg-[#780d15] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                      <span className="text-2xl sm:text-3xl font-black font-mono leading-none text-white">
                        9.0
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-white/95 mt-1 whitespace-nowrap">
                        Cuối kỳ
                      </span>
                    </div>
                  </div>

                  {/* Headline theo mockup */}
                  <h3 className="text-base sm:text-lg font-bold text-[#0f2d59] leading-snug mt-4 sm:mt-5 text-left">
                    Bứt phá ngoạn mục từ 5.5 lên 9.0 điểm
                  </h3>

                  {/* Đường kẻ ngang separator */}
                  <div className="w-full h-px bg-slate-200/80 mt-2 mb-3 sm:mb-3.5" />

                  {/* Metadata trường học & đồng hành */}
                  <div className="space-y-1.5 text-xs sm:text-sm text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#556987] font-medium">Trường:</span>
                      <strong className="text-[#0f2444] font-bold">THCS tại Đà Nẵng</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#556987] font-medium">Đồng hành:</span>
                      <strong className="text-[#0f2444] font-bold">Cô Nghi</strong>
                    </div>
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): NỘI DUNG 3 BƯỚC BÓC TÁCH THỰC TẾ ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="flex flex-col gap-3 font-body text-[15px] sm:text-[16px] leading-relaxed">
                    {/* Sub-box 1: Trạng thái trước khi học */}
                    <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/80 shadow-2xs">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-rose-700 uppercase tracking-wide inline-flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          Trạng thái trước khi học
                        </span>
                        <div className="w-8 h-0.5 rounded-full bg-rose-400 mt-1" />
                      </div>
                      <p className="text-slate-700">
                        Điểm Giữa kỳ dừng ở <strong className="text-slate-900 font-bold">5,5 điểm</strong> do hổng nền tảng ngữ pháp và thường xuyên <strong className="text-rose-700 font-bold">sập bẫy các câu phân hóa</strong> và biến đổi từ loại Word Form.
                      </p>
                    </div>

                    {/* Sub-box 2: Phác đồ can thiệp */}
                    <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200/80 shadow-2xs">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-[#0A78F3] uppercase tracking-wide inline-flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#0A78F3]" />
                          Phác đồ can thiệp vi mô tại lớp
                        </span>
                        <div className="w-8 h-0.5 rounded-full bg-[#0A78F3] mt-1" />
                      </div>
                      <p className="text-slate-700">
                        Qua phiên chẩn đoán 1-1, Cô Nghi khoanh vùng chính xác những <strong className="text-[#0A78F3] font-bold">&ldquo;mắt xích bị gãy&rdquo;</strong>, áp dụng kỹ thuật <strong className="text-[#0A78F3] font-bold">&ldquo;Dịch bắt buộc&rdquo;</strong> và sửa trực tiếp từng câu trong đề cương ôn tập.
                      </p>
                    </div>

                    {/* Sub-box 3: Kết quả điểm số & Năng lực */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 shadow-2xs">
                      <div className="mb-2">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Kết quả điểm số &amp; Năng lực
                        </span>
                        <div className="w-8 h-0.5 rounded-full bg-emerald-600 mt-1" />
                      </div>
                      <p className="text-slate-800 italic font-medium">
                        Kỳ thi Cuối kỳ ngay sau đó đạt <strong className="text-emerald-800 font-bold not-italic">9,0 điểm (+3,5 điểm)</strong> – Minh chứng đanh thép cho tốc độ bứt phá khi học sinh được <strong className="text-slate-900 font-bold not-italic">bắt đúng bệnh và kèm 1-1</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bứt phá ngoạn mục +3.5 điểm thi</span>
                  </div>
                </div>
              </div>
            </div>


            {/* BẰNG CHỨNG XÃ HỘI: FEEDBACK ZALO (SLIDESHOW HÌNH ẢNH CÓ NHÃN TREO) */}
            <div className="relative bg-[#2d3436] rounded-3xl p-5 sm:p-8 pt-7 sm:pt-9 text-white space-y-6 shadow-xl border border-slate-700/80 overflow-visible">
              {/* 1. Nhãn treo ở ngay đường borderline phía trên */}
              <div className="absolute -top-3.5 left-4 sm:left-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff4757] text-white shadow-md border border-white/30 z-20">
                <MessageCircle className="w-4 h-4 text-white shrink-0" />
                <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                  Tin Nhắn Phụ Huynh Báo Điểm &amp; Cảm Ơn
                </span>
              </div>

              {/* Chi tiết ốc vít kỹ thuật ở các góc theo AGENTS.md */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-slate-600 shadow-inner pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-slate-600 shadow-inner pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-slate-600 shadow-inner pointer-events-none" />

              {/* 4. Slideshow hình ảnh feedback Zalo */}
              <div className="relative pt-1 sm:pt-2">
                {/* Khung Slide Container - Trong suốt, không còn background đen thừa */}
                <div
                  className="relative overflow-hidden rounded-2xl bg-transparent border-0 p-0 sm:py-2 select-none"
                  onMouseEnter={() => setIsFeedbackPaused(true)}
                  onMouseLeave={() => setIsFeedbackPaused(false)}
                  onTouchStart={handleFeedbackTouchStart}
                  onTouchMove={handleFeedbackTouchMove}
                  onTouchEnd={handleFeedbackTouchEnd}
                  style={{ touchAction: "pan-y" }}
                >
                  <div
                    className={`flex items-center ${isFeedbackTransitionEnabled ? "transition-transform duration-700 ease-in-out" : ""}`}
                    style={{
                      transform: isDesktop
                        ? `translateX(-${feedbackSlideIndex * (100 / 3)}%)`
                        : `translateX(calc(9% - ${feedbackSlideIndex * 82}%))`,
                    }}
                    onTransitionEnd={handleFeedbackTransitionEnd}
                  >
                    {infiniteFeedbackSlides.map((item, itemIdx) => {
                      return (
                        <div
                          key={item.cloneKey || `fb-${itemIdx}`}
                          className="shrink-0 w-[82%] sm:w-[86%] md:w-1/3 px-2 sm:px-2.5"
                        >
                          <div className="scale-100 opacity-100 shadow-xl rounded-2xl">
                            {item.image ? (
                              <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-white aspect-[1000/1131] w-full shadow-lg group">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  loading="eager"
                                  decoding="async"
                                  draggable={false}
                                  className="w-full h-full object-cover object-top select-none block"
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    if (!img.dataset.fallback) {
                                      img.dataset.fallback = "1";
                                      img.src = `/image/Feedback-${item.id}.webp`;
                                    } else if (img.dataset.fallback === "1") {
                                      img.dataset.fallback = "2";
                                      img.src = `/image/Feedback ${item.id}.webp`;
                                    }
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-700 hover:border-slate-500 bg-slate-900/60 p-5 aspect-[1000/1131] flex flex-col items-center justify-center text-center transition-all group shadow-inner">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-[#ff4757] mb-3 shadow-md group-hover:scale-105 transition-transform">
                                  <Camera className="w-6 h-6 sm:w-7 sm:h-7" />
                                </div>
                                <span className="font-heading font-bold text-xs sm:text-sm text-slate-200 uppercase tracking-wide">
                                  {item.title}
                                </span>
                                <span className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-[190px] leading-relaxed">
                                  Vị trí hình ảnh chụp màn hình Zalo sẽ hiển thị tại đây
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Thanh điều khiển Slide: Nút Prev / Next & Chấm tròn Dots */}
                <div className="flex items-center justify-between pt-3.5 px-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevFeedback}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-[#ff4757] border border-slate-600 hover:border-[#ff4757] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNextFeedback(true)}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-[#ff4757] border border-slate-600 hover:border-[#ff4757] text-white flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                      aria-label="Ảnh tiếp theo"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Chấm tròn định vị slide (5 dots tương ứng 5 ảnh) */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {FEEDBACK_SLIDES.map((_, idx) => {
                      const activeDot = ((feedbackSlideIndex % FEEDBACK_SLIDES.length) + FEEDBACK_SLIDES.length) % FEEDBACK_SLIDES.length;
                      const isDotActive = activeDot === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            triggerPauseOnInteraction();
                            setIsFeedbackTransitionEnabled(true);
                            setFeedbackSlideIndex(10 + idx);
                          }}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            isDotActive
                              ? "w-6 bg-[#ff4757]"
                              : "w-2 bg-slate-600 hover:bg-slate-500"
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Nút CTA Button bên dưới box Tin Nhắn Phụ Huynh */}
            <div className="flex flex-col items-center justify-center pt-2 sm:pt-4">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-3.5 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3.5 group cursor-pointer border-none outline-none active:scale-98"
              >
                <div className="flex flex-col items-center text-center leading-snug min-w-0">
                  <span className="font-heading font-extrabold text-[11px] min-[360px]:text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                    ĐĂNG KÝ NGAY ĐỂ CON ĐẠT KẾT QUẢ NHƯ TRÊN
                  </span>
                  <span className="font-body text-[9.5px] min-[360px]:text-[10px] min-[390px]:text-[11px] sm:text-xs font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                    Nhận phác đồ bóc tách lỗ hổng &amp; bộ sổ tay ma thuật miễn phí
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 7: CHÍNH SÁCH BẢO HIỂM HỌC TẬP 2 LỚP – ĐẢO NGƯỢC RỦI RO TUYỆT ĐỐI (HYPER-RISK REVERSAL)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-[#eef3f9] bg-grid-pattern relative border-t border-slate-200">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-8 sm:space-y-10">
            {/* Header Khối 7 đồng bộ chuẩn Section 'Đồng hành cùng con' */}
            <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0A78F3] border border-sky-200 shadow-xs text-xs sm:text-[13px] font-bold normal-case">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>Cam kết bằng văn bản</span>
              </div>

              <h2 className="font-heading uppercase tracking-tight text-center max-w-4xl mx-auto">
                <span className="block font-black text-slate-900 text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] leading-tight">
                  <span className="block sm:inline">BẢO HIỂM HỌC TẬP 2 LỚP</span>{" "}
                  <span className="block sm:inline">
                    – <span className="text-[#0A78F3]">RỦI RO BẰNG 0</span>
                  </span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-800 text-[16px] min-[390px]:text-[18px] sm:text-2xl md:text-[26px] lg:text-[29px] leading-tight mt-1 sm:mt-1.5">
                  ĐẶT TOÀN BỘ <span className="text-[#C43838] font-black underline decoration-[#C43838]/40 decoration-2 underline-offset-4">TRÁCH NHIỆM VÀ HIỆU QUẢ</span> LÊN VAI NGƯỜI DẠY
                </span>
              </h2>

              <p className="font-body text-slate-600 text-[15.5px] sm:text-base md:text-[17.5px] lg:text-[18px] leading-relaxed max-w-3xl mx-auto text-center">
                <span className="font-bold text-slate-800 underline decoration-slate-300 decoration-1 underline-offset-2">Thấu hiểu tâm lý e ngại của phụ huynh</span> từng mất niềm tin vào các lớp học thêm đại trà, <strong className="text-[#0A78F3] font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/80 shadow-2xs inline-block">Lớp Tiếng Anh Cô Nghi thiết lập cơ chế bảo hiểm minh bạch bằng văn bản</strong>, cam kết <strong className="text-[#ff4757] font-bold">hoàn 100% học phí</strong> và <strong className="text-[#ff4757] font-bold">dạy kèm 1-1 miễn phí</strong> đến khi con tiến bộ vượt bậc!
              </p>
            </div>

            {/* 2 KHỐI BẢO HIỂM LỚN (2-BLOCK TACTILE RECESSED WELL THEO CHUẨN ĐỒNG HÀNH CÙNG CON) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* LỚP BẢO HIỂM 1 */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg">
                {/* ── KHỐI 1 (TRÊN): TIÊU ĐỀ, BADGE NỔI & MÔ TẢ ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-6 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                  <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-6 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-emerald-600 text-white shadow-xs border border-white/30 z-10">
                    <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                      LỚP BẢO HIỂM 01
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-snug mt-2">
                    CAM KẾT THÁI ĐỘ &amp; TÂM LÝ HỌC TẬP
                  </h3>

                  {/* Đường line màu xanh có độ dài vừa phải đặt ngay dưới chân text */}
                  <div className="pt-2 pb-1">
                    <div className="w-20 sm:w-24 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                  </div>

                  <p className="font-body text-[15.5px] sm:text-[16.5px] text-[#1a1a1a] leading-relaxed mt-2 font-normal">
                    Nếu sau <strong className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80">1 tuần đầu tiên</strong> trải nghiệm phương pháp Small Win và môi trường lớp học, con vẫn giữ tâm lý sợ hãi Tiếng Anh, cảm thấy <strong className="text-slate-900 font-bold">không phù hợp</strong> hoặc <strong className="text-slate-900 font-bold">không chủ động muốn đi học tiếp</strong>:
                  </p>
                </div>

                {/* ── KHỐI 2 (DƯỚI): CAM KẾT HOÀN PHÍ & CTA TRỰC TIẾP ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between gap-4">
                  <div className="bg-[#d1d9e6]/70 border border-[#babecc]/60 rounded-2xl p-3.5 sm:p-4 shadow-[var(--shadow-recessed-sm)] text-center space-y-1.5">
                    <p className="font-heading font-extrabold text-base sm:text-lg text-emerald-800 uppercase tracking-tight">
                      CÔ NGHI CAM KẾT HOÀN TRẢ 100% HỌC PHÍ NGAY LẬP TỨC
                    </p>
                    <span className="font-body text-[14.5px] sm:text-[15.5px] md:text-[16px] text-slate-600 font-medium block leading-relaxed">
                      (Không hỏi thêm bất kỳ lý do nào – Hoàn toàn tôn trọng và nâng niu cảm xúc của con)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-body text-[15px] sm:text-[16px] text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Trải nghiệm không rủi ro</span>
                  </div>

                  {/* CTA Button trực tiếp cho Card 1 */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleOpenRegisterModal}
                      className="w-full px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <div className="flex flex-col items-center text-center leading-snug min-w-0">
                        <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-tight sm:tracking-wider whitespace-nowrap">
                          ĐĂNG KÝ HỌC THỬ – HOÀN PHÍ 100%
                        </span>
                        <span className="font-body text-[9.5px] sm:text-[11px] font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                          Trải nghiệm phương pháp Small Win không áp lực
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

              {/* LỚP BẢO HIỂM 2 */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg">
                {/* ── KHỐI 1 (TRÊN): TIÊU ĐỀ, BADGE NỔI & MÔ TẢ ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-6 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                  <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-6 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-[#ff4757] text-white shadow-xs border border-white/30 z-10">
                    <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                      LỚP BẢO HIỂM 02
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-snug mt-2">
                    CAM KẾT ĐIỂM SỐ &amp; NĂNG LỰC ĐẦU RA
                  </h3>

                  {/* Đường line màu đỏ có độ dài vừa phải đặt ngay dưới chân text */}
                  <div className="pt-2 pb-1">
                    <div className="w-20 sm:w-24 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-[#ff4757] to-rose-400" />
                  </div>

                  <p className="font-body text-[15.5px] sm:text-[16.5px] text-[#1a1a1a] leading-relaxed mt-2 font-normal">
                    Cam kết con bứt phá từ <strong className="text-[#C43838] font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/80">1,5 đến 3,0 điểm</strong> trong các kỳ kiểm tra chính khóa trên trường. Nếu sau 3 tháng điểm số của con chưa đạt mốc tăng trưởng theo đúng phác đồ:
                  </p>
                </div>

                {/* ── KHỐI 2 (DƯỚI): CAM KẾT DẠY PHỤ ĐẠO 1-1 & CTA TRỰC TIẾP ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between gap-4">
                  <div className="bg-[#d1d9e6]/70 border border-[#babecc]/60 rounded-2xl p-3.5 sm:p-4 shadow-[var(--shadow-recessed-sm)] text-center space-y-1.5">
                    <p className="font-heading font-extrabold text-base sm:text-lg text-[#ff4757] uppercase tracking-tight">
                      TRỰC TIẾP DẠY PHỤ ĐẠO 1 KÈM 1 MIỄN PHÍ NGOÀI GIỜ
                    </p>
                    <span className="font-body text-[14.5px] sm:text-[15.5px] md:text-[16px] text-slate-600 font-medium block leading-relaxed">
                      (Dạy kèm riêng đến khi con đạt điểm số mong muốn, hoặc hoàn trả 100% học phí tháng cuối)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-body text-[15px] sm:text-[16px] text-[#ff4757] font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#ff4757] shrink-0" />
                    <span>Trách nhiệm với sự tiến bộ của con</span>
                  </div>

                  {/* CTA Button trực tiếp cho Card 2 */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleOpenRegisterModal}
                      className="w-full px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <div className="flex flex-col items-center text-center leading-snug min-w-0">
                        <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-tight sm:tracking-wider whitespace-nowrap">
                          KÍCH HOẠT CAM KẾT BỨT PHÁ 1.5–3 ĐIỂM
                        </span>
                        <span className="font-body text-[9.5px] sm:text-[11px] font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                          Kèm riêng 1-1 miễn phí ngoài giờ đến khi đạt mục tiêu
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hộp Điều Kiện Áp Dụng Minh Bạch Theo Chuẩn 'Đồng hành cùng con' */}
            <div className="relative w-full bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2">
              <div className="relative bg-white/95 rounded-2xl p-5 sm:p-6 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                {/* Nhãn floating ở trên */}
                <div className="absolute -top-3.5 left-4 sm:left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2d3436] text-white shadow-xs border border-white/30 z-10">
                  <FileCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                    Điều kiện áp dụng minh bạch
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-2">
                  <div className="relative bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/80 flex items-start gap-3 shadow-2xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-50 text-[#0A78F3] border border-sky-200 flex items-center justify-center shrink-0 font-bold text-sm sm:text-base">
                      01
                    </div>
                    <p className="font-body text-[14.5px] sm:text-[15.5px] md:text-[16px] text-slate-700 leading-relaxed">
                      Tham gia <strong className="text-slate-900 font-bold">tối thiểu 90%</strong> số buổi học chính khóa.
                    </p>
                  </div>

                  <div className="relative bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/80 flex items-start gap-3 shadow-2xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 font-bold text-sm sm:text-base">
                      02
                    </div>
                    <p className="font-body text-[14.5px] sm:text-[15.5px] md:text-[16px] text-slate-700 leading-relaxed">
                      Hoàn thành <strong className="text-slate-900 font-bold">đầy đủ bài tập</strong> &amp; tương tác theo hướng dẫn.
                    </p>
                  </div>

                  <div className="relative bg-[#f8fafc] rounded-xl p-3.5 sm:p-4 border border-slate-200/80 flex items-start gap-3 shadow-2xs">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-[#ff4757] border border-rose-200 flex items-center justify-center shrink-0 font-bold text-sm sm:text-base">
                      03
                    </div>
                    <p className="font-body text-[14.5px] sm:text-[15.5px] md:text-[16px] text-slate-700 leading-relaxed">
                      Cung cấp <strong className="text-slate-900 font-bold">bảng điểm gần nhất</strong> để đối chiếu tăng trưởng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Tổng Kết Khối 7 Đồng Bộ Chuẩn Thiết Kế */}
            <div className="pt-2 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] transition-all flex items-center justify-center gap-2.5 sm:gap-3.5 cursor-pointer active:scale-98"
              >
                <div className="flex flex-col items-center text-center leading-snug min-w-0">
                  <span className="font-heading font-extrabold text-xs min-[390px]:text-sm sm:text-base uppercase tracking-tight sm:tracking-wider whitespace-nowrap">
                    ĐĂNG KÝ ĐÁNH GIÁ HỌC LỰC 1-1 MIỄN PHÍ
                  </span>
                  <span className="font-body text-[10px] sm:text-xs font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                    Thiết kế phác đồ học tập cá nhân hoá cùng Thạc sĩ TESOL
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 8: ĐẶC QUYỀN KHI ĐĂNG KÝ PHIÊN CHẨN ĐOÁN NĂNG LỰC 1-1 HÔM NAY (LEAD MAGNET STACK)
            ĐỒNG BỘ TIÊU CHUẨN NGÔN NGỮ THIẾT KẾ & UI SECTION 'ĐỒNG HÀNH CÙNG CON'
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-white bg-grid-pattern relative border-t border-slate-200">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-10 sm:space-y-12">
            {/* Header Khối 8 đồng bộ chuẩn Section 'Đồng hành cùng con' */}
            <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0A78F3] border border-sky-200 shadow-xs text-xs sm:text-[13px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>Trọn bộ 4 quà tặng đồng hành</span>
              </div>

              <h2 className="font-heading uppercase tracking-tight text-center max-w-4xl mx-auto">
                <span className="block font-black text-slate-900 text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] leading-tight">
                  ĐẶT LỊCH TEST 1-1 <span className="text-[#0A78F3]">MIỄN PHÍ 100%</span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-800 text-[16px] min-[390px]:text-[18px] sm:text-2xl md:text-[26px] lg:text-[29px] leading-tight mt-1 sm:mt-1.5">
                  NHẬN NGAY <span className="text-[#C43838] font-black underline decoration-[#C43838]/40 decoration-2 underline-offset-4">TRỌN BỘ 4 QUÀ TẶNG</span> ĐỒNG HÀNH ĐỘC QUYỀN
                </span>
              </h2>

              <p className="font-body text-slate-600 text-[15.5px] sm:text-base md:text-[17.5px] lg:text-[18px] leading-relaxed max-w-3xl mx-auto text-center">
                <span className="font-bold text-slate-800 underline decoration-slate-300 decoration-1 underline-offset-2">Trước khi đóng bất kỳ khoản học phí nào</span>, ba mẹ hãy đưa con đến <strong className="text-[#0A78F3] font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/80 shadow-2xs inline-block">866/25 Ngô Quyền, Sơn Trà</strong> tham gia <strong className="text-slate-900 font-bold">Phiên chẩn đoán năng lực 1-1 (45 phút)</strong> trực tiếp cùng Cô Nghi. Dù gia đình có quyết định học ngay hay chưa, con và mẹ vẫn được <strong className="text-[#ff4757] font-bold">TẶNG TRỌN BỘ 4 QUÀ TẶNG HOÀN TOÀN MIỄN PHÍ</strong>:
              </p>
            </div>

            {/* 4 HỘP QUÀ TẶNG (2-BLOCK TACTILE RECESSED WELL THEO CHUẨN ĐỒNG HÀNH CÙNG CON - 2 HÀNG x 2 CỘT FULL WIDTH TRÊN PC) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full">
              {/* Quà 1: Diagnostic Report */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* ── KHỐI 1 (TRÊN): Icon, Badge nổi, Giá trị & Tiêu đề ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                  <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-5 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-[#0A78F3] text-white shadow-xs border border-white/30 z-10">
                    <FileText className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="font-heading font-extrabold text-[10px] sm:text-[11px] tracking-wider">
                      Quà tặng 01
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 text-[#0A78F3] flex items-center justify-center border border-sky-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#0A78F3] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs">
                      Trị giá 500.000đ
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base sm:text-[17px] text-slate-900 leading-snug mt-3">
                    Bản phác đồ &ldquo;Bắt bệnh &amp; lộ trình cá nhân hóa&rdquo;
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold italic mt-0.5 block">
                    (Diagnostic Report)
                  </span>

                  {/* Đường line màu nhận diện dưới tiêu đề */}
                  <div className="pt-2">
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#0A78F3] to-sky-400" />
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): Nội dung mô tả & Footer badge dập chìm ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between">
                  <p className="font-body text-[15px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                    Chỉ rõ chính xác từng <strong className="text-[#0A78F3] font-bold">mắt xích kiến thức bị gãy</strong> của con từ các lớp dưới và thiết lập <strong className="text-slate-900 font-semibold">lộ trình 3 bước khắc phục</strong> cụ thể.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#0A78F3] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Độc quyền sau buổi test 1-1</span>
                  </div>
                </div>
              </div>

              {/* Quà 2: Bộ Sổ Tay Ma Thuật */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* ── KHỐI 1 (TRÊN): Icon, Badge nổi, Giá trị & Tiêu đề ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                  <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-5 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-purple-700 text-white shadow-xs border border-white/30 z-10">
                    <BookOpen className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="font-heading font-extrabold text-[10px] sm:text-[11px] tracking-wider">
                      Quà tặng 02
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700 flex items-center justify-center border border-purple-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs">
                      Trị giá 350.000đ
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base sm:text-[17px] text-slate-900 leading-snug mt-3">
                    Bộ &ldquo;Sổ tay ma thuật&rdquo; lớp 6–9
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold italic mt-0.5 block">
                    (Magic Book Infographic &amp; Video)
                  </span>

                  {/* Đường line màu nhận diện dưới tiêu đề */}
                  <div className="pt-2">
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-purple-600 to-violet-400" />
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): Nội dung mô tả & Footer badge dập chìm ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between">
                  <p className="font-body text-[15px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                    Sơ đồ tư duy tóm gọn <strong className="text-[#0A78F3] font-bold">80% ngữ pháp cốt lõi</strong> &amp; <strong className="text-slate-900 font-semibold">100 từ vựng trọng tâm SGK</strong>, kèm <strong className="text-purple-700 font-bold">3 Video tránh bẫy Word Form</strong>.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-purple-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Mẹ dễ kiểm tra bài con ở nhà</span>
                  </div>
                </div>
              </div>

              {/* Quà 3: Bộ Cứu Thương SOS */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* ── KHỐI 1 (TRÊN): Icon, Badge nổi, Giá trị & Tiêu đề ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                  <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-5 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-[#ff4757] text-white shadow-xs border border-white/30 z-10">
                    <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="font-heading font-extrabold text-[10px] sm:text-[11px] tracking-wider">
                      Quà tặng 03
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-red-50 text-[#ff4757] flex items-center justify-center border border-rose-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#ff4757] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shadow-2xs">
                      Trị giá 450.000đ
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base sm:text-[17px] text-slate-900 leading-snug mt-3">
                    Bộ cứu thương ngữ pháp SOS &amp; kho đề Sơn Trà
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold italic mt-0.5 block">
                    (PDF &amp; video giải chi tiết)
                  </span>

                  {/* Đường line màu nhận diện dưới tiêu đề */}
                  <div className="pt-2">
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#ff4757] to-rose-400" />
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): Nội dung mô tả & Footer badge dập chìm ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between">
                  <p className="font-body text-[15px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                    File PDF &amp; Video hướng dẫn kỹ thuật <strong className="text-[#ff4757] font-bold">&ldquo;Bóc tách 4 bước&rdquo;</strong> trên <strong className="text-slate-900 font-semibold">20 câu trắc nghiệm bẫy</strong>, bám sát đề thi Sơn Trà.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#ff4757] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Trúng tủ ma trận 36 câu Đà Nẵng</span>
                  </div>
                </div>
              </div>

              {/* Quà 4: Thẻ Kickstart & 100 Tokens */}
              <div className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] flex flex-col gap-1.5 sm:gap-2 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* ── KHỐI 1 (TRÊN): Icon, Badge nổi, Giá trị & Tiêu đề ── */}
                <div className="relative bg-white/95 rounded-2xl p-4 sm:p-5 pt-6 sm:pt-7 border border-white/80 shadow-xs overflow-visible">
                  {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                  <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-5 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-amber-600 text-white shadow-xs border border-white/30 z-10">
                    <Gamepad2 className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="font-heading font-extrabold text-[10px] sm:text-[11px] tracking-wider">
                      Quà tặng 04
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 flex items-center justify-center border border-amber-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                      Thẻ đặc quyền
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-base sm:text-[17px] text-slate-900 leading-snug mt-3">
                    &ldquo;Thẻ Kickstart&rdquo; + sổ 100 Tokens
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold italic mt-0.5 block">
                    (Thử thách 5 ngày xóa mù từ vựng)
                  </span>

                  {/* Đường line màu nhận diện dưới tiêu đề */}
                  <div className="pt-2">
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-400" />
                  </div>
                </div>

                {/* ── KHỐI 2 (DƯỚI): Nội dung mô tả & Footer badge dập chìm ── */}
                <div className="bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/80 shadow-xs flex-1 flex flex-col justify-between">
                  <p className="font-body text-[15px] sm:text-[15.5px] text-slate-700 leading-relaxed">
                    Tặng riêng cuốn sổ tích điểm <strong className="text-amber-800 font-bold">&ldquo;100 Tokens&rdquo;</strong> được <strong className="text-emerald-700 font-bold">CỘNG SẴN 10 TOKENS</strong> và quyền tham gia thử thách game hóa qua Zalo/Quizizz.
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-amber-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Tặng sẵn +10 Tokens kích thích Dopamine</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CTA BUTTON CHÈN CUỐI SECTION (ĐỒNG BỘ CHUẨN SECTION 'ĐỒNG HÀNH CÙNG CON') ── */}
            <div className="pt-2 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 border border-white/30 group"
              >
                <div className="flex flex-col items-center text-center leading-snug min-w-0">
                  <span className="font-heading font-extrabold text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                    ĐĂNG KÝ NHẬN TRỌN BỘ 4 QUÀ TẶNG MIỄN PHÍ
                  </span>
                  <span className="font-body text-[10px] min-[390px]:text-[11px] sm:text-xs font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                    Không ràng buộc học phí · Quà tặng chuyển giao ngay
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 9: GIẢI ĐÁP THẮC MẮC THƯỜNG GẶP CỦA PHỤ HUYNH (OBJECTION-KILLING FAQ ACCORDION)
            ĐỒNG BỘ TIÊU CHUẨN NGÔN NGỮ THIẾT KẾ & UI SECTION 'ĐỒNG HÀNH CÙNG CON'
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-[#eef3f9] bg-grid-pattern relative border-t border-slate-200">
          <div className="w-[90%] lg:w-[80%] mx-auto space-y-10 sm:space-y-12">
            {/* Header Khối 9 đồng bộ chuẩn Section 'Đồng hành cùng con' */}
            <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0A78F3] border border-sky-200 shadow-xs text-xs sm:text-[13px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0A78F3] animate-pulse" />
                <span>Giải tỏa băn khoăn phụ huynh</span>
              </div>

              <h2 className="font-heading uppercase tracking-tight text-center max-w-4xl mx-auto">
                <span className="block font-black text-slate-900 text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] leading-tight">
                  <span className="block sm:inline">GIẢI TỎA MỌI BĂN KHOĂN</span>{" "}
                  <span className="block sm:inline">
                    – <span className="text-[#0A78F3]">AN TÂM ĐỒNG HÀNH</span>
                  </span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-800 text-[16px] min-[390px]:text-[18px] sm:text-2xl md:text-[26px] lg:text-[29px] leading-tight mt-1 sm:mt-1.5">
                  CÙNG CON VỚI <span className="text-[#C43838] font-black underline decoration-[#C43838]/40 decoration-2 underline-offset-4">SỰ MINH BẠCH &amp; TẬN TÂM</span> TỪ CÔ NGHI
                </span>
              </h2>

              <p className="font-body text-slate-600 text-[15.5px] sm:text-base md:text-[17.5px] lg:text-[18px] leading-relaxed max-w-3xl mx-auto text-center">
                <span className="font-bold text-slate-800 underline decoration-slate-300 decoration-1 underline-offset-2">Mỗi lo lắng của ba mẹ đều xứng đáng được lắng nghe</span>. Dưới đây là <strong className="text-[#0A78F3] font-bold">những chia sẻ thẳng thắn, chân thành nhất</strong> từ Cô Nghi giúp ba mẹ hoàn toàn thảnh thơi và tin tưởng:
              </p>
            </div>

            {/* DANH SÁCH 5 CÂU HỎI FAQ ACCORDION (TACTILE RECESSED WELL CHASSIS) */}
            <div className="max-w-4xl mx-auto space-y-4">
              {[
                {
                  id: 0,
                  badge: "01",
                  q: '“Con mất gốc nặng lắm, ở nhà lười học từ vựng và không chịu đụng vào sách vở thì theo học có kịp không?”',
                  a: (
                    <>
                      Phụ huynh hoàn toàn yên tâm. Lớp học khống chế <strong className="text-[#0A78F3] font-bold">tối đa 12 học sinh</strong> nên Cô Nghi kèm sát từng bước theo đúng trình độ hiện tại của con, tuyệt đối không để con bị ngợp. Đối với thói quen lười học từ vựng, hệ thống trò chơi hóa <strong className="text-[#0A78F3] font-bold">Quizizz</strong> kết hợp tích điểm <strong className="text-[#ff4757] font-bold">100 Tokens</strong> đổi quà (dành tới 30% điểm cho thái độ nỗ lực) sẽ kích thích con <strong className="text-slate-900 font-semibold">tự giác mở bài ra ôn tập mỗi tối</strong> mà mẹ không cần nhắc nhở.
                    </>
                  ),
                },
                {
                  id: 1,
                  badge: "02",
                  q: '“Sắp tới kỳ thi Giữa kỳ / Cuối kỳ trên trường rồi, bây giờ cho con vào học liệu có kịp gỡ điểm không?”',
                  a: (
                    <>
                      Rất kịp thời! Với <strong className="text-[#0A78F3] font-bold">kho dữ liệu đề cương thực tế</strong> từ các trường THCS tại Sơn Trà (<span className="bg-sky-50 text-[#0A78F3] font-bold px-1.5 py-0.5 rounded border border-sky-200/80 text-xs sm:text-sm inline-block">Lê Độ, Nguyễn Chí Thanh, Phạm Ngọc Thạch, Phan Bội Châu, Lý Tự Trọng, Ngô Quyền...</span>), Cô Nghi sẽ khoanh vùng ngay các dạng bài trọng tâm và trực tiếp kèm cặp. Thực tế tại lớp, nhiều học viên chỉ sau một giai đoạn ôn tập sát sườn đã <strong className="text-[#ff4757] font-bold">bứt phá từ 5,5–6,0 điểm lên 8,5–9,0 điểm</strong>.
                    </>
                  ),
                },
                {
                  id: 2,
                  badge: "03",
                  q: '“Lớp học có dạy giao tiếp không hay chỉ giải bài tập ngữ pháp khô khan?”',
                  a: (
                    <>
                      Lớp tập trung vào <strong className="text-[#0A78F3] font-bold">&ldquo;Học thuật Thực chiến&rdquo;</strong> nhằm giải quyết mục tiêu cấp bách nhất là điểm số trên trường và <strong className="text-slate-900 font-semibold">kỳ thi tuyển sinh lớp 10 Đà Nẵng</strong>. Tuy nhiên, con không hề học lý thuyết câm: thông qua phương pháp <strong className="text-[#0A78F3] font-bold">chuẩn hóa phiên âm IPA</strong>, đọc ngắt nghỉ và bộ chuẩn bị bài Speaking &amp; Writing định kỳ, con vừa nắm chắc ngữ pháp để thi đạt điểm cao, vừa phát âm chuẩn và phản xạ ngôn ngữ tự nhiên.
                    </>
                  ),
                },
                {
                  id: 3,
                  badge: "04",
                  q: '“Lịch học tại lớp có bị trùng với lịch học chính khóa và học thêm môn khác của con không?”',
                  a: (
                    <>
                      Lớp Tiếng Anh Cô Nghi có nhiều <strong className="text-[#0A78F3] font-bold">khung giờ linh hoạt</strong> vào các ca chiều tối trong tuần và cuối tuần dành riêng cho học sinh THCS khu vực Sơn Trà. Trong <strong className="text-[#ff4757] font-bold">buổi Chẩn đoán năng lực 1-1</strong>, Cô Nghi sẽ đối chiếu thời khóa biểu của con để xếp ca học thuận tiện nhất, đảm bảo con không bị quá tải.
                    </>
                  ),
                },
                {
                  id: 4,
                  badge: "05",
                  q: '“Gia đình cần về hỏi thêm ý kiến của con và bố cháu trước khi đăng ký khóa 3 tháng thì phải làm sao?”',
                  a: (
                    <>
                      Phụ huynh chưa cần phải quyết định đóng học phí ngay hôm nay! Hãy đăng ký trước <strong className="text-[#0A78F3] font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/80 shadow-2xs inline-block">&ldquo;Phiên Chẩn Đoán Năng Lực 1-1 Miễn Phí (45 phút)&rdquo;</strong> bên dưới. Đây là buổi đánh giá hoàn toàn miễn phí và <strong className="text-slate-900 font-semibold">không có bất kỳ ràng buộc tài chính nào</strong>, giúp con trực tiếp trải nghiệm sự tận tâm của Cô Nghi và giúp ba mẹ cầm trên tay <strong className="text-[#ff4757] font-bold">Bản Phác Đồ Bắt Bệnh</strong> chính xác trước khi đưa ra quyết định.
                    </>
                  ),
                },
              ].map((faq) => {
                const isOpen = openFaqIndex === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="relative bg-[#d1d9e6]/50 backdrop-blur-xs p-1 sm:p-1.5 rounded-2xl border border-[#babecc]/50 shadow-[var(--shadow-recessed-sm)] overflow-hidden transition-all duration-200"
                  >
                    <div className="bg-white/95 rounded-xl border border-white/80 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : faq.id)}
                        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3.5 sm:gap-4 cursor-pointer select-none hover:bg-slate-50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                          <span
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-heading text-xs sm:text-[13px] font-black flex items-center justify-center shrink-0 transition-colors duration-200 ${
                              isOpen
                                ? "bg-[#0A78F3] text-white shadow-xs"
                                : "bg-[#d1d9e6]/70 text-[#0A78F3] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)]"
                            }`}
                          >
                            {faq.badge}
                          </span>
                          <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                            {faq.q}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#0A78F3]" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-2 border-t-[3px] border-slate-200 animate-in fade-in slide-in-from-top-1 duration-200">
                          <p className="font-body text-slate-700 text-[15.5px] sm:text-[16.5px] leading-relaxed pl-10 sm:pl-11">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── CTA BUTTON CHÈN CUỐI SECTION (ĐỒNG BỘ CHUẨN SECTION 'ĐỒNG HÀNH CÙNG CON') ── */}
            <div className="pt-2 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleOpenRegisterModal}
                className="w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[0_8px_20px_rgba(255,71,87,0.35)] hover:shadow-[0_12px_28px_rgba(255,71,87,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98 border border-white/30 group"
              >
                <div className="flex flex-col items-center text-center leading-snug min-w-0">
                  <span className="font-heading font-extrabold text-[12px] min-[390px]:text-[13px] sm:text-base uppercase tracking-tight whitespace-nowrap">
                    ĐẶT LỊCH TƯ VẤN TRỰC TIẾP VỚI CÔ NGHI
                  </span>
                  <span className="font-body text-[10px] min-[390px]:text-[11px] sm:text-xs font-medium text-rose-100 normal-case mt-0.5 tracking-tight whitespace-nowrap">
                    Đánh giá chuyên sâu 5 kỹ năng · Thiết kế phác đồ riêng
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            KHỐI 10: BIỂU MẪU ĐĂNG KÝ CHUYỂN ĐỔI TRỰC TIẾP TRÊN TRANG (FINAL LEAD CAPTURE FORM)
        ────────────────────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16 bg-[#1e272e] bg-grid-pattern text-white border-t border-slate-700 relative overflow-hidden" id="dang-ky">
          <div className="w-[90%] lg:w-[80%] max-w-4xl mx-auto space-y-8 relative z-10">
            {/* ── SECTION LƯU Ý GIỚI HẠN SĨ SỐ (URGENCY & SCARCITY) ──
                ĐỒNG BỘ TIÊU CHUẨN NGÔN NGỮ THIẾT KẾ & 2-BLOCK TACTILE RECESSED WELL SECTION 'ĐỒNG HÀNH CÙNG CON' ── */}
            <div className="relative bg-[#252f38] p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-red-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.35)] flex flex-col gap-1.5 sm:gap-2 overflow-visible">
              {/* ── KHỐI 1 (TRÊN): Badge nổi, Tiêu đề khẩn cấp & 3 Chỉ số đo lường Tactile Counters ── */}
              <div className="relative bg-[#1e272e] rounded-2xl p-4 sm:p-6 pt-6 sm:pt-7 border border-slate-700/80 shadow-xs overflow-visible">
                {/* Nhãn 50% ngoài 50% trong ở góc trên bên trái */}
                <div className="absolute -top-3.5 sm:-top-4 left-4 sm:left-6 inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-[#ff4757] text-white shadow-md border border-white/30 z-10 font-heading font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>LƯU Ý GIỚI HẠN SĨ SỐ</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
                  <div>
                    <h3 className="font-heading font-black text-lg min-[390px]:text-xl sm:text-2xl text-white uppercase tracking-tight flex flex-col sm:inline-block">
                      <span>THÔNG BÁO KHÓA CỨNG SĨ SỐ</span>
                      <span className="text-[#ff6b81]">
                        <span className="hidden sm:inline"> · </span>CHỈ 12 HỌC SINH/LỚP
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                      Cam kết chất lượng chấm chữa 1-1 tuyệt đối – không mở thêm lớp đại trà
                    </p>
                  </div>
                </div>

                {/* Đường line màu đỏ san hô gradient */}
                <div className="pt-2 pb-3">
                  <div className="w-20 sm:w-24 h-1 sm:h-1.5 rounded-full bg-gradient-to-r from-[#ff4757] via-rose-500 to-amber-400" />
                </div>

                {/* 3 Hộp Đo Lường Suất Học Tactile Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="bg-[#151c22] border border-slate-700/70 rounded-xl p-3 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                    <span className="text-[10.5px] uppercase font-heading font-bold text-slate-400 block tracking-wider">
                      Sĩ số tối đa
                    </span>
                    <span className="text-xl sm:text-2xl font-heading font-black text-white mt-0.5 block">
                      12 em/lớp
                    </span>
                  </div>

                  <div className="bg-[#151c22] border border-slate-700/70 rounded-xl p-3 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                    <span className="text-[10.5px] uppercase font-heading font-bold text-slate-400 block tracking-wider">
                      Đã xác nhận &amp; Giữ chỗ
                    </span>
                    <span className="text-xl sm:text-2xl font-heading font-black text-emerald-400 mt-0.5 block">
                      07 em
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-red-950/80 to-[#2c1418] border-2 border-[#ff4757] rounded-xl p-3 text-center shadow-[0_0_15px_rgba(255,71,87,0.3)]">
                    <span className="text-[10.5px] uppercase font-heading font-extrabold text-[#ff6b81] flex items-center justify-center gap-1 tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#ff4757] animate-pulse shrink-0" />
                      CÒN LẠI DUY NHẤT
                    </span>
                    <span className="text-xl sm:text-2xl font-heading font-black text-amber-300 mt-0.5 block">
                      05 SUẤT CUỐI
                    </span>
                  </div>
                </div>
              </div>

              {/* ── KHỐI 2 (DƯỚI): Lý do giới hạn, Cam kết & Quick CTA Button ── */}
              <div className="bg-[#1e272e] rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-xs">
                <p className="font-heading font-extrabold text-xs sm:text-[13px] text-[#ff6b81] uppercase tracking-wider mb-2.5">
                  VÌ SAO SĨ SỐ TỐI ĐA LẠI LÀ 12 HỌC SINH?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-[14.5px] sm:text-[15.5px]">
                  <div className="bg-[#151c22] rounded-xl p-3 sm:p-3.5 border border-slate-700/70 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#0A78F3] shrink-0 mt-0.5" />
                    <span className="text-slate-200 leading-relaxed font-body">
                      <strong className="text-white font-semibold">Giám sát vi mô:</strong> Trực tiếp sửa từng lỗi chia thì, phát âm và dịch bài.
                    </span>
                  </div>
                  <div className="bg-[#151c22] rounded-xl p-3 sm:p-3.5 border border-slate-700/70 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200 leading-relaxed font-body">
                      <strong className="text-white font-semibold">Báo cáo Zalo 20h00:</strong> LMS gửi chi tiết điểm số về máy mẹ mỗi tối.
                    </span>
                  </div>
                  <div className="bg-[#151c22] rounded-xl p-3 sm:p-3.5 border border-slate-700/70 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#ff4757] shrink-0 mt-0.5" />
                    <span className="text-slate-200 leading-relaxed font-body">
                      <strong className="text-white font-semibold">Bảo hiểm 2 lớp:</strong> Hoàn học phí 100% nếu con không tiến bộ rõ rệt.
                    </span>
                  </div>
                </div>

                <p className="font-body text-[15px] sm:text-[15.5px] text-slate-300 leading-relaxed mt-3.5">
                  Do chỉ nhận <strong className="text-white">tối đa 12 em/lớp</strong>, hiện tại Lớp Tiếng Anh Cô Nghi chỉ còn nhận thêm <strong className="text-amber-300 font-extrabold underline decoration-amber-400">05 suất Chẩn đoán năng lực 1-1 &amp; Giữ chỗ</strong> cho khóa mới tuần này. Cổng đăng ký sẽ tự động đóng ngay khi đủ số lượng!
                </p>

                {/* Quick CTA chèn ngay trong Urgency Card */}
                <div className="mt-4 pt-3.5 border-t border-slate-700/70 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const formEl = document.querySelector("#dang-ky form");
                      if (formEl) {
                        formEl.scrollIntoView({ behavior: "smooth" });
                      } else {
                        handleOpenRegisterModal();
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ff4757] hover:bg-[#e03949] text-white font-heading font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-white/20"
                  >
                    <span>GIỮ 1 TRONG 05 SUẤT NGAY</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Header Form đồng bộ chuẩn Section 'Đồng hành cùng con' */}
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700 shadow-xs text-xs sm:text-[13px] font-bold">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>Đăng ký giữ chỗ &amp; nhận quà</span>
              </div>

              <h2 className="font-heading uppercase tracking-tight text-center max-w-4xl mx-auto">
                <span className="block font-black text-white text-[20px] min-[390px]:text-[22px] sm:text-3xl md:text-4xl lg:text-[38px] leading-tight">
                  <span className="block sm:inline">ĐỪNG ĐỂ TIẾNG ANH</span>{" "}
                  <span className="block sm:inline text-[#0A78F3]">TRỞ THÀNH RÀO CẢN</span>
                </span>
                <span className="block font-bold sm:font-extrabold text-slate-200 text-[16px] min-[390px]:text-[18px] sm:text-2xl md:text-[26px] lg:text-[29px] leading-tight mt-1 sm:mt-1.5">
                  KHIẾN CON <span className="text-[#ff4757] font-black underline decoration-[#ff4757]/40 decoration-2 underline-offset-4">TRƯỢT LỚP 10 CÔNG LẬP</span>
                </span>
              </h2>

              <p className="font-body text-slate-300 text-[15.5px] sm:text-base md:text-[17.5px] lg:text-[18px] leading-relaxed max-w-2xl mx-auto text-center">
                <span className="font-bold text-white underline decoration-slate-600 decoration-1 underline-offset-2">Chỉ mất 30 giây điền thông tin</span>, con sẽ được <strong className="text-[#0A78F3] font-bold bg-sky-950/60 px-2 py-0.5 rounded-lg border border-sky-600/60 shadow-2xs inline-block">bắt bệnh năng lực 1-1 miễn phí</strong> và gia đình nhận ngay <strong className="text-[#ff4757] font-bold">trọn bộ 4 quà tặng độc quyền</strong> từ Cô Nghi:
              </p>
            </div>

            {/* Form On-Page Container */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              {!isOnPageSubmitted ? (
                <form onSubmit={handleOnPageSubmit} className="space-y-4">
                  {/* Trường 1: Tên phụ huynh */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      1. Tên Phụ huynh (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Mẹ Thảo Nguyên, Ba Minh..."
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 2: Số điện thoại Zalo */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      2. Số điện thoại Zalo (*)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Nhập SĐT Zalo để nhận Phác đồ &amp; Bộ Sổ tay PDF..."
                      value={formData.phoneZalo}
                      onChange={(e) => setFormData({ ...formData, phoneZalo: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 3: Họ tên con */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      3. Họ tên con (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Nguyễn Minh An..."
                      value={formData.studentName}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          studentName: name,
                          studentNameAndGrade: `${name}${prev.studentGrade ? ` - ${prev.studentGrade}` : ""}`,
                        }));
                      }}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 4: Khối lớp hiện tại */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      4. Khối lớp hiện tại (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Lớp 7, Lớp 8, Lớp 9..."
                      value={formData.studentGrade}
                      onChange={(e) => {
                        const grade = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          studentGrade: grade,
                          studentNameAndGrade: `${prev.studentName}${grade ? ` - ${grade}` : ""}`,
                        }));
                      }}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 5: Trường THCS con đang học */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      5. Trường THCS con đang theo học tại Đà Nẵng
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: THCS Lê Độ, THCS Ngô Quyền, THCS Nguyễn Chí Thanh..."
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 6: Tình trạng hiện tại của con (Checkboxes) */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1.5">
                      6. Tình trạng hiện tại của con (Chọn các ý phù hợp)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {[
                        "Mất gốc hoàn toàn, học trước quên sau",
                        "Hay 'khoanh lụi' trắc nghiệm, không dịch được câu",
                        "Sợ sai, tự ti, thiếu tự giác học ở nhà",
                        "Cần gỡ điểm gấp cho kỳ thi Giữa kỳ, Cuối kỳ, Lớp 10",
                      ].map((prob, i) => (
                        <label
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.problems.includes(prob)}
                            onChange={() => handleToggleProblem(prob)}
                            className="mt-0.5 text-[#ff4757] rounded-sm focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-slate-700 leading-snug">{prob}</span>
                        </label>
                      ))}

                      {/* Ô Khác:... */}
                      <div className="sm:col-span-2 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={isOtherProblemChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIsOtherProblemChecked(checked);
                              if (checked && otherProblemText) {
                                handleToggleProblem(`Khác: ${otherProblemText}`);
                              } else if (!checked && otherProblemText) {
                                setFormData((prev) => ({
                                  ...prev,
                                  problems: prev.problems.filter((p) => !p.startsWith("Khác:")),
                                }));
                              }
                            }}
                            className="text-[#ff4757] rounded-sm focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-slate-700 leading-snug font-medium text-xs sm:text-sm">
                            Khác:
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập tình trạng cụ thể khác của con..."
                          value={otherProblemText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOtherProblemText(val);
                            setIsOtherProblemChecked(true);
                            setFormData((prev) => {
                              const filtered = prev.problems.filter((p) => !p.startsWith("Khác:"));
                              return val ? { ...prev, problems: [...filtered, `Khác: ${val}`] } : { ...prev, problems: filtered };
                            });
                          }}
                          className="flex-1 text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#ff4757] text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trường 7: Nhu cầu ưu tiên */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1.5">
                      7. Nhu cầu ưu tiên của Phụ huynh
                    </label>
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      {[
                        "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
                        "Tư vấn Lộ trình 90 ngày (Bứt phá 1-3 điểm)",
                        "Tư vấn Trại Ôn Thi Cấp Tốc 14 Ngày (Gỡ điểm cấp tốc)",
                      ].map((choice, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-slate-800 hover:bg-rose-50/50 hover:border-rose-200 transition-colors"
                        >
                          <input
                            type="radio"
                            name="onpage-priority"
                            checked={!isOtherPriority && formData.priorityChoice === choice}
                            onChange={() => {
                              setIsOtherPriority(false);
                              setFormData({ ...formData, priorityChoice: choice });
                            }}
                            className="text-[#ff4757] focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-[13.5px] sm:text-[15px] leading-snug">{choice}</span>
                        </label>
                      ))}

                      {/* Lựa chọn Khác:... */}
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-rose-50/50 hover:border-rose-200 transition-colors">
                        <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
                          <input
                            type="radio"
                            name="onpage-priority"
                            checked={isOtherPriority}
                            onChange={() => {
                              setIsOtherPriority(true);
                              setFormData({
                                ...formData,
                                priorityChoice: otherPriorityText ? `Khác: ${otherPriorityText}` : "Khác",
                              });
                            }}
                            className="text-[#ff4757] focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-[13.5px] sm:text-[15px] leading-snug font-medium">
                            Khác:
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập nhu cầu ưu tiên cụ thể khác..."
                          value={otherPriorityText}
                          onFocus={() => {
                            setIsOtherPriority(true);
                            setFormData({
                              ...formData,
                              priorityChoice: otherPriorityText ? `Khác: ${otherPriorityText}` : "Khác",
                            });
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOtherPriorityText(val);
                            setIsOtherPriority(true);
                            setFormData({
                              ...formData,
                              priorityChoice: val ? `Khác: ${val}` : "Khác",
                            });
                          }}
                          className="flex-1 text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#ff4757] text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nút Bấm Xác Nhận Final CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-xl shadow-rose-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {isSubmittingLead ? (
                        <div className="flex items-center gap-2.5 py-1">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-heading font-black text-sm sm:text-base uppercase tracking-tight">
                            ĐANG GỬI THÔNG TIN VÀO BẢNG TÍNH...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center text-center leading-snug">
                            <span className="font-heading font-black text-sm sm:text-base md:text-lg uppercase tracking-tight">
                              XÁC NHẬN ĐĂNG KÝ
                            </span>
                            <span className="font-body text-[11px] sm:text-xs text-rose-100 normal-case mt-0.5 font-normal">
                              Giữ lịch test 1-1 &amp; nhận phác đồ miễn phí
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 shrink-0" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bảo Mật */}
                  <div className="pt-2 text-center font-body text-xs sm:text-[13px] text-slate-500">
                    <p className="flex items-center justify-center gap-1.5 text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Thông tin cá nhân của phụ huynh và học sinh được bảo mật tuyệt đối 100%.</span>
                    </p>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300 shadow-sm">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-slate-900">
                    Đăng Ký Thành Công!
                  </h3>
                  <p className="font-body text-[15.5px] sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                    Cảm ơn phụ huynh <strong>{formData.parentName}</strong> đã gửi gắm thông tin của bé <strong>{formData.studentNameAndGrade}</strong>.
                  </p>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-slate-800 text-sm sm:text-base max-w-lg mx-auto">
                    Cô Nghi sẽ liên hệ qua Zalo số <strong>{formData.phoneZalo}</strong> trong vòng 15 phút để gửi trọn bộ Phác Đồ Lộ Trình &amp; chốt lịch test 1-1 phù hợp nhất.
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          CHÂN TRANG (FOOTER – THÔNG TIN VẬN HÀNH & ĐỊNH VỊ ĐỊA PHƯƠNG)
      ────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#2d3436] bg-grid-pattern text-white border-t border-slate-700 pt-10 sm:pt-12 pb-24 sm:pb-12 relative z-10 font-body">
        <div className="w-[90%] lg:w-[80%] mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Cột 1: Thương hiệu */}
            <div className="md:col-span-5 space-y-3">
              <span className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-white block">
                LỚP TIẾNG ANH CÔ NGHI
              </span>
              <span className="text-xs text-sky-400 font-bold uppercase tracking-wider block">
                (MS NGHI ENGLISH CLASS)
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Trạm Cứu Hộ Học Thuật &amp; Chữa Lành Tâm Lý Học Tập Cấp 2. Mô hình Giám sát Vi mô tối đa 12 học sinh/lớp, chấm dứt thói quen &ldquo;khoanh lụi&rdquo; và bứt phá 1–3 điểm thi.
              </p>
            </div>

            {/* Cột 2: Cơ sở địa phương */}
            <div className="md:col-span-4 space-y-2 text-xs sm:text-sm text-slate-300">
              <span className="font-heading font-extrabold uppercase tracking-wider text-white text-xs block mb-2">
                📍 CƠ SỞ ĐÀ NẴNG:
              </span>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#ff4757] shrink-0 mt-0.5" />
                <span>866/25 Ngô Quyền (K866/25 Ngô Quyền), Phường An Hải, Quận Sơn Trà, TP. Đà Nẵng</span>
              </p>
              <p className="text-[11.5px] text-slate-400 pl-6 leading-relaxed">
                (Vị trí trung tâm, hẻm rộng an toàn, cách các trường THCS Lê Độ, Nguyễn Chí Thanh, Ngô Quyền, Phạm Ngọc Thạch chỉ 3–5 phút di chuyển)
              </p>
            </div>

            {/* Cột 3: Liên hệ */}
            <div className="md:col-span-3 space-y-2 text-xs sm:text-sm text-slate-300">
              <span className="font-heading font-extrabold uppercase tracking-wider text-white text-xs block mb-2">
                📞 TƯ VẤN TRỰC TIẾP:
              </span>
              <p>
                Hotline / Zalo: <strong className="text-white font-mono text-sm">0898 171 712</strong>
              </p>
              <p>
                Fanpage:{" "}
                <a
                  href="https://facebook.com/lopanhvandiemcao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  facebook.com/lopanhvandiemcao
                </a>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© 2026 Lớp Tiếng Anh Cô Nghi. Bản quyền nội dung đã được đăng ký.</p>
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => setIsSheetConfigOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer font-semibold underline decoration-emerald-500/50 underline-offset-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Cấu hình Google Sheet</span>
              </button>
              <p>Vận hành trên nền tảng Hệ sinh thái Quản lý Học tập LMS Độc quyền.</p>
            </div>
          </div>
        </div>
      </footer>

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
          <span className="text-[10.5px] tracking-wide text-amber-100 flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
            <span className="font-semibold text-white">Miễn phí - Chỉ còn 6 suất tuần này</span>
          </span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL ĐĂNG KÝ PHIÊN CHẨN ĐOÁN 1-1 (LEAD CAPTURE MODAL THEO SHOFU)
      ────────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl p-6 sm:p-8 md:p-9 max-w-lg md:max-w-2xl lg:max-w-[720px] w-full shadow-2xl max-h-[92vh] overflow-y-auto relative">
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
                  <span className="uppercase text-xs tracking-wider text-[#C43838] font-bold">
                    Chỉ Còn 05 Suất Test Trong Tuần Này
                  </span>
                </div>

                <h3
                  style={{ color: "#0f172a" }}
                  className="font-heading font-black uppercase tracking-tight text-slate-900 text-lg sm:text-xl leading-snug"
                >
                  <span style={{ color: "#0f172a" }}>Đăng Ký Phiên Chẩn Đoán Năng Lực 1-1</span>{" "}
                  <span className="text-[#0A78F3] underline decoration-[#0A78F3]/40 decoration-2 underline-offset-4">
                    Miễn Phí
                  </span>{" "}
                  <span className="text-slate-500 font-semibold text-sm sm:text-base lowercase">
                    (45 phút)
                  </span>
                </h3>
                <p className="font-body text-slate-700 text-[15px] sm:text-[15.5px] mt-2 leading-relaxed">
                  <strong className="text-[#0A78F3] font-bold">Trực tiếp cùng Cô Nghi</strong> tại <strong className="text-slate-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">866/25 Ngô Quyền, Sơn Trà</strong>. Nhận ngay <strong className="text-[#ff4757] font-bold">Bản Phác Đồ Lộ Trình</strong> &amp; <strong className="text-purple-700 font-bold">Bộ Sổ Tay Ma Thuật</strong>.
                </p>

                <form onSubmit={handleSubmitForm} className="mt-5 space-y-4">
                  {/* Trường 1: Tên phụ huynh */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      1. Tên Phụ huynh (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Mẹ Thảo Nguyên, Ba Minh..."
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 2: Số điện thoại Zalo */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      2. Số điện thoại Zalo (*)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="Nhập SĐT Zalo để nhận Phác đồ &amp; Bộ Sổ tay PDF..."
                      value={formData.phoneZalo}
                      onChange={(e) => setFormData({ ...formData, phoneZalo: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 3: Họ tên con */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      3. Họ tên con (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Nguyễn Minh An..."
                      value={formData.studentName}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          studentName: name,
                          studentNameAndGrade: `${name}${prev.studentGrade ? ` - ${prev.studentGrade}` : ""}`,
                        }));
                      }}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 4: Khối lớp hiện tại */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      4. Khối lớp hiện tại (*)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Lớp 7, Lớp 8, Lớp 9..."
                      value={formData.studentGrade}
                      onChange={(e) => {
                        const grade = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          studentGrade: grade,
                          studentNameAndGrade: `${prev.studentName}${grade ? ` - ${grade}` : ""}`,
                        }));
                      }}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 5: Trường THCS con đang học */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1">
                      5. Trường THCS con đang theo học tại Đà Nẵng
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: THCS Lê Độ, THCS Ngô Quyền, THCS Nguyễn Chí Thanh..."
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full text-sm sm:text-base px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-[#ff4757] focus:ring-1 focus:ring-[#ff4757] text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Trường 6: Tình trạng hiện tại của con (Checkboxes) */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1.5">
                      6. Tình trạng hiện tại của con (Chọn các ý phù hợp)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      {[
                        "Mất gốc hoàn toàn, học trước quên sau",
                        "Hay 'khoanh lụi' trắc nghiệm, không dịch được câu",
                        "Sợ sai, tự ti, thiếu tự giác học ở nhà",
                        "Cần gỡ điểm gấp cho kỳ thi Giữa kỳ, Cuối kỳ, Lớp 10",
                      ].map((prob, i) => (
                        <label
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.problems.includes(prob)}
                            onChange={() => handleToggleProblem(prob)}
                            className="mt-0.5 text-[#ff4757] rounded-sm focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-slate-700 leading-snug">{prob}</span>
                        </label>
                      ))}

                      {/* Ô Khác:... */}
                      <div className="sm:col-span-2 flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={isOtherProblemChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIsOtherProblemChecked(checked);
                              if (checked && otherProblemText) {
                                handleToggleProblem(`Khác: ${otherProblemText}`);
                              } else if (!checked && otherProblemText) {
                                setFormData((prev) => ({
                                  ...prev,
                                  problems: prev.problems.filter((p) => !p.startsWith("Khác:")),
                                }));
                              }
                            }}
                            className="text-[#ff4757] rounded-sm focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-slate-700 leading-snug font-medium text-xs sm:text-sm">
                            Khác:
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập tình trạng cụ thể khác của con..."
                          value={otherProblemText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOtherProblemText(val);
                            setIsOtherProblemChecked(true);
                            setFormData((prev) => {
                              const filtered = prev.problems.filter((p) => !p.startsWith("Khác:"));
                              return val ? { ...prev, problems: [...filtered, `Khác: ${val}`] } : { ...prev, problems: filtered };
                            });
                          }}
                          className="flex-1 text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#ff4757] text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trường 7: Nhu cầu ưu tiên */}
                  <div>
                    <label className="block text-xs sm:text-[13px] font-extrabold text-slate-800 mb-1.5">
                      7. Nhu cầu ưu tiên của Phụ huynh
                    </label>
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      {[
                        "Đăng ký Phiên Chẩn đoán 1-1 Miễn phí (45 phút) + Nhận trọn bộ 4 Quà tặng",
                        "Tư vấn Lộ trình 90 ngày (Bứt phá 1-3 điểm)",
                        "Tư vấn Trại Ôn Thi Cấp Tốc 14 Ngày (Gỡ điểm cấp tốc)",
                      ].map((choice, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-slate-800 hover:bg-rose-50/50 hover:border-rose-200 transition-colors"
                        >
                          <input
                            type="radio"
                            name="modal-priority"
                            checked={!isOtherPriority && formData.priorityChoice === choice}
                            onChange={() => {
                              setIsOtherPriority(false);
                              setFormData({ ...formData, priorityChoice: choice });
                            }}
                            className="text-[#ff4757] focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-[13.5px] sm:text-[15px] leading-snug">{choice}</span>
                        </label>
                      ))}

                      {/* Lựa chọn Khác:... */}
                      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-rose-50/50 hover:border-rose-200 transition-colors">
                        <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
                          <input
                            type="radio"
                            name="modal-priority"
                            checked={isOtherPriority}
                            onChange={() => {
                              setIsOtherPriority(true);
                              setFormData({
                                ...formData,
                                priorityChoice: otherPriorityText ? `Khác: ${otherPriorityText}` : "Khác",
                              });
                            }}
                            className="text-[#ff4757] focus:ring-[#ff4757]"
                          />
                          <span className="font-body text-[13.5px] sm:text-[15px] leading-snug font-medium">
                            Khác:
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập nhu cầu ưu tiên cụ thể khác..."
                          value={otherPriorityText}
                          onFocus={() => {
                            setIsOtherPriority(true);
                            setFormData({
                              ...formData,
                              priorityChoice: otherPriorityText ? `Khác: ${otherPriorityText}` : "Khác",
                            });
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOtherPriorityText(val);
                            setIsOtherPriority(true);
                            setFormData({
                              ...formData,
                              priorityChoice: val ? `Khác: ${val}` : "Khác",
                            });
                          }}
                          className="flex-1 text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#ff4757] text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nút Bấm Xác Nhận Final CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-[#ff4757] hover:bg-[#e03949] text-white shadow-xl shadow-rose-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                      {isSubmittingLead ? (
                        <div className="flex items-center gap-2.5 py-1">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-heading font-black text-sm sm:text-base uppercase tracking-tight">
                            ĐANG GỬI THÔNG TIN VÀO BẢNG TÍNH...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center text-center leading-snug">
                            <span className="font-heading font-black text-sm sm:text-base md:text-lg uppercase tracking-tight">
                              XÁC NHẬN ĐĂNG KÝ
                            </span>
                            <span className="font-body text-[11px] sm:text-xs text-rose-100 normal-case mt-0.5 font-normal">
                              Giữ lịch test 1-1 &amp; nhận phác đồ miễn phí
                            </span>
                          </div>
                          <ArrowRight className="w-5 h-5 shrink-0" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bảo Mật */}
                  <div className="pt-2 text-center font-body text-xs sm:text-[13px] text-slate-500">
                    <p className="flex items-center justify-center gap-1.5 text-slate-500">
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Thông tin cá nhân của phụ huynh và học sinh được bảo mật tuyệt đối 100%.</span>
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-extrabold uppercase tracking-tight text-slate-900 text-lg">
                  Đăng Ký Thành Công!
                </h4>
                <p className="font-body text-[15.5px] sm:text-base text-slate-600 leading-relaxed">
                  Cảm ơn phụ huynh <strong>{formData.parentName}</strong> đã gửi gắm thông tin của bé <strong>{formData.studentName || formData.studentNameAndGrade}</strong>.
                </p>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-sm sm:text-base text-slate-800">
                  Cô Nghi sẽ liên hệ qua Zalo số <strong>{formData.phoneZalo}</strong> để gửi Bản Phác Đồ Lộ Trình &amp; chốt khung giờ test 1-1 phù hợp nhất với lịch học của con.
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Cấu Hình Google Sheet */}
      <GoogleSheetConfigModal
        isOpen={isSheetConfigOpen}
        onClose={() => setIsSheetConfigOpen(false)}
      />
    </div>
  );
};
