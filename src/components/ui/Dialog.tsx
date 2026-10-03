import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLockBodyScroll } from "../../lib/useLockBodyScroll";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  id?: string;
  className?: string;
  overlayClassName?: string;
}

export function Dialog({ open, onOpenChange, children, id, className, overlayClassName }: DialogProps) {
  useLockBodyScroll(open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      id={id}
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200",
        overlayClassName
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-[var(--shadow-floating)] border border-slate-100 overflow-hidden transform transition-all duration-150 animate-in zoom-in-95",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <div
      id={id}
      className={cn(
        "bg-gradient-to-r from-[#0066ff] via-[#1e88e5] to-[#0052cc] px-4 sm:px-6 py-4 text-white flex items-center justify-between gap-3 relative shrink-0 shadow-xs",
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
      className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/20"
      aria-label="Đóng"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

export function DialogContent({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className={cn("p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-slate-800", className)}>
      {children}
    </div>
  );
}

