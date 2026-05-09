"use client"

import { useEffect, useState } from "react"

type Item = {
  name: string
  status: "available" | "using"
}

export default function Page() {
  const [data, setData] = useState<Item[]>([])
  const [updatedAt, setUpdatedAt] = useState("")

useEffect(() => {
  fetch(
    "https://raw.githubusercontent.com/あなたのユーザー名/リポジトリ名/main/status.json?t=" + Date.now(),
    { cache: "no-store" }
  )
    .then(res => res.json())
    .then(data => {
      console.log(data) // ← 動作確認用（後で消してOK）
      setData(data)
      setUpdatedAt(new Date().toLocaleTimeString())
    })
}, [])

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: "40px" }}>貸し出し状況</h1>

      <p>最終更新: {updatedAt}</p>

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
              ></div>

              <span
                style={{
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
    </div>
  )
}
