import React, { useRef, useState, useEffect } from "react";

interface MarqueeTextProps {
  children?: React.ReactNode;
  text: string;
  className?: string;
  speedSeconds?: number;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  children,
  text,
  className = "",
  speedSeconds = 18,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && measureRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = measureRef.current.scrollWidth;
        setIsOverflowing(textWidth > containerWidth);
      }
    };

    checkOverflow();

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        checkOverflow();
      });
      resizeObserver.observe(containerRef.current);
    }

    const timer = setTimeout(checkOverflow, 120);

    return () => {
      clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex items-center ${className}`}
    >
      {/* Invisible measurement element */}
      <span
        ref={measureRef}
        className="invisible absolute pointer-events-none whitespace-nowrap"
        aria-hidden="true"
      >
        {text}
      </span>

      {isOverflowing ? (
        <div
          className="inline-flex whitespace-nowrap animate-marquee-slow hover:[animation-play-state:paused] active:[animation-play-state:paused]"
          style={{ animationDuration: `${speedSeconds}s` }}
          title={text}
        >
          <span className="inline-block pr-8">{children || text}</span>
          <span className="inline-block pr-8" aria-hidden="true">
            {children || text}
          </span>
        </div>
      ) : (
        <div className="w-full text-center truncate">
          {children || text}
        </div>
      )}
    </div>
  );
};
