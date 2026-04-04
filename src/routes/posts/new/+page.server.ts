import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import type { Actions } from './$types'
import { resolve } from '$app/paths'
import { validateToken } from '$lib/server/crypto'

export const actions = {
  default: async ({ request, cookies }) => {
    const isAdmin = validateToken(cookies.get('SESSION_TOKEN') ?? '')
    if (!isAdmin) {
      error(403, {
        message: 'Unauthorized'
      })
    }

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

    await db.insert(post).values(inferData)
    redirect(302, resolve('/posts/[id]', { id: inferData.alias }))
  }
} satisfies Actions
