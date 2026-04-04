import { desc, eq, or } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { PageServerLoad } from './$types'
import { post } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
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
      message: 'Post not found.'
    })
  }

  return {
    post: data
  }
}
