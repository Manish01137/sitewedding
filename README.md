# George &amp; Pooja — Wedding Website 💌

A single-page, mobile-first scrollable wedding website for **George &amp; Pooja**,
married **03.09.2026** in **Goa, India**. Built with plain HTML, CSS and vanilla
JavaScript — no build step, no framework.

Open `index.html` in a browser and you'll land on the **cat-nose entry gate**:
tap the cat's nose (the ring on its nose) to unlock and reveal the site.

---

## 📁 Project structure

```
siteewedding/
├── index.html        ← all the markup
├── styles.css        ← all the styling (design system at the top)
├── script.js         ← entry gate, smooth-scroll, reveal animations, RSVP form
├── assets/           ← web-optimized images actually used by the site
└── photos/           ← original source photos + design reference screenshots
    └── thumbnails/   ← smaller copies the assets were generated from
```

The site only loads images from `assets/`. The `photos/` folder is kept for
reference / re-exporting and is **not** required to deploy.

---

## ✏️ Things you'll want to customise

All of these are marked in the code with `TODO` comments — search the project
for `TODO` to jump straight to them.

| What | Where | How |
|------|-------|-----|
| **George's UPI / gift link** | `index.html` → "WEDDING GIFTS" | replace `href="#"` on the `George – UPI LINK` anchor |
| **Pooja's UPI / gift link** | `index.html` → "WEDDING GIFTS" | replace `href="#"` on the `Pooja – UPI LINK` anchor |
| **Guest chat link** | `index.html` → "GUEST CHAT" | replace `href="#"` on the `Join Chat` button (e.g. your WhatsApp invite URL) |
| **RSVP backend** | `script.js` → `// TODO: connect RSVP backend` | wire the form to Google Sheets / Formspree / email (see below) |

Phone numbers, the address, dates and all body copy are already filled in with
the real content directly in `index.html`.

---

## 📸 Replacing the photos

Photos used by the site live in `assets/` with descriptive names. To swap one,
just overwrite the file (keep the same filename), or drop a new file in and
update its `src` in `index.html`.

| File | Used for |
|------|----------|
| `assets/cat-gate.png` | Entry-gate cat with the ring on its nose |
| `assets/photo-cover-oval.jpg` | Cover / hero couple portrait (oval frame) |
| `assets/photo-venue.jpg` | Venue aerial (polaroid) |
| `assets/photo-kiss.jpg` | "We can't wait to celebrate" couple photo |
| `assets/bg-collage.jpg` | Faint Goa collage behind the column + closing |
| `assets/deco-*.png` | The red line-art doodles, hearts, frames, etc. |

The three couple/venue photos are shown in black &amp; white via a CSS filter
(`grayscale(1)`) to match the design — you can drop in colour photos and they'll
be desaturated automatically. If you want full colour, remove the
`filter: grayscale(1) ...` rules in `styles.css`.

> Tip: keep new photos roughly the same aspect ratio as the ones they replace,
> and compress large images (e.g. with [squoosh.app](https://squoosh.app)) so the
> page stays fast on mobile data.

---

## 📝 Connecting the RSVP form

The form currently **validates input and logs the data to the browser console**,
then shows a thank-you message. To actually receive RSVPs, open `script.js`,
find the `// TODO: connect RSVP backend` block, and pick one option:

**Formspree (easiest, no server):**
1. Create a free form at [formspree.io](https://formspree.io) → copy your form ID.
2. Replace the `console.log(...)` block with:
   ```js
   fetch("https://formspree.io/f/YOUR_FORM_ID", {
     method: "POST",
     headers: { "Accept": "application/json", "Content-Type": "application/json" },
     body: JSON.stringify(data)
   }).then(function () {
     form.reset();
     status.textContent = "Thank you! Your RSVP is in 💌";
   });
   ```

**Google Sheets:** use a Google Apps Script Web App as the endpoint and `fetch`
to it the same way.

---

## 🚀 Deploying (free options)

The site is fully static, so any static host works:

- **Netlify** – drag the project folder onto <https://app.netlify.com/drop>.
- **Vercel** – `vercel` in the project folder, or import the repo.
- **GitHub Pages** – push to a repo, enable Pages on the `main` branch.

No build command is needed — the publish/root directory is just this folder.

### Run locally
```bash
# from inside the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```
(Opening `index.html` directly via `file://` works too, but a local server is
closer to how it behaves when deployed.)

---

## ♿ Accessibility &amp; performance notes

- The cat-nose hotspot is a real `<button>` — it's keyboard-focusable and
  activates with Enter/Space, with an accessible label ("Enter site").
- All photos have `alt` text; decorative doodles are `aria-hidden`.
- Phone numbers are `tel:` links.
- Respects `prefers-reduced-motion` (disables the wiggle/reveal animations).
- Below-the-fold photos use `loading="lazy"`.

### Developer preview shortcut
Add `?preview=1` to the URL (e.g. `index.html?preview=1`) to skip the entry gate
and show all sections immediately — handy for editing. Remove nothing; it has no
effect for normal visitors who don't add that parameter.
# sitewedding
