# GhostClips Website — Rebuild in JPF Luxury Aesthetic (Design Spec)

**Date:** 2026-06-15
**Product:** GhostClips / "The Clipping System" — local AI video clipping tool, $49.99 one-time
**Repo:** `jprestigeflow/clipping-system-site` → live at `ghostclipofficial.pages.dev` (Cloudflare Pages)
**Local:** `~/Desktop/Projects/clipping-system-site/` (re-cloned; previous local copy was trashed)
**Status:** Approved direction — proceeding to implementation plan

---

## 1. Why

Apply JPF's new **luxury-blue dual-mode editorial aesthetic** to the GhostClips landing page so the two products share a premium look. The current GhostClips site is cyan+purple, Bebas Neue, Three.js/3D, card-heavy. Keep what sells (the $49.99 offer, Whop checkout, legal gate) but rebuild the look + structure to match the new JPF system.

## 2. Design System — port from JPF

**Source of truth to port from:** `~/Desktop/Projects/JPF/index.html` (the shipped JPF site). Reuse its architecture wholesale: design tokens, `.glass` treatment, `.reveal` IntersectionObserver motion, editorial `.editorial`/`.lead`/`.kicker`/`.row`/`.stats`/`.tag` system, the premium **animated logo hero** (float + light-sweep mask + bloom + parallax tilt + reflection + aurora), `prefers-color-scheme` + manual theme toggle, continuous `--page-bg` aurora, reduced-motion handling, single-file no-build, Plus Jakarta Sans.

**What changes vs JPF: palette + content + logo + checkout.**

### Palette — blue base + purple accent (the "blend")
Dark mode ("Midnight Violet"):
- `--page-bg` / hero: deep blue-violet — `radial-gradient(130% 100% at 70% 6%,#1b1640 0%,#0a0a20 55%,#06060f 100%)`; aurora mixes blue `rgba(27,123,255,.28)` + violet `rgba(168,85,247,.26)` + indigo `rgba(124,58,237,.22)`
- `--text:#e8e6ff`, `--muted:#9b93c4`
- `--accent:#5b8cff` (blue), `--accent2:#a855f7` (purple)
- `--cta:linear-gradient(135deg,#5b8cff,#a855f7)`; `--cta-fg:#0a0820`
- `--head-grad:linear-gradient(180deg,#ffffff,#cdc6f2 52%,#9a8fd0)`
- `--glass:rgba(170,150,255,.08)`; `--glass-bd:rgba(195,180,255,.2)`

Light mode ("Ice Violet"):
- bg `linear-gradient(165deg,#fbfaff,#efeaff)`; aurora blue+lilac washes
- `--text:#1a1340`, `--muted:#5a5285`
- `--accent:#1b7bff`, `--accent2:#7c3aed`
- `--cta:linear-gradient(135deg,#1b7bff,#7c3aed)`; `--cta-fg:#fff`
- `--head-grad:linear-gradient(180deg,#1a1340,#5b3aa0)`; glass = white tints

### Logo
Use the **GhostClips logo** (`~/Downloads/ghostclip-logo.svg` — purple ghost + GHOSTCLIP wordmark, viewBox 680×320). Export to PNG (transparent, ~760px wide) as `logo.png` in the repo for the hero mask/treatment, OR use the SVG directly. The purple ghost is the hero centerpiece — purple bloom on a blue aurora (the blend's payoff). Nav wordmark: "GHOSTCLIP".

## 3. Positioning & Voice

- **Product one-liner:** Turn one long video into 87+ ready-to-post clips — automatically, on your own machine.
- **Voice:** confident, creator-native, money-aware — but **honest**. No fabricated payout screenshots, no guaranteed-earnings promises. Income math is framed as *illustrative examples / the model*, never a promise (a legal-agreement gate exists for a reason).
- **Price anchor:** $49.99 one-time. No subscription. No API costs. Runs locally. Lifetime updates.

## 4. Page Structure (single page)

1. **Hero (LOCKED treatment)** — glass nav (GHOSTCLIP + Get button + theme toggle) · animated purple ghost logo · headline "Stop clipping by hand." · subhead "One long video → 87+ ready-to-post clips. Runs on your machine. $49.99, once." · primary CTA **Get GhostClip →** (opens legal-gate modal) · glass metric "1 video → 87 clips · ~7 min".
2. **The problem** — the volume you're sitting on / clipping by hand is dead time.
3. **How it works** — editorial numbered list: 01 Drop a video → 02 AI transcribes, scores & ranks → 03 Export 87+ vertical 9:16 clips, post everywhere.
4. **"Show the work" demo** ⭐ — the signature visual: a glass app window showing one source video exploding into a **grid of clip thumbnails** with AI score badges (e.g., "AI 91", "9:16", "FACE TRACK") + a count-up "87 clips from 1 video" and "~7 min". Honest (it's a product UI demo). Use real thumbnails from `~/ghostclip-render/public/thumbs` if available, else styled placeholders.
5. **Who it's for / 3 income angles** — editorial: **WHOP** (faceless volume play), **Creator distribution** (podcasters/streamers/YouTubers repurposing long-form), **Affiliate** (promote it, earn $15/sale). Each = use case + *illustrative* math clearly labeled as example.
6. **What's included** — the tool, local processing, vertical 9:16 export, captions, face-tracking, lifetime updates, bundled fonts.
7. **Requirements** — Windows 10/11 or macOS 12+, Python 3.10+, Ollama, 8GB RAM. As pills/list.
8. **Pricing** — one card: **$49.99 one-time**, what you get, **Get GhostClip →** (legal modal → Whop). A small affiliate line ("Want to sell it? Earn $15/sale →").
9. **FAQ** — local vs cloud, refunds/terms, OS support, no subscription, how many clips, do I need a face.
10. **Closing CTA band** — "Stop watching hours. Start posting clips." + Get GhostClip.
11. **Footer** — GHOSTCLIP, tagline, links, terms.html, theme toggle.

## 5. Checkout & Compliance (PRESERVE)

- **Legal-agreement modal gate** before checkout: a modal with the purchase agreement + a required **"I agree" checkbox**; only then enable the **Whop** button → `https://whop.com/ghostclip/`. Rebuild it styled to the new system but keep the gate's behavior and the link to `terms.html`.
- Keep `terms.html` (restyle optional/secondary; out of scope for v1 unless quick).
- The 4 delivery emails (`email-*.html`) are **out of scope** (unchanged).

## 6. Functionality

- Auto light/dark (`prefers-color-scheme`) + manual toggle persisted to `localStorage` (key `gc-theme`).
- Scroll-reveal motion, hero parallax tilt, count-up on the demo number — all reduced-motion safe.
- Primary CTA everywhere opens the legal modal → Whop (no lead form / CRM on this site).
- Single `index.html`, inline CSS+JS, no build. External: Google Fonts + `logo.png` + optional clip thumbnails.

## 7. Tech & Deploy

- Single-file `index.html` in `~/Desktop/Projects/clipping-system-site`.
- Deploy: the repo has a **pre-push git hook that auto-deploys via wrangler** on `git push`. Snapshot the current site as `index.legacy.html` before overwriting.
- If the hook fails, fall back to wrangler direct-upload of a clean dist (index.html + logo.png + terms.html), like JPF.

## 8. Honesty Guardrails (explicit)

- No fabricated testimonials or payout screenshots. The current site's generic reviews are NOT reused as if real.
- Income figures labeled as illustrative examples / "the model", never guarantees.
- The demo dashboard is a product-UI illustration (clearly the tool's output), which is truthful.

## 9. Out of Scope

- `terms.html` restyle, the 4 delivery emails, any backend/CRM (none needed — checkout is Whop).
- Three.js/WebGL (the hero is CSS/JS, same as JPF).
- New real testimonials (add when genuine ones exist; leave a commented slot).

## 10. Open Questions (resolve in planning)

- Exact clip-grid demo: real thumbnails vs CSS placeholders (decide at build based on `~/ghostclip-render/public/thumbs` contents).
- Whether to recolor/clean the logo SVG or render the existing one as-is to PNG.
