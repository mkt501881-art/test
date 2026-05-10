export async function GET() {
  const res = await fetch(
    "https://raw.githubusercontent.com/mkt501881-art/status/refs/heads/main/status.json"
  )

  const data = await res.json()

  return Response.json(data)
}
