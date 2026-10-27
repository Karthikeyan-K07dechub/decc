# DECC — Designer Engineering Consultants LLC

Website concept **"The Drawing Set"**: every page is a sheet in a set of construction drawings (A-000 Home, A-100 About, S-200 Services, P-300 Projects, A-400 Careers, C-900 Contact). English and Arabic (RTL), one Next.js project.

## 1. Run it

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. It redirects to `/en`; the Arabic site is at `/ar`.

Run only one development server per checkout. `npm run dev` prevents a second instance from sharing the compilation cache. Stop the running terminal with Ctrl+C before restarting. Development output lives in `.next-dev`; production builds use `.next`, so building does not overwrite a live development preview.

To check a production build:

```bash
npm run build
npm start
```

`npm run build` downloads the Google Fonts (Archivo, Instrument Sans, IBM Plex Mono, Alexandria, IBM Plex Sans Arabic), so it needs an internet connection. It also runs `scripts/blur.mjs` first, which creates small blurred previews of the photos. If that step fails offline, the build still continues with flat-colour previews.

## 2. Stack

- Next.js 15 (App Router), React 19 and TypeScript
- Tailwind CSS v4, with colour and type tokens in `app/globals.css` under `@theme`
- GSAP 3 with ScrollTrigger, SplitText, Flip and CustomEase, used through `@gsap/react`. There is one easing everywhere: `cubic-bezier(0.22, 1, 0.36, 1)`, registered as `"draw"` in `lib/gsap.ts`.
- Lenis smooth scrolling (desktop only), synced to ScrollTrigger
- React Three Fiber and three.js for the hero villa, the exploded G+4 building and the service models. These load only in the browser, after the page is idle, over a static poster.
- next-intl for `/en` and `/ar`, with `dir="rtl"` on Arabic pages
- Server Actions with zod validation for the three forms

## 3. Where things live

| What | File |
|---|---|
| All English and Arabic text | `messages/en.json`, `messages/ar.json` |
| Image URLs, alt text (EN and AR) and credits: **the only place** | `lib/images.ts` |
| Services, projects, sectors, phone, email, coordinates and sheet codes | `lib/content/index.ts` |
| Form handling (consultation, enquiry, job application) | `app/actions.ts` |
| SEO: titles, hreflang, Open Graph, JSON-LD | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` |
| Pages | `app/[locale]/(site)/…` |
| Page sections | `components/sections/` |
| 3D scenes | `components/three/` |
| Motion (cursor, preloader, page transitions, scroll reveals) | `components/motion/` |

Many scroll reveals are switched on with data attributes, so any element can use them:

| Attribute | Effect |
|---|---|
| `data-split` | Heading rises word by word |
| `data-split="lines"` | Text rises line by line |
| `data-fade` | Fades in |
| `data-rule` | Hairline draws across |
| `data-draw` | SVG strokes draw in |
| `data-count` | Number counts up |
| `data-wipe` | Clip-path wipe |

All of them are handled in `components/motion/MotionLayer.tsx`.

## 4. Replacing images

Every photo is a free Unsplash stand-in, marked `placeholder: true`. To use DECC's own photos:

1. Put the file in `public/images/`, for example `public/images/villa-al-dhait.jpg`. Use at least 2400px on the long side for full-width images.
2. In `lib/images.ts`, open the entry you are replacing:
   - set `url` to `"/images/villa-al-dhait.jpg"`
   - update `alt.en`, `alt.ar` and `credit`
   - set `placeholder: false`
3. Run `npm run blur` to refresh the blurred previews.

Every image on the site is referenced by its id (`villaHero`, `mosque`, and so on), so one change updates every page that uses it.

To add a new photo, add its id to the `ImageId` type and add an entry to `images`.

## 5. Editing projects

Projects are listed in `lib/content/index.ts` (`projects`). Their text lives in `messages/*.json` under `projects.items.<slug>`.

To add a project:
1. Add an entry to `projects` with:
   - a new slug and code
   - sector, status and image ids
   - `elevation`: the line drawing shown before the photo; one of villa, tower, mosque, warehouse or block
   - scope
   - data
2. Add its title, location, brief and solution to both message files.

Its page and sitemap entry are created automatically.

## 6. Connecting the forms to email

The forms already validate and log every submission; you can see them in Vercel → Logs. To have them emailed to info@decc.ae:

```bash
npm install resend
```

1. Create a free account at resend.com and verify the decc.ae domain.
2. Add `RESEND_API_KEY` to Vercel → Project → Settings → Environment Variables.
3. In `app/actions.ts`, replace each `// TODO` with:

```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({ from: "DECC website <web@decc.ae>", to: "info@decc.ae", subject: "New enquiry", text: JSON.stringify(parsed.data, null, 2) });
```

For job applications, attach the CV with:

```ts
attachments: [{ filename: cv.name, content: Buffer.from(await cv.arrayBuffer()) }]
```

## 7. Deploying to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project** and import the repository. Vercel detects Next.js, so no settings need changing.
3. Add these environment variables:
   - `NEXT_PUBLIC_SITE_URL` = `https://decc.ae`, used for canonical links, the sitemap and Open Graph
   - `RESEND_API_KEY` (optional, see section 6)
4. Deploy, then add the `decc.ae` domain under **Settings → Domains**.

## 8. Testimonials

A testimonials section is built but hidden. No quotes have been invented. To show it:
1. Add real, approved quotes to `QUOTES` in `components/sections/Testimonials.tsx`.
2. Set `SHOW_TESTIMONIALS = true` in `lib/content/index.ts`.

## 9. Accessibility and motion

- Visitors who set "reduce motion" see the final states with plain fades, and a photo instead of the 3D scenes.
- On mobile the 3D is lighter. The hero and building-layer diagram stay pinned through their animation sequences before releasing. The building-layer descriptions and other sections flow normally. The custom cursor and hover effects are off.
- Phone numbers, coordinates and codes always read left to right, including on Arabic pages.

Everything DECC still needs to supply is listed in `PLACEHOLDERS.md`.
