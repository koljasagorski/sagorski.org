"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  SESSION,
  PROMPT_HELP,
  MAN_PENTEST,
  COWSAY,
  SL,
  COFFEE,
} from "./data";

const PROMPT = "kolja@sagorski:~$";
const MAIL = "mailto:kolja@sagorski.org";

const COMMANDS = [
  "help", "whoami", "ls", "ls leistungen", "cat methodik", "cat compliance",
  "cat profile", "nmap", "contact", "clear", "man pentest", "/lab",
  "vim", "sl", "coffee", "date", "uptime", "echo", "cowsay",
];

type Result =
  | { kind: "lines"; lines: ReactNode[] }
  | { kind: "clear" }
  | { kind: "nav"; url: string; lines: ReactNode[] };

const sessionLookup = (substr: string) =>
  SESSION.find((b) => b.cmd.toLowerCase().includes(substr))?.out ?? [];

function dispatch(raw: string, mountedAt: number): Result {
  const cmd = raw.trim();
  const lower = cmd.toLowerCase();

  if (cmd === "") return { kind: "lines", lines: [] };
  if (lower === "help" || lower === "?") return { kind: "lines", lines: PROMPT_HELP };
  if (lower === "clear" || lower === "cls") return { kind: "clear" };

  if (lower === "whoami") return { kind: "lines", lines: sessionLookup("whoami") };
  if (lower === "ls" || lower.startsWith("ls leistung") || lower.includes("/leistungen"))
    return { kind: "lines", lines: sessionLookup("ls -la") };
  if (lower.startsWith("cat") && lower.includes("metho"))
    return { kind: "lines", lines: sessionLookup("methodik") };
  if (lower.startsWith("cat") && lower.includes("compl"))
    return { kind: "lines", lines: sessionLookup("compliance") };
  if (lower === "cat ~/.profile" || lower === "cat profile" || lower === "cat .profile")
    return { kind: "lines", lines: sessionLookup(".profile") };
  if (lower === "nmap" || lower.startsWith("nmap "))
    return { kind: "lines", lines: sessionLookup("nmap") };

  if (lower === "contact" || lower === "./kontakt" || lower.startsWith("./kontakt"))
    return { kind: "nav", url: MAIL, lines: sessionLookup("./kontakt") };
  if (lower === "/lab" || lower === "cd /lab" || lower === "open /lab")
    return { kind: "nav", url: "/lab", lines: [<>{"opening /lab ..."}</>] };

  if (lower === "man pentest" || lower === "man pentester" || lower === "man kolja")
    return { kind: "lines", lines: MAN_PENTEST };

  // ---- easter eggs ----
  if (lower === "vim") return { kind: "lines", lines: [
    <>E325: ATTENTION — vim ist nicht installiert.</>,
    <>emacs auch nicht. ed ist ein Mythos.</>,
    <>(:wq akzeptiert. Sie sind frei.)</>,
  ]};
  if (lower === "sl") return { kind: "lines", lines: SL };
  if (lower === "coffee" || lower === "make coffee") return { kind: "lines", lines: COFFEE };
  if (lower === "date") return { kind: "lines", lines: [<>{new Date().toLocaleString("de-DE")}</>] };
  if (lower === "uptime") {
    const s = Math.floor((Date.now() - mountedAt) / 1000);
    const m = Math.floor(s / 60);
    return { kind: "lines", lines: [<>up {m}m {s % 60}s — 1 user, load average: 0.05, 0.04, 0.03</>] };
  }
  if (lower.startsWith("echo ")) return { kind: "lines", lines: [<>{raw.slice(5)}</>] };
  if (lower.startsWith("cowsay ")) return { kind: "lines", lines: COWSAY(raw.slice(7)) };
  if (lower === "hack the planet" || lower === "hack the gibson") return { kind: "lines", lines: [<>Hack the planet.</>] };
  if (lower === "sudo make me a sandwich") return { kind: "lines", lines: [<>OK.</>] };
  if (lower === "make me a sandwich") return { kind: "lines", lines: [<>What? Make it yourself.</>] };
  if (lower.startsWith("rm -rf")) return { kind: "lines", lines: [
    <>rm: cannot remove &apos;/&apos;: Operation not permitted.</>,
    <>(nice try.)</>,
  ]};
  if (lower.startsWith("sudo")) return { kind: "lines", lines: [
    <>kolja is not in the sudoers file.  This incident will be reported.</>,
  ]};
  if (lower === "exit" || lower === "logout") return { kind: "lines", lines: [
    <>logout? Nein. Bleiben Sie. Es wird interessant.</>,
  ]};

  // fallback
  const first = cmd.split(/\s+/)[0];
  return { kind: "lines", lines: [<>bash: {first}: command not found  (versuchen Sie <span className="o-hl">help</span>)</>] };
}

type Entry = { id: number; kind: "in" | "out"; node: ReactNode };

export function TerminalPrompt() {
  const mountedAtRef = useRef(0);
  const idRef = useRef(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAtRef.current = Date.now();
    // Avoid popping the mobile keyboard on landing.
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  // Re-focus on click anywhere in the terminal body (but not on links).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, input, textarea")) return;
      if (t.closest(".term-body")) inputRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Auto-scroll the page so the prompt stays in view as entries grow.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
  }, [entries]);

  const append = (kind: Entry["kind"], node: ReactNode) => {
    idRef.current += 1;
    setEntries((prev) => [...prev, { id: idRef.current, kind, node }]);
  };

  const run = (raw: string) => {
    append("in", (
      <>
        <span className="t-prompt">{PROMPT}</span>{" "}
        <span className="t-cmd">{raw}</span>
      </>
    ));
    const result = dispatch(raw, mountedAtRef.current);
    if (result.kind === "clear") {
      setEntries([]);
      return;
    }
    for (const line of result.lines) append("out", line);
    if (raw.trim() !== "") {
      setCmdHistory((h) => [...h, raw]);
      setHistIdx(-1);
    }
    if (result.kind === "nav") {
      // Brief delay so user sees the output before navigation.
      setTimeout(() => { window.location.href = result.url; }, 380);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(cmdHistory[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= cmdHistory.length) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(next); setInput(cmdHistory[next]); }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const q = input.toLowerCase();
      const matches = COMMANDS.filter((c) => c.startsWith(q));
      if (matches.length === 1) setInput(matches[0]);
      else if (matches.length > 1) append("out", (<>{matches.join("  ")}</>));
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setEntries([]);
      return;
    }
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      append("in", (<><span className="t-prompt">{PROMPT}</span> <span className="t-cmd">{input}</span><span className="o-warn">^C</span></>));
      setInput("");
      setHistIdx(-1);
    }
  };

  return (
    <div className="term-live" role="region" aria-label="Interaktive Shell">
      {entries.length > 0 && (
        <pre className="term-pre" aria-live="polite">
          {entries.map((e) => <div key={e.id} className={`t-row t-row-${e.kind}`}>{e.node}</div>)}
        </pre>
      )}
      <div className="term-input-line">
        <span className="t-prompt" aria-hidden>{PROMPT}</span>
        <input
          ref={inputRef}
          className="term-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          enterKeyHint="go"
          aria-label="Befehl eingeben — versuchen Sie help"
          placeholder="help"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
