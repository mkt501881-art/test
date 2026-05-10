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
  }, [])

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "100vh" }}>

      {/* ✅ ハンバーガー */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          position: "fixed",   // ← もう一回これに戻す✅
          top: 86,
          left: 72,

          marginBottom: 10,
          width: 40,
          height: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "5px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          outline: "none",
          zIndex: 1100
        }}
      >
        <span style={{
          height: 2,
          background: "black",
          width: "24px",
          transition: "0.3s",
          transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none"
        }} />
        <span style={{
          height: 2,
          background: "black",
          width: "24px",
          transition: "0.3s",
          opacity: menuOpen ? 0 : 1
        }} />
        <span style={{
          height: 2,
          background: "black",
          width: "24px",
          transition: "0.3s",
          transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none"
        }} />
      </button>

      {/* ✅ 背景 */}
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

      {/* ✅ メニュー */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "250px",
        height: "100%",
        background: "#fff",
        boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        padding: 20,
        paddingTop: 60,
        zIndex: 1000,
        transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease"
      }}>
        <p style={{ fontSize: "13px" }}>ログイン中</p>
        <p><b>{session?.user?.email}</b></p>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            marginTop: 10,
            padding: "6px 12px",
            border: "none",
            background: "#ffecec",
            color: "#cc0000",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          ログアウト
        </button>

        <hr style={{ margin: "20px 0" }} />

        <p
          onClick={() => {
            router.push("/")
            setMenuOpen(false)
          }}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          🏠 ホーム
        </p>
      </div>

      {/* ✅ タイトル */}
      <h1 style={{ fontSize: "28px" }}>貸し出し状況</h1>

      <p style={{ color: "#555" }}>最終更新: {updatedAt}</p>

      <button
        onClick={() => location.reload()}
        style={{
          marginTop: 10,
          marginBottom: 20,
          padding: "8px 14px",
          border: "none",
          background: "#007bff",
          color: "#fff",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        更新
      </button>

      {/* ✅ カード */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 300px))",
        gap: 20
      }}>
        {data.map(item => (
          <div
            key={item.name}
            onClick={() => router.push(`/item/${item.name}`)}
            style={{
              padding: 20,
              borderRadius: "16px",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              cursor: "pointer"
            }}
          >
            <h2 style={{ marginBottom: 10 }}>{item.name}</h2>

            <span style={{
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "bold",
              background:
                item.status === "available" ? "#e6f9ed" : "#fdeaea",
              color:
                item.status === "available" ? "#0a8f3d" : "#c80000"
            }}>
              {item.status === "available" ? "貸出可" : "貸出中"}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
