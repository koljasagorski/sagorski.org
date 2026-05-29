"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTIONS } from "@/lib/lab";
import { MEDIA } from "./Media";

export function Overlay() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const acts = gsap.utils.toArray<HTMLElement>(".lab2-act");
      const N = acts.length;

      // Set initial states. Act 0 is already "entered" so a fresh page load
      // (which lands at scroll = 0) shows the first headline immediately.
      acts.forEach((act, i) => {
        const entered = i === 0;
        gsap.set(act, { opacity: entered ? 1 : 0, y: entered ? 0 : 36 });
        gsap.set(act.querySelector(".lab2-eyebrow"), { opacity: entered ? 1 : 0, x: entered ? 0 : -14 });
        gsap.set(act.querySelector(".lab2-title"), {
          opacity: entered ? 1 : 0,
          y: entered ? 0 : 24,
          filter: entered ? "blur(0px)" : "blur(10px)",
        });
        gsap.set(act.querySelector(".lab2-body"), { opacity: entered ? 1 : 0, y: entered ? 0 : 18 });
        const cta = act.querySelector(".lab2-cta");
        if (cta) gsap.set(cta, { opacity: 0, y: 14 });
        const media = act.querySelector(".lab2-act-media");
        if (media) gsap.set(media, { opacity: entered ? 1 : 0, x: entered ? 0 : 40 });
      });

      const tl = gsap.timeline({ paused: true });
      acts.forEach((act, i) => {
        const slotStart = i / N;
        const slotEnd = (i + 1) / N;
        const slotLen = slotEnd - slotStart;
        const enterDur = slotLen * 0.22;
        const exitDur = slotLen * 0.22;
        const eyebrow = act.querySelector(".lab2-eyebrow");
        const title = act.querySelector(".lab2-title");
        const body = act.querySelector(".lab2-body");
        const cta = act.querySelector(".lab2-cta");
        const media = act.querySelector(".lab2-act-media");

        // Skip enter animation for act 0 (already visible at scroll start).
        if (i > 0) {
          tl.to(act, {
            opacity: 1, y: 0,
            duration: enterDur, ease: "power2.out",
          }, slotStart);
          tl.to(eyebrow, { opacity: 1, x: 0, duration: enterDur * 0.7, ease: "power2.out" },
            slotStart + enterDur * 0.1);
          tl.to(title, { opacity: 1, y: 0, filter: "blur(0px)", duration: enterDur * 0.9, ease: "power3.out" },
            slotStart + enterDur * 0.18);
          tl.to(body, { opacity: 1, y: 0, duration: enterDur * 0.9, ease: "power2.out" },
            slotStart + enterDur * 0.3);
          if (media) {
            tl.to(media, {
              opacity: 1, x: 0,
              duration: enterDur * 0.95, ease: "power3.out",
            }, slotStart + enterDur * 0.35);
          }
        }
        if (cta) {
          tl.to(cta, { opacity: 1, y: 0, duration: enterDur * 0.85, ease: "power2.out" },
            slotStart + enterDur * 0.45);
        }

        if (i < N - 1) {
          tl.to(act, {
            opacity: 0, y: -32,
            duration: exitDur, ease: "power2.in",
          }, slotEnd - exitDur);
          if (media) {
            tl.to(media, {
              opacity: 0, x: -30,
              duration: exitDur, ease: "power2.in",
            }, slotEnd - exitDur);
          }
        }
      });
      // Force exact duration = 1 so timeline positions match scroll fractions.
      const dummy = { v: 0 };
      tl.to(dummy, { v: 1, duration: 1, ease: "none" }, 0);

      ScrollTrigger.create({
        trigger: ".lab2-wrap",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => tl.progress(self.progress, false),
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="lab2-overlay">
      {SECTIONS.map((s, i) => {
        const MediaComp = MEDIA[s.media];
        return (
          <div key={i} className="lab2-act" data-act={i}>
            <div className="lab2-act-text">
              <span className="lab2-eyebrow">{s.eyebrow}</span>
              <h2 className="lab2-title">{s.title}</h2>
              <p className="lab2-body">{s.body}</p>
              {i === SECTIONS.length - 1 && (
                <div className="lab2-cta">
                  <a className="lab2-btn" href="mailto:kontakt@sagorski.it">
                    Risiko-Gespräch vereinbaren →
                  </a>
                  <span className="lab2-cta-note">30 min · vertraulich · ohne Verpflichtung</span>
                </div>
              )}
            </div>
            <div className="lab2-act-media">
              <MediaComp />
            </div>
          </div>
        );
      })}
    </div>
  );
}
