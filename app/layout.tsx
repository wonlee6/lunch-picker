import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import QueryProvider from '@/components/providers/QueryProvider'
import { Toaster } from '@/components/common/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: '오늘 점심 뭐 먹지?',
  description: '회사 근처 점심 메뉴를 랜덤으로 추천해주는 애플리케이션'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
