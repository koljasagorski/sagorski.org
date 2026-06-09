import type { ReactNode } from "react";

// One shell exchange = prompt + command + output lines.
// Output entries are rendered as <pre> children; ReactNode allows highlighting.
export type Block = {
  cmd: string;
  out: ReactNode[];
};

// Output helpers: small classed spans
const c = (cls: string, children: ReactNode): ReactNode => (
  <span className={cls}>{children}</span>
);
const ok = (s: ReactNode) => c("o-ok", s);
const dim = (s: ReactNode) => c("o-dim", s);
const hl = (s: ReactNode) => c("o-hl", s);
const warn = (s: ReactNode) => c("o-warn", s);

export const BOOT: ReactNode[] = [
  <>{dim("SECURE BOOT v1.2 ........................")} {ok("[ OK ]")}</>,
  <>{dim("load /home/kolja/vita ...................")} {ok("[ OK ]")}</>,
  <>{dim("load /home/kolja/leistungen .............")} {ok("[ OK ]")}</>,
  <>{dim("auth: SAL1 ..........................")} {ok("[ verified ]")}</>,
  <>{dim("mount /var/run/coffee ..................")} {warn("[ FULL ]")}</>,
  <>{dim("starting zsh ............................")} {ok("[ ready ]")}</>,
];

export const SESSION: Block[] = [
  {
    cmd: "whoami",
    out: [
      <>{hl("Kolja Sagorski")}</>,
      <>Penetration Tester & IT-Security-Berater</>,
      <>Gelsenkirchen · NRW · DACH</>,
      <>{dim("20+ Jahre IT, davon Jahre als IT-Leiter im Mittelstand.")}</>,
    ],
  },
  {
    cmd: "cat ~/.profile",
    out: [
      <>{dim("# alias pentest='manuell --bsi --documented --re-test-included'")}</>,
      <>{dim("# export NDA=standard")}</>,
      <>{dim("# export SALES_LAYER=0")}</>,
      <>{dim("# export JUNIORS=0")}</>,
      <>{dim("#")}</>,
      <>{dim("# Sie sprechen mit dem, der testet und schreibt.")}</>,
      <>{dim("# Kein White-Label, kein Junior, kein Sales-Layer.")}</>,
    ],
  },
  {
    cmd: "ls -la ~/leistungen/",
    out: [
      <>total 24</>,
      <>drwxr-xr-x  2 kolja  kolja   192  Dez  9 14:30 {hl(".")}</>,
      <>drwxr-xr-x 11 kolja  kolja   352  Dez  9 14:30 {hl("..")}</>,
      <>-rw-r--r--  1 kolja  kolja  2156  webapp-pentest.md     {dim("# Web-Apps + APIs")}</>,
      <>-rw-r--r--  1 kolja  kolja  3287  external-network.md   {dim("# externe Angriffsfläche")}</>,
      <>-rw-r--r--  1 kolja  kolja  4012  internal-ad.md        {dim("# Active Directory · interne")}</>,
      <>-rw-r--r--  1 kolja  kolja  1899  cloud-m365.md         {dim("# M365 · Azure · Cloud")}</>,
      <>-rw-r--r--  1 kolja  kolja  1240  phishing-sim.md       {dim("# Social Engineering")}</>,
      <>-rw-r--r--  1 kolja  kolja   890  retest.md             {dim("# im Festpreis enthalten")}</>,
    ],
  },
  {
    cmd: "cat ~/methodik.md",
    out: [
      <>{hl("# Vorgehen — strukturiert, manuell, dokumentiert.")}</>,
      <>{" "}</>,
      <>01  {hl("Recon")}         Was ist erreichbar?</>,
      <>02  {hl("Enumeration")}   Welche Versionen, welche Konfig?</>,
      <>03  {hl("Exploitation")}  Welche Lücken nutzbar?</>,
      <>04  {hl("Post-Exploit")}  Was bedeutet Zugriff hier?</>,
      <>05  {hl("Lateral")}       Wie tief geht's?</>,
      <>06  {hl("Report")}        Was muss zuerst weg? Re-Test im Festpreis.</>,
      <>{" "}</>,
      <>{dim("Output: priorisierte Liste, Management-Summary, technische Details.")}</>,
      <>{dim("        Nicht „300 Schwachstellen\" — sondern „diese drei kosten Sie")}</>,
      <>{dim("        das Unternehmen, diese fünf den Audit\".")}</>,
    ],
  },
  {
    cmd: "cat /etc/compliance.conf",
    out: [
      <>NIS2      in_kraft         seit  {hl("2024-10")}</>,
      <>BSI       Grundschutz      Modul {hl("IS-Penetrationstest")}</>,
      <>ISO27001  control          A.8.8 · A.12.6</>,
      <>DORA      ICT_risk         Art. 24-27</>,
    ],
  },
  {
    cmd: "nmap -sV --reason sagorski.it",
    out: [
      <>{dim("Starting Nmap 7.94 ( https://nmap.org )")}</>,
      <>Nmap scan report for {hl("sagorski.it")}</>,
      <>Host is up (0.0089s latency).</>,
      <>PORT     STATE   SERVICE   REASON    VERSION</>,
      <>22/tcp   closed  ssh       reset     —</>,
      <>80/tcp   {ok("open")}    http      syn-ack   cloudflare</>,
      <>443/tcp  {ok("open")}    https     syn-ack   cloudflare</>,
      <>Service Info: OS: Linux; CDN: Cloudflare;</>,
      <>{"              "}Pentester: {ok("available")} · NDA · BSI</>,
    ],
  },
  {
    cmd: "./kontakt --book",
    out: [
      <>{dim("opening mailto:kolja@sagorski.org ...")}</>,
      <>{hl("> 30 min · vertraulich · ohne Verpflichtung")}</>,
      <>{dim("> Sie schildern die Lage. Ich höre zu. Wir entscheiden zusammen.")}</>,
    ],
  },
];

// Status bar segments (tmux-style)
export const STATUS = [
  { label: "K. Sagorski" },
  { label: "SAL1" },
  { label: "GE · DACH" },
];

// Tips for the interactive prompt
export const PROMPT_HELP: ReactNode[] = [
  <>{hl("Verfügbare Kommandos")}</>,
  <>{" "}</>,
  <>  {hl("help")}             diese Übersicht</>,
  <>  {hl("whoami")}           kurz zur Person</>,
  <>  {hl("ls leistungen")}    Liste der Pentest-Typen</>,
  <>  {hl("cat methodik")}     Vorgehen in 6 Phasen</>,
  <>  {hl("cat compliance")}   NIS2 · BSI · ISO · DORA</>,
  <>  {hl("nmap")}             Beispiel-Scan</>,
  <>  {hl("man pentest")}      Manpage</>,
  <>  {hl("contact")}          E-Mail starten</>,
  <>  {hl("clear")}            Eingaben löschen</>,
  <>  {hl("/lab")}             3D-Globus-Demo öffnen</>,
  <>{" "}</>,
  <>{dim("Pfeil oben/unten = History.  Enter = ausführen.  Tab = Auto-Complete.")}</>,
  <>{dim("Probieren Sie auch: ")}{hl("vim")}, {hl("sl")}, {hl("sudo make me a sandwich")}, {hl("hack the planet")}, {hl("coffee")}{dim(".")}</>,
];

export const MAN_PENTEST: ReactNode[] = [
  <>PENTEST(8)              Sagorski IT-Security Manual              PENTEST(8)</>,
  <>{" "}</>,
  <>{hl("NAME")}</>,
  <>{"        "}pentest — strukturierter Penetrationstest nach BSI-Modell</>,
  <>{" "}</>,
  <>{hl("SYNOPSIS")}</>,
  <>{"        pentest --scope <target> [--methodik bsi|ptes|owasp]"}</>,
  <>{"                [--re-test included] [--report management,technical]"}</>,
  <>{" "}</>,
  <>{hl("DESCRIPTION")}</>,
  <>{"        "}Manueller, dokumentierter Test der Angriffsfläche.</>,
  <>{"        "}Kein Auto-Scan-Report mit 300 noisy findings.</>,
  <>{"        "}Output: priorisierte Liste, klarer Behebungspfad, Re-Test.</>,
  <>{" "}</>,
  <>{hl("OPTIONS")}</>,
  <>{"        "}--scope          Web-App, externes Netz, AD, M365, Phishing</>,
  <>{"        "}--methodik       Standard: BSI-Modell. PTES/OWASP auf Wunsch.</>,
  <>{"        "}--re-test        im Festpreis enthalten</>,
  <>{"        "}--report         Management-Summary + technischer Anhang</>,
  <>{" "}</>,
  <>{hl("AUTHOR")}</>,
  <>{"        "}Kolja Sagorski. Kein White-Label, kein Junior, kein Sales-Layer.</>,
  <>{" "}</>,
  <>{hl("SEE ALSO")}</>,
  <>{"        "}./kontakt --book, /etc/compliance.conf</>,
];

export const COWSAY = (msg: string): ReactNode[] => {
  const top = " " + "_".repeat(msg.length + 2);
  const bot = " " + "-".repeat(msg.length + 2);
  return [
    <>{top}</>,
    <>{"< "}{msg}{" >"}</>,
    <>{bot}</>,
    <>{"        \\   ^__^"}</>,
    <>{"         \\  (oo)\\_______"}</>,
    <>{"            (__)\\       )\\/\\"}</>,
    <>{"                ||----w |"}</>,
    <>{"                ||     ||"}</>,
  ];
};

export const SL: ReactNode[] = [
  <>{"     ====        ________               ___________"}</>,
  <>{" _D _|  |_______/        \\__I_I_____===__|_________|"}</>,
  <>{"  |(_)---  |   H\\________/ |   |        =|___ ___|"}</>,
  <>{"  /     |  |   H  |  |     |   |         ||_| |_||"}</>,
  <>{" |      |  |   H  |__--------------------| [___] |"}</>,
  <>{" | ________|___H__/__|_____/[][]~\\_______|       |"}</>,
  <>{" |/ |   |-----------I_____I [][] []  D   |=======|__"}</>,
];

export const COFFEE: ReactNode[] = [
  <>{"            (  )   (   )  )"}</>,
  <>{"             ) (   )  (  ("}</>,
  <>{"             ( )  (    ) )"}</>,
  <>{"             _____________"}</>,
  <>{"            <_____________> ___"}</>,
  <>{"            |             |/ _ \\"}</>,
  <>{"            |               | | |"}</>,
  <>{"            |               |_| |"}</>,
  <>{"         ___|             |\\___/"}</>,
  <>{"        /    \\___________/    \\"}</>,
  <>{"        \\_____________________/"}</>,
];

export const ASCII_BANNER: ReactNode[] = [
  <>{" ___   __ _   __ _   ___   _ __  ___  _  __ _"}</>,
  <>{"/ __| / _` | / _` | / _ \\ | '__|/ __|| |/ /| |"}</>,
  <>{"\\__ \\| (_| || (_| || (_) || |   \\__ \\|   < | |"}</>,
  <>{"|___/ \\__,_| \\__, | \\___/ |_|   |___/|_|\\_\\|_|"}</>,
  <>{"             |___/                              .it"}</>,
];
