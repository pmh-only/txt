import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import type { RequestHandler } from './$types'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin

  const posts = await db
    .select({
      id: post.id,
      title: post.title,
      alias: post.alias,
      contentPreview: post.contentPreview,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    })
    .from(post)
    .where(eq(post.visibility, 'PUBLIC'))
    .orderBy(desc(post.id))
    .limit(20)

  const items = posts
    .map((p) => {
      const link = `${origin}/posts/${p.alias}`
      const pubDate = new Date(p.createdAt).toUTCString()
      const description = p.contentPreview
        ? escapeXml(p.contentPreview)
        : escapeXml(`${p.title} — read on txt.`)
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`
    })
    .join('\n')

  const lastBuildDate =
    posts.length > 0 ? new Date(posts[0].createdAt).toUTCString() : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>txt.</title>
    <link>${origin}/</link>
    <description>A minimalist writing space.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
