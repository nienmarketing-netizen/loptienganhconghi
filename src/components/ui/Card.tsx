import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200",
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
    <div id={id} className={cn("flex flex-col space-y-1.5 p-5 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      id={id}
      className={cn("font-semibold text-slate-900 tracking-tight text-lg leading-none", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, id, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p id={id} className={cn("text-xs text-slate-500 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={id} className={cn("p-5 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, id, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={id} className={cn("flex items-center p-5 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
