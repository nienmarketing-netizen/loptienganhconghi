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
    <Card className="relative overflow-hidden border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 shadow-md">
      {/* Decorative subtle ambient circle */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Title & Badge */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              Hệ thống Gamification
            </h3>
            <p className="text-xs text-slate-500">Tích lũy nỗ lực đổi quà thưởng lớn</p>
          </div>

          <div className="flex items-center gap-1 bg-amber-100/90 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-300/50 shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>100 Tokens</span>
          </div>
        </div>

        {/* Large Progress Display */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/60 shadow-xs space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-xs font-medium text-slate-600 block">
                Tiến độ đổi quà của con:
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {currentTokens}
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-400">
                  /{maxTokens}
                </span>
                <span className="text-sm font-bold text-amber-600 ml-1">Tokens</span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200/60">
                <Sparkles className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
                <span>{percentage}% hoàn thành</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                {remainingTokens > 0
                  ? `Chỉ cần thêm ${remainingTokens} tokens`
                  : "Đã đủ điểm đổi đại thưởng!"}
              </p>
            </div>
          </div>

          {/* Large Vibrant Gradient Progress Bar */}
          <div className="space-y-1.5">
            <Progress
              value={currentTokens}
              max={maxTokens}
              className="h-5 sm:h-6 p-1 bg-amber-100/70 rounded-full border border-amber-200/80"
              indicatorClassName="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 shadow-md shadow-orange-500/20"
              showStripes={true}
            />

            {/* Milestones markers under bar */}
            <div className="flex justify-between text-[10px] font-semibold text-slate-600 px-1 pt-0.5">
              <span>0 (Khởi đầu)</span>
              <span className="text-slate-600">35 Token (Bút Highlight)</span>
              <span className="text-slate-600">70 Token (Trà sữa)</span>
              <span className="text-orange-700 font-bold">100 (Vé CGV 🎬)</span>
            </div>
          </div>

          {/* Next Target Item Callout */}
          <div className="flex items-center justify-between text-xs bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/50 text-slate-700">
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">🎯</span>
              <span className="truncate">
                Mục tiêu hiện tại:{" "}
                <strong className="text-slate-900 font-semibold">
                  {student.gamification.targetRewardName}
                </strong>
              </span>
            </div>
            <button
              onClick={onOpenStore}
              className="shrink-0 text-amber-700 hover:text-amber-800 font-semibold flex items-center text-[11px] ml-2"
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
            className="w-full flex items-center justify-center gap-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 text-slate-700 font-semibold text-xs sm:text-sm h-11 rounded-xl shadow-xs"
          >
            <History className="w-4 h-4 text-amber-600" />
            <span>Lịch sử nhận điểm</span>
          </Button>

          <Button
            id="btn-view-reward-store"
            variant="amber"
            onClick={onOpenStore}
            className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm h-11 rounded-xl shadow-md font-bold"
          >
            <Gift className="w-4 h-4" />
            <span>Cửa hàng đổi quà</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
