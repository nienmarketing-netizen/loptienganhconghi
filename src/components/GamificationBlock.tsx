import React, { useState } from "react";
import { History, Gift, Award, HelpCircle, CheckCircle2, ChevronRight, Sparkles, BookOpen, Clock, ShieldCheck, TrendingUp } from "lucide-react";
import { StudentProfile } from "../types";
import { TOKEN_BAREM_GROUPS, REWARD_TIERS } from "../data/tokenGamificationData";
import { Button } from "./ui/Button";
import { Progress } from "./ui/Progress";
import { Dialog, DialogHeader, DialogTitle, DialogCloseButton, DialogContent } from "./ui/Dialog";

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
  const [showBaremModal, setShowBaremModal] = useState(false);

  const currentTokens =
    student.gamification?.currentTokens !== undefined
      ? student.gamification.currentTokens
      : (student.tokenHistory && student.tokenHistory.length > 0
          ? student.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
          : 70);
  const maxTokens = 100;
  const percentage = Math.min(100, Math.max(0, Math.round((currentTokens / maxTokens) * 100)));

  // Determine next milestone
  const nextTier =
    REWARD_TIERS.find((t) => t.milestoneTokens > currentTokens) ||
    REWARD_TIERS[REWARD_TIERS.length - 1];
  const remainingForNext = Math.max(0, nextTier.milestoneTokens - currentTokens);

  const toSentenceCase = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="relative overflow-hidden soft-ui-embossed rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4">
      {/* Title & Badge */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#b2c2d4]/40">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-[#1a1a1a] tracking-[-0.015em] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
            <span>Hành trình nỗ lực</span>
          </h3>
          <p className="text-xs text-[#666666] font-normal mt-0.5">
            Tích lũy nỗ lực - Đổi thưởng từng nấc & cơ chế reset minh bạch
          </p>
        </div>

        <div className="flex items-center gap-1.5 soft-ui-convex text-[#1a1a1a] text-xs font-semibold px-3 py-1.5 rounded-lg leading-tight">
          <Award className="w-4 h-4 text-[#ff4757]" />
          <span className="font-semibold text-xs">{currentTokens} Tokens</span>
        </div>
      </div>

      {/* Large Progress Display - Recessed Well */}
      <div className="soft-ui-debossed rounded-xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-[#666666] block">
              Tiến độ tích lũy của con:
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#ff4757]">
                {currentTokens}
              </span>
              <span className="text-base sm:text-lg font-semibold text-[#666666]">
                /100
              </span>
              <span className="text-xs font-semibold text-[#1a1a1a] ml-1">Tokens</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-md border border-emerald-400 leading-tight">
              <span>{percentage}% chặng đường</span>
            </span>
          </div>
        </div>

        {/* Large Mechanical Progress Bar with Exact 4 Milestones: 0, 25, 50, 75, 100 */}
        <div className="space-y-1.5 pt-1">
          {/* Top Milestones Numbers */}
          <div className="relative h-4 text-[11px] font-bold font-mono text-[#666666]">
            <span className="absolute left-0 text-left">0</span>
            <span className="absolute left-[25%] -translate-x-1/2 text-center">25T</span>
            <span className="absolute left-[50%] -translate-x-1/2 text-center text-amber-600">50T</span>
            <span className="absolute left-[75%] -translate-x-1/2 text-center">75T</span>
            <span className="absolute right-0 text-right text-[#ff4757]">100T</span>
          </div>

          {/* Progress bar with vertical milestone tick lines */}
          <div className="relative flex items-center">
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="relative w-full h-full">
                <span className="absolute left-0 -top-1 -bottom-1 w-[1.5px] bg-[#64748b]/50 rounded-full shadow-[0_0_1px_rgba(255,255,255,0.7)]" />
                <span className="absolute left-[25%] -top-1 -bottom-1 w-[1.5px] -translate-x-1/2 bg-[#64748b]/50 rounded-full shadow-[0_0_1px_rgba(255,255,255,0.7)]" />
                <span className="absolute left-[50%] -top-1 -bottom-1 w-[2px] -translate-x-1/2 bg-amber-500 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
                <span className="absolute left-[75%] -top-1 -bottom-1 w-[1.5px] -translate-x-1/2 bg-[#64748b]/50 rounded-full shadow-[0_0_1px_rgba(255,255,255,0.7)]" />
                <span className="absolute right-0 -top-1 -bottom-1 w-[2px] bg-[#ff4757] rounded-full shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
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

          {/* Bottom Milestones Icons */}
          <div className="relative h-6 text-xs sm:text-sm leading-none pt-1 select-none font-bold text-[#4a5568]">
            <span className="absolute left-0 text-left" title="Khởi đầu">🌱</span>
            <span className="absolute left-[25%] -translate-x-1/2 text-center flex items-center gap-0.5" title="Mốc 25: Chỗ ngồi">
              🪑 <span className="hidden sm:inline text-[10px] font-normal">Chỗ ngồi</span>
            </span>
            <span className="absolute left-[50%] -translate-x-1/2 text-center flex items-center gap-0.5 text-amber-700 font-bold" title="Mốc 50: Flashcard / Chiếc nón">
              ⚡ <span className="hidden sm:inline text-[10px] font-bold">50T Thử thách</span>
            </span>
            <span className="absolute left-[75%] -translate-x-1/2 text-center flex items-center gap-0.5" title="Mốc 75: Trà sữa/Nước ép">
              🧋 <span className="hidden sm:inline text-[10px] font-normal">Đồ uống</span>
            </span>
            <span className="absolute right-0 text-right flex items-center gap-0.5 text-[#ff4757] font-bold" title="Mốc 100: Đại bảo rương">
              👑 <span className="hidden sm:inline text-[10px]">Đại Bảo Rương</span>
            </span>
          </div>
        </div>

        {/* Action callout banner */}
        <div className="flex items-center gap-2.5 text-xs soft-ui-convex rounded-xl p-3 text-[#1a1a1a]">
          <span className="text-xl shrink-0">{nextTier.emoji}</span>
          <div className="min-w-0">
            <span className="text-[11px] text-[#666666] font-medium block">
              Mốc phấn đấu tiếp theo:
            </span>
            <strong className="text-xs sm:text-sm text-[#1a1a1a] font-bold block truncate">
              {toSentenceCase(nextTier.name)} ({nextTier.milestoneTokens} Tokens)
            </strong>
          </div>
        </div>
      </div>

      {/* 3 Synchronized Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <Button
          id="btn-view-barem-criteria"
          variant="outline"
          onClick={() => setShowBaremModal(true)}
          className="w-full flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm h-11 rounded-xl leading-tight border border-[#babecc] bg-[#e0e5ec] text-[#2d3436] hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <Award className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Tiêu chí tích luỹ tokens</span>
        </Button>

        <Button
          id="btn-view-token-history"
          variant="outline"
          onClick={onOpenHistory}
          className="w-full flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm h-11 rounded-xl leading-tight border border-[#babecc] bg-[#e0e5ec] text-[#2d3436] hover:border-amber-500 hover:text-amber-600 transition-all cursor-pointer"
        >
          <History className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Lịch sử nhận điểm</span>
        </Button>

        <Button
          id="btn-view-reward-store"
          variant="default"
          onClick={onOpenStore}
          className="w-full flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm h-11 rounded-xl leading-tight bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[var(--shadow-accent)] border border-white/30 transition-all cursor-pointer"
        >
          <Gift className="w-4 h-4 shrink-0" />
          <span>Đổi quà và quay thưởng</span>
        </Button>
      </div>

      {/* Pop-up Modal: Tiêu chí tích luỹ tokens */}
      <Dialog
        open={showBaremModal}
        onOpenChange={setShowBaremModal}
        id="modal-token-barem"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#1e2528] border border-white/10 flex items-center justify-center text-indigo-400 shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#a3b1c6] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                <span>Quy định thưởng & trừ điểm minh bạch</span>
              </div>
              <DialogTitle>Tiêu chí tích luỹ tokens</DialogTitle>
            </div>
          </div>
          <DialogCloseButton
            onClose={() => setShowBaremModal(false)}
            id="btn-close-barem-modal"
          />
        </DialogHeader>

        <DialogContent className="p-3.5 sm:p-5 space-y-3">
          {TOKEN_BAREM_GROUPS.map((group) => (
            <div
              key={group.id}
              className="bg-[#d1d9e6] rounded-xl border border-[#babecc]/60 p-3.5 shadow-[var(--shadow-recessed-sm)] space-y-2.5"
            >
              <div className="pb-1.5 border-b border-[#babecc]/50">
                <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] flex items-center gap-1.5">
                  <span>{group.groupName}</span>
                </h4>
                <p className="text-[11px] text-[#666666] mt-0.5">{group.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.items.map((item) => {
                  const isEarn = item.points > 0;
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-[#e0e5ec] border border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-xs flex items-center justify-between gap-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="text-base shrink-0">{item.icon}</span>
                        <span className="text-xs font-semibold text-[#1a1a1a] leading-snug">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 font-semibold text-xs px-2.5 py-0.5 rounded-md leading-tight whitespace-nowrap ${
                          isEarn
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}
                      >
                        {isEarn ? `+${item.points}` : item.points} Token{Math.abs(item.points) > 1 ? "s" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};
