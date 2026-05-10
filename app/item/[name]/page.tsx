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
}

export default function ItemPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()

  const name = params.name

  const [item, setItem] = useState<Item | null>(null)

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/mkt501881-art/status/refs/heads/main/status.json?t=" + Date.now(),
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then((data: Item[]) => {
        const found = data.find(i => i.name === name)
        setItem(found || null)
      })
  }, [name])

  if (!item) {
    return <p style={{ padding: 40 }}>読み込み中...</p>
  }

  const isAvailable = item.status === "available"

  return (
    <div style={{
      background: "#f5f5f5",
      minHeight: "100vh",
      padding: 20
    }}>

      {/* ✅ 戻る */}
      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: 20,
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: "14px"
        }}
      >
        ← ホームに戻る
      </button>

      {/* ✅ メインカード */}
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        background: "#fff",
        padding: 20,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>

        {/* ✅ タイトル */}
        <h1 style={{ marginBottom: 10 }}>{item.name}</h1>

        {/* ✅ ステータス */}
        <span style={{
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: "bold",
          background:
            isAvailable ? "#e6f9ed" : "#fdeaea",
          color:
            isAvailable ? "#0a8f3d" : "#c80000"
        }}>
          {isAvailable ? "貸出可" : "貸出中"}
        </span>

        {/* ✅ 情報セクション */}
        <div style={{ marginTop: 20 }}>

          <p style={{ color: "#888", fontSize: "13px" }}>
            保管場所
          </p>
          <p>{item.location || "不明"}</p>

          <p style={{ color: "#888", fontSize: "13px", marginTop: 15 }}>
            出品者
          </p>
          <p>{item.owner || "不明"}</p>

          <p style={{ color: "#888", fontSize: "13px", marginTop: 15 }}>
  ジャンル
</p>
<p>{item.genre || "不明"}</p>

        </div>

        {/* ✅ 申請ボタン */}
        <button
          disabled={!isAvailable}
          onClick={async () => {
            if (!session?.user?.email) {
              alert("ログインしてください")
              return
            }

            if (!isAvailable) {
              alert("現在貸し出し中です")
              return
            }

            try {
              const res = await fetch(
                "https://test-discord-production.up.railway.app/request",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    name: item.name,
                    user: session.user.email,
                    location: item.location,
                    owner: item.owner
                  })
                }
              )

              if (!res.ok) {
                throw new Error("送信失敗")
              }

              alert("✅ 申請を送信しました")

            } catch (err) {
              console.error(err)
              alert("❌ 送信に失敗")
            }
          }}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: isAvailable ? "#007bff" : "#ccc",
            color: "#fff",
            cursor: isAvailable ? "pointer" : "not-allowed",
            fontWeight: "bold"
          }}
        >
          {isAvailable ? "📦 貸し出し申請" : "❌ 貸し出し中"}
        </button>

      </div>
    </div>
  )
}
