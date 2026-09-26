import React, { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  KeyRound,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { StudentProfile } from "../types";

interface LoginPortalProps {
  studentsMap: Record<string, StudentProfile>;
  onLoginParent: (studentSlug: string) => void;
  onLoginTeacher: () => void;
  initialTab?: "parent" | "teacher";
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  studentsMap,
  onLoginParent,
  onLoginTeacher,
  initialTab = "parent",
}) => {
  const [activeTab, setActiveTab] = useState<"parent" | "teacher">(initialTab);

  // Parent Login State
  const [studentCode, setStudentCode] = useState<string>("");
  const [parentError, setParentError] = useState<string>("");

  // Teacher Login State
  const [teacherUsername, setTeacherUsername] = useState<string>("");
  const [teacherPassword, setTeacherPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [teacherError, setTeacherError] = useState<string>("");

  // Handle Parent Login by Student Code / ID / Slug
  const handleParentSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setParentError("");

    const cleanInput = studentCode.trim().toLowerCase();
    if (!cleanInput) {
      setParentError("Vui lòng nhập mã học sinh do Cô Nghi cung cấp.");
      return;
    }

    // 1. Direct slug match
    if (studentsMap[cleanInput]) {
      onLoginParent(cleanInput);
      return;
    }

    // 2. Match by student ID (e.g. "G6-T7CC1-03") or clean slug
    const foundStudent = Object.values(studentsMap).find(
      (s) =>
        s.id.toLowerCase() === cleanInput ||
        s.slug.toLowerCase() === cleanInput ||
        s.fullName.toLowerCase() === cleanInput
    );

    if (foundStudent) {
      onLoginParent(foundStudent.slug);
    } else {
      setParentError(
        `Không tìm thấy học sinh với mã "${studentCode.trim().toUpperCase()}". Vui lòng kiểm tra lại mã đã được Cô Nghi cấp.`
      );
    }
  };

  // Handle Teacher Login
  const handleTeacherSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTeacherError("");

    const cleanUser = teacherUsername.trim().toLowerCase();
    const cleanPass = teacherPassword.trim();

    if (!cleanUser) {
      setTeacherError("Vui lòng nhập tên đăng nhập hoặc ID.");
      return;
    }
    if (!cleanPass) {
      setTeacherError("Vui lòng nhập mật khẩu.");
      return;
    }

    // Credentials specified by user:
    // 1) admin / 123456
    // 2) nguyenthiphuongnghi / 123456
    const isValidTeacher =
      (cleanUser === "admin" || cleanUser === "nguyenthiphuongnghi") &&
      cleanPass === "123456";

    if (isValidTeacher) {
      localStorage.setItem("teacher_session", "true");
      localStorage.setItem("teacher_user", cleanUser);
      onLoginTeacher();
    } else {
      setTeacherError("Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.");
    }
  };

  return (
    <div className="min-h-screen bg-[#d2dbe7] flex flex-col justify-between py-6 px-3.5 sm:px-6 relative">
      {/* Decorative background lighting accents */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#ff4757]/10 blur-3xl" />
      </div>

      {/* Top Brand Bar */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between mb-4 sm:mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl soft-ui-convex flex items-center justify-center text-[#ff4757] shadow-sm">
            <BookOpen className="w-5 h-5 text-[#ff4757]" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-[#1a1a1a] tracking-tight block">
              Lớp Tiếng Anh Cô Nghi
            </span>
            <span className="text-[11px] text-[#666666] font-medium block">
              Cổng Tra Cứu & Học Vụ Trực Tuyến
            </span>
          </div>
        </div>

        {/* Tactile System LED */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[11px] font-mono text-[#2d3436]">
          <span className="w-2 h-2 rounded-full led-indicator-green animate-pulse" />
          <span className="font-semibold text-emerald-700">Online</span>
        </div>
      </div>

      {/* Main Login Card - Neumorphic Embossed Chassis */}
      <div className="w-full max-w-lg mx-auto relative z-10 my-auto">
        <div className="bg-[#e0e5ec] rounded-2xl sm:rounded-3xl p-5 sm:p-8 soft-ui-embossed border border-white/70 relative shadow-[var(--shadow-floating)]">
          {/* 4 Corner Screw Dots */}
          <span className="screw-dot top-3 left-3" />
          <span className="screw-dot top-3 right-3" />
          <span className="screw-dot bottom-3 left-3" />
          <span className="screw-dot bottom-3 right-3" />

          {/* Header Title inside Chassis */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] font-mono">
                XÁC THỰC QUYỀN TRUY CẬP
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#1a1a1a] tracking-tight">
              Đăng nhập cổng học vụ
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Chọn vai trò bên dưới để tiếp tục vào không gian học tập
            </p>
          </div>

          {/* Neumorphic Segmented Tab Switcher */}
          <div className="bg-[#d1d9e6] p-1.5 rounded-2xl border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] grid grid-cols-2 gap-1.5 mb-6">
            {/* Tab 1: Phụ huynh (Default) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("parent");
                setParentError("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "parent"
                  ? "bg-[#e0e5ec] text-[#ff4757] soft-ui-convex shadow-[var(--shadow-card-sm)]"
                  : "text-[#666666] hover:text-[#1a1a1a]"
              }`}
            >
              <GraduationCap
                className={`w-4 h-4 ${
                  activeTab === "parent" ? "text-[#ff4757]" : "text-[#666666]"
                }`}
              />
              <span>Phụ huynh</span>
              {activeTab === "parent" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4757] animate-pulse" />
              )}
            </button>

            {/* Tab 2: Giáo viên */}
            <button
              type="button"
              onClick={() => {
                setActiveTab("teacher");
                setTeacherError("");
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "teacher"
                  ? "bg-[#e0e5ec] text-[#ff4757] soft-ui-convex shadow-[var(--shadow-card-sm)]"
                  : "text-[#666666] hover:text-[#1a1a1a]"
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 ${
                  activeTab === "teacher" ? "text-[#ff4757]" : "text-[#666666]"
                }`}
              />
              <span>Giáo viên</span>
              {activeTab === "teacher" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4757] animate-pulse" />
              )}
            </button>
          </div>

          {/* TAB 1: PHỤ HUYNH FORM */}
          {activeTab === "parent" && (
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div className="bg-[#d1d9e6]/70 border border-[#babecc]/50 rounded-xl p-3 text-xs text-[#555] leading-relaxed">
                <span className="font-semibold text-[#1a1a1a]">Ba mẹ lưu ý:</span> Chỉ cần nhập đúng{" "}
                <span className="font-bold text-[#ff4757] font-mono">Mã học sinh</span> đã được Cô
                Nghi cung cấp để xem đầy đủ biểu đồ tiến bộ, bài tập và kho tokens của con.
              </div>

              {/* Student Code Input Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="student-code-input"
                  className="block text-xs font-bold font-mono uppercase tracking-wider text-[#4a5568]"
                >
                  MÃ HỌC SINH
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                    <KeyRound className="w-4 h-4 text-[#ff4757]" />
                  </div>
                  <input
                    id="student-code-input"
                    type="text"
                    value={studentCode}
                    onChange={(e) => {
                      setStudentCode(e.target.value);
                      if (parentError) setParentError("");
                    }}
                    placeholder="Ví dụ: G6-T7CC1-03"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-[#d1d9e6] border border-[#babecc]/80 rounded-xl text-[#1a1a1a] font-mono text-base font-bold uppercase tracking-wider placeholder:text-[#8892a0] placeholder:normal-case placeholder:font-normal placeholder:tracking-normal shadow-[var(--shadow-recessed-sm)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/60 focus:border-[#ff4757] transition-all"
                  />
                </div>
              </div>

              {/* Parent Error Notice */}
              {parentError && (
                <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{parentError}</span>
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#ff4757] hover:bg-[#e03949] text-white font-bold py-3.5 px-6 rounded-xl shadow-[var(--shadow-accent)] border border-white/30 active:shadow-[var(--shadow-accent-pressed)] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <span>Truy cập hồ sơ học tập</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: GIÁO VIÊN FORM */}
          {activeTab === "teacher" && (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="bg-[#d1d9e6]/70 border border-[#babecc]/50 rounded-xl p-3 text-xs text-[#555] leading-relaxed">
                <span className="font-semibold text-[#1a1a1a]">Khu vực Giáo viên:</span> Quản lý
                lớp học, chấm bài, cập nhật điểm số và điểm thưởng Tokens cho toàn bộ học sinh.
              </div>

              {/* Username Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="teacher-username-input"
                  className="block text-xs font-bold font-mono uppercase tracking-wider text-[#4a5568]"
                >
                  TÊN ĐĂNG NHẬP / ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                    <User className="w-4 h-4 text-[#ff4757]" />
                  </div>
                  <input
                    id="teacher-username-input"
                    type="text"
                    value={teacherUsername}
                    onChange={(e) => {
                      setTeacherUsername(e.target.value);
                      if (teacherError) setTeacherError("");
                    }}
                    placeholder="admin hoặc nguyenthiphuongnghi"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-[#d1d9e6] border border-[#babecc]/80 rounded-xl text-[#1a1a1a] font-medium text-sm sm:text-base placeholder:text-[#8892a0] shadow-[var(--shadow-recessed-sm)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/60 focus:border-[#ff4757] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="teacher-password-input"
                  className="block text-xs font-bold font-mono uppercase tracking-wider text-[#4a5568]"
                >
                  MẬT KHẨU
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#666666]">
                    <Lock className="w-4 h-4 text-[#ff4757]" />
                  </div>
                  <input
                    id="teacher-password-input"
                    type={showPassword ? "text" : "password"}
                    value={teacherPassword}
                    onChange={(e) => {
                      setTeacherPassword(e.target.value);
                      if (teacherError) setTeacherError("");
                    }}
                    placeholder="Nhập mật khẩu"
                    className="w-full pl-10 pr-11 py-3 bg-[#d1d9e6] border border-[#babecc]/80 rounded-xl text-[#1a1a1a] font-medium text-sm sm:text-base placeholder:text-[#8892a0] shadow-[var(--shadow-recessed-sm)] focus:outline-none focus:ring-2 focus:ring-[#ff4757]/60 focus:border-[#ff4757] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#666666] hover:text-[#1a1a1a] cursor-pointer"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#ff4757]" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Teacher Error Notice */}
              {teacherError && (
                <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{teacherError}</span>
                </div>
              )}

              {/* Quick Fill Credentials for Convenience */}
              <div className="bg-[#d8e0ec] rounded-xl p-2.5 border border-[#babecc]/50 text-xs text-[#555] space-y-1.5">
                <span className="text-[11px] font-bold text-[#444] uppercase font-mono block">
                  Tài khoản đăng nhập được cấp:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTeacherUsername("admin");
                      setTeacherPassword("123456");
                      setTeacherError("");
                    }}
                    className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-left border border-white/80 text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-[#1a1a1a]">admin</div>
                    <div className="text-[#666]">Pass: 123456</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTeacherUsername("nguyenthiphuongnghi");
                      setTeacherPassword("123456");
                      setTeacherError("");
                    }}
                    className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-left border border-white/80 text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-[#ff4757]">nguyenthiphuongnghi</div>
                    <div className="text-[#666]">Pass: 123456</div>
                  </button>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#ff4757] hover:bg-[#e03949] text-white font-bold py-3.5 px-6 rounded-xl shadow-[var(--shadow-accent)] border border-white/30 active:shadow-[var(--shadow-accent-pressed)] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Đăng nhập cổng giáo viên</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Bottom Ventilation Grooves Tactile Detail */}
          <div className="flex justify-center items-center gap-1.5 mt-6 pt-2">
            <span className="w-1 h-3 rounded-full bg-[#b8c6d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
            <span className="w-1 h-4 rounded-full bg-[#b8c6d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
            <span className="w-1 h-3 rounded-full bg-[#b8c6d8] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </div>

      {/* Footer Support Info */}
      <div className="w-full max-w-lg mx-auto text-center mt-6 text-xs text-[#666666] relative z-10 space-y-1.5">
        <p className="flex items-center justify-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-[#ff4757]" />
          <span>Hỗ trợ phụ huynh & giải đáp: Cô Nghi</span>
          <span className="text-[#a3b1c6]">•</span>
          <span className="font-mono font-semibold text-[#1a1a1a]">0898 17 17 12</span>
        </p>
        <div className="text-[11px] text-[#8c98a9] leading-relaxed">
          <p>Bản quyền © 2026 Lớp Tiếng Anh Cô Nghi.</p>
          <p>Hệ thống quản lý học vụ phát triển bởi nien.work</p>
        </div>
      </div>
    </div>
  );
};
