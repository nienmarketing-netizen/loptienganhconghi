export interface BaremItem {
  id: string;
  label: string;
  points: number; // positive or negative
  icon: string;
  description: string;
  type: "earned" | "spent";
}

export interface BaremGroup {
  id: string;
  groupName: string;
  description: string;
  badge: string;
  items: BaremItem[];
}

export const TOKEN_BAREM_GROUPS: BaremGroup[] = [
  {
    id: "discipline",
    groupName: "Nhóm 1: Chuyên cần & kỷ luật",
    description: "Xây dựng thói quen kỷ luật, đúng giờ và trách nhiệm bài vở",
    badge: "Kỷ luật",
    items: [
      {
        id: "b-punctual",
        label: "Đi học đúng giờ và đầy đủ",
        points: 1,
        icon: "⏰",
        description: "Có mặt trước giờ học, chuẩn bị đầy đủ sách vở đồ dùng",
        type: "earned",
      },
      {
        id: "b-hw-complete",
        label: "Làm đầy đủ bài tập được giao",
        points: 1,
        icon: "📝",
        description: "Hoàn thành 100% nhiệm vụ bài tập về nhà trước hạn chót",
        type: "earned",
      },
      {
        id: "b-absence",
        label: "Nghỉ học 1 buổi (không lý do/nghỉ học)",
        points: -1,
        icon: "⚠️",
        description: "Vắng mặt không phép hoặc nghỉ học không có lý do chính đáng",
        type: "spent",
      },
    ],
  },
  {
    id: "learning",
    groupName: "Nhóm 2: Tương tác & học tập",
    description: "Tinh thần hăng hái, phản xạ nhanh và sự tự tin trên lớp",
    badge: "Tương tác",
    items: [
      {
        id: "b-quiz-top1",
        label: "Quizizz - Nhanh & đúng nhất (Top 1)",
        points: 3,
        icon: "🥇",
        description: "Quán quân minigame kiểm tra từ vựng & ngữ pháp trên Quizizz",
        type: "earned",
      },
      {
        id: "b-quiz-top2",
        label: "Quizizz - Nhanh & đúng nhì (Top 2)",
        points: 2,
        icon: "🥈",
        description: "Á quân bảng xếp hạng đấu trường Quizizz của lớp",
        type: "earned",
      },
      {
        id: "b-quiz-top3",
        label: "Quizizz - Nhanh & đúng ba (Top 3)",
        points: 1,
        icon: "🥉",
        description: "Top 3 chung cuộc minigame củng cố kiến thức tại lớp",
        type: "earned",
      },
      {
        id: "b-cold-call",
        label: "Trả lời tốt khi bị gọi ngẫu nhiên (Cold Call)",
        points: 1,
        icon: "🎯",
        description: "Phản xạ tự tin, bóc tách câu chuẩn xác khi cô giáo gọi bất ngờ",
        type: "earned",
      },
    ],
  },
  {
    id: "milestones",
    groupName: "Nhóm 3: Thưởng/trừ cột mốc (milestones)",
    description: "Ghi nhận sự bứt phá kết quả thi cử và cột mốc nhập học",
    badge: "Cột mốc",
    items: [
      {
        id: "b-kickstart",
        label: "Kickstart Bonus (Thưởng đăng ký học)",
        points: 5,
        icon: "🚀",
        description: "Thưởng 1 lần lúc tạo tài khoản & gia nhập lớp Cô Nghi",
        type: "earned",
      },
      {
        id: "b-midterm-up",
        label: "Tăng điểm thi Giữa kỳ trên trường",
        points: 5,
        icon: "📈",
        description: "Điểm thi Giữa kỳ trên trường cao hơn mốc khảo sát/kỳ trước",
        type: "earned",
      },
      {
        id: "b-midterm-down",
        label: "Giảm điểm thi Giữa kỳ trên trường",
        points: -5,
        icon: "📉",
        description: "Điểm thi Giữa kỳ sụt giảm so với kỳ trước",
        type: "spent",
      },
      {
        id: "b-final-up",
        label: "Tăng điểm thi Cuối kỳ trên trường",
        points: 10,
        icon: "⭐",
        description: "Bứt phá ngoạn mục trong kỳ thi Học kỳ chính thức tại trường",
        type: "earned",
      },
      {
        id: "b-final-down",
        label: "Giảm điểm thi Cuối kỳ trên trường",
        points: -10,
        icon: "🔻",
        description: "Điểm thi Cuối kỳ sụt giảm so với mục tiêu đề ra",
        type: "spent",
      },
    ],
  },
];

export interface RewardTier {
  id: string;
  milestoneTokens: number;
  deductTokens: number;
  name: string;
  shortTitle: string;
  emoji: string;
  description: string;
  ruleNote: string;
  type: "standard" | "choice50";
  choiceA?: {
    name: string;
    description: string;
    emoji: string;
    deductTokens: number;
  };
  choiceB?: {
    name: string;
    description: string;
    emoji: string;
    winTokens: number; // 100
    loseTokens: number; // 25
  };
}

export const REWARD_TIERS: RewardTier[] = [
  {
    id: "tier-25",
    milestoneTokens: 25,
    deductTokens: 25,
    name: "Thẻ Đặc Quyền - Chỗ ngồi yêu thích",
    shortTitle: "Chọn chỗ ngồi (1 tuần)",
    emoji: "🪑",
    description: "Tự do chọn chỗ ngồi yêu thích trong 1 tuần học.",
    ruleNote: "Đổi xong sẽ reset trừ 25 Tokens.",
    type: "standard",
  },
  {
    id: "tier-50",
    milestoneTokens: 50,
    deductTokens: 50,
    name: "Mốc 50 Tokens: Chọn 1 trong 2",
    shortTitle: "Sổ Flashcard hoặc Chiếc Nón Kỳ Diệu",
    emoji: "⚡",
    description: "Học sinh được lựa chọn giữa phương án an toàn hoặc thử thách rủi ro!",
    ruleNote: "Lựa chọn A trừ 50T về 0. Lựa chọn B quay bánh xe x2 lên 100T hoặc ÷2 xuống 25T.",
    type: "choice50",
    choiceA: {
      name: "Lựa chọn A (An toàn): Nhận 1 Sổ Flashcard học từ vựng",
      description: "Sổ Flashcard học từ vựng thiết kế chuyên dụng cho học sinh chuyên ngữ. Đổi xong sẽ trừ 50 Tokens về 0.",
      emoji: "📓",
      deductTokens: 50,
    },
    choiceB: {
      name: "Lựa chọn B (Thách đấu rủi ro): Quay 'Chiếc Nón Kỳ Diệu'",
      description: "Quay bánh xe may mắn: Kết quả 1 nhân đôi lên 100 Tokens (chạm đỉnh Đại Bảo Rương), Kết quả 2 chia đôi giáng xuống 25 Tokens.",
      emoji: "🎡",
      winTokens: 100,
      loseTokens: 25,
    },
  },
  {
    id: "tier-75",
    milestoneTokens: 75,
    deductTokens: 75,
    name: "Thẻ đồ uống yêu thích",
    shortTitle: "Trà sữa / Nước ép",
    emoji: "🧋",
    description: "1 Món đồ uống yêu thích như Trà sữa hoặc Nước ép do con tự chọn.",
    ruleNote: "Đổi xong sẽ reset trừ 75 Tokens.",
    type: "standard",
  },
  {
    id: "tier-100",
    milestoneTokens: 100,
    deductTokens: 100,
    name: "ĐẠI BẢO RƯƠNG",
    shortTitle: "Quà giá trị dưới 100k",
    emoji: "👑",
    description: "1 Món quà giá trị dưới 100k theo sở thích và nguyện vọng của con.",
    ruleNote: "Đạt đỉnh vinh quang - Đổi xong sẽ reset trừ 100 Tokens.",
    type: "standard",
  },
];
