import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "indigo" | "outline" | "amber";
}

export function Badge({ className, variant = "default", children, id, ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-50 text-[#0066ff] border-blue-200/80 shadow-xs",
    secondary: "bg-slate-100 text-slate-700 border-slate-200 shadow-xs",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs",
    warning: "bg-amber-50 text-amber-800 border-amber-200 shadow-xs",
    amber: "bg-amber-50 text-amber-800 border-amber-300 font-bold shadow-xs",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs",
    outline: "text-slate-700 border-slate-200 bg-white shadow-xs",
  };

  return (
    <span
      id={id}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-normal whitespace-nowrap transition-colors select-none",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

