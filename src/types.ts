export interface TokenHistoryItem {
  id: string;
  date: string;
  reason: string;
  tokens: number; // e.g. +5 or -100
  type: "earned" | "spent";
  category: "homework" | "test" | "speaking" | "discipline" | "reward" | "bonus";
}

export interface RewardItem {
  id: string;
  name: string;
  tokensCost: number;
  category: "stationery" | "book" | "entertainment" | "special";
  description: string;
  emoji: string;
  tag?: string;
}

export interface GrowthScorePoint {
  period: string; // e.g., "Tuần 1", "Tuần 2", "Giữa kỳ", "Tuần 5"
  classScore: number; // Điểm test tại lớp (thang 10)
  schoolScore: number; // Điểm thi trên trường (thang 10)
  note?: string;
}

export interface RadarCapabilityPoint {
  subject: string; // Từ vựng, Ngữ pháp, Nghe hiểu, Phát âm, Thái độ
  baseline: number; // Điểm ngày đầu nhập học (thang 100)
  current: number; // Điểm năng lực hiện tại (thang 100)
  fullMark: number; // 100
}

export interface LessonMediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title: string;
  timestamp?: string;
  duration?: string; // e.g. "0:45"
  tag?: string; // e.g. "Thuyết trình", "Làm bài tập", "Hoạt động nhóm"
  uploadedBy?: string; // e.g. "Cô Nghi"
}

export interface RecentLessonInfo {
  date: string; // e.g. "19/09/2026"
  lessonName: string; // e.g. "Buổi 16: Bóc tách Đề Chuyên & Ngữ pháp Unit 3"
  topic: string; // Nội dung học là gì
  skillsLearned?: string[];
  score: {
    value: number; // e.g. 9.2
    maxScore: number; // 10
    label: string; // e.g. "Điểm bài kiểm tra đầu giờ"
    ratingBadge?: string; // e.g. "Top 3 của lớp ⭐"
  };
  teacherFeedback: string; // Đánh giá của cô giáo
  attendanceStatus?: string; // e.g. "Đi học đúng giờ"
  mediaItems?: LessonMediaItem[];
}

export interface TeacherDiagnosticProfile {
  admissionDate: string; // Ngày nhập học
  baselineOverallScore: number; // Điểm chuẩn đầu vào thang 10 (ví dụ 4.5/10)
  currentOverallScore: number; // Điểm hiện tại
  diagnosisTitle: string; // e.g., "Mất gốc ngữ pháp, ngại giao tiếp"
  initialObservations: string; // Nhận xét chi tiết ngày đầu nhập học
  breakthroughAction: string; // Giải pháp Cô Nghi đã áp dụng
  messageToParents: string; // Lời nhắn gửi riêng cho mẹ/ba
}

export interface StudentProfile {
  id: string;
  slug: string;
  fullName: string;
  parentSalutation: string; // e.g. "mẹ bé Hoàng Nam" hoặc "ba bé Hà My"
  parentName: string; // e.g. "Chị Thu Hương"
  grade: string; // e.g. "Lớp 7 - K7A"
  school: string; // e.g. "THCS Trưng Vương"
  avatar: string;
  attitudeBadge: {
    label: string; // e.g. "Đang tiến bộ vượt bậc", "Tự giác & Chăm chỉ"
    variant: "success" | "warning" | "indigo" | "amber";
    iconName?: string;
  };
  gamification: {
    currentTokens: number; // e.g. 85
    maxTokens: number; // 100
    targetRewardName: string; // Món quà bé đang tích lũy đổi
  };
  growthHistory: GrowthScorePoint[];
  radarCapabilities: RadarCapabilityPoint[];
  teacherDiagnosis: TeacherDiagnosticProfile;
  tokenHistory: TokenHistoryItem[];
  assignments: Assignment[];
  recentLesson?: RecentLessonInfo;
}

export type AssignmentStatus = "not_done" | "submitted" | "graded";

export interface GradedCorrection {
  question: string;
  studentAnswer: string;
  teacherCorrection: string;
  explanation: string;
}

export interface GradedMediaItem {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  title: string;
  subtitle?: string;
  badge?: string;
  tag?: string;
  duration?: string;
  thumbnail?: string;
  uploadedBy?: string; // e.g. "Cô Nghi upload", "Học sinh tự sửa & nộp"
}

export interface GradedWorkDetails {
  gradedImage: string;
  gradedImages?: string[];
  gradedImageCaptions?: string[];
  mediaItems?: GradedMediaItem[];
  score: number;
  maxScore: number;
  feedbackTitle: string;
  comment: string;
  audioDuration?: number; // in seconds
  voiceTranscript: string;
  corrections: GradedCorrection[];
  teacherStamp: string; // e.g. "Cô Nghi đã chấm ⭐ Xuất sắc!"
}

export type AssignmentSkillType = "all" | "listening" | "speaking" | "reading" | "writing";

export interface AssignmentMaterial {
  id: string;
  type: "pdf" | "mp3" | "video" | "image";
  title: string;
  url: string;
  duration?: string; // e.g. "02:45"
  fileSize?: string; // e.g. "3.2 MB"
}

export interface SubmittedMediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
  duration?: string;
  thumbnail?: string;
  uploadedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  unit: string;
  description?: string; // Nội dung bài tập chi tiết
  teacherInstruction?: string; // Hướng dẫn từ cô Nghi
  skillType?: "writing" | "speaking" | "listening" | "reading";
  skillLabel?: string;
  deadline: string;
  formattedDeadlineBadge?: string;
  status: AssignmentStatus;
  tokensReward: number;
  pdfDownloadName: string;
  materials?: AssignmentMaterial[];
  submittedAt?: string;
  submissionImages?: string[];
  submissionVideos?: Array<{ url: string; title: string; duration?: string; thumbnail?: string }>;
  submissionMedia?: SubmittedMediaItem[];
  submissionNote?: string;
  gradedDetails?: GradedWorkDetails;
}
