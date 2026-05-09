"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"

type Item = {
  name: string
  status: string
  location: string
  owner: string
}

export default function ItemPage() {
  const params = useParams()
  const name = params.name
  const router = useRouter()

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

  return (
    <div style={{ padding: 40 }}>
      
      <button
  onClick={() => router.push("/")}
  style={{
    marginBottom: 20,
    padding: "8px 16px",
    border: "2px solid black",
    cursor: "pointer",
  }}
>
  ← ホームに戻る
</button>
      
      {/* タイトル */}
      <h1 style={{ fontSize: "32px", marginBottom: 20 }}>
        {item.name}
      </h1>

      {/* 情報 */}
      <p>保管場所: {item.location}</p>
      <p>出品者: {item.owner}</p>

      <p>
        状態:{" "}
        <span
          style={{
            color: item.status === "available" ? "green" : "red",
          }}
        >
          {item.status === "available"
            ? "貸し出し可能"
            : "貸し出し中"}
        </span>
      </p>
    </div>
  )
}
``
