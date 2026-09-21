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
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-100 text-orange-800">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <DialogTitle>Cửa Hàng 100 Tokens</DialogTitle>
            <p className="text-xs text-slate-500">Động lực học tập tích cực cho học sinh cấp 2</p>
          </div>
        </div>
        <DialogCloseButton onClose={onClose} id="btn-close-reward-store" />
      </DialogHeader>

      <DialogContent>
        {/* Header Balance Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs text-amber-100 block font-medium">
                Kho token của {student.fullName.split(" ").slice(-2).join(" ")}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black font-mono">{currentTokens}</span>
                <span className="text-sm font-semibold text-amber-200">/ 100 Tokens</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-xs">
              🎁
            </div>
          </div>
          <div className="mt-2 text-[11px] text-amber-100 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Đạt 100 Tokens để mở khóa Đại Thưởng Vé Phim CGV!</span>
          </div>
        </div>

        {/* Feedback when user tried claiming */}
        {redeemedRewardId && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Chúc mừng con! Cô Nghi đã nhận yêu cầu đổi món quà này và sẽ trao tận tay con tại buổi học tới!
              </span>
            </div>
          </div>
        )}

        {/* Reward Items List */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            <span>Danh sách phần thưởng:</span>
            <span className="text-[11px] text-slate-600 font-normal lowercase">
              (cần từ 35 - 100 tokens)
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
                      ? "bg-white border-amber-200/90 hover:border-amber-300 shadow-xs"
                      : "bg-slate-50/70 border-slate-200/70 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl shrink-0">
                      {reward.emoji}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                          {reward.name}
                        </h4>
                        {reward.tag && (
                          <Badge
                            variant={reward.tokensCost === 100 ? "amber" : "secondary"}
                            className="text-[10px] py-0 px-1.5"
                          >
                            {reward.tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {reward.description}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-bold font-mono text-amber-700">
                        <span>{reward.tokensCost} Tokens</span>
                        {!canAfford && (
                          <span className="text-[10px] text-slate-600 font-normal font-sans">
                            (cần thêm {needMore})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isClaimed ? (
                      <Badge variant="success" className="py-1.5 px-2.5 text-xs font-semibold">
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Đã chọn
                      </Badge>
                    ) : canAfford ? (
                      <Button
                        size="sm"
                        variant="amber"
                        onClick={() => handleClaimReward(reward)}
                        className="text-xs font-bold rounded-xl shadow-xs"
                      >
                        Đổi ngay
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                        <Lock className="w-3 h-3 text-slate-600" />
                        <span>Chưa đủ</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parent note about Gamification philosophy */}
        <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Quy chế đổi quà Cô Nghi:</strong> Học sinh tích lũy token qua thái độ học tập, điểm test và làm BTVN. Quà được trao trực tiếp tại lớp để vinh danh tinh thần kiên trì của con.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
