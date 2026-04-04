import { eq } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { Actions } from './$types'
import { post } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { validateToken } from '../../../../lib/server/crypto'

export const actions = {
  default: async ({ params, request, cookies }) => {
    const isAdmin = validateToken(cookies.get('SESSION_TOKEN') ?? '')
    if (!isAdmin) {
      error(403, {
        message: 'Unauthorized'
      })
    }

    const data = await request.formData()
    const id = parseInt(data.get('id')?.toString() ?? params.id)

    const inferData: typeof post.$inferInsert = {
      title: data.get('title')?.toString() ?? '',
      alias: data.get('alias')?.toString() ?? '',
      content: data.get('content')?.toString() ?? '',
      visibility: data.get('visibility')?.toString() as
        | 'PUBLIC'
        | 'UNLISTED'
        | 'PRIVATE',
      updatedAt: Date.now()
    }

    await db.update(post).set(inferData).where(eq(post.id, id))

    redirect(
      307,
      resolve('/posts/[id]', {
        id: Number.isNaN(parseInt(params.id))
          ? inferData.alias
          : id.toString()
      })
    )
  }
} satisfies Actions
