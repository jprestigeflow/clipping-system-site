# GhostClips Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `jprestigeflow/clipping-system-site` (`ghostclipofficial.pages.dev`) in JPF's luxury aesthetic — blue base + purple accent, dual-mode, glassmorphism, editorial layout, animated ghost-logo hero — selling the $49.99 GhostClip tool via the existing Whop checkout + legal-gate modal.

**Architecture:** Single-file `index.html` (inline CSS+JS, no build), ported from the shipped JPF site `~/Desktop/Projects/JPF/index.html`. Re-skin tokens to blue+purple, swap content to the product, swap the hero logo to the GhostClip ghost, and preserve the legal-agreement modal that gates the Whop checkout link. Deploy via the repo's pre-push wrangler hook.

**Tech Stack:** HTML/CSS/vanilla JS, IntersectionObserver, `prefers-color-scheme` + localStorage theme, Plus Jakarta Sans, Cloudflare Pages.

**Source of truth to port from:** `~/Desktop/Projects/JPF/index.html` (shipped). Reuse its tokens/`.glass`/`.reveal`/`.editorial`/`.row`/`.stats`/`.tag`/hero-logo/`.dash`/`#cta`/theme/motion verbatim; change only palette, content, logo, and add the modal.

**Spec:** `docs/superpowers/specs/2026-06-15-ghostclips-website-rebuild-design.md`

**Palette tokens (blue+purple blend):**

Dark `:root`:
```
--bg-solid:#06060f; --text:#e8e6ff; --muted:#9b93c4;
--accent:#5b8cff; --accent2:#a855f7;
--head-grad:linear-gradient(180deg,#fff 0%,#cdc6f2 52%,#9a8fd0 100%);
--cta:linear-gradient(135deg,#5b8cff,#a855f7); --cta-fg:#0a0820;
--glass:rgba(170,150,255,.08); --glass-bd:rgba(195,180,255,.2); --glass-hi:rgba(175,160,255,.07);
--aurora1:rgba(27,123,255,.28);--aurora2:rgba(168,85,247,.26);--aurora3:rgba(124,58,237,.22);
--hero-bg:radial-gradient(130% 100% at 70% 6%,#1b1640 0%,#0a0a20 55%,#06060f 100%);
--page-bg:radial-gradient(45% 30% at 82% 8%,rgba(27,123,255,.20),transparent 60%),radial-gradient(40% 30% at 8% 30%,rgba(168,85,247,.18),transparent 60%),radial-gradient(46% 34% at 90% 55%,rgba(124,58,237,.22),transparent 60%),radial-gradient(40% 30% at 10% 78%,rgba(91,140,255,.14),transparent 60%),radial-gradient(44% 32% at 86% 96%,rgba(168,85,247,.16),transparent 60%),linear-gradient(180deg,#0a0a20 0%,#06060f 50%,#08061a 100%);
```
Light `:root[data-theme=light]`:
```
--bg-solid:#f3f0ff; --text:#1a1340; --muted:#5a5285;
--accent:#1b7bff; --accent2:#7c3aed;
--head-grad:linear-gradient(180deg,#1a1340 0%,#5b3aa0 100%);
--cta:linear-gradient(135deg,#1b7bff,#7c3aed); --cta-fg:#fff;
--glass:rgba(255,255,255,.62); --glass-bd:rgba(255,255,255,.95); --glass-hi:rgba(255,255,255,.55);
--aurora1:rgba(120,160,255,.30);--aurora2:rgba(180,150,255,.34);--aurora3:rgba(124,58,237,.12);
--hero-bg:linear-gradient(165deg,#ffffff 0%,#efeaff 100%);
--page-bg:radial-gradient(45% 30% at 82% 8%,rgba(120,160,255,.22),transparent 60%),radial-gradient(40% 30% at 8% 30%,rgba(190,165,255,.32),transparent 60%),radial-gradient(46% 34% at 90% 58%,rgba(124,58,237,.10),transparent 60%),radial-gradient(42% 30% at 12% 88%,rgba(150,170,255,.20),transparent 60%),linear-gradient(180deg,#fbfaff 0%,#efeaff 100%);
```
Theme key: `gc-theme`. Mask var stays `--logo:url(logo.png)`.

**Copy bank:**
- Nav brand: `GHOSTCLIP`; nav CTA: `Get GhostClip`
- Eyebrow: `The Clipping System · $49.99 once`
- Headline: `Stop clipping by hand.`
- Subhead: `One long video → 87+ ready-to-post clips. Runs on your own machine. $49.99, once — no subscription.`
- Hero metric: `1 video → 87 clips` / `~7 MINUTES · 9:16 VERTICAL`
- Problem (02): `You're sitting on content you'll never post.` — Hours of long-form, podcasts, streams, VODs — all of it full of clips you'll never cut by hand.
- How it works (03): 01 `Drop a video` — point it at any long video on your machine. · 02 `AI does the work` — it transcribes, scores every moment, and ranks the best. · 03 `Export 87+ clips` — vertical 9:16, captioned, face-tracked, ready to post everywhere.
- Income angles (05): `WHOP` — Faceless volume play: WHOP pays per 1,000 views, so volume is the game. One video → 87 clips makes the math possible. · `Creators` — Podcasters, streamers & YouTubers: turn one upload into a week of shorts. · `Affiliates` — Promote it, earn ~$15 per sale. $49.99 impulse price, no subscription to cancel. *(label all numbers as illustrative examples)*
- Included (06): Local AI clipping · Vertical 9:16 export · Auto captions · Face tracking · AI moment scoring · Lifetime updates · Bundled fonts · No API costs
- Requirements (07): Windows 10/11 or macOS 12+ · Python 3.10+ · Ollama · 8GB RAM
- Pricing (08): `$49.99` `one-time · lifetime · no subscription`; affiliate line `Want to sell it instead? Earn ~$15 per sale →`
- Closing CTA: `Stop watching hours. Start posting clips.`
- Whop: `https://whop.com/ghostclip/` · Terms: `terms.html`

> **Methodology:** Static design build. No unit tests; each frontend task = **build → verify in a headless Playwright browser (served over `python3 -m http.server`) → commit**. The one piece of real logic (the legal-gate modal) gets an explicit behavioral check in Task 9.

---

### Task 0: Prep, branch, assets

- [ ] **Step 1: Branch + snapshot legacy**
```bash
cd ~/Desktop/Projects/clipping-system-site
git checkout -b rebuild-luxury && cp index.html index.legacy.html && git add index.legacy.html && git commit -m "chore: snapshot legacy GhostClip site"
```
- [ ] **Step 2: Produce `logo.png` from the ghost SVG** (transparent, ~760px wide):
```bash
command -v rsvg-convert >/dev/null && rsvg-convert -w 760 ~/Downloads/ghostclip-logo.svg -o ~/Desktop/Projects/clipping-system-site/logo.png || qlmanage -t -s 760 -o /tmp ~/Downloads/ghostclip-logo.svg && cp /tmp/ghostclip-logo.svg.png ~/Desktop/Projects/clipping-system-site/logo.png
ls -la ~/Desktop/Projects/clipping-system-site/logo.png
```
Note: the SVG has a dark `#08080f` rounded-rect background; if the PNG isn't transparent, that's acceptable (the dark plate reads fine on the dark hero) — but prefer transparent. If neither tool exists, render via Playwright (`browser_navigate` to the svg over http, screenshot the element).
- [ ] **Step 3: Check for real clip thumbnails** for the demo:
```bash
ls ~/ghostclip-render/public/thumbs/ 2>/dev/null | head; ls ~/GhostClip/**/thumbs* 2>/dev/null | head
```
Record whether usable thumbnails exist (Task 5 decides real vs CSS placeholders).

### Task 1: Port JPF site as base + re-skin palette

**Files:** Create `index.html` (overwrite)

- [ ] **Step 1: Copy the shipped JPF site as the starting point**
```bash
cp ~/Desktop/Projects/JPF/index.html ~/Desktop/Projects/clipping-system-site/index.html
```
- [ ] **Step 2: Replace the two `:root` token blocks** with the GhostClips blue+purple tokens from the Palette section above (dark + light). Keep all other CSS identical.
- [ ] **Step 3: Update `<head>`** — title `GhostClip — Turn 1 video into 87 clips`, meta description (the product one-liner), keep Plus Jakarta Sans + `logo.png` favicon.
- [ ] **Step 4: Theme key** — change both `localStorage` uses from `jpf-theme` to `gc-theme` (early head script + `toggleTheme`).
- [ ] **Step 5: Verify** — serve + load (see Task verify recipe below); page renders in GhostClips colors, no console errors. **Commit:** `feat: port JPF system + GhostClips blue/purple palette`.

**Verify recipe (use in every frontend task):**
```bash
cd ~/Desktop/Projects/clipping-system-site && (python3 -m http.server 8891 >/tmp/gc.log 2>&1 &) ; sleep 1
```
Then Playwright: navigate `http://localhost:8891/index.html`; `browser_evaluate` to set `data-theme` and force `document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))` and `.count` text before fullPage screenshots; check `browser_console_messages` (errors = 0).

### Task 2: Hero — ghost logo + product copy

**Files:** Modify `index.html` (hero section + nav)

- [ ] **Step 1: Nav** — brand text `GHOSTCLIP`; nav links → `How it works` (#how), `Income` (#income), `Pricing` (#pricing), `FAQ` (#faq); the `Book`/`bk` pill → `Get GhostClip` button with `onclick="openBuy()"` (modal opened in Task 9; until then it can link to `#pricing`).
- [ ] **Step 2: Hero copy** — eyebrow/headline/subhead/metric from the Copy bank. Primary CTA button `Get GhostClip →` with `onclick="openBuy()"`. The logo block already uses `logo.png` — keep the animated treatment as-is (it now shows the ghost logo).
- [ ] **Step 3: Verify** both modes — ghost logo floats with purple bloom on blue aurora, copy correct. **Commit:** `feat: hero — ghost logo + product positioning`.

### Task 3: The problem section

**Files:** Modify `index.html` (replace the JPF "offer" feature band)

- [ ] **Step 1:** Repurpose the `#offer` feature band into `#problem`: kicker `The problem`, h2 `You're sitting on content you'll never post.`, p (problem copy from bank), and a CTA `See how it works →` (href `#how`). Keep `.offer-band` styling.
- [ ] **Step 2: Verify + Commit:** `feat: problem feature band`.

### Task 4: How it works

**Files:** Modify `index.html` (the `#how` editorial list)

- [ ] **Step 1:** Keep the `.editorial`+`.list` structure; set kicker `01 · How it works`, h2 `From one video to a week of content`, and the 3 `.row` items to the How-it-works copy (Drop a video / AI does the work / Export 87+ clips).
- [ ] **Step 2: Verify + Commit:** `feat: how-it-works`.

### Task 5: "Show the work" demo — clip grid

**Files:** Modify `index.html` (replace the JPF `#system` dashboard)

- [ ] **Step 1: Replace the `.dash` body** with a clip-explosion demo: a glass app window titled `GhostClip · 1 video → clips`, a count-up `<b class="count" data-to="87">0</b>` labeled `clips from one video · ~7 min`, then a grid of ~9 clip cards. Each clip card markup:
```html
<div class="clip"><div class="thumb"></div><span class="score">AI 0.9X</span><span class="ratio">9:16</span></div>
```
Plus a final card `<div class="clip more">+78 more</div>`.
- [ ] **Step 2: Add clip-grid CSS** (in the `<style>` near `.dash`):
```css
.clipgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:18px}
.clip{position:relative;aspect-ratio:9/16;border-radius:8px;overflow:hidden;border:1px solid var(--glass-bd);background:linear-gradient(160deg,rgba(170,150,255,.14),rgba(91,140,255,.06))}
.clip .thumb{position:absolute;inset:0;background:linear-gradient(135deg,#2a2350,#141030)}
.clip .score{position:absolute;top:5px;left:5px;font-size:8px;font-weight:800;color:#fff;background:rgba(168,85,247,.8);padding:2px 5px;border-radius:4px}
.clip .ratio{position:absolute;bottom:5px;right:5px;font-size:8px;color:var(--muted)}
.clip.more{display:grid;place-items:center;font-size:12px;font-weight:800;color:var(--accent2);background:var(--glass)}
@media(max-width:860px){.clipgrid{grid-template-columns:repeat(3,1fr)}}
```
If usable thumbnails exist (Task 0 Step 3), set `.thumb` to real `background-image` per card; else keep the gradient placeholders.
- [ ] **Step 2: Verify** — grid shows clip cards with AI score + 9:16 badges, count-up animates to 87. **Commit:** `feat: clip-explosion demo (1 video to 87 clips)`.

### Task 6: Income angles

**Files:** Modify `index.html` (the `#proof`/`#who` sections → `#income`)

- [ ] **Step 1:** Repurpose into `#income`: editorial lead kicker `02 · Three ways it pays`, h2 `One tool. Three income angles.`, and content = three `.row` items (WHOP / Creators / Affiliates) from the Copy bank. Add a small muted line under the list: `Figures are illustrative examples, not income guarantees.`
- [ ] **Step 2: Verify + Commit:** `feat: income angles (honest framing)`.

### Task 7: What's included + Requirements

**Files:** Modify `index.html` (the JPF `#services` + `#who` reused)

- [ ] **Step 1:** Section `#included` (editorial): kicker `03 · What's included`, h2 `Everything in the box`, content = `.tags` pills from the Included copy bank.
- [ ] **Step 2:** Section `#requirements` (editorial): kicker `04 · Requirements`, h2 `What you need to run it`, content = `.tags` pills (Win/Mac, Python 3.10+, Ollama, 8GB RAM).
- [ ] **Step 3: Verify + Commit:** `feat: included + requirements`.

### Task 8: Pricing

**Files:** Modify `index.html` (replace the JPF `#book` section)

- [ ] **Step 1:** `#pricing` — centered glass price card: kicker `Pricing`, big `$49.99`, sub `one-time · lifetime updates · no subscription`, a short benefit list, a `Get GhostClip →` button (`onclick="openBuy()"`), and a muted affiliate line `Want to sell it instead? Earn ~$15 per sale →` linking to `https://whop.com/ghostclip/` (affiliate). No lead form.
- [ ] **Step 2: Verify + Commit:** `feat: pricing card`.

### Task 9: Legal-gate modal → Whop checkout (PRESERVE behavior)

**Files:** Modify `index.html` (add modal markup + CSS + JS)

- [ ] **Step 1: Add modal markup** before `</body>`:
```html
<div id="buyModal" class="modal" aria-hidden="true">
  <div class="modal-card glass">
    <h3 class="grad-text">Before you buy</h3>
    <p>GhostClip is a one-time $49.99 purchase delivered via Whop. By continuing you agree to the <a href="terms.html" target="_blank" rel="noopener">purchase agreement & terms</a>.</p>
    <label class="agree"><input type="checkbox" id="agreeChk"> I have read and agree to the terms.</label>
    <a id="whopBtn" class="btn disabled" href="https://whop.com/ghostclip/" target="_blank" rel="noopener" aria-disabled="true">Continue to checkout →</a>
    <button class="modal-close" onclick="closeBuy()" aria-label="Close">×</button>
  </div>
</div>
```
- [ ] **Step 2: Add modal CSS**:
```css
.modal{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;background:rgba(4,4,14,.7);backdrop-filter:blur(6px);padding:20px}
.modal.open{display:flex}
.modal-card{position:relative;max-width:460px;width:100%;padding:34px}
.modal-card h3{font-size:22px;font-weight:800;margin-bottom:12px}
.modal-card p{color:var(--muted);font-size:14.5px;margin-bottom:18px}
.modal-card .agree{display:flex;gap:10px;align-items:flex-start;font-size:14px;margin-bottom:20px;cursor:pointer}
.modal-card .btn.disabled{opacity:.45;pointer-events:none}
.modal-close{position:absolute;top:14px;right:16px;background:none;border:0;color:var(--muted);font-size:24px;cursor:pointer}
```
- [ ] **Step 3: Add modal JS** in the script block:
```html
<script>
function openBuy(){document.getElementById('buyModal').classList.add('open');document.getElementById('buyModal').setAttribute('aria-hidden','false');}
function closeBuy(){document.getElementById('buyModal').classList.remove('open');document.getElementById('buyModal').setAttribute('aria-hidden','true');}
document.getElementById('agreeChk').addEventListener('change',function(e){var b=document.getElementById('whopBtn');if(e.target.checked){b.classList.remove('disabled');b.setAttribute('aria-disabled','false');}else{b.classList.add('disabled');b.setAttribute('aria-disabled','true');}});
document.getElementById('buyModal').addEventListener('click',function(e){if(e.target.id==='buyModal')closeBuy();});
</script>
```
- [ ] **Step 4: Behavioral verify** (Playwright): click a `Get GhostClip` button → `#buyModal` has class `open`; the `#whopBtn` has class `disabled`; check `#agreeChk` → `#whopBtn` no longer `disabled` and `href` = `https://whop.com/ghostclip/`. Confirm via `browser_evaluate` reading classList/href.
- [ ] **Step 5: Commit:** `feat: legal-gate modal before Whop checkout`.

### Task 10: Closing CTA + footer

**Files:** Modify `index.html`

- [ ] **Step 1:** `#cta` band (reuse JPF `#cta`): h2 `Stop watching hours. Start posting clips.`, p `87+ clips from one video. $49.99, once.`, button `Get GhostClip →` (`onclick="openBuy()"`).
- [ ] **Step 2: Footer** — brand `GHOSTCLIP`, tagline, links (How it works / Income / Pricing / FAQ / `terms.html`), theme toggle, `© 2026 GhostClip`.
- [ ] **Step 3: Verify + Commit:** `feat: closing CTA + footer`.

### Task 11: FAQ

**Files:** Modify `index.html` (reuse JPF `#faq`)

- [ ] **Step 1:** 5 `<details>`: `Is it a subscription?` (No — $49.99 once, lifetime.) · `Does it run in the cloud?` (No — fully local, your machine, no API costs.) · `What do I need?` (Win10/11 or macOS 12+, Python 3.10+, Ollama, 8GB RAM.) · `Do I need to show my face?` (No — works on any long video, faceless-friendly.) · `How do I get it?` (Buy via Whop; you download a ZIP and run one file.)
- [ ] **Step 2: Verify + Commit:** `feat: FAQ`.

### Task 12: Responsive, a11y, reduced-motion pass

**Files:** Modify `index.html`

- [ ] **Step 1:** Check 375/768/1280 in both modes (Playwright `browser_resize`): nav collapses, editorial stacks, clip grid → 3 cols, modal usable on mobile.
- [ ] **Step 2:** Reduced-motion: aurora/float/sweep/tilt/reveal/count-up all freeze; logo static. `alt` on logo, focus-visible on modal checkbox + buttons, contrast on muted text both modes.
- [ ] **Step 3: Commit:** `chore: responsive + a11y + reduced-motion`.

### Task 13: Deploy + verify live

- [ ] **Step 1: Merge to main**
```bash
cd ~/Desktop/Projects/clipping-system-site && git checkout main && git merge --no-ff rebuild-luxury -m "rebuild: GhostClips luxury aesthetic"
```
- [ ] **Step 2: Deploy.** Push triggers the repo's pre-push wrangler hook:
```bash
git push origin main
```
If the hook doesn't publish, fall back to direct upload:
```bash
rm -rf /tmp/gc-dist && mkdir /tmp/gc-dist && cp index.html logo.png terms.html /tmp/gc-dist/
wrangler pages deploy /tmp/gc-dist --project-name ghostclipofficial --branch main --commit-dirty=true
```
(Confirm the exact Pages project name with `wrangler pages project list`.)
- [ ] **Step 3: Verify live** — `curl -s https://ghostclipofficial.pages.dev/ | grep -o 'Stop clipping by hand\|whop.com/ghostclip'`; open in browser, test theme toggle + the buy modal → Whop on mobile + desktop.
- [ ] **Step 4: Update wiki** — add a dated entry to `~/Desktop/JPF-Wiki/wiki/hot.md` and update `[[ghostclip]]` / `[[GHOSTCLIP_WIKI]]` with the rebuild; commit + push the wiki.

---

## Self-Review

**Spec coverage:** palette blue+purple ✓ (Task 1), port JPF system ✓ (1), ghost-logo hero ✓ (2), problem ✓ (3), how ✓ (4), clip-explosion demo ✓ (5), 3 income angles + honesty ✓ (6), included+requirements ✓ (7), $49.99 pricing + affiliate ✓ (8), **legal-gate modal → Whop preserved** ✓ (9), closing+footer ✓ (10), FAQ ✓ (11), dual-mode/responsive/a11y ✓ (1,12), deploy via hook + legacy snapshot ✓ (0,13), honesty guardrails ✓ (6, no fabricated reviews). No gaps.

**Placeholders:** none — all code/copy concrete. Task 0 Step 2 has a tool-fallback chain (rsvg/qlmanage/Playwright) which is intentional, not a placeholder.

**Type/name consistency:** `openBuy()`/`closeBuy()` used in Tasks 2,8,9,10 and defined in Task 9; ids `buyModal`/`agreeChk`/`whopBtn` consistent; section ids `#how`/`#income`/`#pricing`/`#faq` match nav links set in Task 2; theme key `gc-theme` consistent.
