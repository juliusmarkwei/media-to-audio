import { formatTime } from '../lib/formats'

interface PlayerBarProps {
  isPlaying: boolean
  onTogglePlay: () => void
  trimStart: number
  trimEnd: number
  duration: number
}

export default function PlayerBar({ isPlaying, onTogglePlay, trimStart, trimEnd, duration }: PlayerBarProps) {
  const selectionLength = Math.max(trimEnd - trimStart, 0)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
      <button
        onClick={onTogglePlay}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-[#ff5a1f] hover:text-[#ff5a1f] dark:border-zinc-700 dark:text-zinc-200"
        aria-label={isPlaying ? 'Pause' : 'Play selection'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
        <span>{formatTime(trimStart)}</span>
        <span className="text-zinc-500 dark:text-zinc-400">Selection {formatTime(selectionLength)}</span>
        <span>{formatTime(trimEnd)}</span>
      </div>

      <span className="shrink-0 whitespace-nowrap font-mono text-xs text-zinc-400 dark:text-zinc-500">
        / {formatTime(duration)} total
      </span>
    </div>
  )
}
