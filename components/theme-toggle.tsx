'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-mode-provider'
import { Button } from './ui/button'
import { useContext } from 'react'
import { ThemeContext } from './theme-mode-provider'

export function ThemeToggle() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    return null
  }

  const { isDark, setTheme } = context

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="rounded-full"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}
