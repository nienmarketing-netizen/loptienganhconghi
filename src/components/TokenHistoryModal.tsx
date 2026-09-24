import React from "react";
import { History, PlusCircle, MinusCircle, BookOpen, Mic, Award, ShieldCheck, Gift } from "lucide-react";
import { StudentProfile, TokenHistoryItem } from "../types";
import { Dialog, DialogHeader, DialogTitle, DialogCloseButton, DialogContent } from "./ui/Dialog";
import { Badge } from "./ui/Badge";

interface TokenHistoryModalProps {
  open: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const TokenHistoryModal: React.FC<TokenHistoryModalProps> = ({ open, onClose, student }) => {
  const getCategoryIcon = (category: TokenHistoryItem["category"]) => {
    switch (category) {
      case "homework":
        return <BookOpen className="w-3.5 h-3.5 text-[#ff4757]" />;
      case "speaking":
        return <Mic className="w-3.5 h-3.5 text-purple-600" />;
      case "test":
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      case "discipline":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case "reward":
        return <Gift className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Award className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const totalEarned = student.tokenHistory
    .filter((i) => i.tokens > 0)
    .reduce((sum, i) => sum + i.tokens, 0);

  const currentBalance =
    student.tokenHistory && student.tokenHistory.length > 0
      ? student.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
      : student.gamification.currentTokens;

  return (
    <Dialog open={open} onOpenChange={onClose} id="modal-token-history">
      <DialogHeader>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
            <History className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#a3b1c6] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full led-indicator-orange animate-pulse" />
              <span>Hệ thống tích lũy điểm thưởng</span>
            </div>
            <DialogTitle>Lịch Sử Tích Lũy Token</DialogTitle>
          </div>
        </div>
        <DialogCloseButton onClose={onClose} id="btn-close-token-history" />
      </DialogHeader>

      <DialogContent>
        {/* Token Balance Summary Bar - Recessed Tactile Well */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-[#d1d9e6] border border-[#babecc]/60 rounded-lg sm:rounded-xl shadow-[var(--shadow-recessed-sm)]">
          <div>
            <span className="text-[11px] text-[#666666] font-medium block">Số dư hiện tại</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-[#1a1a1a] font-mono tracking-tight">
                {currentBalance}
              </span>
              <span className="text-xs font-bold text-[#ff4757] font-mono">Tokens</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#666666] font-medium block">Tổng tích lũy từ đầu kỳ</span>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#e0e5ec] text-emerald-700 border border-white/90 shadow-[var(--shadow-card-sm)] mt-1">
              +{totalEarned} Tokens
            </span>
          </div>
        </div>

        {/* History Item Timeline */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#666666] uppercase tracking-wider px-1">
            <span>Nhật ký ghi nhận gần đây:</span>
            <span className="text-[11px] text-[#888888] font-normal lowercase">
              ({student.tokenHistory.length} lần ghi nhận)
            </span>
          </div>

          <div className="space-y-2">
            {student.tokenHistory.map((item) => {
              const isEarned = item.tokens > 0;
              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg sm:rounded-xl bg-[#e0e5ec] border border-white/80 border-b-[#babecc] border-r-[#babecc] shadow-[var(--shadow-card-sm)] hover:shadow-[var(--shadow-card)] transition-all"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-md bg-[#d1d9e6] border border-[#babecc]/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)] shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1a1a1a] leading-snug">
                        {item.reason}
                      </p>
                      <span className="text-[11px] text-[#666666] block mt-0.5">{item.date}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-0.5 rounded-md border ${
                        isEarned
                          ? "bg-[#d1d9e6] text-emerald-700 border-emerald-300/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]"
                          : "bg-[#d1d9e6] text-rose-700 border-rose-300/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.06)]"
                      }`}
                    >
                      {isEarned ? (
                        <PlusCircle className="w-3 h-3 text-emerald-600 inline" />
                      ) : (
                        <MinusCircle className="w-3 h-3 text-rose-600 inline" />
                      )}
                      <span>{item.tokens > 0 ? `+${item.tokens}` : item.tokens}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
