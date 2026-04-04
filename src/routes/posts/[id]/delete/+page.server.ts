import { eq } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { Actions } from './$types'
import { post } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { validateToken } from '$lib/server/crypto'

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

    await db.delete(post).where(eq(post.id, id))
    redirect(307, resolve('/'))
  }
} satisfies Actions
