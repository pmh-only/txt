import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin

  const posts = await db
    .select({
      alias: post.alias,
      id: post.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    })
    .from(post)
    .where(eq(post.visibility, 'PUBLIC'))

  const postEntries = posts
    .map((p) => {
      const loc = `${origin}/posts/${p.alias}`
      const lastmod = new Date(p.updatedAt ?? p.createdAt)
        .toISOString()
        .split('T')[0]
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${postEntries}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
