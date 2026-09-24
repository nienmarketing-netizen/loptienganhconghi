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
            <div className="w-9 h-9 rounded-lg bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
              <Gift className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#a3b1c6] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
                <span>Cơ chế đổi thưởng từng nấc & reset</span>
              </div>
              <DialogTitle>Cửa hàng đổi thưởng tokens</DialogTitle>
            </div>
          </div>
          <DialogCloseButton onClose={onClose} id="btn-close-reward-store" />
        </DialogHeader>

        <DialogContent>
          {/* Header Balance Banner */}
          <div className="p-4 bg-[#2d3436] rounded-xl text-white border border-white/10 shadow-[var(--shadow-recessed-sm)] relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <span className="text-xs text-[#a3b1c6] block font-medium">
                  Kho tokens của <strong className="font-bold text-white">{studentShortName}</strong>
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-[#ff4757] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {currentTokens}
                  </span>
                  <span className="text-sm font-semibold text-[#a3b1c6]">
                    / 100 Tokens
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#1e2528] border border-white/10 flex items-center justify-center text-2xl shadow-[inset_1px_1px_3px_rgba(0,0,0,0.7)]">
                🎁
              </div>
            </div>
            <div className="mt-2 text-[11px] text-[#a3b1c6] flex items-center gap-1.5 pt-2 border-t border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Đổi thưởng từng nấc: Đổi xong sẽ trừ số Tokens tương ứng để tiếp tục tích lũy!
              </span>
            </div>
          </div>

          {/* Feedback notice when user redeemed */}
          {redeemedNotice && (
            <div className="p-3.5 bg-[#d1d9e6] border border-emerald-500/60 rounded-xl text-[#1a1a1a] text-xs flex items-center gap-2.5 shadow-[var(--shadow-recessed-sm)] animate-in fade-in duration-200">
              <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <strong className="text-emerald-800 block">Thao tác thành công!</strong>
                <span className="text-slate-700 leading-tight">{redeemedNotice}</span>
              </div>
            </div>
          )}

          {/* Reward Tiers List */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-0.5 sm:gap-2 text-xs font-semibold text-[#666666] px-1">
              <span>Các mốc đổi thưởng</span>
              <span className="text-[11px] text-[#888888] font-normal">
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
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-3 ${
                        canAfford
                          ? "bg-[#e0e5ec] border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)]"
                          : "bg-[#e0e5ec]/60 border-[#babecc]/50 shadow-[var(--shadow-card-sm)] opacity-85"
                      }`}
                    >
                      {/* Tier Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-[#babecc]/50 pb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-xl shrink-0 shadow-xs">
                            {tier.emoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
                                Mốc 50 Tokens: Lựa chọn 1 trong 2
                              </h4>
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500 text-white shadow-xs">
                                50 Tokens
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666]">
                              Chọn giữa phương án an toàn hoặc thử thách quay thưởng may mắn
                            </p>
                          </div>
                        </div>

                        {!canAfford && (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-[#666666] bg-[#d1d9e6] border border-[#babecc]/60 px-2.5 py-1 rounded-md shrink-0">
                            <Lock className="w-3 h-3 text-[#888888]" />
                            <span>Cần thêm {needMore}T</span>
                          </div>
                        )}
                      </div>

                      {/* 2 Choices Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Choice A: Safe */}
                        <div className="p-3 rounded-lg bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📓</span>
                              <span className="text-xs font-bold text-[#1a1a1a]">
                                Lựa chọn A (An toàn)
                              </span>
                            </div>
                            <p className="text-[11px] text-[#4a5568] mt-1 leading-relaxed">
                              Nhận <strong>1 Sổ Flashcard học từ vựng</strong>.
                            </p>
                            <span className="inline-block text-[10px] font-mono font-semibold text-[#ff4757] bg-white/70 border border-[#babecc] px-2 py-0.5 rounded mt-1.5">
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
                              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-lg shadow-sm active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed text-center"
                            >
                              Chọn Sổ Flashcard (-50T)
                            </button>
                          </div>
                        </div>

                        {/* Choice B: Wheel */}
                        <div className="p-3 rounded-lg bg-[#d1d9e6] border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🎡</span>
                              <span className="text-xs font-bold text-[#ff4757]">
                                Lựa chọn B (Thách đấu rủi ro)
                              </span>
                            </div>
                            <p className="text-[11px] text-[#4a5568] mt-1 leading-relaxed">
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
                              className="w-full py-2 px-3 bg-[#ff4757] hover:bg-[#e03949] disabled:bg-slate-400 text-white text-xs font-bold rounded-lg shadow-[var(--shadow-accent-sm)] active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed text-center flex items-center justify-center gap-1.5"
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
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      canAfford
                        ? "bg-[#e0e5ec] border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] hover:shadow-[var(--shadow-card)]"
                        : "bg-[#e0e5ec]/60 border-[#babecc]/50 shadow-[var(--shadow-card-sm)] opacity-75"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#d1d9e6] border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)] flex items-center justify-center text-2xl shrink-0">
                        {tier.emoji}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-[#1a1a1a] leading-snug">
                            {tier.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-[#ff4757]">
                            {tier.milestoneTokens} Tokens
                          </span>
                        </div>
                        <p className="text-xs text-[#4a5568] mt-0.5">{tier.description}</p>
                        <div className="text-[10px] text-[#666666] font-mono mt-1">
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
                          className="w-full sm:w-auto px-4 py-2 bg-[#ff4757] hover:bg-[#e03949] text-white text-xs font-bold font-mono rounded-lg shadow-[var(--shadow-accent-sm)] active:translate-y-[1px] transition-all cursor-pointer text-center"
                        >
                          Đổi thưởng (-{tier.deductTokens}T)
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#666666] bg-[#d1d9e6] border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] px-3 py-1.5 rounded-lg">
                          <Lock className="w-3.5 h-3.5 text-[#888888]" />
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
          <div className="bg-[#d1d9e6] p-3 rounded-xl border border-[#babecc]/60 shadow-[var(--shadow-recessed-sm)] text-[11px] text-[#4a5568] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#ff4757] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#1a1a1a]">Cơ chế reset nấc:</strong> Học sinh tích lũy điểm thưởng qua kỷ luật, minigame Quizizz và điểm thi. Khi đổi quà ở bất kỳ nấc nào, số Tokens tương ứng sẽ được trừ đi để bắt đầu chu kỳ nỗ lực tiếp theo. Quà được trao tận tay tại lớp học!
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
