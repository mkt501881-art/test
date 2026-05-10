"use client"

import { SessionProvider } from "next-auth/react"
import { Noto_Sans_JP } from "next/font/google"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
