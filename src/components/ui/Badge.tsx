import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "indigo" | "outline" | "amber";
}

export function Badge({ className, variant = "default", children, id, ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-[#2d3436] text-white border-white/20 shadow-[1px_1px_2px_rgba(0,0,0,0.2)]",
    secondary: "bg-[#e0e5ec] text-[#2d3436] border-[#babecc] shadow-[inset_1px_1px_2px_#ffffff,inset_-1px_-1px_2px_#babecc]",
    success: "bg-emerald-100/90 text-emerald-950 border-emerald-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]",
    warning: "bg-amber-100/90 text-amber-950 border-amber-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]",
    amber: "bg-amber-100 text-amber-950 border-amber-400/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]",
    indigo: "bg-[#d1d9e6] text-indigo-950 border-indigo-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]",
    outline: "text-[#2d3436] border-[#babecc] bg-[#e0e5ec] shadow-[inset_1px_1px_2px_#ffffff]",
  };

  return (
    <span
      id={id}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-xs font-bold font-mono tracking-wide whitespace-nowrap transition-colors select-none",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

