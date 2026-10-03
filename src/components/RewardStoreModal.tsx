import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Gift, Check, Lock, Sparkles, HelpCircle, RotateCw, Award, ArrowRight } from "lucide-react";
import { StudentProfile } from "../types";
import { REWARD_TIERS, RewardTier } from "../data/tokenGamificationData";
import { Dialog, DialogHeader, DialogTitle, DialogCloseButton, DialogContent } from "./ui/Dialog";
import { LuckyWheelModal } from "./LuckyWheelModal";
import { Button } from "./ui/Button";

interface RewardStoreModalProps {
  open: boolean;
  onClose: () => void;
  student: StudentProfile;
  onRedeemReward?: (tokensToDeduct: number, reason: string) => Promise<void> | void;
}

export const RewardStoreModal: React.FC<RewardStoreModalProps> = ({
  open,
  onClose,
  student,
  onRedeemReward,
}) => {
  const currentTokens =
    student.gamification?.currentTokens !== undefined
      ? student.gamification.currentTokens
      : (student.tokenHistory && student.tokenHistory.length > 0
          ? student.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
          : 70);

  const [redeemedNotice, setRedeemedNotice] = useState<string | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState(false);

  // Standard redemption (e.g. Tier 25, Tier 75, Tier 100, or Tier 50 Choice A)
  const handleClaimStandardReward = async (
    tierName: string,
    deductAmount: number,
    itemDetail: string
  ) => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
    });

    const reason = `Đổi thưởng ${tierName}: ${itemDetail} (-${deductAmount} Tokens)`;

    if (onRedeemReward) {
      await onRedeemReward(-deductAmount, reason);
    }

    setRedeemedNotice(
      `Đã đổi thành công "${itemDetail}"! Hệ thống đã trừ ${deductAmount} Tokens.`
    );
  };

  // Lucky wheel spin completion
  const handleWheelComplete = async (
    newTokens: number,
    deltaTokens: number,
    resultText: string
  ) => {
    if (onRedeemReward) {
      await onRedeemReward(deltaTokens, resultText);
    }
    setRedeemedNotice(resultText);
  };

  const studentShortName = student.fullName.split(" ").slice(-2).join(" ");

  return (
    <>
      <Dialog open={open} onOpenChange={onClose} id="modal-reward-store">
        <DialogHeader>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Gift className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-blue-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]" />
                <span>Cơ chế đổi thưởng từng nấc & reset</span>
              </div>
              <DialogTitle>Cửa hàng đổi thưởng tokens</DialogTitle>
            </div>
          </div>
          <DialogCloseButton onClose={onClose} id="btn-close-reward-store" />
        </DialogHeader>

        <DialogContent>
          {/* Header Balance Banner */}
          <div className="p-4 bg-gradient-to-r from-[#ff9800] via-amber-500 to-[#ffb800] rounded-2xl text-white shadow-md shadow-amber-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <span className="text-xs text-amber-100 block font-medium">
                  Kho tokens của <strong className="font-bold text-white">{studentShortName}</strong>
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-white drop-shadow-sm">
                    {currentTokens}
                  </span>
                  <span className="text-sm font-semibold text-amber-100">
                    / 100 Tokens
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl shadow-inner backdrop-blur-xs">
                🎁
              </div>
            </div>
            <div className="mt-2 text-[11px] text-amber-100 flex items-center gap-1.5 pt-2 border-t border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-white shrink-0" />
              <span>
                Đổi thưởng từng nấc: Đổi xong sẽ trừ số Tokens tương ứng để tiếp tục tích lũy!
              </span>
            </div>
          </div>

          {/* Feedback notice when user redeemed */}
          {redeemedNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
              <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <strong className="text-emerald-900 block font-bold">Thao tác thành công!</strong>
                <span className="text-slate-700 leading-tight">{redeemedNotice}</span>
              </div>
            </div>
          )}

          {/* Reward Tiers List */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-0.5 sm:gap-2 text-xs font-bold text-slate-800 px-1">
              <span>Các mốc đổi thưởng</span>
              <span className="text-[11px] text-slate-500 font-normal">
                (Đổi nấc nào trừ Tokens nấc đó)
              </span>
            </div>

            <div className="space-y-3">
              {REWARD_TIERS.map((tier) => {
                const canAfford = currentTokens >= tier.milestoneTokens;
                const needMore = tier.milestoneTokens - currentTokens;

                // SPECIAL TIER 50: CHOICE A OR CHOICE B
                if (tier.type === "choice50") {
                  return (
                    <div
                      key={tier.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all space-y-3 ${
                        canAfford
                          ? "bg-white border-slate-200 shadow-xs"
                          : "bg-slate-50/70 border-slate-200/60 opacity-80"
                      }`}
                    >
                      {/* Tier Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center text-xl shrink-0 shadow-xs">
                            {tier.emoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                Mốc 50 Tokens: Lựa chọn 1 trong 2
                              </h4>
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
                                50 Tokens
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Chọn giữa phương án an toàn hoặc thử thách quay thưởng may mắn
                            </p>
                          </div>
                        </div>

                        {!canAfford && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Cần thêm {needMore}T</span>
                          </div>
                        )}
                      </div>

                      {/* 2 Choices Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Choice A: Safe */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📓</span>
                              <span className="text-xs font-bold text-slate-900">
                                Lựa chọn A (An toàn)
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              Nhận <strong>1 Sổ Flashcard học từ vựng</strong>.
                            </p>
                            <span className="inline-block text-[10px] font-mono font-bold text-[#0066ff] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md mt-1.5">
                              Cơ chế: Trừ 50 Tokens về 0
                            </span>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              disabled={!canAfford}
                              onClick={() =>
                                handleClaimStandardReward(
                                  "Mốc 50 Tokens (Lựa chọn A)",
                                  50,
                                  "1 Sổ Flashcard học từ vựng"
                                )
                              }
                              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed text-center"
                            >
                              Chọn Sổ Flashcard (-50T)
                            </button>
                          </div>
                        </div>

                        {/* Choice B: Wheel */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎡</span>
                              <span className="text-xs font-bold text-[#ff9800]">
                                Lựa chọn B (Thách đấu rủi ro)
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              Quay <strong>"Chiếc Nón Kỳ Diệu"</strong>:
                              <br />
                              • <span className="text-emerald-700 font-bold">X2 lên 100T</span> (Mở Đại Bảo Rương)
                              <br />
                              • <span className="text-rose-700 font-bold">÷2 giáng xuống 25T</span>
                            </p>
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              disabled={!canAfford}
                              onClick={() => setIsWheelOpen(true)}
                              className="w-full py-2 px-3 bg-gradient-to-r from-[#ff9800] to-[#ffb800] hover:from-amber-600 hover:to-orange-600 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/25 active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed text-center flex items-center justify-center gap-1.5"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>Quay Chiếc Nón Kỳ Diệu</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard Tiers (25, 75, 100)
                return (
                  <div
                    key={tier.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      canAfford
                        ? "bg-white border-slate-200 shadow-xs hover:shadow-md"
                        : "bg-slate-50/70 border-slate-200/60 opacity-80"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                        {tier.emoji}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {tier.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-amber-600">
                            {tier.milestoneTokens} Tokens
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {tier.ruleNote}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                      {canAfford ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleClaimStandardReward(
                              tier.name,
                              tier.deductTokens,
                              tier.shortTitle
                            )
                          }
                          className="w-full sm:w-auto px-4 py-2 bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold font-mono rounded-xl shadow-md shadow-blue-500/20 active:translate-y-[1px] transition-all cursor-pointer text-center"
                        >
                          Đổi thưởng (-{tier.deductTokens}T)
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Cần thêm {needMore} Tokens</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Philosophy Note */}
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/80 text-[11px] text-slate-600 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#0066ff] shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900 font-bold">Cơ chế reset nấc:</strong> Học sinh tích lũy điểm thưởng qua kỷ luật, minigame Quizizz và điểm thi. Khi đổi quà ở bất kỳ nấc nào, số Tokens tương ứng sẽ được trừ đi để bắt đầu chu kỳ nỗ lực tiếp theo. Quà được trao tận tay tại lớp học!
            </span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        open={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        currentTokens={currentTokens}
        studentName={student.fullName}
        onSpinComplete={handleWheelComplete}
      />
    </>
  );
};
