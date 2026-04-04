import { redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import type { Actions } from './$types'
import { resolve } from '$app/paths'

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()

    const inferData: typeof post.$inferInsert = {
      title: data.get('title')?.toString() ?? '',
      alias: data.get('alias')?.toString() ?? '',
      content: data.get('content')?.toString() ?? '',
      visibility: data.get('visibility')?.toString() as
        | 'PUBLIC'
        | 'UNLISTED'
        | 'PRIVATE'
    }

    const returnedPost = await db
      .insert(post)
      .values(inferData)
      .returning({ id: post.id })

    redirect(
      302,
      resolve('/posts/[id]', { id: returnedPost[0].id.toString() })
    )
  }
} satisfies Actions
