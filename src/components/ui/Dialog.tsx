import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, id, className }: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#e0e5ec] rounded-2xl sm:rounded-3xl shadow-[var(--shadow-floating)] border border-white/80 border-b-[#babecc] border-r-[#babecc] overflow-hidden transform transition-all duration-150 animate-in zoom-in-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className={cn(
        "bg-[#2d3436] px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between gap-3 border-b border-white/20 relative shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className={cn("text-sm sm:text-base font-bold !text-white tracking-[-0.015em] leading-snug", className)}>
      {children}
    </h3>
  );
}

export function DialogCloseButton({ onClose, id }: { onClose: () => void; id?: string }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClose}
      className="w-8 h-8 rounded-lg bg-[#1e2528] hover:bg-[#ff4757] text-[#a3b1c6] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/10"
      aria-label="Đóng"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

export function DialogContent({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className={cn("p-4 sm:p-6 overflow-y-auto space-y-4 text-[#1a1a1a]", className)}>
      {children}
    </div>
  );
}

