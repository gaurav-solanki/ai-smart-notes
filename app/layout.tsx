import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeModeProvider } from '@/components/theme-mode-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AI Smart Notes Lite',
  description: 'A modern AI-powered note-taking app with smart summarization and task extraction.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeModeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeModeProvider>
      </body>
    </html>
  )
}
