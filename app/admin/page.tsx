"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ADMIN_EMAILS } from "@/lib/admin"

type Item = {
  name: string
  status: "available" | "using"
  genre: string
  location?: string
  owner?: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [data, setData] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const [newName, setNewName] = useState("")
  const [newGenre, setNewGenre] = useState("マンガ")

  // ✅ 編集状態
  const [editingName, setEditingName] = useState<string | null>(null)

  const [editName, setEditName] = useState("")
  const [editGenre, setEditGenre] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editOwner, setEditOwner] = useState("")

  // ✅ アクセス制御
  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.email) {
      router.push("/")
      return
    }

    if (!ADMIN_EMAILS.includes(session.user.email)) {
      router.push("/")
    }
  }, [session, status])

  // ✅ データ取得
  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
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

  if (loading) {
    return <p style={{ padding: 40 }}>読み込み中...</p>
  }

  return (
    <div style={{ padding: 20 }}>

      <h1>⚙ 管理画面</h1>

      <p>ログイン: {session?.user?.email}</p>

      {/* ✅ 追加 */}
      <div style={{ marginTop: 20 }}>
        <h2>本の追加</h2>

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

        <button onClick={addItem}>追加</button>
      </div>

      {/* ✅ 一覧 */}
      <div style={{ marginTop: 30 }}>
        <h2>本一覧</h2>

        {data.map(item => (

          <div key={item.name} style={{
            marginBottom: 10,
            padding: 10,
            border: "1px solid #ccc"
          }}>

            {/* ✅ 編集モード */}
            {editingName === item.name ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <select
                  value={editGenre}
                  onChange={(e) => setEditGenre(e.target.value)}
                >
                  <option>マンガ</option>
                  <option>ライトノベル</option>
                  <option>小説</option>
                  <option>その他</option>
                </select>

                <input
                  placeholder="保管場所"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />

                <input
                  placeholder="出品者"
                  value={editOwner}
                  onChange={(e) => setEditOwner(e.target.value)}
                />

                <button
                  onClick={async () => {
                    await fetch("/api/update", {
                      method: "POST",
                      body: JSON.stringify({
                        originalName: item.name,
                        name: editName,
                        genre: editGenre,
                        location: editLocation,
                        owner: editOwner
                      })
                    })

                    location.reload()
                  }}
                >
                  保存
                </button>

                <button onClick={() => setEditingName(null)}>
                  キャンセル
                </button>
              </>

            ) : (

              <>
                {item.name}（{item.genre}）

                <button onClick={() => {
                  setEditingName(item.name)
                  setEditName(item.name)
                  setEditGenre(item.genre)
                  setEditLocation(item.location || "")
                  setEditOwner(item.owner || "")
                }}>
                  編集
                </button>

                <button
                  onClick={() => deleteItem(item.name)}
                  style={{ marginLeft: 10, color: "red" }}
                >
                  削除
                </button>
              </>
            )}

          </div>

        ))}
      </div>

    </div>
  )
}
