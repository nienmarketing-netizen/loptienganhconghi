import React from "react";
import { cn } from "../../lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
  showStripes?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  indicatorClassName,
  showStripes = false,
  id,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

  return (
    <div
      id={id}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "relative h-5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out bg-[#4caf50] shadow-[0_2px_8px_rgba(76,175,80,0.35)] relative overflow-hidden",
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      >
        {showStripes && (
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:0.875rem_0.875rem]" />
        )}
      </div>
    </div>
  );
}
