# Kickoff prompt for Claude Code

Put `CLAUDE.md` in the project root first, then paste the block below into the CLI.

---

Build a client-side poster generator in Next.js. Read CLAUDE.md first and follow it — it holds the
constraints that matter. Plan the approach and show it to me before writing code.

**What it does:** a fixed poster template is shown as a live preview. The user can change exactly
three things — upload a photo, type a name, type a position — and then download the poster as a PNG.
Nothing else about the poster is editable. There is no backend; the image never leaves the browser.

**Poster layout** (1080 × 1350 px, top to bottom):
- A full-width header band with the fixed text "Nepali Congress"
- Below it, a card containing:
  - the party logo, top-left (use a placeholder at `public/logo.png` for now)
  - the user's photo in a rounded frame, top-right
  - a fixed title pill under the logo
  - `Name: {name}`
  - `Position: {position}`

**Stack:** Next.js App Router, TypeScript, Tailwind, `html-to-image` for export, static export
(`output: 'export'`). No API routes, no database, no auth.

**Build it in this order, and stop after each step so I can check it:**
1. Scaffold the project and get `PosterCanvas` rendering the locked layout with hardcoded sample
   values at the right dimensions, scaled down to fit the screen.
2. Wire up the three controls — photo upload with zoom and drag-to-reposition, name, position —
   with live preview on every keystroke.
3. Add PNG download. Apply every workaround listed in the export section of CLAUDE.md; I have hit
   the blank-capture and missing-font problems before.
4. Polish: empty states, long-name handling, mobile layout, keyboard focus, error messages.

**Things I do not want:** multiple templates, a color picker, layout options, localStorage,
state libraries, or anything that talks to a server.

After each step, tell me what you changed and what to click to verify it.

---

## If you want the CLI to write CLAUDE.md itself instead

> Read the attached mockup. I'm building a Next.js, frontend-only poster generator where only the
> photo, name, and position are editable and the user downloads the result as a PNG. Write a
> CLAUDE.md for this project covering the stack, the locked-layout rule, the file structure, the
> known pitfalls of DOM-to-image export, and what is out of scope. Don't write app code yet.
