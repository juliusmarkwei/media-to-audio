import { useCallback, useRef, useState } from 'react'
import { ACCEPTED_INPUT_EXTENSIONS } from '../lib/formats'

interface DropzoneProps {
  onFile: (file: File) => void
}

export default function Dropzone({ onFile }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0]
      if (file) onFile(file)
    },
    [onFile],
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors sm:p-14 ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-7 w-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V4.5m0 0L7 9.5m5-5 5 5M4.5 16.5v2A2.5 2.5 0 0 0 7 21h10a2.5 2.5 0 0 0 2.5-2.5v-2" />
        </svg>
      </div>
      <p className="text-base font-medium text-slate-700">Drop an audio file here, or click to browse</p>
      <p className="text-sm text-slate-400">MP3, M4A, WAV, OGG, FLAC, AAC, OPUS and more</p>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_INPUT_EXTENSIONS.map((ext) => `.${ext}`).concat('audio/*').join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
