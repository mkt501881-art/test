"use client"

import { Noto_Sans_JP } from "next/font/google"
import { SessionProvider } from "next-auth/react"

const noto = Noto_Sans_JP({
  subsets: ["latin"],
})

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={noto.className}>
        {children}
      </body>
    </html>
  )
}
