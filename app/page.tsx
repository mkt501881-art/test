"use client"

export const dynamic = "force-dynamic"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"

type Item = {
  name: string
  status: "available" | "using"
  genre: string
}

const genreOrder = ["マンガ", "ライトノベル", "小説", "その他"]

export default function Page() {
  const { data: session } = useSession()
  const router = useRouter()

  const [data, setData] = useState<Item[]>([])
  const [updatedAt, setUpdatedAt] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  // ✅ 追加：検索
  const [search, setSearch] = useState("")

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

  // ✅ 検索フィルタ
  const filtered = data.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.genre.includes(search)
  )

  // ✅ グループ分け
  const grouped = filtered.reduce((acc: Record<string, Item[]>, item) => {
    if (!acc[item.genre]) acc[item.genre] = []
    acc[item.genre].push(item)
    return acc
  }, {})

  const sortedGenres = genreOrder.filter(g => grouped[g])

  // ✅ スクロール
  const scrollToGenre = (genre: string) => {
    const el = document.getElementById(`genre-${genre}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMenuOpen(false)
  }

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "100vh" }}>

      {/* ハンバーガー */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          position: "fixed",
          top: 15,
          left: 30,
          width: 40,
          height: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "5px",
          background: "none",
          border: "none",
          cursor: "pointer",
          outline: "none",
          zIndex: 1100
        }}
      >
        <span style={{
          height: 2, background: "black", width: "24px",
          transition: "0.3s",
          transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none"
        }} />
        <span style={{
          height: 2, background: "black", width: "24px",
          transition: "0.3s",
          opacity: menuOpen ? 0 : 1
        }} />
        <span style={{
          height: 2, background: "black", width: "24px",
          transition: "0.3s",
          transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none"
        }} />
      </button>

      {/* 背景 */}
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

      {/* メニュー */}
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
        transition: "0.3s"
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

        <hr style={{ margin: "20px 0" }} />

        <p style={{ fontSize: "13px", color: "#888" }}>ジャンル</p>

        {genreOrder.map(g => (
          <p key={g}
            onClick={() => scrollToGenre(g)}
            style={{ cursor: "pointer", padding: "6px 8px" }}>
            {g}
          </p>
        ))}
      </div>

      {/* タイトル */}
      <h1 style={{ fontSize: "28px" }}>貸し出し状況</h1>
      <p style={{ color: "#555" }}>最終更新: {updatedAt}</p>

      {/* ✅ 検索バー */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="タイトル・ジャンルで検索"
        style={{
          width: "100%",
          padding: "10px",
          marginTop: 10,
          marginBottom: 20,
          borderRadius: "8px",
          border: "1px solid #ccc"
        }}
      />

      {/* ✅ データなし */}
      {filtered.length === 0 && (
        <p style={{ color: "#888" }}>
          見つかりませんでした
        </p>
      )}

      {/* ✅ ジャンルごと表示 */}
      {sortedGenres.map((genre) => (
        <div key={genre} id={`genre-${genre}`} style={{ marginBottom: 30 }}>
          <h2 style={{
            marginBottom: 10,
            fontSize: "18px",
            borderLeft: "4px solid #007bff",
            paddingLeft: 8
          }}>
            {genre}
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 300px))",
            gap: 20
          }}>
            {grouped[genre].map(item => (
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
                <h3>{item.name}</h3>

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
      ))}
    </div>
  )
}
