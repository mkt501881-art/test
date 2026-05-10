"use client"

import { SessionProvider } from "next-auth/react"
import { Noto_Sans_JP } from "next/font/google"

const noto = Noto_Sans_JP({
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={noto.className}>   {/* ← ここ追加 ✅ */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
