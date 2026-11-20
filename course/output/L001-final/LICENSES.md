# Asset & font license notes — DigProg L001

## Fonts

- **Manrope** (site via Google Fonts; Remotion falls back to system UI stack if not bundled): SIL Open Font License 1.1.
- **IBM Plex Mono** (video number/price labels via system/CSS fallback chain): SIL Open Font License 1.1 when loaded; otherwise system monospace.

To ship Remotion with identical glyphs, place licensed `Manrope-*.woff2` under `remotion-lecture/public/fonts/` and load via `@remotion/google-fonts` or `FontFace` before render.

## Voice

- **edge-tts / Microsoft Neural voices** (`en-US-BrianNeural`): used for production in this build because no ElevenLabs API key was available. Review Microsoft/edge-tts usage terms for your distribution channel before public commercial release.
- Replace with a licensed ElevenLabs (or other) voice when authorized; keep alignment files updated.

## Music / SFX

- No music bed in the final mix.
- No third-party SFX library assets in the final editorial cut.

## References (inspiration only — not reused)

- YouTube motion craft reference: principles only; no footage, branding, or music copied.
- DataCamp lesson UX: layout/interaction principles only; no DataCamp assets or branding.

## Illustrations

- All UI mockups, guide cover, diagrams, and marker graphics are original SVG/React drawings created for DigProg.
