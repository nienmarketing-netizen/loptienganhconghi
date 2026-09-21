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
        return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
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

  return (
    <Dialog open={open} onOpenChange={onClose} id="modal-token-history">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 text-amber-800">
            <History className="w-4 h-4" />
          </div>
          <div>
            <DialogTitle>Lịch Sử Tích Lũy Token</DialogTitle>
            <p className="text-xs text-slate-500">Mọi nỗ lực của con đều được ghi nhận minh bạch</p>
          </div>
        </div>
        <DialogCloseButton onClose={onClose} id="btn-close-token-history" />
      </DialogHeader>

      <DialogContent>
        {/* Token Balance Summary Bar */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80">
          <div>
            <span className="text-[11px] text-slate-500 block">Số dư hiện tại</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {student.gamification.currentTokens}{" "}
              <span className="text-sm font-bold text-amber-600">Tokens</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Tổng tích lũy từ đầu kỳ</span>
            <Badge variant="success" className="font-mono text-xs font-bold py-1">
              +{totalEarned} Tokens
            </Badge>
          </div>
        </div>

        {/* History Item Timeline */}
        <div className="space-y-2.5 pt-1">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Nhật ký ghi nhận gần đây:
          </div>

          <div className="space-y-2">
            {student.tokenHistory.map((item) => {
              const isEarned = item.tokens > 0;
              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-xs border border-slate-200/60 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        {item.reason}
                      </p>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{item.date}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                        isEarned
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-rose-50 text-rose-700 border border-rose-200/60"
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
