"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { content } from "@/contants/content";

type Stat = { id: string; label: string; value: number; suffix?: string };

function AnimatedNumber({
  progress,
  input,
  to,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  input: [number, number];
  to: number;
}) {
  const mv = useTransform(progress, input, [0, to]);
  const [num, setNum] = useState(0);
  useEffect(() => {
    const unsub = mv.on("change", (v) => setNum(Math.round(v)));
    return () => unsub();
  }, [mv]);
  return <>{num.toLocaleString()}</>;
}

export default function AboutSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Desktop vs mobile: desktop uses progress-driven pin + animations; mobile uses while-in-view fades
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const headerOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.08], [12, 0]);

  const p1 = useTransform(scrollYProgress, [0.10, 0.22], [0, 1]);
  const p2 = useTransform(scrollYProgress, [0.20, 0.34], [0, 1]);
  const p3 = useTransform(scrollYProgress, [0.30, 0.46], [0, 1]);

  const stats = (content.about.stats as unknown as readonly Stat[]) as Stat[];

  return (
    <section id="about" className="relative z-10 w-full py-16">
      <div ref={ref} className="relative md:min-h-[260vh]">
        <div className="md:sticky md:top-0 md:h-screen">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col md:justify-center gap-6 px-6 pt-20 md:pt-0">
            {/* Mobile-specific header to avoid overlap */}
            <h2 className="md:hidden text-3xl font-bold leading-tight">
              <span style={{ color: "#b9ff4f" }}>{content.about.header}</span>
            </h2>
            <motion.h2
              style={{ opacity: headerOpacity, y: headerY }}
              className="hidden md:block text-3xl md:text-5xl font-bold leading-tight"
            >
              <span style={{ color: "#b9ff4f" }}>{content.about.header}</span>
            </motion.h2>

            {/* Paragraphs: progress-driven on desktop, fade-in on mobile */}
            <motion.p
              style={isDesktop ? { opacity: p1 } : undefined}
              initial={isDesktop ? undefined : { opacity: 0, y: 8 }}
              whileInView={isDesktop ? undefined : { opacity: 1, y: 0 }}
              viewport={isDesktop ? undefined : { once: true, amount: 0.25 }}
              transition={isDesktop ? undefined : { duration: 0.5, ease: "easeOut" }}
              className="text-white/85 text-base md:text-lg"
            >
              {content.about.paragraphs[0]}
            </motion.p>
            <motion.p
              style={isDesktop ? { opacity: p2 } : undefined}
              initial={isDesktop ? undefined : { opacity: 0, y: 8 }}
              whileInView={isDesktop ? undefined : { opacity: 1, y: 0 }}
              viewport={isDesktop ? undefined : { once: true, amount: 0.25 }}
              transition={isDesktop ? undefined : { duration: 0.5, ease: "easeOut", delay: 0.05 }}
              className="text-white/85 text-base md:text-lg"
            >
              {content.about.paragraphs[1]}
            </motion.p>
            <motion.p
              style={isDesktop ? { opacity: p3 } : undefined}
              initial={isDesktop ? undefined : { opacity: 0, y: 8 }}
              whileInView={isDesktop ? undefined : { opacity: 1, y: 0 }}
              viewport={isDesktop ? undefined : { once: true, amount: 0.25 }}
              transition={isDesktop ? undefined : { duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="text-white/85 text-base md:text-lg"
            >
              {content.about.paragraphs[2]}
            </motion.p>

            {/* Stats: 3 by 1 column (3 columns, 1 row) */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 * i }}
                  className="rounded-lg border border-lime-400/20 bg-black/40 p-4"
                >
                  <div className="text-3xl font-bold" style={{ color: "#b9ff4f" }}>
                    <AnimatedNumber progress={scrollYProgress} input={[0.5, 0.8]} to={s.value} />
                    {s.suffix ?? ""}
                  </div>
                  <div className="text-white/80">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
