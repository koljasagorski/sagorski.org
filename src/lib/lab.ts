"use client";

import { Vector3 } from "three";

// Mutable, non-reactive store so 3D and overlay can read scroll progress
// without React re-renders on every frame.
export type LabStore = {
  total: number;     // 0..1 across the whole scroll experience
  reduce: boolean;   // prefers-reduced-motion
  mobile: boolean;   // viewport < 768
};
export const labStore: LabStore = { total: 0, reduce: false, mobile: false };

// Lat/lng (degrees) → unit-sphere Vector3.
// Convention matches three.js SphereGeometry default UV: lng=0 → +X, lng=+90E → -Z.
export function latLngToVec3(latDeg: number, lngDeg: number, r = 1, out = new Vector3()) {
  const lat = (latDeg * Math.PI) / 180;
  const lng = (lngDeg * Math.PI) / 180;
  const c = Math.cos(lat);
  return out.set(r * c * Math.cos(lng), r * Math.sin(lat), -r * c * Math.sin(lng));
}

export const TARGET_LAT = 50.1;
export const TARGET_LNG = 8.7; // Frankfurt — stand-in for "your company in the DACH"

export const SOURCES: Array<[number, number]> = [
  [39.9, 116.4], [55.7, 37.6], [35.7, 51.4], [28.6, 77.2],
  [1.3, 103.8], [-6.2, 106.8], [21.0, 105.8], [14.6, 121.0],
  [6.5, 3.4], [-23.5, -46.6], [44.4, 26.1], [39.0, 125.7],
  [41.0, 28.9], [30.0, 31.2], [19.4, -99.1], [40.7, -74.0],
  [34.0, -118.2], [-1.3, 36.8],
];

export const TARGETS_GLOBAL: Array<[number, number]> = [
  [40.7, -74.0], [51.5, -0.1], [48.9, 2.4], [35.7, 139.7],
  [-33.9, 151.2], [1.3, 103.8], [50.1, 8.7], [52.5, 13.4],
  [48.1, 11.6], [37.8, -122.4], [25.0, 55.3], [-23.5, -46.6],
];

export type Act = {
  camPos: [number, number, number];
  globeSpin: number;
  atmoColor: string;
  atmoIntensity: number;
  arcsTarget: number;
  arcColor: string;
  arcSpeed: number;
  arcFocus: "global" | "frankfurt";
  shieldOpacity: number;
  shieldScale: number;
  exfilIntensity: number;
  targetIntensity: number;
};

const FRANKFURT = latLngToVec3(TARGET_LAT, TARGET_LNG);
const camAtFrankfurt = (dist: number): [number, number, number] => [
  FRANKFURT.x * dist, FRANKFURT.y * dist, FRANKFURT.z * dist,
];

export const ACTS: Act[] = [
  // 0 — Vernetzt
  {
    camPos: [1.4, 0.85, 2.85],
    globeSpin: 0.04,
    atmoColor: "#5ab2e6",
    atmoIntensity: 0.55,
    arcsTarget: 10,
    arcColor: "#9cc6e8",
    arcSpeed: 0.55,
    arcFocus: "global",
    shieldOpacity: 0,
    shieldScale: 1,
    exfilIntensity: 0,
    targetIntensity: 0,
  },
  // 1 — Bedrohung
  {
    camPos: [0.7, 0.55, 2.7],
    globeSpin: 0.06,
    atmoColor: "#e8794a",
    atmoIntensity: 0.75,
    arcsTarget: 46,
    arcColor: "#ff5a3a",
    arcSpeed: 1.35,
    arcFocus: "global",
    shieldOpacity: 0,
    shieldScale: 1,
    exfilIntensity: 0,
    targetIntensity: 0.15,
  },
  // 2 — Ihr Unternehmen
  {
    camPos: camAtFrankfurt(1.85),
    globeSpin: 0,
    atmoColor: "#b8472d",
    atmoIntensity: 0.8,
    arcsTarget: 26,
    arcColor: "#ff4630",
    arcSpeed: 1.55,
    arcFocus: "frankfurt",
    shieldOpacity: 0,
    shieldScale: 1,
    exfilIntensity: 1,
    targetIntensity: 1,
  },
  // 3 — Verteidigung
  {
    camPos: camAtFrankfurt(2.0),
    globeSpin: 0,
    atmoColor: "#1d9e75",
    atmoIntensity: 0.7,
    arcsTarget: 20,
    arcColor: "#ff5a3a",
    arcSpeed: 1.25,
    arcFocus: "frankfurt",
    shieldOpacity: 1,
    shieldScale: 1.07,
    exfilIntensity: 0,
    targetIntensity: 0.85,
  },
  // 4 — Klarheit
  {
    camPos: [0.5, 0.5, 3.05],
    globeSpin: 0.04,
    atmoColor: "#3da585",
    atmoIntensity: 0.5,
    arcsTarget: 12,
    arcColor: "#7fd0b3",
    arcSpeed: 0.7,
    arcFocus: "global",
    shieldOpacity: 0.55,
    shieldScale: 1,
    exfilIntensity: 0,
    targetIntensity: 0.4,
  },
];

export const ACT_COUNT = ACTS.length;

export type MediaKey = "counter" | "terminal" | "assets" | "process" | "trust";

export type Section = {
  eyebrow: string;
  title: string;
  body: string;
  media: MediaKey;
};

export const SECTIONS: Section[] = [
  {
    eyebrow: "01 · Vernetzt",
    title: "Die Welt hängt am Netz.",
    body:
      "Milliarden Verbindungen pro Sekunde — E-Mails, Bestellungen, Backups, Updates. Vieles davon läuft auch durch Ihr Unternehmen.",
    media: "counter",
  },
  {
    eyebrow: "02 · Realität",
    title: "Nicht alles, was reinkommt, ist freundlich.",
    body:
      "Automatisierte Tools scannen ununterbrochen jede öffentliche Adresse. Brute-Force-Login. Schwachstellen-Scan. Massenangriff. Es passiert gerade jetzt — auch bei Ihnen.",
    media: "terminal",
  },
  {
    eyebrow: "03 · Ihr Unternehmen",
    title: "Sie sind nicht zu klein.",
    body:
      "Der Mittelstand ist beliebtes Ziel: gut genug, um zahlungsfähig zu sein — schlecht genug geschützt, um lohnenswert zu sein. Die Frage ist nicht ob, sondern wann jemand findet, was Sie übersehen haben.",
    media: "assets",
  },
  {
    eyebrow: "04 · Antwort",
    title: "Wissen, wo es brennt — bevor es brennt.",
    body:
      "Ein strukturierter Pentest spielt den Angreifer durch: kontrolliert, dokumentiert, mit Behebungspfad. Sie sehen Ihre Angriffsfläche durch die Augen eines Angreifers — nicht durch die eines Scanners.",
    media: "process",
  },
  {
    eyebrow: "05 · Klarheit",
    title: "Reden Sie mit dem, der testet.",
    body:
      "30 Minuten, vertraulich. Wir schauen auf Ihre Lage. Sie entscheiden danach in Ruhe.",
    media: "trust",
  },
];

// Map total scroll (0..1) to a pair of adjacent acts and a blend factor.
// Each act peaks at (i + 0.5) / N in total-space; we lerp between adjacent peaks.
export function blendActs(total: number): { from: number; to: number; t: number } {
  const t = Math.max(0, Math.min(1, total));
  const n = ACT_COUNT;
  if (t <= 0.5 / n) return { from: 0, to: 0, t: 0 };
  if (t >= (n - 0.5) / n) return { from: n - 1, to: n - 1, t: 0 };
  const scaled = t * n - 0.5; // 0..n-1
  const from = Math.floor(scaled);
  const localT = scaled - from;
  return { from, to: Math.min(n - 1, from + 1), t: localT };
}

export function smoothstep(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}
