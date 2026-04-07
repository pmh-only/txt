import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { pingIndexNow } from '$lib/server/indexnow'
import { validateToken } from '$lib/server/crypto'
import type { RequestHandler } from './$types'

function urlToAlias(url: string): string {
  try {
    const u = new URL(url)
    return (u.hostname + u.pathname + u.search)
      .toLowerCase()
      .replace(/[^\w]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
  } catch {
    return 'bookmark'
  }
}

async function generateDescription(
  title: string,
  url: string,
  content: string
): Promise<string> {
  const res = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "You are a concise content curator. Given a web page's title, URL, and content, write a single plain-text description under 150 characters. Be direct and specific. No quotes, no labels, no explanation."
          },
          {
            role: 'user',
            content: `Title: ${title}\nURL: ${url}\nContent:\n${content || '(no content extracted)'}`
          }
        ],
        max_tokens: 60,
        temperature: 0.5
      })
    }
  )

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(
      body.error?.message ?? `OpenAI error ${res.status}`
    )
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

export const POST: RequestHandler = async ({ request }) => {
  const auth = request.headers.get('authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!validateToken(token)) {
    error(401, { message: 'Unauthorized' })
  }

  const { url, title, content } = await request.json()

  const alias = urlToAlias(url)

  const [existing] = await db
    .select({ alias: post.alias })
    .from(post)
    .where(eq(post.alias, alias))
    .limit(1)

  if (existing) {
    return json({ duplicate: true, alias: existing.alias })
  }

  if (!env.OPENAI_API_KEY) {
    error(503, {
      message: 'OpenAI API key not configured on server.'
    })
  }

  let description: string
  try {
    description = await generateDescription(title, url, content)
  } catch (err) {
    error(502, {
      message:
        err instanceof Error ? err.message : 'Generation failed'
    })
  }

  const htmlContent = `<p>${description}</p>\n<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>`

  const [inserted] = await db
    .insert(post)
    .values({
      title,
      alias,
      content: htmlContent,
      contentPreview:
        description.slice(0, 47) +
        (description.length > 47 ? '...' : ''),
      visibility: 'PUBLIC',
      type: 'bookmark',
      sourceUrl: url
    })
    .returning()

  void pingIndexNow(new URL(request.url).origin, `/posts/${alias}`)

  return json(
    { duplicate: false, alias: inserted.alias },
    { status: 201 }
  )
}
