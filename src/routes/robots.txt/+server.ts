import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ url }) => {
  const sitemap = `${url.protocol}//${url.host}/sitemap.xml`

  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /auth\nDisallow: /posts/*/edit\nDisallow: /posts/*/delete\nDisallow: /posts/new\n\nSitemap: ${sitemap}\n`,
    { headers: { 'Content-Type': 'text/plain' } }
  )
}
