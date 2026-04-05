import type { RequestHandler } from './$types'

export const GET: RequestHandler = () => {
  const body = `User-agent: *
Allow: /
Disallow: /auth
Disallow: /posts/*/edit
Disallow: /posts/*/delete
Disallow: /posts/new

Sitemap: /sitemap.xml
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' }
  })
}
