import { useCallback, useEffect, useState } from 'react'
import { getCookie, setCookie } from '../lib/cookies'

export type Theme = 'light' | 'dark'

function readInitialTheme(): Theme {
  const cookie = getCookie('theme')
  if (cookie === 'light' || cookie === 'dark') return cookie
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    setCookie('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
