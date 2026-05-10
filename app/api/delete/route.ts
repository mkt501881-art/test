const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export async function POST(req: Request) {
  const { name } = await req.json()

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

  const updated = content.filter((item: any) => item.name !== name)

  await fetch(
    "https://api.github.com/repos/mkt501881-art/status/contents/status.json",
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `delete ${name}`,
        content: Buffer.from(JSON.stringify(updated, null, 2)).toString("base64"),
        sha: data.sha
      })
    }
  )

  return Response.json({ ok: true })
}
