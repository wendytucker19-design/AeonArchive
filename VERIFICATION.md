# Verification of the expanded museum edition

## Build and asset checks

- `npm run typecheck` passed.
- `npm run build` passed with Webpack. The homepage compiled and prerendered successfully.
- The portable static export compiled and prerendered successfully.
- Every catalog image reference resolves to a local file.
- All thirteen exhibition WebP files decode successfully.
- All six original source photographs are retained.
- The Natural Earth geographic dataset parses successfully.
- The development, build, and export scripts use the existing installed dependencies.
- The optional browser-check script passes JavaScript syntax validation.

## Browser checks completed

The rendered static export was inspected through the supported browser preview.

- The museum hero and expanded collection were inspected visually.
- All twelve collection entries were present.
- Searching for chronometer returned the corresponding single entry.
- The Timekeeping filter returned three entries.
- The source photograph view opened and its zoom control changed the displayed zoom to 140 percent.
- New generated concepts displayed their exhibition labeling and omitted unsupported source-photograph and 3D controls.
- Next and previous object navigation opened the expected records.
- Escape dismissed the native object dialog.
- The atlas fallback rendered geographic land shapes and city markers.
- Selecting Rochester updated the destination and opened The Deco Eye through the related-object control.
- No horizontal overflow was observed in the desktop preview at 1363 by 936 CSS pixels.

## Verification limits

The preview browser has WebGL disabled. The native Three.js globe and six 3D object studies therefore could not be visually verified. A Canvas 2D orthographic globe was added and checked using the same geographic data and scroll position. In browsers that support WebGL, the real-time Three.js scenes remain available.

The mobile viewport could not be activated through the available browser controls. Mobile CSS is implemented, but phone-size visual checks and mobile menu behavior remain unverified in this environment.

The optional Playwright script was updated for twelve entries and the conditional 3D controls. It has not been executed as a standalone command here. Browser checks above were performed interactively.

## Image and collection decisions

The museum hero is generated photographic artwork with scroll parallax and live HTML typography. Its object-viewer control opens a procedural armillary study when WebGL is supported.

The six original collection entries retain their original reference images, attribution, and source links. Six additional entries are AI-generated exhibition design concepts and are labeled accordingly. Their dates, dimensions, and provenance have not been invented. The original historical labels were retained from the uploaded collection data and were not independently authenticated.
