# Alpha Art & Crafts — website

Portfolio and enquiry website for Alpha Art & Crafts: religious art, floral & nature wall panels,
doors & entryways, wooden art & furniture, lifestyle mockups and a design library.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · static export.
The site builds to plain HTML/CSS/JS in `out/` — no server or database needed, so hosting is free and fast.

## Everyday tasks

### Run it on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Add new work photos

1. Drop the photo (`.jpg`, `.jpeg`, `.png` or `.webp`) into the right folder in `content/gallery/`:

   | Folder              | Shows on                              |
   | ------------------- | ------------------------------------- |
   | `religious-art`     | Religious Art collection              |
   | `wall-panels`       | Wall Panels collection                |
   | `doors-entryways`   | Doors & Entryways collection          |
   | `furniture`         | Wooden Art & Furniture collection     |
   | `lifestyle`         | Lifestyle Mockups collection          |
   | `workshop`          | "From our workshop" strip + Our Work  |
   | `design-library`    | Design Library (gets a code AAC-Dxx)  |

2. Optionally give it a caption in `src/data/gallery.ts` → `captions` (keyed by file name without
   extension). You can also list extra collections it should appear in with `also: ["doors-entryways"]`.
3. Run `npm run dev` or `npm run build` — photos are converted to optimised WebP sizes automatically.

### Change phone, email, address, social links

Edit `src/data/site.ts`. Empty values (email, address, Instagram…) are hidden on the site automatically.
**Set `url` to the real domain before going live** — it is used for SEO, the sitemap and link previews.

### Galleries, codes and the shortlist

- Galleries are paged (Prev / Next, or swipe on phones): 4 photos per page on phones, 6 on tablets,
  8 on desktop. Change `MOBILE_PAGE_SIZE` / `PAGE_QUERIES` at the top of `src/components/Gallery.tsx`.
- Every photo gets a code customers can quote: `AAC-R05` = Religious Art #5. Letters: R religious,
  W wall panels, E doors & entryways, F furniture, L lifestyle, S workshop, D design library
  (`codePrefix` in `src/data/gallery.ts`). Codes come from the file number, so don't renumber files.
- Design Library themes (Florals, Branches, Abstract, Motifs) are set per design with `also: ["florals"]`
  in `captions` in `src/data/gallery.ts` — new designs need one to appear under a theme.
- Page, filter and open photo live in the address (`?page=2&filter=florals&view=design-04`), so links
  can be shared and the phone's Back button closes the full-screen viewer.
- Visitors' shortlist (♡) is stored in their own browser only — it is never sent anywhere until they
  press "Send shortlist on WhatsApp".

### Change collection names, descriptions or cover photos

Edit `collections` in `src/data/gallery.ts`.

## Publish

```bash
npm run build
```

Upload the `out/` folder to any static host. Recommended (all free for a site this size):

- **Vercel** or **Netlify** — connect the GitHub repo; build command `npm run build`, output folder `out`.
- **Cloudflare Pages** — same settings.
- **GitHub Pages** — if served from a sub-path like `username.github.io/alpha-arts-web`, build with
  `NEXT_PUBLIC_BASE_PATH=/alpha-arts-web npm run build`. Not needed with a custom domain.

Preview the production build locally with `npm run preview`.

## Project layout

```
content/gallery/        source photos (edit these)
public/media/           generated WebP images (auto, git-ignored)
scripts/build-images.mjs  image pipeline (sharp)
src/app/                pages: home, work, collections/[slug], design-library, about, contact
src/components/         header, footer, gallery + lightbox, enquiry form, sections
src/data/site.ts        business details
src/data/gallery.ts     collections, captions, photo helpers
```

The contact form doesn't need a backend: it formats the enquiry and opens WhatsApp with it pre-filled.
