import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "amber" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", id, children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-150 active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066ff]/50 cursor-pointer";

    const variantClasses = {
      default: "bg-[#0066ff] hover:bg-[#0052cc] text-white shadow-[0_4px_14px_rgba(0,102,255,0.3)] border border-blue-400/20",
      secondary: "bg-white text-[#1e293b] shadow-sm hover:bg-blue-50/60 hover:text-[#0066ff] border border-slate-200/80",
      outline: "border border-blue-200 bg-white text-[#0066ff] hover:bg-blue-50/80 hover:border-blue-300 shadow-xs",
      ghost: "text-[#64748b] hover:bg-blue-50 hover:text-[#0066ff]",
      amber: "bg-gradient-to-r from-[#ffb800] to-[#ff9800] hover:brightness-105 text-white shadow-[0_4px_14px_rgba(255,184,0,0.35)] border border-amber-200/40",
      destructive: "bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-[0_4px_14px_rgba(239,68,68,0.25)] border border-red-400/20",
    };

    const sizeClasses = {
      default: "min-h-[42px] px-4 py-2 rounded-xl",
      sm: "min-h-[34px] px-3 py-1 text-xs rounded-lg",
      lg: "min-h-[48px] px-6 py-2.5 text-base rounded-2xl",
      icon: "min-h-[38px] min-w-[38px] p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        id={id}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

