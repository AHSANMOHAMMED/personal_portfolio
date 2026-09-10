const MODEL = 'openai/gpt-oss-20b'

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return Response.json(
      { error: 'Server configuration error: Missing API Key' },
      { status: 500 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { messages } = body || {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: 'Messages must be a non-empty array' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 300,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Groq API Error:', data)
      return Response.json(
        { error: data?.error?.message || 'Failed to fetch from Groq' },
        { status: response.status }
      )
    }

    return Response.json(data)
  } catch (error) {
    console.error('Groq API Error:', error)
    return Response.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
