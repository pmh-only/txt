import { desc, eq, or } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { PageServerLoad, Actions } from './$types'
import { post } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'

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

export const actions = {
  default: async ({ params, request }) => {
    const data = await request.formData()
    const id = parseInt(data.get('id')?.toString() ?? params.id)

    await db.delete(post).where(eq(post.id, id))
    redirect(302, resolve('/'))
  }
} satisfies Actions
