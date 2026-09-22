import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "amber" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", id, children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-150 active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4757]/60 cursor-pointer";

    const variantClasses = {
      default: "bg-[#2d3436] text-white shadow-[4px_4px_8px_rgba(0,0,0,0.25),-2px_-2px_6px_rgba(255,255,255,0.1)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-2px_-2px_6px_rgba(255,255,255,0.1)] border border-white/10",
      secondary: "bg-[#e0e5ec] text-[#2d3436] shadow-[var(--shadow-card-sm)] hover:text-[#ff4757] border border-white/80 border-b-[#babecc]/80 border-r-[#babecc]/80 active:shadow-[var(--shadow-pressed-sm)]",
      outline: "border border-[#babecc] bg-[#e0e5ec] text-[#2d3436] shadow-[inset_1px_1px_2px_#ffffff,var(--shadow-card-sm)] hover:border-[#ff4757] hover:text-[#ff4757] active:shadow-[var(--shadow-pressed-sm)]",
      ghost: "text-[#4a5568] hover:bg-[#d1d9e6]/50 hover:text-[#2d3436] active:shadow-[inset_2px_2px_4px_#babecc]",
      amber: "bg-[#ff4757] hover:bg-[#ff3344] text-white shadow-[var(--shadow-accent)] border border-white/30 active:shadow-[var(--shadow-accent-pressed)]",
      destructive: "bg-[#e03949] text-white shadow-[var(--shadow-accent)] border border-white/20 active:shadow-[var(--shadow-accent-pressed)]",
    };

    const sizeClasses = {
      default: "min-h-[42px] px-4 py-2",
      sm: "min-h-[34px] px-3 py-1 text-xs rounded-md",
      lg: "min-h-[48px] px-6 py-2.5 text-base rounded-lg sm:rounded-xl",
      icon: "min-h-[38px] min-w-[38px] p-0 rounded-lg",
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

