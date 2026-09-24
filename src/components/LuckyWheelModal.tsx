import React, { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, AlertTriangle, RotateCw, X, Award } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogCloseButton, DialogContent } from "./ui/Dialog";
import { Button } from "./ui/Button";

interface LuckyWheelModalProps {
  open: boolean;
  onClose: () => void;
  currentTokens: number;
  studentName: string;
  onSpinComplete: (newTokens: number, deltaTokens: number, resultText: string) => void;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  open,
  onClose,
  currentTokens,
  studentName,
  onSpinComplete,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [resultOutcome, setResultOutcome] = useState<"double" | "halve" | null>(null);

  // 8 slices: 4 "x2 (100T)" and 4 "÷2 (25T)" alternating
  // Slice angle: 360 / 8 = 45 deg
  // Slices:
  // 0: x2 (0 - 45)
  // 1: ÷2 (45 - 90)
  // 2: x2 (90 - 135)
  // 3: ÷2 (135 - 180)
  // 4: x2 (180 - 225)
  // 5: ÷2 (225 - 270)
  // 6: x2 (270 - 315)
  // 7: ÷2 (315 - 360)

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setResultOutcome(null);

    // Random outcome: 50% chance
    const isWin = Math.random() >= 0.5;
    // Win landing slices (even: 0, 2, 4, 6)
    // Lose landing slices (odd: 1, 3, 5, 7)
    const winSlices = [0, 2, 4, 6];
    const loseSlices = [1, 3, 5, 7];

    const chosenSlice = isWin
      ? winSlices[Math.floor(Math.random() * winSlices.length)]
      : loseSlices[Math.floor(Math.random() * loseSlices.length)];

    // Extra full rotations (between 5 and 7 rounds = 1800 - 2520 deg)
    const extraRounds = 5 + Math.floor(Math.random() * 3);
    // Pointer is at the top (270 deg or 0 deg). With pointer at top (arrow pointing down):
    // Target center angle of slice: chosenSlice * 45 + 22.5
    const targetAngle = chosenSlice * 45 + 22.5;
    // Rotation so that the pointer lands on chosenSlice:
    const totalRotation = rotationDegrees + extraRounds * 360 + (360 - targetAngle);

    setRotationDegrees(totalRotation);

    // 4 seconds animation
    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);

      if (isWin) {
        setResultOutcome("double");
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
        });
        // Win: double to 100
        const delta = 100 - currentTokens;
        onSpinComplete(
          100,
          delta,
          "Quay Chiếc Nón Kỳ Diệu (Mốc 50T): Trúng ô NHÂN ĐÔI -> Lên thẳng 100 Tokens!"
        );
      } else {
        setResultOutcome("halve");
        // Lose: halve to 25
        const delta = 25 - currentTokens;
        onSpinComplete(
          25,
          delta,
          "Quay Chiếc Nón Kỳ Diệu (Mốc 50T): Trúng ô CHIA ĐÔI -> Bị giáng xuống 25 Tokens"
        );
      }
    }, 4000);
  };

  const handleResetAndClose = () => {
    setIsSpinning(false);
    setHasSpun(false);
    setResultOutcome(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleResetAndClose} id="modal-lucky-wheel">
      <DialogHeader>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#1e2528] border border-white/10 flex items-center justify-center text-[#ff4757] shrink-0 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#a3b1c6] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Thách đấu rủi ro - Mốc 50 Tokens</span>
            </div>
            <DialogTitle>Vòng Quay "Chiếc Nón Kỳ Diệu"</DialogTitle>
          </div>
        </div>
        <DialogCloseButton onClose={handleResetAndClose} id="btn-close-lucky-wheel" />
      </DialogHeader>

      <DialogContent>
        {/* Intro Rules Banner */}
        <div className="bg-[#2d3436] rounded-xl p-3.5 sm:p-4 text-white border border-white/10 shadow-[var(--shadow-recessed-sm)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#a3b1c6]">HỌC SINH: {studentName.toUpperCase()}</span>
            <span className="font-bold text-[#ff4757] bg-[#1e2528] px-2 py-0.5 rounded border border-white/10">
              Số dư hiện tại: {currentTokens} Tokens
            </span>
          </div>
          <div className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-amber-400">Luật chơi:</strong> Khi quay Chiếc Nón Kỳ Diệu, con sẽ nhận được 1 trong 2 kết quả:
            <ul className="mt-1 space-y-1 pl-4 list-disc text-[11px] text-slate-300">
              <li>
                <strong className="text-emerald-400">Ô Nhân Đôi:</strong> Lên thẳng <strong>100 Tokens</strong> để mở khóa ngay <strong>ĐẠI BẢO RƯƠNG</strong>!
              </li>
              <li>
                <strong className="text-rose-400">Ô Chia Đôi:</strong> Bị giáng xuống <strong>25 Tokens</strong> (Mốc Thẻ Đặc Quyền).
              </li>
            </ul>
          </div>
        </div>

        {/* Wheel Interactive Container */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          {/* Wheel Frame & Pointer */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Top Pointer (Kim chỉ điểm) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center filter drop-shadow-md">
              <div className="w-5 h-7 bg-[#ff4757] border-2 border-white rounded-b-md shadow-lg" />
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#ff4757]" />
            </div>

            {/* Recessed Outer Ring */}
            <div className="absolute inset-0 rounded-full bg-[#d1d9e6] border-4 border-[#babecc] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" />

            {/* The Rotating Wheel SVG */}
            <div
              className="relative w-[236px] h-[236px] sm:w-[264px] sm:h-[264px] rounded-full overflow-hidden shadow-xl"
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transition: isSpinning
                  ? "transform 4s cubic-bezier(0.12, 0.8, 0.18, 1)"
                  : "none",
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full select-none pointer-events-none">
                {/* 8 Slices (alternating colors) */}
                {/* Slice 0: x2 (Emerald) */}
                <path d="M100,100 L200,100 A100,100 0 0,1 170.7,170.7 Z" fill="#10b981" />
                {/* Slice 1: ÷2 (Rose) */}
                <path d="M100,100 L170.7,170.7 A100,100 0 0,1 100,200 Z" fill="#e11d48" />
                {/* Slice 2: x2 (Emerald) */}
                <path d="M100,100 L100,200 A100,100 0 0,1 29.3,170.7 Z" fill="#059669" />
                {/* Slice 3: ÷2 (Rose) */}
                <path d="M100,100 L29.3,170.7 A100,100 0 0,1 0,100 Z" fill="#be123c" />
                {/* Slice 4: x2 (Emerald) */}
                <path d="M100,100 L0,100 A100,100 0 0,1 29.3,29.3 Z" fill="#10b981" />
                {/* Slice 5: ÷2 (Rose) */}
                <path d="M100,100 L29.3,29.3 A100,100 0 0,1 100,0 Z" fill="#e11d48" />
                {/* Slice 6: x2 (Emerald) */}
                <path d="M100,100 L100,0 A100,100 0 0,1 170.7,29.3 Z" fill="#059669" />
                {/* Slice 7: ÷2 (Rose) */}
                <path d="M100,100 L170.7,29.3 A100,100 0 0,1 200,100 Z" fill="#be123c" />

                {/* Text Labels inside slices */}
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(22.5 100 100)">
                  x2 (100T)
                </text>
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(67.5 100 100)">
                  ÷2 (25T)
                </text>
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(112.5 100 100)">
                  x2 (100T)
                </text>
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(157.5 100 100)">
                  ÷2 (25T)
                </text>
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(202.5 100 100)">
                  x2 (100T)
                </text>
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(247.5 100 100)">
                  ÷2 (25T)
                </text>
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(292.5 100 100)">
                  x2 (100T)
                </text>
                <text x="145" y="140" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(337.5 100 100)">
                  ÷2 (25T)
                </text>

                {/* Center Hub */}
                <circle cx="100" cy="100" r="24" fill="#2d3436" stroke="#ffffff" strokeWidth="3" />
              </svg>
            </div>

            {/* Center Golden Button */}
            <div className="absolute z-20 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSpin}
                disabled={isSpinning || hasSpun}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center font-black text-[11px] text-[#1a1a1a] uppercase leading-none hover:scale-105 active:scale-95 disabled:opacity-80 cursor-pointer disabled:cursor-not-allowed transition-all"
              >
                <RotateCw className={`w-4 h-4 text-[#1a1a1a] mb-0.5 ${isSpinning ? "animate-spin" : ""}`} />
                <span>QUAY</span>
              </button>
            </div>
          </div>

          {/* Outcome Result Notification */}
          {resultOutcome && (
            <div
              className={`mt-4 w-full p-4 rounded-xl text-center border animate-in zoom-in-95 duration-200 shadow-md ${
                resultOutcome === "double"
                  ? "bg-emerald-100 border-emerald-400 text-emerald-950"
                  : "bg-rose-100 border-rose-400 text-rose-950"
              }`}
            >
              {resultOutcome === "double" ? (
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-base font-bold text-emerald-800">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                    <span>CHÚC MỪNG BẠN ĐÃ CHIẾN THẮNG!</span>
                  </div>
                  <p className="text-xs font-semibold mt-1">
                    Bánh xe đã dừng ở ô <strong>NHÂN ĐÔI TOKENS</strong>!
                  </p>
                  <p className="text-sm font-black font-mono text-emerald-700 mt-1">
                    Số Tokens đã tăng vọt lên 100 Tokens 👑
                  </p>
                  <p className="text-[11px] text-emerald-800/80 mt-1">
                    Bạn đã đủ điều kiện mở ngay <strong>ĐẠI BẢO RƯƠNG (&lt;100k)</strong>!
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-1.5 text-base font-bold text-rose-800">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>RẤT TIẾC, CHIA ĐÔI TOKENS!</span>
                  </div>
                  <p className="text-xs font-semibold mt-1">
                    Bánh xe đã dừng ở ô <strong>CHIA ĐÔI TOKENS</strong>.
                  </p>
                  <p className="text-sm font-black font-mono text-rose-700 mt-1">
                    Số Tokens hiện tại được giáng xuống 25 Tokens
                  </p>
                  <p className="text-[11px] text-rose-800/80 mt-1">
                    Bạn vẫn có thể nhận <strong>Thẻ Đặc Quyền (Chỗ ngồi yêu thích 1 tuần)</strong>. Hãy cố gắng ở các buổi học tới nhé!
                  </p>
                </div>
              )}

              <Button
                variant="default"
                onClick={handleResetAndClose}
                className="mt-3 px-5 py-2 text-xs font-bold"
              >
                Xác nhận & Đóng
              </Button>
            </div>
          )}

          {/* Action trigger button if not spun */}
          {!hasSpun && (
            <div className="mt-4 text-center">
              <Button
                variant="default"
                onClick={handleSpin}
                disabled={isSpinning}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold min-h-[44px] flex items-center gap-2 bg-[#ff4757] hover:bg-[#e03949] text-white shadow-[var(--shadow-accent)]"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
                <span>{isSpinning ? "Đang quay bánh xe..." : "Bắt Đầu Quay Chiếc Nón Kỳ Diệu"}</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
