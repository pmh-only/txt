import { env } from '$env/dynamic/private'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ params }) => {
  const key = env.INDEXNOW_KEY
  if (!key || params.key !== key) error(404)

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}
