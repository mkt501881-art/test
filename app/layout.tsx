"use client"

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
      <body className={noto.className}>
        {children}
      </body>
    </html>
  )
}
