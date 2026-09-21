import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  id?: string;
}

export function Dialog({ open, onOpenChange, children, id }: DialogProps) {
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full sm:max-w-lg max-h-[88vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden transform transition-all duration-200 animate-in slide-in-from-bottom sm:slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className={cn("p-5 pb-3 border-b border-slate-100 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className={cn("text-lg font-bold text-slate-900", className)}>
      {children}
    </h2>
  );
}

export function DialogCloseButton({ onClose, id }: { onClose: () => void; id?: string }) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClose}
      className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      aria-label="Đóng"
    >
      <X className="w-5 h-5" />
    </button>
  );
}

export function DialogContent({ className, children, id }: { className?: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className={cn("p-5 overflow-y-auto space-y-4", className)}>
      {children}
    </div>
  );
}
