import { env } from '$env/dynamic/private'

/**
 * Pings IndexNow to notify Bing, Yandex, and others of a URL change.
 * Requires INDEXNOW_KEY in environment variables.
 * No-ops silently if the key is not set.
 */
export async function pingIndexNow(origin: string, urlPath: string): Promise<void> {
  const key = env.INDEXNOW_KEY
  if (!key) return

  const url = `${origin}${urlPath}`

  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(origin).hostname,
      key,
      keyLocation: `${origin}/${key}.txt`,
      urlList: [url]
    })
  }).catch(() => {
    // Non-critical — never block the response
  })
}
