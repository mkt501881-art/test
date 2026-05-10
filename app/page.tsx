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
  const [menuOpen, setMenuOpen] = useState(false)

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
    <div style={{ padding: 20 }}>

      {/* ✅ ハンバーガーボタン */}
      <button
        onClick={() => setMenuOpen(true)}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          width: 40,
          height: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          outline: "none"
        }}
      >
        <span style={{ height: 3, background: "black", width: "28px" }} />
        <span style={{ height: 3, background: "black", width: "28px" }} />
        <span style={{ height: 3, background: "black", width: "28px" }} />
      </button>

      {/* ✅ 背景（クリックで閉じる） */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            zIndex: 999
          }}
        />
      )}

      {/* ✅ サイドメニュー */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "250px",
          height: "100%",
          background: "#fff",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
          padding: 20,
          zIndex: 1000,

          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease"
        }}
      >
        {/* 閉じる */}
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            fontSize: "20px",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          ✕
        </button>

        {/* ✅ ユーザー情報 */}
        <p style={{ marginTop: 20, fontSize: "14px" }}>
          ログイン中：
        </p>
        <p>
          <b>{session?.user?.email}</b>
        </p>

        {/* ✅ ログアウト */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            marginTop: 10,
            padding: "6px 12px",
            border: "1px solid black",
            cursor: "pointer",
            color: "red"
          }}
        >
          ログアウト
        </button>

        {/* ✅ 区切り */}
        <hr style={{ margin: "20px 0" }} />

        {/* ✅ ホーム */}
        <p
          onClick={() => {
            router.push("/")
            setMenuOpen(false)
          }}
          style={{
            cursor: "pointer"
          }}
        >
          🏠 ホーム
        </p>
      </div>

      {/* ✅ タイトル */}
      <h1 style={{ fontSize: "32px", marginTop: 10 }}>
        貸し出し状況
      </h1>

      <p>最終更新: {updatedAt}</p>

      <button
        onClick={() => location.reload()}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          border: "2px solid black",
          cursor: "pointer"
        }}
      >
        更新
      </button>

      {/* ✅ カード一覧 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 300px))",
          gap: "20px",
        }}
      >
        {data.map(item => (
          <div
            key={item.name}
            onClick={() => router.push(`/item/${item.name}`)}

            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px) scale(1)"
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.2)"
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)"
            }}

            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(-5px) scale(0.96)"
              e.currentTarget.style.boxShadow = "0 5px 12px rgba(0,0,0,0.2)"
            }}

            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-5px) scale(1)"
              e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.2)"
            }}

            onTouchStart={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(0.96)"
            }}

            onTouchEnd={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
            }}

            style={{
              cursor: "pointer",
              border: "2px solid black",
              padding: 20,
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
          データが読み込めていません
        </p>
      )}
    </div>
  )
}
