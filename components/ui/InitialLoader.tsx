"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function InitialLoader({ children }: { children: React.ReactNode }) {
  // Default to visible so SSR/first paint shows the overlay
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    try {
      const alreadyShown = typeof window !== "undefined" && sessionStorage.getItem("initial-loader-shown");
      if (alreadyShown) {
        setShowOverlay(false);
        return;
      }

      const finish = () => {
        // Small delay so the spinner is perceptible
        setTimeout(() => {
          setShowOverlay(false);
          sessionStorage.setItem("initial-loader-shown", "1");
        }, 300);
      };

      if (document.readyState === "complete") {
        finish();
      } else {
        const onLoad = () => finish();
        window.addEventListener("load", onLoad, { once: true });
        return () => window.removeEventListener("load", onLoad);
      }
    } catch {
      // If sessionStorage not available, still show once for this load
      const onLoad = () => setTimeout(() => setShowOverlay(false), 300);
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="initial-loader"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200"
              style={{ borderTopColor: "#b9ff4f" }}
              aria-label="Loading"
              role="status"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
