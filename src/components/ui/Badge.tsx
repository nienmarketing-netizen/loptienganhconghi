import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "indigo" | "outline" | "amber";
}

export function Badge({ className, variant = "default", children, id, ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-slate-900 text-white border-transparent",
    secondary: "bg-slate-100 text-slate-800 border-transparent",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    warning: "bg-amber-50 text-amber-700 border-amber-200/70",
    amber: "bg-amber-100/80 text-amber-900 border-amber-300/60",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
    outline: "text-slate-700 border-slate-200 bg-white",
  };

  return (
    <span
      id={id}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
