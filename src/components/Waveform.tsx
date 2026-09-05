import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin, { type Region } from 'wavesurfer.js/plugins/regions'

interface WaveformProps {
  file: File
  onReady: (duration: number) => void
  onRegionChange: (start: number, end: number) => void
  isPlaying: boolean
  onPlaybackEnd: () => void
}

export default function Waveform({ file, onReady, onRegionChange, isPlaying, onPlaybackEnd }: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const regionsRef = useRef<RegionsPlugin | null>(null)
  const regionRef = useRef<Region | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const regions = RegionsPlugin.create()
    regionsRef.current = regions

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#93c5fd',
      progressColor: '#6366f1',
      cursorColor: '#312e81',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 96,
      normalize: true,
      url: URL.createObjectURL(file),
      plugins: [regions],
    })
    wavesurferRef.current = ws

    ws.on('ready', (duration) => {
      const region = regions.addRegion({
        start: 0,
        end: duration,
        color: 'rgba(99, 102, 241, 0.15)',
        drag: true,
        resize: true,
      })
      regionRef.current = region
      onReady(duration)
      onRegionChange(0, duration)
    })

    regions.on('region-updated', (region) => {
      onRegionChange(region.start, region.end)
    })

    ws.on('finish', () => {
      onPlaybackEnd()
    })

    ws.on('timeupdate', (time) => {
      const region = regionRef.current
      if (region && ws.isPlaying() && time >= region.end) {
        ws.pause()
        onPlaybackEnd()
      }
    })

    return () => {
      ws.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => {
    const ws = wavesurferRef.current
    if (!ws) return
    if (isPlaying && !ws.isPlaying()) {
      const region = regionRef.current
      if (region) {
        if (ws.getCurrentTime() < region.start || ws.getCurrentTime() >= region.end) {
          ws.setTime(region.start)
        }
      }
      void ws.play()
    } else if (!isPlaying && ws.isPlaying()) {
      ws.pause()
    }
  }, [isPlaying])

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div ref={containerRef} className="w-full" />
    </div>
  )
}
