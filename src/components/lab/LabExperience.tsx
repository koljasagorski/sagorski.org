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

const SCROLL_PER_ACT = 1.5;

function detectSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // Real Safari (desktop or iOS): contains "Safari" but neither "Chrome"
  // nor "Chromium" nor "Android". Also catch iPad on macOS UA.
  const safariUA = /^((?!chrome|chromium|crios|android).)*safari/i.test(ua);
  const iOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && "ontouchend" in document);
  return safariUA || iOS;
}

export function LabExperience() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [enableBloom, setEnableBloom] = useState(false);

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

    // Bloom postprocessing is heavy and flickers on Safari's compositor when
    // combined with a fixed/sticky WebGL canvas. Disable on Safari + mobile.
    const safari = detectSafari();
    const isMobileNow = window.innerWidth < 768;
    setEnableBloom(!safari && !isMobileNow);

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
        <a href="/" aria-label="Startseite" className="lab2-brand">
          <span className="lab2-brand-name">Kolja Sagorski</span>
          <span className="lab2-brand-role">· Offensive Security</span>
        </a>
        <a href="https://impressum.sagorski.it" rel="noopener">Impressum</a>
      </header>

      {/* Fixed stage holds the 3D scene and overlays — always covers the
          viewport, no sticky-release at the bottom. */}
      <div className="lab2-stage" aria-hidden={false}>
        {mounted && <Scene mobile={mobile} enableBloom={enableBloom} />}
        <Overlay />
        <div className="lab2-hint" aria-hidden>scroll ↓</div>
      </div>

      {/* Empty scroll spacer — provides the scroll distance that drives the
          ScrollTrigger timeline. */}
      <div
        ref={wrapRef}
        className="lab2-wrap"
        style={{ height: wrapHeight }}
        aria-hidden
      />
    </div>
  );
}
