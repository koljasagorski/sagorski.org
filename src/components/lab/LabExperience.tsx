"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Scene } from "./Scene";
import { Overlay } from "./Overlay";
import { labStore, SECTIONS } from "@/lib/lab";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SCROLL_PER_ACT = 1.5; // viewport heights per act

export function LabExperience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    labStore.reduce = mq.matches;
    const onMq = (e: MediaQueryListEvent) => { labStore.reduce = e.matches; };
    mq.addEventListener("change", onMq);
    const updateMobile = () => {
      const m = window.innerWidth < 768;
      labStore.mobile = m;
      setMobile(m);
    };
    updateMobile();
    window.addEventListener("resize", updateMobile);

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const st = ScrollTrigger.create({
      trigger: wrapRef.current!,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => { labStore.total = self.progress; },
    });

    return () => {
      st.kill();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", updateMobile);
    };
  }, []);

  const wrapHeight = `${SECTIONS.length * SCROLL_PER_ACT * 100}vh`;

  return (
    <div className="lab2">
      <header className="lab2-header">
        <a href="/" aria-label="Zurück zur Hauptseite">← sagorski.it</a>
        <span>LAB · CYBER SECURITY</span>
      </header>

      <div ref={wrapRef} className="lab2-wrap" style={{ height: wrapHeight }}>
        <div className="lab2-sticky">
          {mounted && <Scene mobile={mobile} />}
          <Overlay />
          <div className="lab2-hint" aria-hidden>scroll ↓</div>
        </div>
      </div>
    </div>
  );
}
