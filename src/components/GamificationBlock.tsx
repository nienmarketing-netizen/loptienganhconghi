import React from "react";
import { History, Gift, ChevronRight, Award } from "lucide-react";
import { StudentProfile } from "../types";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";

interface GamificationBlockProps {
  student: StudentProfile;
  onOpenHistory: () => void;
  onOpenStore: () => void;
}

export const GamificationBlock: React.FC<GamificationBlockProps> = ({
  student,
  onOpenHistory,
  onOpenStore,
}) => {
  const currentTokens = student.gamification.currentTokens;
  const maxTokens = student.gamification.maxTokens;
  const remainingTokens = Math.max(0, maxTokens - currentTokens);
  const percentage = Math.min(100, Math.round((currentTokens / maxTokens) * 100));

  return (
    <div className="relative overflow-hidden soft-ui-embossed rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4">
      {/* Title & Badge */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#b2c2d4]/40">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
            <span>Hệ thống Gamification</span>
          </h3>
          <p className="text-xs text-[#666666] font-normal mt-0.5">Tích lũy nỗ lực đổi quà thưởng lớn</p>
        </div>

        <div className="flex items-center gap-1.5 soft-ui-convex text-[#1a1a1a] text-xs font-semibold px-3 py-1.5 rounded-md leading-tight">
          <Award className="w-3.5 h-3.5 text-[#ff4757]" />
          <span>100 Tokens</span>
        </div>
      </div>

      {/* Large Progress Display - Recessed Well */}
      <div className="soft-ui-debossed rounded-lg sm:rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-[#666666] block">
              Tiến độ đổi quà của con:
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#ff4757]">
                {currentTokens}
              </span>
              <span className="text-base sm:text-lg font-semibold text-[#666666]">
                /{maxTokens}
              </span>
              <span className="text-xs font-semibold text-[#1a1a1a] ml-1">Tokens</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-md border border-emerald-400 leading-tight">
              <span>{percentage}% hoàn thành</span>
            </span>
            <p className="text-xs text-[#666666] mt-1 font-normal">
              {remainingTokens > 0
                ? `Chỉ cần thêm ${remainingTokens} tokens`
                : "Đã đủ điểm đổi đại thưởng!"}
            </p>
          </div>
        </div>

        {/* Large Mechanical Progress Bar with Milestones */}
        <div className="space-y-1.5 pt-1">
          {/* Top Milestones: Token Counts */}
          <div className="relative h-4 text-xs font-bold font-mono text-[#666666]">
            <span className="absolute left-0 text-left">0</span>
            <span className="absolute left-[35%] -translate-x-1/2 text-center">35</span>
            <span className="absolute left-[70%] -translate-x-1/2 text-center">70</span>
            <span className="absolute right-0 text-right text-[#ff4757]">100</span>
          </div>

          {/* Progress bar with delicate milestone indicator lines */}
          <div className="relative flex items-center">
            {/* Delicate vertical milestone tick lines */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="relative w-full h-full">
                <span className="absolute left-0 -top-1 -bottom-1 w-[1.5px] bg-[#64748b]/50 rounded-full shadow-[0_0_1px_rgba(255,255,255,0.7)]" />
                <span className="absolute left-[35%] -top-1 -bottom-1 w-[1.5px] -translate-x-1/2 bg-[#64748b]/50 rounded-full shadow-[0_0_1px_rgba(255,255,255,0.7)]" />
                <span className="absolute left-[70%] -top-1 -bottom-1 w-[1.5px] -translate-x-1/2 bg-[#64748b]/50 rounded-full shadow-[0_0_1px_rgba(255,255,255,0.7)]" />
                <span className="absolute right-0 -top-1 -bottom-1 w-[1.5px] bg-[#64748b]/50 rounded-full shadow-[0_0_1px_rgba(255,255,255,0.7)]" />
              </div>
            </div>

            <Progress
              value={currentTokens}
              max={maxTokens}
              className="h-5 sm:h-6"
              indicatorClassName="bg-[#ff4757]"
              showStripes={true}
            />
          </div>

          {/* Bottom Milestones: Reward Icons */}
          <div className="relative h-5 sm:h-6 text-sm sm:text-base leading-none pt-0.5 select-none">
            <span className="absolute left-0 text-left" title="Khởi đầu">🌱</span>
            <span className="absolute left-[35%] -translate-x-1/2 text-center" title="Bút highlight">🖍️</span>
            <span className="absolute left-[70%] -translate-x-1/2 text-center" title="Trà sữa">🧋</span>
            <span className="absolute right-0 text-right" title="Vé xem phim">🎬</span>
          </div>
        </div>

        {/* Next Target Item Callout */}
        <div className="flex items-center justify-between text-xs soft-ui-convex rounded-md sm:rounded-lg p-2.5 sm:p-3 text-[#1a1a1a]">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span className="text-base shrink-0">🎯</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] sm:text-xs text-[#666666] font-medium leading-tight">
                Mục tiêu hiện tại:
              </span>
              <strong className="text-xs sm:text-sm text-[#1a1a1a] font-bold truncate leading-snug">
                {student.gamification.targetRewardName}
              </strong>
            </div>
          </div>
          <button
            onClick={onOpenStore}
            className="shrink-0 text-[#2563eb] hover:underline font-semibold flex items-center text-xs ml-2 cursor-pointer leading-tight"
          >
            Đổi món <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons - 2 rows on mobile (full width), 2 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <Button
          id="btn-view-token-history"
          variant="outline"
          onClick={onOpenHistory}
          className="w-full flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm h-11 rounded-md sm:rounded-lg leading-tight"
        >
          <History className="w-4 h-4 text-[#ff4757]" />
          <span>Lịch sử nhận điểm</span>
        </Button>

        <Button
          id="btn-view-reward-store"
          variant="amber"
          onClick={onOpenStore}
          className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm h-11 rounded-md sm:rounded-lg font-semibold leading-tight bg-[#ff4757] hover:bg-[#e03949] text-white border border-white/70 ring-1 ring-white/50 shadow-[0_0_14px_rgba(255,255,255,0.85),var(--shadow-accent)] active:shadow-[var(--shadow-accent-pressed)] transition-all"
        >
          <Gift className="w-4 h-4 text-white" />
          <span>Cửa hàng đổi quà</span>
        </Button>
      </div>
    </div>
  );
};
