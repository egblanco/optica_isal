## Brief intent
This is a small, static marketing site for "Óptica Isal" (HTML/CSS/JS). The repo contains two main front-ends (root `index.html` and `programacion/index.html`) and static assets under `promocion/` and `lentes/`.

When generating or editing code, prefer minimal, low-risk changes that keep the site fully static (no new server runtime) unless explicitly asked.

## Big picture (what to know fast)
- Static site: no Node/packager or build step in the repo. Pages are plain HTML, CSS and client-side JS. Preview by opening `index.html` or serving the folder with a static server.
- Two similar front-ends: `index.html` (root) contains integrated CSS and inline scripts; `programacion/index.html` uses `programacion/style.css` and `programacion/script.js`. They implement the same "wizard" and product/catalog features but with duplicated logic — keep both in sync if you change behavior/UI.
- Client-side integrations:
  - Supabase: used directly in `index.html` with a public URL and publishable key. Tables used in scripts: `pedidos` and `citas` (see db.from('pedidos').insert(...) and db.from('citas').insert(...)).
  - Form submit fallback: `programacion/index.html` uses a hidden form (`#hiddenOrderForm`) that posts to FormSubmit (email) for wizard orders.
  - Leaflet: maps are initialized in `index.html` (see `L.map('map')`).

## Key files to reference
- `index.html` — canonical homepage. Inline CSS + Leaflet + Supabase usage and a wizard implementation.
- `programacion/index.html` — alternate/page with `programacion/script.js` and `programacion/style.css`. Contains the hidden order form (`#hiddenOrderForm`) and a modular JS file.
- `programacion/script.js` — DOM logic for navigation, wizard steps, form filling and submission (look for ids: `#wizardModal`, `#btnNext`, `#wizardTotalPrice`, `#hiddenOrderForm`).
- `programacion/style.css` — primary CSS variables and UI tokens used across the programacion page (colors, spacings, button classes).

## Patterns & conventions to follow
- Minimal, semantic markup. Reuse existing classes like `.btn-primary`, `.product-card`, `.mini-product`, `.glass-panel` and CSS variables (see `programacion/style.css`) for consistent styling.
- Keep behavior accessible: scripts use ids for key UI elements (`#appointmentForm`, `#wizardModal`, `#orderName`, `#orderPhone`). Use these selectors when wiring features.
- When changing the wizard flow, update both `index.html` and `programacion/index.html` (both have independent implementations). Prefer modifying `programacion/script.js` and then carefully replicating changes to inline script in `index.html` or refactor both pages to share a single script (ask before large refactor).

## Integration details & secrets
- Supabase usage is client-side in `index.html`:
  - URL: appears as `https://ptmrgeaogvoduqsepdef.supabase.co` and a publishable key is present in the file. That key is publishable but treat any DB schema assumptions cautiously.
  - The code expects tables `pedidos` and `citas` with fields used in insert calls (cliente, telefono, modelo, tipo_mica, graduacion, estado, nombre, fecha, hora).
- Hidden order form: `programacion/index.html` includes `#hiddenOrderForm` which posts to FormSubmit; changing IDs or field names will break email notifications.

## How to run & test locally (quick)
- Quick preview (recommended): install the VS Code Live Server extension and open either `index.html` or `programacion/index.html`.
- From PowerShell you can run a minimal static server (works on Windows):
  - Python 3:  `python -m http.server 8000` (run in repo root) and open http://localhost:8000/

## Concrete examples AI should use
- To open the wizard programmatically: interact with `document.getElementById('navWizardBtn')` or call `openWizard()` defined inline in `index.html` (note there are two `openWizard` definitions — be explicit about which file you're editing).
- To change total calculation, update `programacion/script.js` functions `updateTotal()` and `updateSummary()` and mirror logic to inline script in `index.html`.
- To add a product card, follow existing structure in `index.html` product cards (image -> .product-info -> h3 title -> price span -> button onclick="openWizard('Model',price)").

## Safety & low-risk rules for AI edits
- Do not remove or rename form ids used for submission (`#hiddenOrderForm`, `#appointmentForm`, `#fCita`) without updating corresponding JS.
- Avoid touching the Supabase URL/key or changing how data is inserted unless the developer asks for DB changes. If you must change schema, describe migration steps and table fields.
- Keep changes local to one page when possible; big refactors require confirmation.

## When to ask instead of acting
- If a change requires creating a server or adding new build tooling (Node, bundlers, database migrations), ask for explicit permission.
- If you need to rotate or remove keys/secrets from `index.html`, ask for secure replacement values and deployment instructions.

If any instruction above is unclear or you want the file to include more examples (e.g., exact selectors to update), tell me which part to expand and I'll refine the file.
