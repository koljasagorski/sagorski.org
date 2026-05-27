import type { Config } from "tailwindcss";

// Tailwind v4 reads its theme from `@theme` in globals.css.
// This file mirrors the design tokens for editor tooling and reference.
export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        text: "var(--text)",
        "text-body": "var(--text-body)",
        "text-muted": "var(--text-muted)",
        "text-subtle": "var(--text-subtle)",
        "text-faint": "var(--text-faint)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        accent: "var(--accent)",
        success: "var(--success)",
        "dark-bg": "var(--dark-bg)",
        "dark-text": "var(--dark-text)",
        "dark-muted": "var(--dark-muted)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        container: "1080px",
      },
    },
  },
} satisfies Config;
