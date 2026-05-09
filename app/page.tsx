"use client"

import { useEffect, useState } from "react"

type Item = {
  name: string
  status: "available" | "using"
}

export default function Page() {
  const [data, setData] = useState<Item[]>([])

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/mkt501881-art/test/refs/heads/main/status.json")
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: "40px" }}>貸し出し状況</h1>

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
