# Audio Convertor & Trimmer

A fast, private audio converter and trimmer that runs entirely in the browser — no uploads, no backend.

## Features

- Convert between MP3, M4A (AAC), WAV, OGG (Vorbis), Opus, and FLAC
- Trim audio by dragging a region on the waveform
- Named quality tiers (Low / Standard / High / Best) tuned per codec
- Rename the output file before downloading
- Conversion happens locally via [ffmpeg.wasm](https://ffmpegwasm.netlify.app/)

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- [wavesurfer.js](https://wavesurfer.xyz/) for waveform display and trim regions
- [Radix UI](https://www.radix-ui.com/) for accessible custom dropdowns
- `@ffmpeg/ffmpeg` (ffmpeg.wasm) for in-browser audio transcoding

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```
