import { useCallback, useMemo, useState } from 'react'
import ControlsPanel from './components/ControlsPanel'
import Dropzone from './components/Dropzone'
import PlayerBar from './components/PlayerBar'
import Waveform from './components/Waveform'
import { useFFmpeg } from './hooks/useFFmpeg'
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

  const { transcode, isLoading, error } = useFFmpeg()
  const [isConverting, setIsConverting] = useState(false)

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
  }, [])

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 sm:gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Audio Convertor & Trimmer</h1>
            <p className="text-sm text-slate-500">
              Convert between MP3, M4A, WAV, OGG, Opus and FLAC — trim before you export. Everything runs in your
              browser, nothing is uploaded.
            </p>
          </div>
        </header>

        {!file && <Dropzone onFile={handleFile} />}

        {file && (
          <>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4.5 w-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1">
                    <input
                      value={outputName}
                      onChange={(e) => setOutputName(e.target.value)}
                      spellCheck={false}
                      aria-label="Output file name"
                      className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 -mx-1 text-sm font-medium text-slate-800 outline-none hover:border-slate-200 focus:border-indigo-300 focus:bg-indigo-50/50 focus:ring-2 focus:ring-indigo-200"
                    />
                    <span className="shrink-0 text-sm font-medium text-slate-400">.{format.ext}</span>
                  </div>
                  <p className="px-1 text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => handleFile(null)}
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              >
                Change file
              </button>
            </div>

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
              isPlaying={isPlaying}
              onPlaybackEnd={() => setIsPlaying(false)}
            />

            <div className="rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-200">
              <PlayerBar
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying((p) => !p)}
                trimStart={trimStart}
                trimEnd={trimEnd}
                duration={duration}
              />
            </div>

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

        <footer className="mt-4 text-center text-xs text-slate-400">
          Drag the edges of the highlighted region on the waveform to trim. Conversion happens locally via ffmpeg.wasm.
        </footer>
      </div>
    </div>
  )
}
