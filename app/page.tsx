"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"

type Item = {
  name: string
  status: "available" | "using"
}

export default function Page() {
  const { data: session } = useSession()

  const [data, setData] = useState<Item[]>([])
  const [updatedAt, setUpdatedAt] = useState("")

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/mkt501881-art/status/refs/heads/main/status.json?t=" + Date.now(),
      { cache: "no-store" }
    )
      .then(res => res.json())
      .then(data => {
        setData(data)
        setUpdatedAt(new Date().toLocaleTimeString())
      })
      .catch(err => {
        console.error("読み込みエラー:", err)
      })
  }, [])

  return (
    <div style={{ padding: 40 }}>
      {/* 🔐 上部ユーザー情報＋ログアウト */}
      <div style={{ marginBottom: 20 }}>
        <p>ログイン中：{session?.user?.email}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            padding: "8px 16px",
            border: "2px solid black",
            cursor: "pointer",
          }}
        >
          ログアウト
        </button>
      </div>

      <h1 style={{ fontSize: "40px", marginBottom: 20 }}>
        貸し出し状況
      </h1>

      <p style={{ marginBottom: 20 }}>
        最終更新: {updatedAt}
      </p>

      <button
        onClick={() => location.reload()}
        style={{
          marginBottom: 30,
          padding: "10px 20px",
          border: "2px solid black",
          cursor: "pointer",
        }}
      >
        更新
      </button>

      <div style={{ display: "flex", gap: 40 }}>
        {data.map(item => (
          <div
            key={item.name}
            style={{
              border: "4px solid black",
              padding: 20,
              width: 300,
            }}
          >
            <h2>{item.name}</h2>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background:
                    item.status === "available" ? "green" : "red",
                }}
              />

              <span
                style={{
                  fontWeight: "bold",
                  color:
                    item.status === "available" ? "green" : "red",
                }}
              >
                {item.status === "available"
                  ? "貸し出し可能"
                  : "貸し出し中"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <p style={{ marginTop: 20 }}>
          データが読み込めていません（URL or JSON確認）
        </p>
      )}
    </div>
  )
}
