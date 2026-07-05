# Assets

Static assets for Summer Study (not committed until needed).

## Planned structure

```
assets/
├── icons/          # Subject icons, UI icons (SVG preferred)
├── illustrations/  # Empty states, celebrations (optimized WebP/SVG)
├── brand/          # Logo, favicon source files
└── fonts/          # Self-hosted font files if not using CDN
```

## Guidelines

- Prefer SVG for icons (small bundle, scalable)
- Optimize raster images (WebP, max dimensions for iPad)
- No stock photo clutter
- See `DESIGN_SYSTEM.md` for visual direction

## Runtime assets

Production assets served from `public/` in the Vite project (copied at build).

This `assets/` folder is for **source files** and design exports.
