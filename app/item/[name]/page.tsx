"use client"

import { useParams } from "next/navigation"

export default function ItemPage() {
  const params = useParams()
  const name = params.name

  return (
    <div style={{ padding: 40 }}>
      <h1>{name} の詳細ページ</h1>

      <p>ここに詳細情報を書く</p>
    </div>
  )
}
``
