export default function DragOverlay() {
  return (
    <div className="drop-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#f6f4ef]/90 dark:bg-[#111110]/90">
      <div className="drop-overlay-ring pointer-events-none fixed rounded-2xl border-2 border-dashed border-[#ff5a1f]" />
      <div className="drop-overlay-mark flex flex-col items-center gap-3 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff5a1f" strokeWidth={1.6} className="h-9 w-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V4.5m0 0L7 9.5m5-5 5 5M4.5 19.5h15" />
        </svg>
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
          Drop anywhere to load
        </p>
      </div>
    </div>
  )
}
