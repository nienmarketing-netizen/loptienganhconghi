import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "amber" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", id, children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40";

    const variantClasses = {
      default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
      secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200/80",
      outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-xs",
      ghost: "text-slate-700 hover:bg-slate-100/80",
      amber: "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-sm hover:from-amber-600 hover:to-orange-600 shadow-orange-500/20",
      destructive: "bg-rose-600 text-white hover:bg-rose-700",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-xs rounded-lg",
      lg: "h-12 px-6 text-base rounded-2xl",
      icon: "h-9 w-9 p-0 rounded-lg",
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
