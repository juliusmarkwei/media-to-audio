import { FORMATS, type FormatId } from '../lib/formats'
import Select from './Select'

interface ControlsPanelProps {
  formatId: FormatId
  onFormatChange: (id: FormatId) => void
  bitrate: string
  onBitrateChange: (bitrate: string) => void
  isTrimmed: boolean
  onConvert: () => void
  isBusy: boolean
  progress: number
  statusMessage: string
}

export default function ControlsPanel({
  formatId,
  onFormatChange,
  bitrate,
  onBitrateChange,
  isTrimmed,
  onConvert,
  isBusy,
  progress,
  statusMessage,
}: ControlsPanelProps) {
  const format = FORMATS.find((f) => f.id === formatId)!

  const formatOptions = FORMATS.map((f) => ({ value: f.id, label: f.label }))
  const qualityOptions = format.qualities?.map((q) => ({
    value: q.value,
    label: q.label,
    hint: `${q.value}bps`,
    recommended: q.recommended,
  }))

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Output format</label>
          <Select
            ariaLabel="Output format"
            value={formatId}
            onChange={(id) => onFormatChange(id as FormatId)}
            options={formatOptions}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Quality</label>
          {qualityOptions ? (
            <Select ariaLabel="Quality" value={bitrate} onChange={onBitrateChange} options={qualityOptions} />
          ) : (
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400">
              Lossless — no quality setting
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onConvert}
        disabled={isBusy}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-500 hover:shadow-indigo-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
      >
        {isBusy ? (
          <>
            <svg className="h-4 w-4 animate-spin text-white/80" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-90" d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span>{statusMessage || 'Working…'}</span>
          </>
        ) : (
          <span>
            {isTrimmed ? 'Trim & Convert' : 'Convert'} to {format.label}
          </span>
        )}
      </button>

      {isBusy && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
