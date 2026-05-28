"use client";

import { useEffect, useRef, useState } from "react";

// ============ Akt 1 — Live connections counter + data stream ============
export function Counter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let count = 0;
    const fmt = new Intl.NumberFormat("de-DE");
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      count += dt * 4_500_000; // ~4.5M/s — simulated planetary scale
      if (ref.current) ref.current.textContent = fmt.format(Math.floor(count));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const streamItems = [
    "203.0.113.42 → mail-relay-fra",
    "198.51.100.7 → cdn.cloudfront",
    "192.0.2.55 → api.azure-eu",
    "10.0.42.18 → backup.local",
    "172.16.5.91 → vpn-gateway",
    "185.74.22.140 → s3.amazonaws",
    "212.99.4.18 → smtp.relay",
    "91.121.4.18 → dns.resolver",
  ];

  return (
    <div className="lab2-card lab2-card-counter">
      <div className="lab2-card-head">
        <span className="lab2-live"><i /></span>
        <span className="lab2-card-label">Verbindungen weltweit</span>
      </div>
      <div className="lab2-card-num" ref={ref}>0</div>
      <div className="lab2-card-sub">pro Sekunde · Schätzung</div>
      <div className="lab2-stream" aria-hidden>
        <div className="lab2-stream-track">
          {[...streamItems, ...streamItems].map((s, i) => (
            <span key={i} className="lab2-stream-item">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Akt 2 — Live attack log terminal ============
export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ips = [
      "203.0.113.42", "198.51.100.7", "192.0.2.55", "172.16.5.91",
      "10.0.42.18", "185.74.22.140", "91.121.4.18", "45.146.31.4",
      "8.42.77.91", "212.83.4.18", "104.244.78.231",
    ];
    const users = ["admin", "root", "ubuntu", "support", "test", "git", "deploy", "postgres", "www-data", "oracle"];
    const passes = ["123456", "qwerty", "letmein", "admin", "password", "12345", "P@ssw0rd", "welcome1", "changeme"];
    const attacks = ["SSH brute", "HTTP auth", "FTP login", "RDP probe", "SMB scan", "SMTP relay", "DB probe"];

    const addLine = () => {
      if (!ref.current) return;
      const t = new Date();
      const pad = (n: number, w = 2) => String(n).padStart(w, "0");
      const ts = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}.${pad(t.getMilliseconds(), 3)}`;
      const ip = ips[Math.floor(Math.random() * ips.length)];
      const u = users[Math.floor(Math.random() * users.length)];
      const p = passes[Math.floor(Math.random() * passes.length)];
      const a = attacks[Math.floor(Math.random() * attacks.length)];
      const line = document.createElement("div");
      line.className = "lab2-term-line";
      line.innerHTML =
        `<span class="t-ts">${ts}</span> ` +
        `<span class="t-ip">${ip}</span> ` +
        `<span class="t-arr">→</span> ` +
        `<span class="t-att">${a}</span> ` +
        `<span class="t-cred">${u}:${p}</span> ` +
        `<span class="t-x">BLOCKED</span>`;
      ref.current.appendChild(line);
      requestAnimationFrame(() => line.classList.add("is-shown"));
      while (ref.current.children.length > 7) {
        ref.current.firstChild?.remove();
      }
    };

    addLine();
    const id = setInterval(addLine, 320);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lab2-card lab2-terminal">
      <div className="lab2-term-head">
        <span className="lab2-term-dots"><i /><i /><i /></span>
        <span className="lab2-term-title">attack-log · live</span>
        <span className="lab2-live"><i /></span>
      </div>
      <div className="lab2-term-body" ref={ref} />
    </div>
  );
}

// ============ Akt 3 — Exposed assets discovered ============
export function Assets() {
  const [n, setN] = useState(2);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v >= 6 ? v : v + 1)), 1100);
    return () => clearInterval(id);
  }, []);
  const items = [
    { name: "vpn.firma.de", note: "exposed — CVE-2023-46805", sev: "HIGH" },
    { name: "test.firma.de", note: "outdated WordPress 5.8.1", sev: "MED" },
    { name: "ftp.firma.de", note: "anonymous login aktiv", sev: "MED" },
    { name: "git.firma.de", note: ".git/ öffentlich lesbar", sev: "HIGH" },
    { name: "mail.firma.de", note: "SPF / DMARC fehlt", sev: "LOW" },
    { name: "remote.firma.de", note: "RDP-Port exponiert", sev: "HIGH" },
  ];
  return (
    <div className="lab2-card lab2-assets">
      <div className="lab2-card-head">
        <span className="lab2-live"><i /></span>
        <span className="lab2-card-label">Exposed Assets · Discovery</span>
      </div>
      <div className="lab2-assets-list">
        {items.map((it, i) => (
          <div key={i} className={`lab2-asset ${i < n ? "is-shown" : ""}`}>
            <span className={`lab2-asset-sev sev-${it.sev.toLowerCase()}`}>{it.sev}</span>
            <div className="lab2-asset-text">
              <span className="lab2-asset-name">{it.name}</span>
              <span className="lab2-asset-note">{it.note}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="lab2-card-foot">
        <span>{n}/6 Findings</span>
        <span className="lab2-progress"><span style={{ width: `${(n / 6) * 100}%` }} /></span>
      </div>
    </div>
  );
}

// ============ Akt 4 — Pentest workflow phases ============
export function Process() {
  const [step, setStep] = useState(1);
  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= 6) return 1; // restart loop so the "is-active" highlight keeps moving
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(id);
  }, []);
  const phases = [
    { name: "Recon", note: "Was ist erreichbar?" },
    { name: "Enumeration", note: "Welche Versionen, welche Konfig?" },
    { name: "Exploitation", note: "Welche Lücken nutzbar?" },
    { name: "Post-Exploit", note: "Was bedeutet Zugriff hier?" },
    { name: "Lateral Movement", note: "Wie tief geht's?" },
    { name: "Report & Re-Test", note: "Klarer Behebungspfad." },
  ];
  return (
    <div className="lab2-card lab2-process">
      <div className="lab2-card-head">
        <span className="lab2-card-label">Pentest · Workflow</span>
        <span className="lab2-card-sub-inline">{step}/6</span>
      </div>
      <div className="lab2-process-list">
        {phases.map((p, i) => (
          <div key={i} className={`lab2-step ${i < step ? "is-done" : i === step ? "is-active" : ""}`}>
            <span className="lab2-step-num">{String(i + 1).padStart(2, "0")}</span>
            <div className="lab2-step-text">
              <span className="lab2-step-name">{p.name}</span>
              <span className="lab2-step-note">{p.note}</span>
            </div>
            <span className="lab2-step-mark">{i < step ? "✓" : i === step ? "·" : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Akt 5 — Trust card + next-slot countdown ============
export function Trust() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date(now);
      // next Thursday at 14:30
      const dayOffset = (4 - now.getDay() + 7) % 7 || 7;
      target.setDate(now.getDate() + dayOffset);
      target.setHours(14, 30, 0, 0);
      const ms = Math.max(0, target.getTime() - now.getTime());
      const d = Math.floor(ms / 86_400_000);
      const h = Math.floor((ms % 86_400_000) / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      setTime({ d, h, m });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lab2-card lab2-trust">
      <div className="lab2-card-head">
        <span className="lab2-card-label">Kurz zu mir</span>
      </div>
      <div className="lab2-trust-rows">
        <div className="lab2-trust-row">
          <span className="lab2-trust-num">20+</span>
          <span className="lab2-trust-lbl">Jahre IT, davon als IT-Leiter im Mittelstand</span>
        </div>
        <div className="lab2-trust-row">
          <span className="lab2-trust-num">100%</span>
          <span className="lab2-trust-lbl">manueller Pentest — kein Junior, kein Sales-Layer</span>
        </div>
        <div className="lab2-trust-row">
          <span className="lab2-trust-num">SAL1</span>
          <span className="lab2-trust-lbl">zertifiziert · Bericht nach BSI-Modell</span>
        </div>
      </div>
      <a className="lab2-slot" href="mailto:kontakt@sagorski.it">
        <span className="lab2-slot-row">
          <span className="lab2-live"><i /></span>
          <span className="lab2-slot-label">Nächster freier Slot</span>
        </span>
        <span className="lab2-slot-time">
          in {time.d}d {String(time.h).padStart(2, "0")}h {String(time.m).padStart(2, "0")}m
        </span>
      </a>
    </div>
  );
}

export const MEDIA = {
  counter: Counter,
  terminal: Terminal,
  assets: Assets,
  process: Process,
  trust: Trust,
} as const;
export type MediaKey = keyof typeof MEDIA;
