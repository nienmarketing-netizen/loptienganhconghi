import React, { useState, useEffect } from "react";
import {
  X,
  Coins,
  CheckCircle2,
  Trash2,
  Edit2,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
} from "lucide-react";
import { StudentProfile, TokenHistoryItem } from "../types";
import { useLockBodyScroll } from "../lib/useLockBodyScroll";

interface ScoringOption {
  id: string;
  points: number;
  label: string;
  reason: string;
  icon: string;
  group: string;
}

const PRESET_SCORING_OPTIONS: ScoringOption[] = [
  // Nhóm 1: Chuyên cần & Kỷ luật
  {
    id: "attend_ontime",
    points: 1,
    label: "+1 Đi học đúng giờ & đủ",
    reason: "Đi học đúng giờ và đầy đủ",
    icon: "⏰",
    group: "Chuyên cần & Kỷ luật",
  },
  {
    id: "homework_done",
    points: 1,
    label: "+1 Làm đầy đủ bài tập",
    reason: "Làm đầy đủ bài tập được giao",
    icon: "📝",
    group: "Chuyên cần & Kỷ luật",
  },
  {
    id: "absence_penalty",
    points: -1,
    label: "-1 Nghỉ học 1 buổi",
    reason: "Nghỉ học 1 buổi (không lý do/nghỉ học)",
    icon: "⚠️",
    group: "Chuyên cần & Kỷ luật",
  },
  // Nhóm 2: Tương tác & Học tập
  {
    id: "quizizz_top1",
    points: 3,
    label: "+3 Quizizz - Top 1",
    reason: "Quizizz - Nhanh & đúng nhất (Top 1)",
    icon: "🥇",
    group: "Tương tác & Học tập",
  },
  {
    id: "quizizz_top2",
    points: 2,
    label: "+2 Quizizz - Top 2",
    reason: "Quizizz - Nhanh & đúng nhì (Top 2)",
    icon: "🥈",
    group: "Tương tác & Học tập",
  },
  {
    id: "quizizz_top3",
    points: 1,
    label: "+1 Quizizz - Top 3",
    reason: "Quizizz - Nhanh & đúng ba (Top 3)",
    icon: "🥉",
    group: "Tương tác & Học tập",
  },
  {
    id: "cold_call_good",
    points: 1,
    label: "+1 Cold Call tốt",
    reason: "Trả lời tốt khi bị gọi ngẫu nhiên (Cold Call)",
    icon: "🎯",
    group: "Tương tác & Học tập",
  },
  // Nhóm 3: Cột mốc & Thành tích
  {
    id: "kickstart_bonus",
    points: 5,
    label: "+5 Kickstart Bonus",
    reason: "Kickstart Bonus (Thưởng đăng ký học)",
    icon: "🚀",
    group: "Cột mốc & Thành tích",
  },
  {
    id: "midterm_up",
    points: 5,
    label: "+5 Tăng điểm thi Giữa kỳ",
    reason: "Tăng điểm thi Giữa kỳ trên trường",
    icon: "📈",
    group: "Cột mốc & Thành tích",
  },
  {
    id: "midterm_down",
    points: -5,
    label: "-5 Giảm điểm thi Giữa kỳ",
    reason: "Giảm điểm thi Giữa kỳ trên trường",
    icon: "📉",
    group: "Cột mốc & Thành tích",
  },
  {
    id: "final_up",
    points: 10,
    label: "+10 Tăng điểm thi Cuối kỳ",
    reason: "Tăng điểm thi Cuối kỳ trên trường",
    icon: "⭐",
    group: "Cột mốc & Thành tích",
  },
  {
    id: "final_down",
    points: -10,
    label: "-10 Giảm điểm thi Cuối kỳ",
    reason: "Giảm điểm thi Cuối kỳ trên trường",
    icon: "🔻",
    group: "Cột mốc & Thành tích",
  },
];

interface TokenManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  onSaveStudent?: (student: StudentProfile) => Promise<void> | void;
  onAddToast?: (
    type: "success" | "info" | "token",
    title: string,
    description: string
  ) => void;
}

export const TokenManagerModal: React.FC<TokenManagerModalProps> = ({
  isOpen,
  onClose,
  student,
  onSaveStudent,
  onAddToast,
}) => {
  useLockBodyScroll(isOpen);

  // Active View Tab on mobile
  const [activeTab, setActiveTab] = useState<"add" | "history">("add");

  // Selection for Step 1: Mapping optionId -> quantity selected (default 1 when chosen)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  // Custom token adjustment input
  const [customSign, setCustomSign] = useState<"+" | "-">("+");
  const [customPoints, setCustomPoints] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  // History Filter: "today" vs "all"
  const [historyFilter, setHistoryFilter] = useState<"today" | "all">("today");

  // Editing existing history item state - restricted to Barem options only
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedEditOptionId, setSelectedEditOptionId] = useState<string>(
    PRESET_SCORING_OPTIONS[0].id
  );

  // Local student state to allow immediate smooth edits
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(student);

  useEffect(() => {
    setCurrentStudent(student);
    setSelectedOptions({});
    setCustomPoints("");
    setCustomReason("");
    setEditingItemId(null);
    setActiveTab("add");
    setHistoryFilter("today");
  }, [student, isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentStudent) return null;

  // Toggle selection for a preset option
  const toggleOption = (optId: string) => {
    setSelectedOptions((prev) => {
      const copy = { ...prev };
      if (copy[optId]) {
        delete copy[optId];
      } else {
        copy[optId] = 1;
      }
      return copy;
    });
  };

  // Calculate total tokens from selected presets + custom
  const selectedPresetsTotal = Object.entries(selectedOptions).reduce(
    (acc, [id, count]) => {
      const opt = PRESET_SCORING_OPTIONS.find((o) => o.id === id);
      return acc + (opt ? opt.points * count : 0);
    },
    0
  );

  const customPointsNum = parseInt(customPoints, 10);
  const validCustomPoints =
    !isNaN(customPointsNum) && customPointsNum > 0
      ? customSign === "+"
        ? customPointsNum
        : -customPointsNum
      : 0;

  const totalDelta = selectedPresetsTotal + validCustomPoints;
  const currentTokens = currentStudent.gamification?.currentTokens ?? 0;
  const projectedTokens = Math.max(0, currentTokens + totalDelta);
  const selectedCount =
    Object.keys(selectedOptions).length + (validCustomPoints !== 0 ? 1 : 0);

  // Helper date format for today (robust checking for Vietnamese & standard date strings)
  const now = new Date();
  const todayDay = String(now.getDate()).padStart(2, "0");
  const todayMonth = String(now.getMonth() + 1).padStart(2, "0");
  const todayYear = now.getFullYear();
  const todayStrShort = `${todayDay}/${todayMonth}`;
  const todayStrFull = `${todayDay}/${todayMonth}/${todayYear}`;
  const unpaddedShort = `${now.getDate()}/${now.getMonth() + 1}`;

  // Filter history entries for today
  const studentHistory = currentStudent.tokenHistory || [];
  const todayEntries = studentHistory.filter((item) => {
    if (!item.date) return false;
    return (
      item.date.includes(todayStrFull) ||
      item.date.includes(todayStrShort) ||
      item.date.includes(unpaddedShort)
    );
  });

  // Strict filter: When "today", ONLY show today's entries (even if 0)
  const displayedHistory =
    historyFilter === "today" ? todayEntries : studentHistory;

  // STEP 2: Execute Token Addition & Close Modal
  const handleApplyTokens = async () => {
    if (totalDelta === 0 && selectedCount === 0) return;

    const timeStr = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = `${timeStr}, ${todayStrFull}`;

    const newHistoryItems: TokenHistoryItem[] = [];

    // Add selected presets to history
    Object.entries(selectedOptions).forEach(([id, count]) => {
      const opt = PRESET_SCORING_OPTIONS.find((o) => o.id === id);
      if (!opt) return;

      for (let i = 0; i < count; i++) {
        newHistoryItems.push({
          id: `tk-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          date: dateStr,
          reason: opt.reason,
          tokens: opt.points,
          type: opt.points >= 0 ? "earned" : "spent",
          category:
            opt.group === "Chuyên cần & Kỷ luật"
              ? "discipline"
              : opt.group === "Tương tác & Học tập"
              ? "test"
              : "bonus",
        });
      }
    });

    // Add custom points if entered
    if (validCustomPoints !== 0) {
      newHistoryItems.push({
        id: `tk-${Date.now()}-custom`,
        date: dateStr,
        reason:
          customReason.trim() ||
          (validCustomPoints > 0
            ? "Điểm thưởng bổ sung của Cô Nghi"
            : "Trừ điểm nhắc nhở"),
        tokens: validCustomPoints,
        type: validCustomPoints >= 0 ? "earned" : "spent",
        category: validCustomPoints >= 0 ? "bonus" : "discipline",
      });
    }

    const updatedHistory = [...newHistoryItems, ...studentHistory];
    const newStudentState: StudentProfile = {
      ...currentStudent,
      gamification: {
        ...currentStudent.gamification,
        currentTokens: projectedTokens,
      },
      tokenHistory: updatedHistory,
    };

    setCurrentStudent(newStudentState);

    if (onSaveStudent) {
      await onSaveStudent(newStudentState);
    }

    if (onAddToast) {
      const signStr = totalDelta > 0 ? `+${totalDelta}` : `${totalDelta}`;
      onAddToast(
        "token",
        `${signStr} Tokens cho ${currentStudent.fullName}!`,
        `Đã cập nhật ${selectedCount} tiêu chí. Số dư mới: ${projectedTokens}/100T`
      );
    }

    onClose();
  };

  // Revert / Delete a token history entry
  const handleDeleteHistoryItem = async (item: TokenHistoryItem) => {
    const isConfirmed = window.confirm(
      `Hoàn tác lượt: "${item.reason}" (${item.tokens > 0 ? `+${item.tokens}` : item.tokens}T)?\nSố dư sẽ tự động được cân bằng lại.`
    );
    if (!isConfirmed) return;

    // To revert: subtract the tokens that were added (or add back if it was negative)
    const tokenAdjustment = -item.tokens;
    const adjustedTokens = Math.max(0, currentTokens + tokenAdjustment);
    const updatedHistory = studentHistory.filter((h) => h.id !== item.id);

    const updatedStudent: StudentProfile = {
      ...currentStudent,
      gamification: {
        ...currentStudent.gamification,
        currentTokens: adjustedTokens,
      },
      tokenHistory: updatedHistory,
    };

    setCurrentStudent(updatedStudent);

    if (onSaveStudent) {
      await onSaveStudent(updatedStudent);
    }

    if (onAddToast) {
      onAddToast(
        "info",
        `Đã hoàn tác lượt token của ${currentStudent.fullName}`,
        `Số dư điều chỉnh từ ${currentTokens}T sang ${adjustedTokens}T.`
      );
    }
  };

  // Start editing a history item (restricted to Barem options only)
  const handleStartEdit = (item: TokenHistoryItem) => {
    setEditingItemId(item.id);
    const matched =
      PRESET_SCORING_OPTIONS.find(
        (o) => o.points === item.tokens && o.reason === item.reason
      ) ||
      PRESET_SCORING_OPTIONS.find((o) => o.points === item.tokens) ||
      PRESET_SCORING_OPTIONS[0];
    setSelectedEditOptionId(matched.id);
  };

  // Save edited history item from Barem
  const handleSaveEditItem = async (item: TokenHistoryItem) => {
    const chosenOpt = PRESET_SCORING_OPTIONS.find(
      (o) => o.id === selectedEditOptionId
    );
    if (!chosenOpt) return;

    const diff = chosenOpt.points - item.tokens;
    const adjustedTokens = Math.max(0, currentTokens + diff);

    const updatedHistory = studentHistory.map((h) => {
      if (h.id === item.id) {
        return {
          ...h,
          tokens: chosenOpt.points,
          reason: chosenOpt.reason,
          type: (chosenOpt.points >= 0 ? "earned" : "spent") as "earned" | "spent",
          category:
            chosenOpt.group === "Chuyên cần & Kỷ luật"
              ? ("discipline" as const)
              : chosenOpt.group === "Tương tác & Học tập"
              ? ("test" as const)
              : ("bonus" as const),
        };
      }
      return h;
    });

    const updatedStudent: StudentProfile = {
      ...currentStudent,
      gamification: {
        ...currentStudent.gamification,
        currentTokens: adjustedTokens,
      },
      tokenHistory: updatedHistory,
    };

    setCurrentStudent(updatedStudent);
    setEditingItemId(null);

    if (onSaveStudent) {
      await onSaveStudent(updatedStudent);
    }

    if (onAddToast) {
      onAddToast(
        "success",
        `Đã sửa lượt token thành công!`,
        `Cập nhật theo Barem: "${chosenOpt.label}". Số dư mới: ${adjustedTokens}T`
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#e0e5ec] text-[#1a1a1a] flex flex-col w-screen h-screen overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* 1. TOP INDUSTRIAL HEADER */}
      <header className="bg-[#2d3436] text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md shrink-0 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.fullName}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30 border border-white/20 shrink-0"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full led-indicator-orange animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {currentStudent.fullName}
              </h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-white/10">
                {currentStudent.id}
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-medium">
              Quản lý & Chỉnh sửa Token học vụ
            </p>

            {/* YÊU CẦU 2: Hàng badge thể hiện "Số dư hiện tại..." ngay bên dưới thông tin học sinh */}
            <div className="mt-1 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/15 px-2.5 py-0.5 rounded-lg shadow-inner">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-neutral-300 font-medium">
                  Số dư hiện tại:
                </span>
                <span className="font-mono text-xs font-bold text-white">
                  {currentTokens}{" "}
                  <span className="text-[10px] text-amber-400 font-normal">
                    / 100 Tokens
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nút Đóng góc trên bên phải */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#ff4757] text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 shadow-xs cursor-pointer active:scale-95"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Đóng</span>
          </button>
        </div>
      </header>

      {/* MOBILE TABS SWITCHER */}
      <div className="lg:hidden flex border-b border-[#babecc]/60 bg-[#d1d9e6] px-3 pt-2 gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("add")}
          className={`flex-1 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "add"
              ? "bg-[#e0e5ec] text-[#ff4757] shadow-[var(--shadow-card-sm)] border-t border-x border-[#babecc]/60"
              : "text-[#666666] hover:text-[#1a1a1a]"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>1. Chọn Cộng/Trừ</span>
          {selectedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#ff4757] text-white font-mono">
              {selectedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "history"
              ? "bg-[#e0e5ec] text-[#ff4757] shadow-[var(--shadow-card-sm)] border-t border-x border-[#babecc]/60"
              : "text-[#666666] hover:text-[#1a1a1a]"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>2. Sửa Hôm Nay ({todayEntries.length})</span>
        </button>
      </div>

      {/* 2. MAIN CONTENT AREA (Scrolls independently, keeps footer sticky) */}
      <main className="flex-1 overflow-hidden p-3 sm:p-5 max-w-7xl w-full mx-auto flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 flex-1 overflow-hidden">
          {/* ======================================================== */}
          {/* CỘT TRÁI: TAB 1 - CHỌN CÁC TIÊU CHÍ CỘNG/TRỪ TOKEN      */}
          {/* ======================================================== */}
          <div
            className={`lg:col-span-7 flex flex-col h-full overflow-hidden ${
              activeTab !== "add" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="flex items-center justify-between pb-2.5 mb-1 border-b border-[#babecc]/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#ff4757] text-white flex items-center justify-center font-bold text-xs font-mono shadow-[var(--shadow-accent-sm)]">
                  1
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-tight">
                    Bước 1: Bấm chọn các tiêu chí cần cộng/trừ
                  </h3>
                  <p className="text-[11px] text-[#666666]">
                    Có thể chọn cùng lúc nhiều ô. Bấm lại vào ô để bỏ chọn.
                  </p>
                </div>
              </div>

              {selectedCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOptions({});
                    setCustomPoints("");
                    setCustomReason("");
                  }}
                  className="text-xs text-[#ff4757] hover:underline font-semibold cursor-pointer"
                >
                  Bỏ chọn tất cả ({selectedCount})
                </button>
              )}
            </div>

            {/* Presets List Scrollable Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-1">
              {[
                "Chuyên cần & Kỷ luật",
                "Tương tác & Học tập",
                "Cột mốc & Thành tích",
              ].map((groupName) => {
                const groupOpts = PRESET_SCORING_OPTIONS.filter(
                  (o) => o.group === groupName
                );
                return (
                  <div key={groupName} className="space-y-2">
                    <div className="text-[11px] font-bold text-[#4a5568] uppercase font-mono tracking-wider flex items-center gap-1.5 px-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff4757]" />
                      {groupName}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {groupOpts.map((opt) => {
                        const isSelected = Boolean(selectedOptions[opt.id]);
                        const isNegative = opt.points < 0;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleOption(opt.id)}
                            className={`p-3 rounded-xl text-left transition-all cursor-pointer relative flex items-center justify-between gap-3 border ${
                              isSelected
                                ? "bg-[#fff1f2] border-[#ff4757] shadow-[var(--shadow-recessed-sm)] ring-2 ring-[#ff4757]/30"
                                : "soft-ui-embossed-sm bg-[#e0e5ec] border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] hover:bg-[#d8e0ec] active:translate-y-[1px]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xl shrink-0 p-1.5 rounded-lg bg-[#d1d9e6] border border-[#babecc]/50">
                                {opt.icon}
                              </span>
                              <div className="min-w-0">
                                <div
                                  className={`font-bold text-xs truncate ${
                                    isSelected
                                      ? "text-[#ff4757]"
                                      : "text-[#1a1a1a]"
                                  }`}
                                >
                                  {opt.label}
                                </div>
                                <div className="text-[11px] text-[#666666] line-clamp-1">
                                  {opt.reason}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-xs font-mono font-black px-2 py-0.5 rounded-md shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] ${
                                  isNegative
                                    ? "text-rose-700 bg-rose-100 border border-rose-300"
                                    : "text-[#ff4757] bg-[#d1d9e6] border border-[#babecc]/60"
                                }`}
                              >
                                {opt.points > 0 ? `+${opt.points}` : opt.points}T
                              </span>

                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                  isSelected
                                    ? "bg-[#ff4757] text-white border-[#ff4757]"
                                    : "border-[#babecc] bg-[#d1d9e6]"
                                }`}
                              >
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Custom Scoring Box */}
              <div className="bg-[#d1d9e6] rounded-xl p-3 border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1a1a1a] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Hoặc nhập số Token tùy chỉnh:
                  </span>
                  {validCustomPoints !== 0 && (
                    <span className="text-xs font-mono font-bold text-[#ff4757]">
                      Đã ghi nhận:{" "}
                      {validCustomPoints > 0
                        ? `+${validCustomPoints}`
                        : validCustomPoints}
                      T
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCustomSign("+")}
                      className={`px-2.5 py-1.5 rounded-lg font-bold font-mono text-xs cursor-pointer border ${
                        customSign === "+"
                          ? "bg-[#ff4757] text-white border-white/30 shadow-xs"
                          : "bg-[#e0e5ec] text-[#666666] border-[#babecc]"
                      }`}
                    >
                      + Cộng
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomSign("-")}
                      className={`px-2.5 py-1.5 rounded-lg font-bold font-mono text-xs cursor-pointer border ${
                        customSign === "-"
                          ? "bg-rose-600 text-white border-white/30 shadow-xs"
                          : "bg-[#e0e5ec] text-[#666666] border-[#babecc]"
                      }`}
                    >
                      - Trừ
                    </button>
                  </div>

                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={customPoints}
                    onChange={(e) => setCustomPoints(e.target.value)}
                    placeholder="Số lượng (VD: 3)"
                    className="w-full sm:w-28 px-3 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] text-xs font-mono text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#ff4757] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]"
                  />

                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Lý do (Tùy chọn, VD: Thưởng phụ đạo)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#e0e5ec] border border-[#babecc] text-xs text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#ff4757] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CỘT PHẢI: TAB 2 - NHẬT KÝ & CHỈNH SỬA TOKEN HÔM NAY      */}
          {/* ======================================================== */}
          <div
            className={`lg:col-span-5 flex flex-col h-full overflow-hidden bg-[#e0e5ec] rounded-2xl border border-white/80 border-b-[#babecc] border-r-[#babecc] p-3.5 shadow-[var(--shadow-card)] ${
              activeTab !== "history" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Header: Nhật ký hôm nay & Chỉnh sửa */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#babecc]/60 shrink-0">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#ff4757]" />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#1a1a1a] tracking-tight">
                    Nhật ký & Chỉnh sửa token
                  </h3>
                  <p className="text-[11px] text-[#666666]">
                    Sửa số điểm theo Barem hoặc hoàn tác nếu giáo viên lỡ bấm nhầm
                  </p>
                </div>
              </div>

              {/* YÊU CẦU 4.1: Bộ lọc chính xác "Hôm nay ()" vs "Tất cả ()" */}
              <div className="flex items-center gap-1 bg-[#d1d9e6] p-0.5 rounded-lg border border-[#babecc]/60">
                <button
                  type="button"
                  onClick={() => setHistoryFilter("today")}
                  className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    historyFilter === "today"
                      ? "bg-[#ff4757] text-white shadow-xs"
                      : "text-[#666666] hover:text-[#1a1a1a]"
                  }`}
                >
                  Hôm nay ({todayEntries.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter("all")}
                  className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                    historyFilter === "all"
                      ? "bg-[#ff4757] text-white shadow-xs"
                      : "text-[#666666] hover:text-[#1a1a1a]"
                  }`}
                >
                  Tất cả ({studentHistory.length})
                </button>
              </div>
            </div>

            {/* List of Token History Items */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
              {displayedHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#d1d9e6]/50 rounded-xl border border-dashed border-[#babecc] text-[#666666]">
                  <Clock className="w-8 h-8 text-[#babecc] mb-2" />
                  <p className="text-xs font-semibold text-[#1a1a1a]">
                    Chưa có lượt cộng/trừ nào trong ngày hôm nay
                  </p>
                  <p className="text-[11px] mt-1 max-w-xs text-[#666666]">
                    Sau khi giáo viên cộng điểm ở tab Chọn Cộng/Trừ, lịch sử sẽ xuất hiện ở đây để cô có thể sửa hoặc xóa bất cứ lúc nào.
                  </p>
                  {studentHistory.length > 0 && historyFilter === "today" && (
                    <button
                      type="button"
                      onClick={() => setHistoryFilter("all")}
                      className="mt-3 text-xs font-bold text-[#ff4757] hover:underline cursor-pointer"
                    >
                      Xem tất cả lịch sử trước đó ({studentHistory.length} mục)
                    </button>
                  )}
                </div>
              ) : (
                displayedHistory.map((item) => {
                  const isEditing = editingItemId === item.id;
                  const isPositive = item.tokens > 0;

                  // YÊU CẦU 4.2: CHỈNH SỬA THEO BAREM, KHÔNG CHO TÙY CHỈNH TỰ DO
                  if (isEditing) {
                    const chosenBaremOpt =
                      PRESET_SCORING_OPTIONS.find(
                        (o) => o.id === selectedEditOptionId
                      ) || PRESET_SCORING_OPTIONS[0];

                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-white border-2 border-[#ff4757] shadow-md space-y-3 animate-in fade-in duration-150"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#ff4757]">
                          <span className="flex items-center gap-1.5">
                            <Edit2 className="w-3.5 h-3.5" />
                            Chỉnh sửa theo Barem:
                          </span>
                          <span className="font-mono text-[11px] text-[#666666]">
                            {item.date}
                          </span>
                        </div>

                        {/* Chọn tiêu chí từ Barem */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#4a5568] uppercase tracking-wider block">
                            Chọn lại mục quy định trong Barem:
                          </label>
                          <select
                            value={selectedEditOptionId}
                            onChange={(e) =>
                              setSelectedEditOptionId(e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#d1d9e6] border border-[#babecc] text-xs font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#ff4757] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] cursor-pointer"
                          >
                            {[
                              "Chuyên cần & Kỷ luật",
                              "Tương tác & Học tập",
                              "Cột mốc & Thành tích",
                            ].map((groupName) => (
                              <optgroup key={groupName} label={groupName}>
                                {PRESET_SCORING_OPTIONS.filter(
                                  (o) => o.group === groupName
                                ).map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.icon} {opt.label} (
                                    {opt.points > 0
                                      ? `+${opt.points}`
                                      : opt.points}
                                    T)
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        {/* Preview chi tiết mục barem đã chọn */}
                        <div className="p-2.5 rounded-xl bg-[#e0e5ec] border border-[#babecc]/60 flex items-center justify-between text-xs shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-[#1a1a1a] flex items-center gap-1.5 truncate">
                              <span>{chosenBaremOpt.icon}</span>
                              <span>{chosenBaremOpt.label}</span>
                            </div>
                            <div className="text-[11px] text-[#666666] line-clamp-1">
                              {chosenBaremOpt.reason}
                            </div>
                          </div>
                          <span
                            className={`font-mono font-black px-2 py-0.5 rounded text-xs shrink-0 ${
                              chosenBaremOpt.points > 0
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-rose-100 text-rose-800 border border-rose-300"
                            }`}
                          >
                            {chosenBaremOpt.points > 0
                              ? `+${chosenBaremOpt.points}`
                              : chosenBaremOpt.points}
                            T
                          </span>
                        </div>

                        {/* Nút hành động Lưu / Hủy */}
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#666666] hover:bg-neutral-100 cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEditItem(item)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#ff4757] hover:bg-[#e03949] text-white shadow-xs cursor-pointer flex items-center gap-1.5 active:translate-y-[1px]"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Lưu thay đổi</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-[#e0e5ec] border border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] flex items-center justify-between gap-2.5 hover:bg-[#d8e0ec] transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`font-mono text-xs font-black px-2 py-1 rounded-md shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)] ${
                            isPositive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {isPositive ? `+${item.tokens}` : item.tokens}T
                        </span>

                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#1a1a1a] truncate">
                            {item.reason}
                          </div>
                          <div className="text-[10px] text-[#666666] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Edit & Delete/Revert */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="w-7 h-7 rounded-lg bg-[#d1d9e6] hover:bg-white text-[#4a5568] hover:text-[#1a1a1a] flex items-center justify-center border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] cursor-pointer transition-colors"
                          title="Chỉnh sửa theo Barem"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteHistoryItem(item)}
                          className="w-7 h-7 rounded-lg bg-[#d1d9e6] hover:bg-rose-100 text-[#4a5568] hover:text-rose-700 flex items-center justify-center border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)] cursor-pointer transition-colors"
                          title="Hoàn tác / Xóa lượt này (cân bằng lại số dư)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* YÊU CẦU 3.1: THANH STICKY DƯỚI ĐÁY POP-UP                 */}
      {/* ======================================================== */}
      <footer
        className={`sticky bottom-0 z-30 shrink-0 w-full bg-[#d1d9e6] border-t border-[#babecc] px-4 py-3 sm:py-3.5 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] ${
          activeTab === "history" ? "hidden lg:block" : "block"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#2d3436] text-white shadow-xs border border-white/20">
              <span className="text-[10px] font-mono text-neutral-300 uppercase">
                Dự kiến
              </span>
              <span className="text-base sm:text-lg font-bold font-mono text-amber-300 leading-tight">
                {projectedTokens}T
              </span>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
                  Đã chọn:{" "}
                  <span className="text-[#ff4757] font-mono font-bold">
                    {selectedCount}
                  </span>{" "}
                  tiêu chí
                </span>
                {totalDelta !== 0 && (
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                      totalDelta > 0
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    Biến động: {totalDelta > 0 ? `+${totalDelta}` : totalDelta}{" "}
                    Tokens
                  </span>
                )}
              </div>

              {/* YÊU CẦU 3.1: Phần text chuyển thành 2 hàng */}
              <div className="text-xs space-y-0.5 mt-1 font-medium leading-tight">
                <div className="text-[#666666]">
                  Số dư hiện tại:{" "}
                  <span className="font-bold text-[#1a1a1a] font-mono">
                    {currentTokens}T
                  </span>
                </div>
                <div className="text-[#1a1a1a]">
                  Sau cập nhật:{" "}
                  <span className="font-bold text-[#ff4757] font-mono">
                    {projectedTokens}T
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl soft-ui-convex text-[#666666] hover:text-[#1a1a1a] font-bold text-xs sm:text-sm border border-white/80 shadow-[var(--shadow-card-sm)] active:translate-y-[1px] transition-all cursor-pointer"
            >
              Hủy / Đóng
            </button>

            {/* YÊU CẦU 3.2: Nút đổi text thành "Bấm để cộng...tokens" */}
            <button
              type="button"
              id="btn-confirm-apply-tokens"
              disabled={selectedCount === 0 || totalDelta === 0}
              onClick={handleApplyTokens}
              className={`py-2.5 px-5 sm:px-7 rounded-xl font-bold font-mono text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/30 transition-all cursor-pointer ${
                selectedCount > 0 && totalDelta !== 0
                  ? "bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[var(--shadow-accent)] active:translate-y-[1px]"
                  : "bg-[#babecc] text-[#666666] opacity-60 cursor-not-allowed border-transparent shadow-none"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>
                {totalDelta >= 0
                  ? `Bấm để cộng +${totalDelta} tokens`
                  : `Bấm để trừ ${totalDelta} tokens`}
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
