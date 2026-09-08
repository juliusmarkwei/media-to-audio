# Media to Audio Converter

A fast, private converter and trimmer that turns audio or video files into MP3, M4A, WAV, OGG, Opus, or FLAC — entirely in the browser, no uploads, no backend.

## Features

- Convert audio or video files (video's audio track is extracted automatically)
- Output formats: MP3, M4A (AAC), WAV, OGG (Vorbis), Opus, and FLAC
- Trim audio by dragging a region on the waveform
- Named quality tiers (Low / Standard / High / Best) tuned per codec
- Rename the output file before downloading
- Drop a file anywhere in the window, not just onto the dropzone
- Light/dark theme, remembered between visits
- Conversion happens locally via [ffmpeg.wasm](https://ffmpegwasm.netlify.app/)

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- [wavesurfer.js](https://wavesurfer.xyz/) for waveform display and trim regions
- [Radix UI](https://www.radix-ui.com/) for accessible custom dropdowns
- `@ffmpeg/ffmpeg` (ffmpeg.wasm) for in-browser media transcoding

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```
