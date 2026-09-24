import { useEffect } from "react";

let activeLockCount = 0;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";
let previousBodyPaddingRight = "";

/**
 * Custom hook to lock background page scrolling when a pop-up / modal is opened.
 * Allows scrolling only within the pop-up itself if the content exceeds viewport height.
 */
export function useLockBodyScroll(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked) return;

    if (activeLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      previousHtmlOverflow = document.documentElement.style.overflow;
      previousBodyPaddingRight = document.body.style.paddingRight;

      // Compensate for scrollbar width to prevent desktop layout jitter
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "contain";
    }

    activeLockCount++;

    return () => {
      activeLockCount--;
      if (activeLockCount <= 0) {
        activeLockCount = 0;
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.paddingRight = previousBodyPaddingRight;
        document.body.style.overscrollBehavior = "";
      }
    };
  }, [isLocked]);
}
