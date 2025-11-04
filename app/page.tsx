"use client";

import { useLenis } from "@/lib/useLenis";
import Hero from "@/components/sections/Hero";
import OverlayNav from "@/components/OverlayNav";

export default function Home() {
  useLenis(true);

  return (
    <main className="relative isolate min-h-screen w-full text-lime-300">
      {/* City canvas is rendered inside Hero only */}
      <OverlayNav />

      <div className="relative">
        {/* Hero section only */}
        <Hero />
      </div>
    </main>
  );
}
 
