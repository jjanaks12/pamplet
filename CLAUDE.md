# CLAUDE.md

Project context for Claude Code. Read this before touching any file.

## What this is

A **client-side poster/banner generator**. The user picks a fixed poster template, fills in
three editable fields, and downloads the result as a PNG image.

- Framework: **Next.js (App Router) + TypeScript + Tailwind CSS**
- **No backend, no database, no auth, no API routes.** Everything runs in the browser.
- Deploys as a static site (`output: 'export'`) to Vercel / Netlify / GitHub Pages.
- Nothing is uploaded anywhere. The chosen photo never leaves the user's device.

## The one rule that defines this app

The poster layout is **locked**. Exactly three things are editable:

| Editable | Not editable |
|---|---|
| Photo (upload, zoom, reposition) | Header band / party name |
| Name (text) | Logo |
| Position / designation (text) | Title text on the poster |
| | Colors, fonts, spacing, layout, poster size |

Do not add a "customize colors", "change layout", "edit title", or "pick a template" feature
unless explicitly asked. Every extra control makes the output less consistent, which is the
entire point of a template.

## Poster spec

- Export size: **1080 × 1350 px** (4:5). Defined once as a constant, used by both the preview
  and the exporter.
- Preview is the same DOM node scaled down with CSS `transform: scale(...)` so it fits the
  viewport. The export always captures at full size — never capture the scaled version.
- Regions, top to bottom: header band (fixed text) → logo (top-left) → photo frame (top-right)
  → title pill (fixed text) → `Name: {name}` → `Position: {position}`.

## Editing behaviour

**Photo**
- `<input type="file" accept="image/png,image/jpeg,image/webp">`, plus drag-and-drop onto the frame.
- Read with `FileReader.readAsDataURL` and store the **data URL** in state. Do not use
  `URL.createObjectURL` — blob URLs sometimes fail to inline during export.
- Reject files over ~10 MB with an inline message that says the size limit and what to do.
- Photo frame is fixed size with `overflow: hidden`. The image inside is positioned by state
  `{ scale, offsetX, offsetY }` — a zoom slider and pointer-drag to reposition. Reset button
  returns to the default fit.
- Empty state: the frame shows a dashed outline and a short instruction, not a broken image.

**Name and position**
- Plain controlled text inputs with `maxLength` (name 40, position 60).
- Auto-shrink: if a value exceeds a character threshold, step the font size down through 2–3
  preset sizes so long names never overflow or wrap ugly. Do not let text spill outside the poster.
- Empty inputs render placeholder text on the poster in a muted tone so the layout never collapses.

**Download**
- One primary button: `Download poster`. It produces `nc-poster-{slugified-name}.png`.
- Disabled until a photo is chosen. Show a spinner/label change while rendering.

## Export: this is where it breaks, read carefully

Use **`html-to-image`** (`toPng`). It is `foreignObject`-based and handles modern CSS better
than `html2canvas`. Known traps, all of which have bitten this pattern before:

1. **Never `next/image` inside the poster node.** Use a plain `<img>`. Next's optimizer wraps
   the element and the capture comes out blank or misplaced.
2. **Self-host the fonts.** Put woff2 files in `public/fonts/` and declare `@font-face` locally.
   Fonts fetched from a third-party CDN are frequently dropped during embedding and the export
   silently falls back to Times New Roman. If you use `next/font/local`, that is fine — it is
   still same-origin.
3. **Avoid `oklch()` colors in the poster subtree.** If the project is on Tailwind v4, define the
   poster's palette as explicit hex values in a CSS module or inline styles rather than relying on
   Tailwind's default color tokens.
4. **Capture at full resolution.** Pass `pixelRatio: 2` (or set explicit `width`/`height` to the
   1080×1350 constant and neutralize the preview transform via the `style` option
   `{ transform: 'scale(1)', transformOrigin: 'top left' }`).
5. **Call `toPng` twice**, discarding the first result. This is a well-known workaround for the
   first render missing embedded images/fonts in Safari and Firefox. Keep it, with a comment.
6. **Set `backgroundColor`** explicitly — transparent PNGs look broken when shared on social apps.
7. All export code is client-only. Import it inside a `'use client'` component, and if the module
   touches `window` at import time, pull it in with `await import('html-to-image')` inside the handler.

If `html-to-image` still misbehaves, the fallback is drawing the poster manually on a `<canvas>`
with `drawImage` and `fillText`. Do not switch to that without saying why.

## Structure

```
app/
  layout.tsx          root layout, font setup
  page.tsx            the single page: editor panel + live preview
components/
  PosterCanvas.tsx    the locked poster. forwardRef so the exporter can grab the node.
  EditorPanel.tsx     the three controls
  PhotoUploader.tsx   file input, drag-drop, zoom, reposition
  DownloadButton.tsx  export handler
lib/
  poster.ts           POSTER_WIDTH/HEIGHT constants, slugify, font-size steps
  export.ts           toPng wrapper with all the workarounds above
public/
  logo.png            party logo
  fonts/              self-hosted woff2
```

Keep all poster state (`photo`, `name`, `position`, `transform`) in `page.tsx` with `useState`
and pass it down. No Redux, no Zustand, no context — it is four values.

## UI

Two-column desktop layout: controls on the left, sticky live preview on the right. On mobile it
stacks with the preview first, so the user sees the effect of what they type. The preview updates
on every keystroke — no "apply" button.

Design direction: the surrounding app chrome should be quiet and neutral so it never competes with
the poster, which is the only colorful thing on screen. Real content in every state — no lorem
ipsum, no placeholder gray boxes in the finished UI.

Quality floor, not optional: responsive to 360px, visible keyboard focus rings, labels tied to
inputs, `prefers-reduced-motion` respected, alt text on the logo and the uploaded photo.

## Copy rules

Sentence case. Active voice. The button says `Download poster` and the toast says `Poster downloaded`.
Errors state what happened and what to do: "That file is over 10 MB. Try a smaller photo."
Never "Submit", never "Oops! Something went wrong."

## Conventions

- TypeScript strict. No `any`.
- Server Components by default; `'use client'` only where interactivity or browser APIs are needed.
- No `localStorage` unless asked — the app is intentionally stateless between visits.
- Run `npm run build` before declaring work done. `output: 'export'` must succeed.

## Out of scope

Multiple templates, template gallery, sharing links, backend upload, user accounts, watermark
removal tiers, analytics, PDF export. If one of these seems necessary, ask first.
