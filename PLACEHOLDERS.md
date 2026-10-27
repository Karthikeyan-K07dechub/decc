# Placeholders for DECC to replace

On the site, everything below is shown either as **00**, with a dotted clay underline (`.tbc`), or labelled "Sample project" or "To confirm".

## Numbers (`messages/*.json`, `lib/content/index.ts`)

| What | Where | Now |
|---|---|---|
| Portfolio project count | Home → credentials strip | Automatically counts the listed portfolio entries (currently 8 sample projects); not a claim about total completed jobs |
| Plot area for each project | `projects[].data.plotArea` | 00 m² |
| Completion year for each project | `projects[].data.year` | 00 |
| Timeline years: first residential building, first mosque, interior design added, move to Julphar Tower | `about.timeline` (set `confirmed: true` only after DECC verifies each date) | Illustrative years: 2012, 2015, 2018, 2022; labelled as awaiting confirmation |
| RAK Municipality consultant registration no. | `about.licences` | Reg. no. 00 |
| Civil Defence approved consultant no. | `about.licences` | Reg. no. 00 |
| Trade licence no. | `about.licences` | No. 00 |
| Society of Engineers membership | `about.licences` | To confirm |

## Projects (`lib/content/index.ts` and `projects.items` in both message files)

All 8 projects are **samples**: the names, locations, briefs and solutions are illustrative, not DECC's real jobs.
- P-301 Courtyard villa, Al Dhait
- P-302 Residential building, Al Nakheel
- P-303 Neighbourhood mosque, Khuzam
- P-304 Warehouse, Al Ghail
- P-305 Contemporary villa, Julan
- P-306 Commercial building, Al Hisn
- P-307 Residential building, Dafan Al Nakheel
- P-308 Villa, Mina Al Arab

Replace them with real projects and photos, then remove the "Sample project" labels by deleting the `common.sampleProject` usages. Those are in `ProjectTile.tsx`, `FeaturedProjects.tsx` and the project detail page.

## Team (`about.team`)

- Six roles have illustrative names in English and Arabic, with stock Unsplash portraits. The section explicitly identifies these as sample profiles, not verified DECC staff.
- Replace the names in `about.team` and the six `team*` images in `lib/images.ts` with approved staff details. Photo credits and source links are recorded in the image registry. Remove `about.teamSampleNote` from the rendered section only when all profiles are verified.

## Careers (`careers.roles`)

The Architect, Structural Engineer and Site Engineer roles are samples. Confirm the current openings before going live.

## Photos (`lib/images.ts`): project, office, and team images are Unsplash stand-ins

| Id | Used for | Note |
|---|---|---|
| villaHero | Home hero, P-301 | Generic modern villa |
| villaDusk | P-305 | |
| villaCourt | P-308 | Photographed in the UAE |
| mountains | (spare) | Real Hajar mountains, Wadi Ghalilah, RAK |
| engineersSite | Supervision, Careers | |
| concreteFrame | Structural, P-307 | |
| engineeringFacade | Why DECC | Modern concrete and glass facade; stock image by Ivan Rohovchenko |
| craneSite | Approvals | |
| mepDucts | MEP | |
| mosque | P-303 | Istanbul domes, a deliberately non-UAE landmark so nobody assumes DECC designed it |
| residential | P-302 | |
| commercial | P-306 | |
| warehouse | P-304 | |
| architectDesk | Architecture, About hero | |
| interior | Interior design | |
| officeTower | About → office | **Stand-in for Julphar Tower.** Replace with a real photo of the building. |

## Other

- **Testimonials:** hidden. Add real, approved quotes only (see the README).
- **Open Graph image:** uses villaHero. Replace it with a branded 1200×630 image if you like (`lib/seo.ts`).
- **Logo:** the DECC wordmark is typeset in Archivo (`components/ui/Logo.tsx`). Swap in the official logo SVG if DECC has one.
- **Map:** the contact page embeds a Google Maps preview using the configured coordinates, 25.7911°N 55.9602°E. Clicking the preview or "Get directions" opens the same location in Google Maps. Keep `company.coords` and `company.mapsUrl` aligned when updating the office location.
- **Email:** form submissions are only logged until Resend is connected (see README section 6).
