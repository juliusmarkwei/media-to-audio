import * as RadixSelect from '@radix-ui/react-select'

export interface SelectOption {
  value: string
  label: string
  hint?: string
  recommended?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  ariaLabel: string
  disabled?: boolean
}

export default function Select({ value, onChange, options, ariaLabel, disabled }: SelectProps) {
  const selected = options.find((o) => o.value === value)

  return (
    <RadixSelect.Root value={value} onValueChange={onChange} disabled={disabled}>
      <RadixSelect.Trigger
        aria-label={ariaLabel}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition-colors hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[state=open]:border-indigo-400 data-[state=open]:ring-2 data-[state=open]:ring-indigo-100"
      >
        <RadixSelect.Value>
          {selected && (
            <span className="flex items-baseline gap-1.5">
              <span>{selected.label}</span>
              {selected.hint && <span className="text-xs font-normal text-slate-400">{selected.hint}</span>}
            </span>
          )}
        </RadixSelect.Value>
        <RadixSelect.Icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8 9 4-4 4 4M8 15l4 4 4-4" />
          </svg>
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60"
        >
          <RadixSelect.Viewport className="p-1.5">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className="flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-700 data-[state=checked]:font-semibold data-[state=checked]:text-indigo-600"
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                {opt.hint && <span className="text-xs font-normal text-slate-400">{opt.hint}</span>}
                {opt.recommended && (
                  <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                    Recommended
                  </span>
                )}
                <RadixSelect.ItemIndicator className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
