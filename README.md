# AEON Archive — A world worth keeping

A Next.js exhibition revised around the approved sunlit museum concept, with twelve illustrated objects and a coordinated cream-and-gold gallery.

## Run on Windows

Extract this ZIP into a new folder, open PowerShell in that folder, and run:

```powershell
npm ci
npm run dev
```

Open the Local URL printed by Next.js. If another dev server is running, stop it with Ctrl+C first.

Development and production builds use Webpack by default to avoid the Turbopack package-resolution error reported on Windows.

## Production checks

```powershell
npm run typecheck
npm run build
npm start
```

The original dependency versions and lockfile are retained. Validation used Node.js 24.22.1.

## Edit the exhibition

- `data/collection.ts` contains the object labels, categories, source links, and optional dimensions and condition fields.
- Original reference photographs are in `public/images`.
- Generated exhibition artwork is in `public/exhibition`.
- `components/ArchiveExperience.tsx` contains the hero, collection, and object viewer.
- `components/WorldJourney.tsx` contains the scroll-driven atlas and destination associations.
- `app/globals.css` is the consolidated responsive stylesheet.

All twelve objects appear on the opening gallery. The cobalt vessel, chronometer, and astrolabe lead the collection, followed by nine further visualisations. Search the collection reveals the category filters and search field. Six entries retain original reference photographs and live 3D studies. Six new entries are clearly labeled generated exhibition concepts.

## Artwork and 3D

The opening museum scene is generated photographic artwork with scroll parallax and live HTML typography. Its Explore in 3D control opens a procedural armillary study. The globe and six object studies are live Three.js scenes. Procedural studies and generated images are artistic interpretations, with the original reference image accessible separately in each object viewer.

The atlas sits in the Not old. Still becoming. story section. When WebGL is unavailable, a Canvas 2D orthographic globe uses the same local geographic dataset and scroll position. The collection and atlas links work with either renderer. London and Rochester use collection-origin labels. Toulouse is explicitly a museum reference. Collection associations are preserved from the supplied source data and are not independently authenticated provenance.

Image zoom, source attribution, exhibition/source/3D viewing modes, previous/next navigation, reduced-motion behavior, keyboard controls, and mobile navigation are included. Dimensions and condition appear only when supplied in the collection file.

## Portable static build

`npm run export` creates a static copy in `.next-export` for any static web host. The normal `npm run build` and `npm start` flow remains available.

## Optional browser checks

The supplied Playwright check expects the dev server to be running. If Playwright's Chromium browser is already installed, run `npm run test:e2e`. Otherwise install that browser with `npx playwright install chromium` first. Set `AEON_TEST_URL` if using a different local port.

## Verification

See `VERIFICATION.md` for the checks performed during this redesign.
