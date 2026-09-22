import React from "react";
import { Coins, History, Gift, Sparkles, ChevronRight, Award } from "lucide-react";
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
    <div className="relative overflow-hidden soft-ui-embossed rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
      {/* Title & Badge */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#b2c2d4]/40">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
            <span>Hệ thống Gamification</span>
          </h3>
          <p className="text-xs text-[#666666] font-normal mt-0.5">Tích lũy nỗ lực đổi quà thưởng lớn</p>
        </div>

        <div className="flex items-center gap-1.5 soft-ui-convex text-[#1a1a1a] text-xs font-semibold px-3 py-1.5 rounded-lg leading-tight">
          <Award className="w-3.5 h-3.5 text-[#ff4757]" />
          <span>100 Tokens</span>
        </div>
      </div>

      {/* Large Progress Display - Recessed Well */}
      <div className="soft-ui-debossed rounded-2xl p-4 sm:p-5 space-y-3">
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
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-400 leading-tight">
              <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: "3s" }} />
              <span>{percentage}% hoàn thành</span>
            </span>
            <p className="text-xs text-[#666666] mt-1 font-normal">
              {remainingTokens > 0
                ? `Chỉ cần thêm ${remainingTokens} tokens`
                : "Đã đủ điểm đổi đại thưởng!"}
            </p>
          </div>
        </div>

        {/* Large Mechanical Progress Bar */}
        <div className="space-y-1.5">
          <Progress
            value={currentTokens}
            max={maxTokens}
            className="h-5 sm:h-6"
            indicatorClassName="bg-[#ff4757]"
            showStripes={true}
          />

          {/* Milestones markers under bar */}
          <div className="flex justify-between text-[11px] font-semibold text-[#666666] px-1 pt-0.5">
            <span>0 (Khởi đầu)</span>
            <span>35 (Bút Highlight)</span>
            <span>70 (Trà sữa)</span>
            <span className="text-[#ff4757] font-bold">100 (Vé CGV 🎬)</span>
          </div>
        </div>

        {/* Next Target Item Callout */}
        <div className="flex items-center justify-between text-xs soft-ui-convex rounded-xl p-2.5 text-[#1a1a1a]">
          <div className="flex items-center gap-2 truncate">
            <span className="text-base">🎯</span>
            <span className="truncate">
              Mục tiêu hiện tại:{" "}
              <strong className="text-[#1a1a1a] font-semibold">
                {student.gamification.targetRewardName}
              </strong>
            </span>
          </div>
          <button
            onClick={onOpenStore}
            className="shrink-0 text-[#2563eb] hover:underline font-semibold flex items-center text-xs ml-2 cursor-pointer leading-tight"
          >
            Đổi món <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button
          id="btn-view-token-history"
          variant="outline"
          onClick={onOpenHistory}
          className="w-full flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm h-11 rounded-xl leading-tight"
        >
          <History className="w-4 h-4 text-[#ff4757]" />
          <span>Lịch sử nhận điểm</span>
        </Button>

        <Button
          id="btn-view-reward-store"
          variant="default"
          onClick={onOpenStore}
          className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm h-11 rounded-xl font-semibold leading-tight"
        >
          <Gift className="w-4 h-4" />
          <span>Cửa hàng đổi quà</span>
        </Button>
      </div>
    </div>
  );
};
