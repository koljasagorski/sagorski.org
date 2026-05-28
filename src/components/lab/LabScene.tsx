"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

type LatLng = { lat: number; lng: number; name: string };

const SOURCES: LatLng[] = [
  { lat: 39.9, lng: 116.4, name: "Beijing" },
  { lat: 55.7, lng: 37.6, name: "Moscow" },
  { lat: 35.7, lng: 51.4, name: "Tehran" },
  { lat: 28.6, lng: 77.2, name: "Delhi" },
  { lat: 1.3, lng: 103.8, name: "Singapore" },
  { lat: -6.2, lng: 106.8, name: "Jakarta" },
  { lat: 21.0, lng: 105.8, name: "Hanoi" },
  { lat: 14.6, lng: 121.0, name: "Manila" },
  { lat: 6.5, lng: 3.4, name: "Lagos" },
  { lat: -23.5, lng: -46.6, name: "São Paulo" },
  { lat: 44.4, lng: 26.1, name: "Bucharest" },
  { lat: 39.0, lng: 125.7, name: "Pyongyang" },
  { lat: 41.0, lng: 28.9, name: "Istanbul" },
  { lat: 30.0, lng: 31.2, name: "Cairo" },
  { lat: 19.4, lng: -99.1, name: "Mexico City" },
];

const DACH_TARGETS: LatLng[] = [
  { lat: 50.1, lng: 8.7, name: "Frankfurt" },
  { lat: 52.5, lng: 13.4, name: "Berlin" },
  { lat: 48.1, lng: 11.6, name: "München" },
  { lat: 53.5, lng: 10.0, name: "Hamburg" },
  { lat: 48.8, lng: 9.2, name: "Stuttgart" },
  { lat: 50.9, lng: 6.95, name: "Köln" },
  { lat: 47.4, lng: 8.5, name: "Zürich" },
  { lat: 48.2, lng: 16.4, name: "Wien" },
  { lat: 51.5, lng: 7.1, name: "Gelsenkirchen" },
];

const GLOBAL_TARGETS: LatLng[] = [
  { lat: 40.7, lng: -74.0, name: "New York" },
  { lat: 37.8, lng: -122.4, name: "San Francisco" },
  { lat: 51.5, lng: -0.1, name: "London" },
  { lat: 48.9, lng: 2.4, name: "Paris" },
  { lat: 35.7, lng: 139.7, name: "Tokyo" },
  { lat: -33.9, lng: 151.2, name: "Sydney" },
  { lat: 1.3, lng: 103.8, name: "Singapore" },
  ...DACH_TARGETS,
];

type Stage = {
  eyebrow: string;
  title: string;
  body: string;
  pov: { lat: number; lng: number; altitude: number };
  intervalMs: number;
  maxArcs: number;
  targetSet: LatLng[];
  arcColor: [string, string];
  arcAltitude: number;
  arcStroke: number;
  side: "left" | "right";
};

const STAGES: Stage[] = [
  {
    eyebrow: "01 · Status quo",
    title: "Was Sie online sehen.",
    body:
      "Ein paar erfolglose Login-Versuche im Log. Vielleicht ein Phishing-Mail im Spam. Nichts Auffälliges. Aus Sicht der Geschäftsführung: alles ruhig.",
    pov: { lat: 30, lng: 10, altitude: 2.6 },
    intervalMs: 1400,
    maxArcs: 6,
    targetSet: GLOBAL_TARGETS,
    arcColor: ["rgba(184,71,45,0)", "rgba(184,71,45,0.7)"],
    arcAltitude: 0.35,
    arcStroke: 0.35,
    side: "left",
  },
  {
    eyebrow: "02 · Realität",
    title: "Was wirklich passiert.",
    body:
      "Pro Sekunde scannen automatisierte Tools öffentliche Angriffsflächen weltweit. Brute-Force, Schwachstellen-Scanner, exfiltrierte Credentials. Die meisten verschwinden im Hintergrundrauschen — die gefährlichen tarnen sich darin.",
    pov: { lat: 30, lng: 10, altitude: 2.4 },
    intervalMs: 180,
    maxArcs: 28,
    targetSet: GLOBAL_TARGETS,
    arcColor: ["rgba(255,255,255,0)", "rgba(184,71,45,0.95)"],
    arcAltitude: 0.32,
    arcStroke: 0.4,
    side: "right",
  },
  {
    eyebrow: "03 · Ihre Angriffsfläche",
    title: "Auf Sie zugeschnitten.",
    body:
      "Sechs externe IPs. Drei Subdomains, die Sie vergessen haben. Eine alte VPN-Appliance. Ein Test-System aus 2022, das noch erreichbar ist. Das findet ein strukturierter Pentest — bevor jemand anders es tut.",
    pov: { lat: 51, lng: 10, altitude: 1.4 },
    intervalMs: 240,
    maxArcs: 22,
    targetSet: DACH_TARGETS,
    arcColor: ["rgba(255,255,255,0)", "rgba(255,80,55,1)"],
    arcAltitude: 0.18,
    arcStroke: 0.5,
    side: "left",
  },
  {
    eyebrow: "04 · Antwort",
    title: "Strukturierter Pentest.",
    body:
      "Manuell. Methodisch. Dokumentiert nach BSI. Mit priorisiertem Behebungspfad und Re-Test im Festpreis. Das Ergebnis ist keine Liste mit 300 Schwachstellen — sondern Klarheit, was zuerst weg muss.",
    pov: { lat: 51, lng: 10, altitude: 1.7 },
    intervalMs: 700,
    maxArcs: 10,
    targetSet: DACH_TARGETS,
    arcColor: ["rgba(29,158,117,0)", "rgba(29,158,117,0.95)"],
    arcAltitude: 0.22,
    arcStroke: 0.45,
    side: "right",
  },
];

type Arc = {
  id: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  arcAltitude: number;
  arcStroke: number;
};

let arcSeq = 0;

function makeArc(stage: Stage): Arc {
  const src = SOURCES[Math.floor(Math.random() * SOURCES.length)];
  const tgt = stage.targetSet[Math.floor(Math.random() * stage.targetSet.length)];
  return {
    id: ++arcSeq,
    startLat: src.lat,
    startLng: src.lng,
    endLat: tgt.lat,
    endLng: tgt.lng,
    color: stage.arcColor,
    arcAltitude: stage.arcAltitude,
    arcStroke: stage.arcStroke,
  };
}

export function LabScene() {
  const [stage, setStage] = useState(0);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctrl = g.controls() as any;
    if (ctrl) {
      ctrl.autoRotate = !reduceMotion;
      ctrl.autoRotateSpeed = 0.35;
      ctrl.enableZoom = false;
    }
    g.pointOfView(STAGES[0].pov, 0);
  }, [reduceMotion, dims.w]);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView(STAGES[stage].pov, reduceMotion ? 0 : 1600);
  }, [stage, reduceMotion]);

  useEffect(() => {
    const cfg = STAGES[stage];
    setArcs([]);
    if (reduceMotion) return; // static globe under reduced motion
    const interval = window.setInterval(() => {
      setArcs((prev) => {
        const next = [...prev, makeArc(cfg)];
        return next.length > cfg.maxArcs ? next.slice(-cfg.maxArcs) : next;
      });
    }, cfg.intervalMs);
    return () => window.clearInterval(interval);
  }, [stage, reduceMotion]);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".lab-section");
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(visible.target.getAttribute("data-stage"));
        if (!Number.isNaN(idx)) setStage(idx);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lab">
      <div className="lab-globe" aria-hidden>
        {dims.w > 0 && (
          <Globe
            ref={globeRef}
            width={dims.w}
            height={dims.h}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="/lab/earth-dark.jpg"
            showAtmosphere
            atmosphereColor="#b8472d"
            atmosphereAltitude={0.18}
            arcsData={arcs}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            arcStartLat={(a: any) => a.startLat}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            arcStartLng={(a: any) => a.startLng}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            arcEndLat={(a: any) => a.endLat}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            arcEndLng={(a: any) => a.endLng}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            arcColor={(a: any) => a.color}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            arcAltitude={(a: any) => a.arcAltitude}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            arcStroke={(a: any) => a.arcStroke}
            arcDashLength={0.45}
            arcDashGap={0.6}
            arcDashAnimateTime={1800}
            enablePointerInteraction={false}
            animateIn={false}
          />
        )}
      </div>

      <div className="lab-shell">
        <header className="lab-header">
          <a href="/" className="lab-back" aria-label="Zurück zu sagorski.it">
            ← sagorski.it
          </a>
          <span className="lab-mark">LAB · THREAT GLOBE</span>
        </header>

        <main id="main">
          {STAGES.map((s, i) => (
            <section
              key={i}
              className={`lab-section lab-section-${s.side}`}
              data-stage={i}
              aria-labelledby={`lab-stage-${i}`}
            >
              <div className="lab-panel">
                <span className="lab-eyebrow">{s.eyebrow}</span>
                <h2 id={`lab-stage-${i}`}>{s.title}</h2>
                <p>{s.body}</p>
                {i === STAGES.length - 1 && (
                  <div className="lab-cta-row">
                    <a
                      className="lab-cta-primary"
                      href="mailto:kontakt@sagorski.it"
                    >
                      Risiko-Gespräch vereinbaren →
                    </a>
                    <a className="lab-cta-secondary" href="/">
                      Zurück zur Hauptseite
                    </a>
                  </div>
                )}
              </div>
            </section>
          ))}
        </main>

        <footer className="lab-foot">
          <span>Simulation · keine echten Live-Daten</span>
          <a href="/">sagorski.it ↗</a>
        </footer>
      </div>
    </div>
  );
}
