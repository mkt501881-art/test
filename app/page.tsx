"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <button onClick={() => signIn("google")}>
        Googleでログイン
      </button>
    )
  }

  return (
    <>
      <p>ログイン中：{session.user?.email}</p>
<button onClick={() => signOut({ callbackUrl: "/" })}>
  ログアウト
</button>
    </>
  )
}
