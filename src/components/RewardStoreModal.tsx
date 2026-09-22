import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Gift, Check, Lock, Sparkles, HelpCircle } from "lucide-react";
import { StudentProfile, RewardItem } from "../types";
import { AVAILABLE_REWARDS } from "../data/mockStudents";
import { Dialog, DialogHeader, DialogTitle, DialogCloseButton, DialogContent } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

interface RewardStoreModalProps {
  open: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const RewardStoreModal: React.FC<RewardStoreModalProps> = ({ open, onClose, student }) => {
  const currentTokens = student.gamification.currentTokens;
  const [redeemedRewardId, setRedeemedRewardId] = useState<string | null>(null);

  const handleClaimReward = (reward: RewardItem) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setRedeemedRewardId(reward.id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose} id="modal-reward-store">
      <DialogHeader>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
            <Gift className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#a3b1c6] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
              <span>Chương trình đổi thưởng nỗ lực</span>
            </div>
            <DialogTitle>Cửa Hàng 100 Tokens</DialogTitle>
          </div>
        </div>
        <DialogCloseButton onClose={onClose} id="btn-close-reward-store" />
      </DialogHeader>

      <DialogContent>
        {/* Header Balance Banner - Industrial Hardware Console Bar */}
        <div className="p-4 bg-[#2d3436] rounded-2xl text-white border border-white/10 shadow-[var(--shadow-recessed-sm)] relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs text-[#a3b1c6] block font-mono font-medium">
                KHO TOKEN CỦA {student.fullName.split(" ").slice(-2).join(" ").toUpperCase()}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black font-mono text-[#ff4757] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                  {currentTokens}
                </span>
                <span className="text-sm font-semibold font-mono text-[#a3b1c6]">/ 100 Tokens</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#1e2528] border border-white/10 flex items-center justify-center text-2xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)]">
              🎁
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#a3b1c6] flex items-center gap-1.5 pt-2 border-t border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#ff4757] shrink-0" />
            <span>Tích lũy đạt 100 Tokens để mở khóa Đại Thưởng Vé Phim CGV!</span>
          </div>
        </div>

        {/* Feedback when user tried claiming */}
        {redeemedRewardId && (
          <div className="p-3.5 bg-[#d1d9e6] border border-emerald-500/60 rounded-xl text-[#1a1a1a] text-xs flex items-center gap-2.5 shadow-[var(--shadow-recessed-sm)] animate-in fade-in duration-200">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span>
              <strong>Chúc mừng con!</strong> Cô Nghi đã nhận yêu cầu đổi món quà này và sẽ trao tận tay con tại buổi học tới!
            </span>
          </div>
        )}

        {/* Reward Items List */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#666666] uppercase tracking-wider px-1">
            <span>Danh sách phần thưởng:</span>
            <span className="text-[11px] text-[#888888] font-normal lowercase">
              (mở khóa từ 35 - 100 tokens)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {AVAILABLE_REWARDS.map((reward) => {
              const canAfford = currentTokens >= reward.tokensCost;
              const needMore = reward.tokensCost - currentTokens;
              const isClaimed = redeemedRewardId === reward.id;

              return (
                <div
                  key={reward.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    canAfford
                      ? "bg-[#e0e5ec] border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] hover:shadow-[var(--shadow-card)]"
                      : "bg-[#e0e5ec]/60 border-[#babecc]/50 shadow-[var(--shadow-card-sm)] opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#d1d9e6] border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)] flex items-center justify-center text-2xl shrink-0">
                      {reward.emoji}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] leading-snug truncate">
                          {reward.name}
                        </h4>
                        {reward.tag && (
                          <span className={`text-[10px] py-0.5 px-2 rounded font-mono font-bold ${
                            reward.tokensCost === 100 
                              ? "bg-[#ff4757] text-white shadow-[var(--shadow-accent-sm)]" 
                              : "bg-[#d1d9e6] text-[#4a5568] border border-[#babecc]/60"
                          }`}>
                            {reward.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">
                        {reward.description}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-bold font-mono">
                        <span className="text-[#ff4757]">{reward.tokensCost} Tokens</span>
                        {!canAfford && (
                          <span className="text-[10px] text-[#888888] font-normal font-sans">
                            (cần thêm {needMore})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isClaimed ? (
                      <span className="inline-flex items-center gap-1 py-1.5 px-2.5 text-xs font-semibold rounded-xl bg-[#d1d9e6] text-emerald-700 border border-emerald-400/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]">
                        <Check className="w-3.5 h-3.5" />
                        Đã chọn
                      </span>
                    ) : canAfford ? (
                      <button
                        type="button"
                        onClick={() => handleClaimReward(reward)}
                        className="px-3.5 py-1.5 bg-[#ff4757] hover:bg-[#ff3848] text-white text-xs font-bold font-mono rounded-xl shadow-[var(--shadow-accent-sm)] active:translate-y-[1px] transition-all cursor-pointer"
                      >
                        Đổi ngay
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#666666] bg-[#d1d9e6] border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] px-2.5 py-1 rounded-lg">
                        <Lock className="w-3 h-3 text-[#888888]" />
                        <span>Chưa đủ</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parent note about Gamification philosophy - Recessed Well */}
        <div className="bg-[#d1d9e6] p-3 rounded-xl border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[11px] text-[#4a5568] flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-[#ff4757] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#1a1a1a]">Quy chế đổi quà Cô Nghi:</strong> Học sinh tích lũy token qua thái độ học tập, điểm test và làm BTVN. Quà được trao trực tiếp tại lớp để vinh danh tinh thần kiên trì của con.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
