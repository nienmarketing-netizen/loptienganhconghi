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
  Sparkles,
  Trophy,
  Flame,
  Star,
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
      localStorage.setItem(`student_auth_${cleanInput}`, "true");
      localStorage.setItem("current_authorized_student", cleanInput);
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
      localStorage.setItem(`student_auth_${foundStudent.slug}`, "true");
      localStorage.setItem("current_authorized_student", foundStudent.slug);
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
    <div className="min-h-screen bg-gradient-to-b from-[#F2F4FD] via-[#F6F7FF] to-[#ECEFFA] flex flex-col justify-between py-6 px-3.5 sm:px-6 relative text-slate-800">
      {/* Decorative soft pastel ambient shapes inspired by Learnly style */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#635BFF]/8 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#FFB800]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#48D1CC]/10 blur-3xl" />
      </div>

      {/* Top Header Navigation Bar */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between mb-5 sm:mb-7 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#635BFF] to-[#8B83FF] flex items-center justify-center text-white shadow-[0_6px_16px_rgba(99,91,255,0.3)]">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight block">
              Lớp Tiếng Anh Cô Nghi
            </span>
            <span className="text-xs text-slate-500 font-medium block">
              Hành trình học tập & rèn luyện mỗi ngày
            </span>
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-lg mx-auto relative z-10 my-auto">
        <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 border border-indigo-100/70 shadow-[0_20px_50px_rgba(99,91,255,0.09),0_2px_8px_rgba(0,0,0,0.02)] relative">
          
          {/* Header Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#635BFF]/10 text-[#635BFF] font-semibold text-xs mb-3">
              <span>Learning Adventures</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Đăng nhập cổng học vụ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Nơi học sinh tra cứu tiến độ, điểm thưởng và bài học mỗi ngày
            </p>

            {/* Quick Learnly feature highlights */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
              <div className="bg-[#F8F9FE] border border-indigo-50 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-[#635BFF] flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 fill-[#635BFF] text-[#635BFF]" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Biểu đồ điểm</span>
                <span className="text-[10px] text-slate-400">Từng bài học</span>
              </div>
              <div className="bg-[#F8F9FE] border border-indigo-50 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                  <Trophy className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Kho Tokens</span>
                <span className="text-[10px] text-slate-400">Đổi quà vui</span>
              </div>
              <div className="bg-[#F8F9FE] border border-indigo-50 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-[11px] font-bold text-slate-800">Nhận xét</span>
                <span className="text-[10px] text-slate-400">Từ Cô Nghi</span>
              </div>
            </div>
          </div>

          {/* Learnly Style Pill Switcher */}
          <div className="bg-[#F0F2FD] p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("parent");
                setParentError("");
              }}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "parent"
                  ? "bg-[#635BFF] text-white shadow-[0_4px_14px_rgba(99,91,255,0.35)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Phụ huynh & Học sinh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("teacher");
                setTeacherError("");
              }}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "teacher"
                  ? "bg-[#635BFF] text-white shadow-[0_4px_14px_rgba(99,91,255,0.35)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Giáo viên quản lý</span>
            </button>
          </div>

          {/* TAB 1: PARENT FORM */}
          {activeTab === "parent" && (
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div className="bg-[#F5F6FF] border border-indigo-100 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#635BFF]" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-semibold">Ba mẹ lưu ý:</strong> Nhập đúng{" "}
                  <span className="font-bold text-[#635BFF] font-mono">Mã học sinh</span> (được cấp
                  khi nhập học) để mở hồ sơ học tập và bảng điểm của con.
                </p>
              </div>

              {/* Input: Student Code */}
              <div className="space-y-2">
                <label
                  htmlFor="student-code-input"
                  className="block text-xs font-bold tracking-wide text-slate-600"
                >
                  Mã học sinh của con
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-5 h-5 text-[#635BFF]" />
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
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FE] border border-indigo-100 rounded-2xl text-slate-900 font-mono text-base font-bold uppercase tracking-wider placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#635BFF]/15 focus:border-[#635BFF] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                </div>

                {/* Quick Selection Pills */}
                <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-slate-500">
                  <span className="font-medium text-slate-400">Mã xem thử:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentCode("G6-T7CC1-03");
                      if (parentError) setParentError("");
                    }}
                    className="px-2.5 py-1 rounded-xl bg-[#635BFF]/10 hover:bg-[#635BFF]/20 text-[#635BFF] font-mono font-bold transition-colors cursor-pointer border border-[#635BFF]/20"
                  >
                    G6-T7CC1-03
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentCode("G7-CN2-05");
                      if (parentError) setParentError("");
                    }}
                    className="px-2.5 py-1 rounded-xl bg-[#635BFF]/10 hover:bg-[#635BFF]/20 text-[#635BFF] font-mono font-bold transition-colors cursor-pointer border border-[#635BFF]/20"
                  >
                    G7-CN2-05
                  </button>
                </div>
              </div>

              {/* Error Notice */}
              {parentError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{parentError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#635BFF] hover:bg-[#5248E5] text-white font-bold py-3.5 px-6 rounded-2xl shadow-[0_8px_22px_rgba(99,91,255,0.38)] active:translate-y-[1px] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Truy cập hồ sơ học tập</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: TEACHER FORM */}
          {activeTab === "teacher" && (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="bg-[#F5F6FF] border border-indigo-100 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#635BFF]" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-semibold">Cổng Giáo viên:</strong> Nhập
                  tài khoản để quản lý danh sách học sinh, điểm danh, chấm bài và cấp tokens.
                </p>
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <label
                  htmlFor="teacher-username-input"
                  className="block text-xs font-bold tracking-wide uppercase text-slate-600"
                >
                  TÊN ĐĂNG NHẬP / ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5 text-[#635BFF]" />
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
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F8F9FE] border border-indigo-100 rounded-2xl text-slate-900 font-medium text-base placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#635BFF]/15 focus:border-[#635BFF] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="teacher-password-input"
                  className="block text-xs font-bold tracking-wide uppercase text-slate-600"
                >
                  MẬT KHẨU
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5 text-[#635BFF]" />
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
                    className="w-full pl-12 pr-12 py-3.5 bg-[#F8F9FE] border border-indigo-100 rounded-2xl text-slate-900 font-medium text-base placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#635BFF]/15 focus:border-[#635BFF] transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-[#635BFF]" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Notice */}
              {teacherError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{teacherError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#635BFF] hover:bg-[#5248E5] text-white font-bold py-3.5 px-6 rounded-2xl shadow-[0_8px_22px_rgba(99,91,255,0.38)] active:translate-y-[1px] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Đăng nhập cổng giáo viên</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer Support Info */}
      <div className="w-full max-w-lg mx-auto text-center mt-6 text-xs text-slate-500 relative z-10 space-y-2">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xs border border-indigo-50 shadow-xs">
          <PhoneCall className="w-3.5 h-3.5 text-[#635BFF] shrink-0" />
          <span>Hỗ trợ phụ huynh:</span>
          <span className="font-bold text-slate-800">Cô Nghi</span>
          <a
            href="tel:0898171712"
            className="font-mono font-bold text-[#635BFF] hover:underline cursor-pointer ml-1"
            title="Gọi ngay cho Cô Nghi"
          >
            0898 17 17 12
          </a>
        </div>
        <div className="text-[11px] text-slate-400 leading-relaxed">
          <p>Bản quyền © 2026 Lớp Tiếng Anh Cô Nghi.</p>
          <p>
            Hệ thống học vụ phát triển bởi{" "}
            <a
              href="https://www.nien.work"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-[#635BFF] font-medium underline underline-offset-2 transition-colors cursor-pointer"
            >
              nien.work
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

