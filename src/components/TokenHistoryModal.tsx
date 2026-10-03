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
        return <BookOpen className="w-3.5 h-3.5 text-[#0066FF]" />;
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
    student.gamification?.currentTokens !== undefined
      ? student.gamification.currentTokens
      : (student.tokenHistory && student.tokenHistory.length > 0
          ? student.tokenHistory.reduce((sum, item) => sum + item.tokens, 0)
          : 70);

  return (
    <Dialog open={open} onOpenChange={onClose} id="modal-token-history">
      <DialogHeader>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <History className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-blue-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]" />
              <span>Hệ thống tích lũy điểm thưởng</span>
            </div>
            <DialogTitle>Lịch sử tích lũy token</DialogTitle>
          </div>
        </div>
        <DialogCloseButton onClose={onClose} id="btn-close-token-history" />
      </DialogHeader>

      <DialogContent>
        {/* Token Balance Summary Bar - Clean Well */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl shadow-xs">
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Số dư hiện tại</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                {currentBalance}
              </span>
              <span className="text-xs font-bold text-[#ff9800]">Tokens</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-medium block">Ghi nhận gần đây</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs mt-1">
              +{totalEarned} Tokens
            </span>
          </div>
        </div>

        {/* History Item Timeline */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 px-1">
            <span>Nhật ký ghi nhận gần đây:</span>
            <span className="text-[11px] text-slate-500 font-normal">
              ({student.tokenHistory.length} lần ghi nhận)
            </span>
          </div>

          <div className="space-y-2">
            {student.tokenHistory.map((item) => {
              const isEarned = item.tokens > 0;
              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {item.reason}
                      </p>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{item.date}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-md border ${
                        isEarned
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
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
