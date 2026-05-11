"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Item = {
  name: string
  status: string
  location: string
  owner: string
  genre: string
  borrower?: {
    email: string
  } | null
}

export default function ItemPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()

  const name = params.name

  const [item, setItem] = useState<Item | null>(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email)
    }
  }, [session])

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/mkt501881-art/status/refs/heads/main/status.json?t=" + Date.now()
    )
      .then(res => res.json())
      .then((data: Item[]) => {
        const found = data.find(i => i.name === name)
        setItem(found || null)
      })
  }, [name])

  if (!item) return <p style={{ padding: 40 }}>読み込み中...</p>

  // ✅ 状態判定
  const isAvailable = item.status === "available"
  const isPending = item.status === "pending"
  const isMine = item.borrower?.email === email

  return (
    <div style={{ padding: 20 }}>

      <button onClick={() => router.push("/")}>
        ← 戻る
      </button>

      <h1>{item.name}</h1>

      {/* ✅ 状態表示 */}
      <p>
        状態: {
          isAvailable ? "貸出可" :
          isPending ? "申請中" :
          "貸出中"
        }
      </p>

      {/* ✅ ボタン分岐 */}

      {/* 申請 */}
      {isAvailable && (
        <button
          onClick={async () => {
            await fetch("https://test-discord-production.up.railway.app/request", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: item.name,
                user: email
              })
            })
            alert("申請しました")
            location.reload()
          }}
        >
          📦 申請
        </button>
      )}

      {/* ✅ 自分の申請 → 取消 */}
      {isPending && isMine && (
        <button
          onClick={async () => {
            await fetch("https://test-discord-production.up.railway.app/cancel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: item.name,
                user: email
              })
            })
            alert("取消しました")
            location.reload()
          }}
          style={{ background: "#ff5722", color: "#fff" }}
        >
          ↩ 申請取消
        </button>
      )}

      {/* 他人の申請 or 使用中 */}
      {!isAvailable && !isMine && (
        <button disabled>
          利用不可
        </button>
      )}

    </div>
  )
}
