const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export async function POST(req: Request) {
  const { name, genre } = await req.json()

  const res = await fetch(
    "https://api.github.com/repos/mkt501881-art/status/contents/status.json",
    {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    }
  )

  const data = await res.json()

  const content = JSON.parse(
    Buffer.from(data.content, "base64").toString()
  )

  content.push({
    name,
    status: "available",
    genre
  })

  await fetch(
    "https://api.github.com/repos/mkt501881-art/status/contents/status.json",
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `add ${name}`,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
        sha: data.sha
      })
    }
  )

  return Response.json({ ok: true })
}
