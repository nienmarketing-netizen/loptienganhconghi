import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl bg-white shadow-[var(--shadow-card)] border border-slate-100 hover:border-blue-100/80 transition-all duration-200 relative",
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
      className={cn("font-bold text-[#1e293b] tracking-tight text-base sm:text-lg leading-snug", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, id, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p id={id} className={cn("text-xs text-[#64748b] leading-relaxed", className)} {...props}>
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

