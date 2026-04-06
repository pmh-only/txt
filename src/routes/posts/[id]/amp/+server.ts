import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import { eq, or } from 'drizzle-orm'
import { desc } from 'drizzle-orm'
import { error } from '@sveltejs/kit'
import { validateToken } from '$lib/server/crypto'
import { detectLang, localeMap } from '$lib/lang'
import type { RequestHandler } from './$types'

function toAmpHtml(html: string): string {
  // Replace <img> tags with <amp-img layout="responsive">
  return html
    .replace(/<img(\s[^>]*?)?\s*\/?>/gi, (_match, attrs = '') => {
      const src = (attrs.match(/src="([^"]*)"/) ?? [])[1] ?? ''
      const alt = (attrs.match(/alt="([^"]*)"/) ?? [])[1] ?? ''
      return `<amp-img src="${src}" alt="${alt}" width="800" height="450" layout="responsive"></amp-img>`
    })
    .replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ''
    )
}

export const GET: RequestHandler = async ({
  params,
  cookies,
  url
}) => {
  const [data] = await db
    .select()
    .from(post)
    .where(
      or(eq(post.id, parseInt(params.id)), eq(post.alias, params.id))
    )
    .orderBy(desc(post.id))
    .limit(1)

  if (!data) error(404, { message: 'Not Found' })

  const isAdmin = validateToken(cookies.get('SESSION_TOKEN') ?? '')
  if (data.visibility === 'PRIVATE' && !isAdmin)
    error(404, { message: 'Not Found' })

  const lang = detectLang(data.content)
  const locale = localeMap[lang]
  const canonicalUrl = `${url.origin}/posts/${data.alias}`
  const description =
    data.contentPreview ?? `${data.title} — read on txt.`
  const publishedAt = new Date(data.createdAt).toISOString()
  const updatedAt = data.updatedAt
    ? new Date(data.updatedAt).toISOString()
    : publishedAt

  const html = `<!doctype html>
<html ⚡ lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
  <title>${data.title} - txt.</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:locale" content="${locale}" />
  <meta http-equiv="content-language" content="${lang}" />
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
  <noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <style amp-custom>
    :root { --c100: #cfcfcf; --c200: #a8a8a8; --c300: #888888; --c500: #646464; --c800: #2e2e2e; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; background: var(--c800); color: var(--c200); font-family: 'Noto Serif KR', serif; font-size: 1.125rem; }
    body { display: flex; justify-content: center; }
    .wrap { width: 100%; max-width: 36rem; padding: 0.5rem 1rem; display: flex; flex-direction: column; }
    nav { text-align: center; margin-bottom: 0.5rem; }
    a { color: inherit; text-decoration: none; cursor: pointer; }
    a:hover { text-decoration: underline; text-decoration-color: var(--c500); }
    h1 { font-size: 1.5rem; font-weight: bold; color: var(--c100); }
    main { flex: 1 1 auto; padding-bottom: 1rem; }
    footer { border-top: 1px solid var(--c500); padding: 0.75rem 0; font-size: 0.875rem; }
    footer p { margin-bottom: 0.25rem; }
    footer section { margin-top: 0.5rem; display: flex; gap: 1rem; }
    .prose h1 { font-size: 1.25rem; font-weight: bold; color: var(--c100); }
    .prose h2 { font-size: 1rem; font-weight: bold; color: var(--c100); }
    .prose h3 { font-size: 0.875rem; font-weight: bold; color: var(--c100); }
    .prose strong { font-weight: bold; color: var(--c100); }
    .prose ul { list-style: disc; padding-left: 1.25em; }
    .prose ol { list-style: decimal; padding-left: 1.25em; }
    .prose blockquote { border-left: 2px solid var(--c500); padding-left: 0.75em; color: var(--c300); }
    .prose code, .prose pre { font-family: monospace; color: var(--c100); }
    .prose hr { border-color: var(--c500); margin: 0.5rem 0; }
    .prose p { margin: 0; padding: 0; }
    .prose p:empty { min-height: 1em; }
    .prose > * + * { margin-top: 0.5em; }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(data.title)},
    "description": ${JSON.stringify(description)},
    "datePublished": "${publishedAt}",
    "dateModified": "${updatedAt}",
    "url": "${canonicalUrl}"
  }
  </script>
</head>
<body>
  <div class="wrap">
    <nav><a href="${url.origin}/">txt</a>.</nav>
    <main>
      <h1>${data.title}.txt</h1>
      <div class="prose">
        ${toAmpHtml(data.content)}
      </div>
    </main>
    <footer>
      <p><b>#${data.id} ${data.title}</b></p>
      <p>Posted: ${new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      ${data.updatedAt ? `<p>Updated: ${new Date(data.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
      <section><a href="${canonicalUrl}">View full page</a> &middot; <a href="${url.origin}/">Back</a></section>
    </footer>
  </div>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
