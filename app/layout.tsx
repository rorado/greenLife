import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'AgriSmart - AI-Powered Smart Farming',
  description: 'Helping farmers choose the best crops using weather and location data. Optimize your yield with AI-driven precision agriculture.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#416f1f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
