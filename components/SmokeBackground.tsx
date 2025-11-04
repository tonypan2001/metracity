"use client";

import { useEffect, useRef } from "react";
import { valueNoise2D } from "@/lib/noise";

type Props = {
  className?: string;
  opacity?: number; // 0..1 visual opacity of the smoke layer
};

// Animated procedural smoke using low-res value noise upscaled + blurred
export default function SmokeBackground({ className, opacity = 0.5 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const targetW = Math.max(160, Math.min(480, Math.floor(rect.width / 3)));
      const targetH = Math.max(120, Math.min(360, Math.floor(rect.height / 3)));

      width = targetW;
      height = targetH;
      canvas.width = width;
      canvas.height = height;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const imageData = () => ctx.createImageData(width, height);
    let frame = 0;

    const draw = () => {
      if (!running) return;
      const data = imageData();
      const buf = data.data;
      const t = frame * 0.008; // time

      // parameters
      const scale1 = 55; // base scale
      const scale2 = 95; // second octave
      const scale3 = 160; // third octave
      const speedX = 0.12;
      const speedY = -0.08;

      let p = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Fractal noise with moving coordinates to create swirling feel
          const nx = x / scale1 + t * speedX;
          const ny = y / scale1 + t * speedY;
          let n = valueNoise2D(nx, ny, 3);
          n += 0.6 * valueNoise2D(x / scale2 - t * 0.06, y / scale2 + t * 0.05, 7);
          n += 0.35 * valueNoise2D(x / scale3 + t * 0.03, y / scale3 - t * 0.035, 11);
          n /= 1.95;

          // shape the noise to be softer (more transparent overall)
          let v = Math.max(0, Math.min(1, (n - 0.45) * 3.0));
          v = v * v; // ease

          const alpha = Math.floor(v * 255);
          buf[p++] = 255; // R
          buf[p++] = 255; // G
          buf[p++] = 255; // B
          buf[p++] = alpha; // A
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(data, 0, 0);
      frame++;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className ?? ""}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-50 [filter:blur(24px)] [image-rendering:pixelated]"
        style={{ opacity }}
        aria-hidden
      />
    </div>
  );
}
