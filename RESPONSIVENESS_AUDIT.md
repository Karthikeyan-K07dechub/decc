# DECC responsiveness audit

Date: 26 October 2026

**Verdict: the website has a strong responsive foundation, but it is not ready for an “all devices work correctly” sign-off.** Confirmed issues affect reduced motion, narrow screens, short desktop viewports, mobile navigation, and enlarged text. This audit reviews the local website in this workspace; it does not establish that a deployed version contains identical code.

## Coverage and method

- Inspected shared CSS, all page templates, navigation, forms, gallery, project cards, and animation/device detection.
- Ran the local Next.js site and measured layouts using headless Chrome 155 via the Chrome DevTools Protocol. Captured screenshots and inspected representative failures visually.
- Checked eight page types in English and Arabic at 320×568, 390×844, 640×800, 768×1024, 1024×768, and 1440×900: **96 layout cases**. Types: home, about, services, projects, careers, contact, project detail, service detail.
- Additionally checked **all six service details and all eight project details**, in both languages, at 320×568 and 1024×768: **56 cases**, including some overlap with the template sample above.
- Tested home at 375×667, 844×390 landscape, 1024×600, 1280×720, and 1920×1080; normal and reduced motion; touch input at 1024px; mobile menu keyboard focus; project filtering; FAQ; gallery; empty enquiry validation; and a 200% root-font-size simulation.
- `npm.cmd run typecheck` passed. The initial template sweep recorded no uncaught browser runtime exceptions.
- A later targeted recheck encountered local Next.js development-cache errors (missing compiled page and malformed generated JSON). The earlier sweeps returned successful page responses; the narrow-card finding below is based on those earlier measurements and source inspection. A production-build rerun is still needed.
- No application source was changed. Audit scripts, screenshots, and measurements are under [.audit](.audit/).

## Confirmed findings

### 1. High — reduced motion leaves later featured projects off-screen

**Affected:** home, English and Arabic, desktop widths ≥1024px, reduced motion enabled.

The featured section remains a horizontal desktop strip, but its horizontal scrolling animation is installed only when motion is allowed. The section clips overflow and has no visible alternative controls or native horizontal scroller. At 1024×600 its content is approximately 2900px wide inside a 1009px content viewport. The third and fourth panels are entirely off-screen. Normal vertical scrolling does not reveal them.

**Cause:** [FeaturedProjects.tsx:26](components/sections/FeaturedProjects.tsx#L26), [desktop layout at line 97](components/sections/FeaturedProjects.tsx#L97), and the section's `overflow-hidden` at line 78.

**Recommended fix:** use a vertical, content-height layout whenever reduced motion is enabled, or provide an accessible native horizontal scroller with controls. Animation enhancement and layout activation must use matching conditions.

**Acceptance:** all four project titles, schedules, and links can be reached with ordinary scrolling and keyboard navigation in both languages with reduced motion enabled.

Evidence: [screenshot](.audit/reduced-en-featured-title-1024x600.png), [measurements](.audit/interactions.json).

### 2. High — reduced motion removes the five building-layer explanations on desktop

**Affected:** home, both languages, desktop widths ≥1024px, reduced motion enabled.

The list containing all five explanations uses `lg:hidden`. Meanwhile, reduced motion disables the ScrollTrigger that updates the desktop explanation. The visible result is the intro, a static drawing, and `00 / 05`; the layer descriptions are absent from the visible layout.

**Cause:** [Exploded.tsx:29](components/sections/Exploded.tsx#L29), [desktop explanation at line 74](components/sections/Exploded.tsx#L74), [fallback list at line 89](components/sections/Exploded.tsx#L89).

**Recommended fix:** show the complete list for reduced motion at every viewport width; hide the animated status block in that mode.

**Acceptance:** all five descriptions remain readable without animation at 1024px, 1440px, and with keyboard navigation.

Evidence: [visible desktop reduced-motion content](.audit/focused.json), [screenshot](.audit/reduced-en-exploded-title-1024x600.png).

### 3. Medium — small home hero overlaps the fixed header

**Affected:** confirmed on the English home page at 320×568; also observed at 1024×600.

At 320×568, the sheet/company label starts at y≈23 and ends at y≈59, underneath the fixed 80px header. The label and logo visibly overlap. At 1024×600 the label begins around y≈71, again entering the header area. Flex-end alignment, large text, fixed hero height, and vertical padding leave insufficient room for the content.

Landscape 844×390 also places the hero description and CTA below the initial visible region. Scrolling can reach them; this is a first-screen density concern, not a missing CTA.

**Cause:** [Hero.tsx:105](components/sections/Hero.tsx#L105), [copy container at line 132](components/sections/Hero.tsx#L132).

**Recommended fix:** allow content-driven hero height with a viewport minimum; reserve header space explicitly; add a short-height layout that reduces headline scale and vertical spacing.

**Acceptance:** label, heading, copy, and CTAs do not overlap the header or contact bar at 320×568, 375×667, 844×390, and 1024×600.

Evidence: [320px screenshot](.audit/normal-en-320x568.png), [short desktop screenshot](.audit/normal-en-1024x600.png), [geometry](.audit/focused.json).

### 4. Medium — narrow project cards can overflow

**Affected:** detected on `/en/services/approvals-permits` at 320px in its related-project cards.

The card title and “Sample project” badge share a non-wrapping flex row. The badge cannot shrink, and the title wrapper lacks `min-width: 0`. The sweep measured the badge ending at x≈328 on a 320px viewport. Global horizontal clipping can conceal this kind of problem rather than resolve the layout.

**Cause:** [ProjectTile.tsx:23](components/ui/ProjectTile.tsx#L23), [badge at line 30](components/ui/ProjectTile.tsx#L30), [global clipping](app/globals.css#L71).

**Recommended fix:** stack or wrap the badge on narrow screens, allow the title wrapper to shrink, and test the longest English and Arabic titles.

**Acceptance:** all card text and badges stay within the available content width at 320px, including related-project sections.

Evidence: [detail sweep](.audit/details.json). The attempted follow-up screenshot was blocked by the development-cache error described above.

### 5. Medium — desktop pinning ignores height and input type

**Affected:** home animation sections on short desktop screens and wide touch devices.

At 1024×600, the building section's pinned content measured approximately 717px tall in English and 688px in Arabic. The pinned composition exceeds the visible viewport before accounting for the fixed header. The stage's lower annotation is outside the screenshot. Scrolling eventually releases the section, but its intended composition cannot fit while pinned.

A touch-emulated 1024×768 device also received all three pinned sections despite reporting no fine pointer and no hover. The shared `isDesktop()` helper checks input capabilities, but the section pinning conditions check only width and motion preference.

**Cause:** [Exploded.tsx:29](components/sections/Exploded.tsx#L29), [layout at line 62](components/sections/Exploded.tsx#L62); equivalent width-only conditions in Hero and FeaturedProjects.

**Recommended fix:** gate pinning by a suitable minimum height and input capabilities; supply a flowing layout for short viewports and touch devices. Keep text and critical links outside motion-dependent presentation.

**Acceptance:** the full pinned composition fits the usable height, and wide touch devices receive a deliberately tested interaction model.

Evidence: [short-screen screenshot](.audit/motion-en-exploded-title-1024x600.png), [touch detection](.audit/edge.json).

### 6. Medium — mobile menu does not isolate navigation

**Affected:** mobile navigation in both languages.

- Opening the menu does not lock the document. A browser scroll command moved the page behind the open menu from 0 to 300px; scroll chaining remains possible because the overlay has no containment policy.
- Keyboard Tab from the menu's final CTA moved to a Services link in the obscured page. The overlay has no focus containment, background `inert`, or focus restoration.
- The desktop mega-menu offers the Services overview; the mobile menu includes only the six individual services. The overview and comparison table remain reachable from the footer, but navigation parity is missing.

**Cause:** [Header.tsx:41](components/ui/Header.tsx#L41), [mobile menu at line 144](components/ui/Header.tsx#L144).

**Recommended fix:** implement the menu as a properly managed modal navigation overlay with background isolation, scroll containment, initial/return focus, and a Services overview link. Escape already closes it.

**Acceptance:** background content cannot receive focus while the menu is open; closing restores focus; scrolling stays in the menu; the overview is directly available.

Evidence: [menu measurements and links](.audit/focused.json), [keyboard result](.audit/edge.json).

### 7. Medium — several touch controls have only an 18px hit height

**Affected:** mobile menu toggle, language switch, gallery close/previous/next.

Measured clickable heights were 18px, with no extra padding on these controls. The menu label was approximately 33×18px in English. Gallery controls also measured 18px tall. They are usable in automation but offer little tolerance for fingers or motor imprecision.

**Cause:** [Header.tsx:95](components/ui/Header.tsx#L95), [toggle at line 105](components/ui/Header.tsx#L105), [Gallery.tsx:88](components/ui/Gallery.tsx#L88), [gallery navigation at line 96](components/ui/Gallery.tsx#L96).

**Recommended fix:** retain the visual style while expanding interactive padding to provide a consistent approximately 44×44px touch area, with separation between adjacent controls.

Evidence: [control dimensions](.audit/results.json), [gallery dimensions](.audit/interactions.json).

### 8. Medium — enlarged text overflows the header

**Affected:** text-size enlargement; confirmed with a 200% root-font-size simulation at 1280×720.

The enlarged header extended beyond the right edge, pushing later navigation controls out of view. Global horizontal clipping prevents this from becoming a usable horizontal navigation area. Hero content also moved well below the first visible screen, but its enlarged minimum height allowed scrolling to that content; this measurement alone does not establish lost hero controls. This is a text-enlargement finding, not a completed browser zoom compliance test.

**Cause:** header items cannot wrap or switch navigation mode based on actual available space. Increasing root text size does not activate the width breakpoint that selects mobile navigation.

**Recommended fix:** let navigation collapse before enlarged content stops fitting, and preserve access to the language switch and consultation link.

**Acceptance:** repeat actual browser zoom and text-size tests at 200%, including navigation and form submission, with no lost controls or clipped text.

Evidence: [enlarged-text screenshot](.audit/text-resize-200.png), [measurements](.audit/edge.json).

## What worked in the checks

- The principal grids collapse and expand across phone, tablet, and desktop widths. No persistent site-wide horizontal overflow was found; the narrow related-project card above needs attention.
- English and Arabic pages render with the correct reading direction. The sampled layouts generally retain sensible wrapping and spacing.
- Main buttons and form fields have approximately 48px minimum height; the fixed mobile contact bar has approximately 56px targets.
- The Services comparison table deliberately stays at least 640px wide inside its own horizontal scroller. This is contained table scrolling, not a page overflow defect. A visible scroll hint would improve discoverability.
- Project filtering returned three villa cards; a mobile FAQ expanded to its full measured content height; the gallery filled the viewport, opened/closed, and locked document scrolling; an empty enquiry produced three inline invalid fields without widening the page.
- Responsive images use `sizes` and fill constrained containers. Mobile pinning is disabled below 1024px. Reduced-motion fallbacks exist, though the two desktop gaps above prevent complete parity.
- The footer already has additional bottom spacing for the fixed mobile contact bar.

## Remaining concerns requiring device validation

These are code risks or untested environments, not confirmed failures:

1. **iPhone safe areas:** `viewport-fit: cover` is enabled, but `.wrap` applies the left safe-area inset to both sides. The right inset is never read. The header includes top safe-area padding while the menu starts at a fixed `top-16`. The gallery has no explicit safe-area padding for its top/bottom controls. Test both landscape orientations on a notched iPhone. Sources: [globals.css:192](app/globals.css#L192), [Header.tsx:67](components/ui/Header.tsx#L67), [Gallery.tsx:83](components/ui/Gallery.tsx#L83).
2. **On-screen keyboard:** test enquiry/application fields and submission with iOS Safari and Android Chrome keyboards open. The fixed contact bar and full-screen overlays need checks against the visual viewport; headless viewport resizing does not reproduce the keyboard.
3. **Mobile GPU/battery:** WebGL is selected after idle whenever supported, without device-memory, save-data, or runtime-error fallback policy. Scenes use DPR up to 2 and continuously render while visible. Lower-detail geometry exists on smaller widths, but no real-device frame-rate, thermal, or battery measurements were taken. Sources: [Scenes.tsx](components/three/Scenes.tsx), [HeroScene.tsx](components/three/HeroScene.tsx), [useVisibleFrameloop.ts](components/three/useVisibleFrameloop.ts).
4. **Browser coverage:** no physical iOS/Android devices, Safari/WebKit, or Firefox were available in this run. Browser screenshots and touch emulation do not establish compatibility with those engines.
5. **Resize/orientation:** the animation sections use reactive media queries, while smooth scrolling and some input listeners are selected only on mount. Test repeated rotations and desktop/tablet resizing during navigation and while pinned.

## Suggested order of work

1. Restore complete content access in both desktop reduced-motion sections.
2. Fix hero height/spacing, narrow card wrapping, and short-screen pinning.
3. Repair mobile menu focus/scroll handling and enlarge small touch targets.
4. Verify enlarged text, safe areas, keyboard behavior, and wide touch devices.
5. Repeat on physical iPhone/iPad and Android devices, plus Safari and Firefox, before approving broad device support.

Raw evidence: [template measurements](.audit/results.json), [all detail-page measurements](.audit/details.json), [focused home/menu tests](.audit/focused.json), [interaction tests](.audit/interactions.json), [edge tests](.audit/edge.json).
