import { useCallback, useMemo, useState } from 'react'
import ControlsPanel from './components/ControlsPanel'
import DragOverlay from './components/DragOverlay'
import Dropzone from './components/Dropzone'
import PlayerBar from './components/PlayerBar'
import ThemeToggle from './components/ThemeToggle'
import Waveform from './components/Waveform'
import { useFFmpeg } from './hooks/useFFmpeg'
import { useTheme } from './hooks/useTheme'
import { useWindowFileDrop } from './hooks/useWindowFileDrop'
import { FORMATS, type FormatId } from './lib/formats'

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [duration, setDuration] = useState(0)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [formatId, setFormatId] = useState<FormatId>('mp3')
  const [bitrate, setBitrate] = useState('192k')
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [outputName, setOutputName] = useState('')
  const [previewError, setPreviewError] = useState(false)

  const { transcode, isLoading, error } = useFFmpeg()
  const [isConverting, setIsConverting] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const format = useMemo(() => FORMATS.find((f) => f.id === formatId)!, [formatId])
  const isTrimmed = duration > 0 && (trimStart > 0.05 || trimEnd < duration - 0.05)

  const handleFile = useCallback((f: File | null) => {
    setFile(f)
    setDuration(0)
    setTrimStart(0)
    setTrimEnd(0)
    setIsPlaying(false)
    setProgress(0)
    setStatusMessage('')
    setOutputName(f ? f.name.replace(/\.[^/.]+$/, '') : '')
    setPreviewError(false)
  }, [])

  const isDraggingFile = useWindowFileDrop(handleFile)

  const handleFormatChange = useCallback((id: FormatId) => {
    setFormatId(id)
    const f = FORMATS.find((fmt) => fmt.id === id)!
    const recommended = f.qualities?.find((q) => q.recommended) ?? f.qualities?.[0]
    if (recommended) setBitrate(recommended.value)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!file) return
    setIsConverting(true)
    setProgress(0)
    setStatusMessage('Loading converter…')
    try {
      const blob = await transcode({
        file,
        format,
        bitrate: format.qualities ? bitrate : undefined,
        trimStart,
        trimEnd,
        onProgress: (ratio) => {
          setProgress(ratio)
          setStatusMessage('Converting…')
        },
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const baseName = outputName.trim() || file.name.replace(/\.[^/.]+$/, '')
      a.href = url
      a.download = `${baseName}.${format.ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setStatusMessage('Done!')
    } catch (e) {
      setStatusMessage(e instanceof Error ? e.message : 'Conversion failed')
    } finally {
      setIsConverting(false)
      setTimeout(() => setStatusMessage(''), 2500)
    }
  }, [file, format, bitrate, trimStart, trimEnd, outputName, transcode])

  return (
    <div className="min-h-screen bg-[#f6f4ef] px-3 py-6 text-zinc-900 sm:px-4 sm:py-10 dark:bg-[#111110] dark:text-zinc-100">
      {isDraggingFile && <DragOverlay />}

      <div className="mx-auto flex max-w-2xl flex-col gap-5 sm:gap-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold tracking-tight">audio/convert</span>
            <span className="hidden font-mono text-xs text-zinc-400 sm:inline dark:text-zinc-500">
              mp3 · m4a · wav · ogg · opus · flac
            </span>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {!file && <Dropzone onFile={handleFile} />}

        {file && (
          <>
            <div className="flex items-center justify-between gap-3 border border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-baseline">
                    <input
                      value={outputName}
                      onChange={(e) => setOutputName(e.target.value)}
                      spellCheck={false}
                      aria-label="Output file name"
                      style={{ width: `${Math.max(outputName.length, 1) + 1}ch` }}
                      className="max-w-full min-w-0 shrink border border-transparent bg-transparent px-1 -mx-1 text-sm font-medium outline-none hover:border-zinc-200 focus:border-[#ff5a1f] dark:hover:border-zinc-700"
                    />
                    <span className="shrink-0 font-mono text-sm font-medium text-zinc-400 dark:text-zinc-500">
                      .{format.ext}
                    </span>
                  </div>
                  <p className="px-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleFile(null)}
                className="shrink-0 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                Change file
              </button>
            </div>

            {previewError ? (
              <div className="border border-zinc-200 px-4 py-5 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                Can&apos;t preview this file&apos;s audio in-browser, but you can still convert the whole thing —
                trimming is unavailable for this format.
              </div>
            ) : (
              <>
                <Waveform
                  file={file}
                  onReady={(d) => {
                    setDuration(d)
                    setTrimEnd(d)
                  }}
                  onRegionChange={(start, end) => {
                    setTrimStart(start)
                    setTrimEnd(end)
                  }}
                  onError={() => setPreviewError(true)}
                  isPlaying={isPlaying}
                  onPlaybackEnd={() => setIsPlaying(false)}
                />

                <div className="border border-zinc-200 px-4 py-3.5 dark:border-zinc-800">
                  <PlayerBar
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying((p) => !p)}
                    trimStart={trimStart}
                    trimEnd={trimEnd}
                    duration={duration}
                  />
                </div>
              </>
            )}

            <ControlsPanel
              formatId={formatId}
              onFormatChange={handleFormatChange}
              bitrate={bitrate}
              onBitrateChange={setBitrate}
              isTrimmed={isTrimmed}
              onConvert={handleConvert}
              isBusy={isConverting || isLoading}
              progress={progress}
              statusMessage={statusMessage}
            />

            {error && <p className="text-center text-sm text-red-500">{error}</p>}
          </>
        )}

        <footer className="mt-4 text-center font-mono text-xs text-zinc-400 dark:text-zinc-500">
          drag a region's edges to trim · nothing leaves your browser · powered by ffmpeg.wasm
        </footer>
      </div>
    </div>
  )
}
