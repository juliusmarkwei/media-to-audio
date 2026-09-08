import { useEffect, useRef, useState } from 'react'

function hasFiles(e: DragEvent): boolean {
  return Array.from(e.dataTransfer?.types ?? []).includes('Files')
}

export function useWindowFileDrop(onDropFile: (file: File) => void) {
  const [isDragging, setIsDragging] = useState(false)
  const depth = useRef(0)

  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      depth.current += 1
      setIsDragging(true)
    }

    const onDragOver = (e: DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
    }

    const onDragLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return
      const leftWindow = e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight
      depth.current = leftWindow ? 0 : Math.max(0, depth.current - 1)
      if (depth.current === 0) setIsDragging(false)
    }

    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      depth.current = 0
      setIsDragging(false)
      const file = e.dataTransfer?.files?.[0]
      if (file) onDropFile(file)
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [onDropFile])

  return isDragging
}
