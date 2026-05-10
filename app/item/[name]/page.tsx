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
  const [showForm, setShowForm] = useState(false)

  const [email, setEmail] = useState("")
  const [studentName, setStudentName] = useState("")
  const [className, setClassName] = useState("")
  const [number, setNumber] = useState("")

  // ✅ 自動解析（ここ重要）
useEffect(() => {
  if (!session?.user?.email || !session?.user?.name) return

  const raw = session.user.name

  if (raw.length >= 5) {
    const grade = raw[0]              // 学年
    const cls = raw[1]                // 組
    const num = raw.slice(2, 4)       // 出席番号
    const realName = raw.slice(4)     // 名前

    setEmail(session.user.email)
    setClassName(`${grade}年${cls}組`)  // ← ここ重要 ✅
    setNumber(num)
    setStudentName(realName)
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

  if (!item) {
    return <p style={{ padding: 40 }}>読み込み中...</p>
  }

  const isAvailable = item.status === "available"

  const genreColor: Record<string, string> = {
    マンガ: "#ff9800",
    ライトノベル: "#9c27b0",
    小説: "#2196f3",
    その他: "#607d8b"
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>

      {/* 戻る */}
      <button
        onClick={() => router.push("/")}
        style={{ marginBottom: 20, border: "none", background: "none", cursor: "pointer" }}
      >
        ← ホームに戻る
      </button>

      {/* カード */}
      <div style={{
        maxWidth: "500px",
        margin: "0 auto",
        background: "#fff",
        padding: 20,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>

        <h1>{item.name}</h1>

        {/* 状態 */}
        <span style={{
          padding: "6px 12px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: "bold",
          background: isAvailable ? "#e6f9ed" : "#fdeaea",
          color: isAvailable ? "#0a8f3d" : "#c80000"
        }}>
          {isAvailable ? "貸出可" : "貸出中"}
        </span>

        {/* ジャンル */}
        <p style={{ color: "#888", marginTop: 20 }}>ジャンル</p>
        <span style={{
          padding: "6px 12px",
          borderRadius: "999px",
          background: genreColor[item.genre] || "#ccc",
          color: "#fff",
          fontSize: "12px"
        }}>
          {item.genre}
        </span>

        {/* 情報 */}
        <div style={{ marginTop: 15 }}>
          <p style={{ color: "#888" }}>保管場所</p>
          <p>{item.location || "不明"}</p>

          <p style={{ color: "#888", marginTop: 10 }}>出品者</p>
          <p>{item.owner || "不明"}</p>
        </div>

        {/* ボタン */}
        <button
          disabled={!isAvailable}
          onClick={() => setShowForm(!showForm)}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: isAvailable ? "#007bff" : "#ccc",
            color: "#fff"
          }}
        >
          {isAvailable ? "📦 貸し出し申請" : "貸し出し中"}
        </button>

        {/* ✅ 確認UI */}
        {showForm && (
          <div style={{ marginTop: 20 }}>

            <p style={{ fontWeight: "bold", marginBottom: 10 }}>
              こちらの情報で間違いありませんか？
            </p>

            <div style={{
              background: "#eee",
              padding: 12,
              borderRadius: 8,
              fontSize: 14
            }}>
              <p>メール: {email}</p>
              <p>名前: {studentName}</p>
              <p>組: {className}</p>
              <p>出席番号: {number}</p>
            </div>

            <button
              onClick={async () => {
                try {
                  await fetch("https://test-discord-production.up.railway.app/request", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: item.name,
                      user: email,
                      location: item.location,
                      owner: item.owner,
                      className,
                      number,
                      studentName
                    })
                  })

                  alert("✅ 申請しました")
                  setShowForm(false)

                } catch {
                  alert("❌ 失敗")
                }
              }}
              style={{
                marginTop: 15,
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#28a745",
                color: "#fff"
              }}
            >
              申請する
            </button>

          </div>
        )}

      </div>
    </div>
  )
}
