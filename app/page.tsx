"use client"

export const dynamic = "force-dynamic"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"

type Item = {
  name: string
  status: "available" | "using"
}

export default function Page() {
  const { data: session } = useSession()
  const router = useRouter()
  
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
      
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 300px))",
    gap: "40px",
  }}
>
        {data.map(item => (
<div
  key={item.name}
  onClick={() => router.push(`/item/${item.name}`)}

  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.96)"
    e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)"
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.transform = "scale(1)"
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)"
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)"
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)"
  }}
  onTouchStart={(e) => {
    e.currentTarget.style.transform = "scale(0.96)"
  }}
  onTouchEnd={(e) => {
    e.currentTarget.style.transform = "scale(1)"
  }}

  style={{
    cursor: "pointer",
    border: "2px solid black",
    padding: 20,
    width: "300px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    background: "#fff",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
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
