import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl bg-[#e0e5ec] shadow-[var(--shadow-card)] border border-white/80 border-b-[#babecc]/70 border-r-[#babecc]/70 transition-all duration-200 relative",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={id} className={cn("flex flex-col space-y-1.5 p-4 sm:p-5 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      id={id}
      className={cn("font-bold text-[#2d3436] tracking-tight text-base sm:text-lg leading-none drop-shadow-[0_1px_0_#ffffff]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, id, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p id={id} className={cn("text-xs text-[#4a5568] leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={id} className={cn("p-4 sm:p-5 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={id} className={cn("flex items-center p-4 sm:p-5 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

