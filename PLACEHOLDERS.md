# Placeholders for DECC to replace

On the site, everything below is shown either as **00**, with a dotted clay underline (`.tbc`), or labelled "Sample project" or "To confirm".

## Numbers (`messages/*.json`, `lib/content/index.ts`)

| What | Where | Now |
|---|---|---|
| Total projects completed | Home → credentials strip | 00 |
| Plot area for each project | `projects[].data.plotArea` | 00 m² |
| Completion year for each project | `projects[].data.year` | 00 |
| Timeline years: first residential building, first mosque, interior design added, move to Julphar Tower | `about.timeline` (set `confirmed: true` once the year is filled in) | 00 |
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

- There are six roles, each named "Name to confirm".
- The portraits are drawn placeholders (`components/ui/Portrait.tsx`). Replace them with real photos: add them to `lib/images.ts` and swap `<Portrait>` for `<Photo>`.

## Careers (`careers.roles`)

The Architect, Structural Engineer and Site Engineer roles are samples. Confirm the current openings before going live.

## Photos (`lib/images.ts`): all 15 are free Unsplash stand-ins

| Id | Used for | Note |
|---|---|---|
| villaHero | Home hero, P-301 | Generic modern villa |
| villaDusk | P-305 | |
| villaCourt | P-308 | Photographed in the UAE |
| mountains | (spare) | Real Hajar mountains, Wadi Ghalilah, RAK |
| engineersSite | Supervision, Careers | |
| concreteFrame | Structural, Why DECC, P-307 | |
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
- **Map:** the contact map is a schematic line drawing, not to scale. The "Get directions" link uses the real coordinates, 25.7911°N 55.9602°E.
- **Email:** form submissions are only logged until Resend is connected (see README section 6).
