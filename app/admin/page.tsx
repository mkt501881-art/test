"use client"

import { useEffect, useState } from "react"

type Item = {
  name: string
  status: "available" | "using"
  genre: string
}

export default function AdminPage() {
  const [data, setData] = useState<Item[]>([])

  const [newName, setNewName] = useState("")
  const [newGenre, setNewGenre] = useState("マンガ")

  // ✅ 読み込み
  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(setData)
  }, [])

  // ✅ 追加
  const addItem = async () => {
    if (!newName) return

    await fetch("/api/add", {
      method: "POST",
      body: JSON.stringify({
        name: newName,
        genre: newGenre
      })
    })

    location.reload()
  }

  // ✅ 削除
  const deleteItem = async (name: string) => {
    await fetch("/api/delete", {
      method: "POST",
      body: JSON.stringify({ name })
    })

    location.reload()
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>管理画面</h1>

      {/* ✅ 追加フォーム */}
      <div style={{ marginTop: 20 }}>
        <input
          placeholder="本の名前"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <select
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
        >
          <option>マンガ</option>
          <option>ライトノベル</option>
          <option>小説</option>
          <option>その他</option>
        </select>

        <button onClick={addItem}>
          追加
        </button>
      </div>

      {/* ✅ 一覧 */}
      <div style={{ marginTop: 30 }}>
        {data.map(item => (
          <div key={item.name} style={{
            marginBottom: 10,
            padding: 10,
            border: "1px solid #ccc"
          }}>
            {item.name}（{item.genre}）

            <button
              onClick={() => deleteItem(item.name)}
              style={{ marginLeft: 10, color: "red" }}
            >
              削除
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
``
