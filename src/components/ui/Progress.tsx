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
        "relative h-4 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 shadow-sm relative overflow-hidden",
          indicatorClassName
        )}
        style={{ width: `${percentage}%` }}
      >
        {showStripes && (
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[move-stripes_2s_linear_infinite]" />
        )}
      </div>
    </div>
  );
}
