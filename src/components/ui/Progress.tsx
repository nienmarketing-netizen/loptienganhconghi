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
        "relative h-5 w-full overflow-hidden rounded-full bg-[#d1d9e6] p-1 shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] border border-[#babecc]/50",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#ff4757] via-[#ff6b81] to-[#ff4757] shadow-[0_0_8px_rgba(255,71,87,0.5)] relative overflow-hidden",
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
