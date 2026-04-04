import { desc, eq, or } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { LayoutServerLoad } from './$types'
import { post } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'
import { validateToken } from '$lib/server/crypto'

export const load: LayoutServerLoad = async ({ params, cookies }) => {
  const [data] = await db
    .select()
    .from(post)
    .where(
      or(
        eq(post.id, parseInt(params.id)), //
        eq(post.alias, params.id)
      )
    )
    .orderBy(desc(post.id))
    .limit(1)

  if (data === undefined) {
    error(404, {
      message: 'Not Found'
    })
  }

  const isAdmin = validateToken(cookies.get('SESSION_TOKEN') ?? '')
  if (data.visibility === 'PRIVATE' && !isAdmin) {
    error(404, {
      message: 'Not Found'
    })
  }

  return {
    post: data
  }
}
