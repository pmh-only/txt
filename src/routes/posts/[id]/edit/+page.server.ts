import { and, eq, not } from 'drizzle-orm'
import { db } from '$lib/server/db'
import type { Actions, PageServerLoad } from './$types'
import { post } from '$lib/server/db/schema'
import { error, redirect } from '@sveltejs/kit'
import { resolve } from '$app/paths'
import { validateToken } from '$lib/server/crypto'

export const load: PageServerLoad = async ({ parent }) => {
  const { isAdmin } = await parent()
  if (!isAdmin) {
    error(404, {
      message: 'Not Found'
    })
  }
}

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
      contentPreview: data.get('contentPreview')?.toString() ?? '',
      visibility: data.get('visibility')?.toString() as
        | 'PUBLIC'
        | 'UNLISTED'
        | 'PRIVATE',
      updatedAt: Date.now()
    }

    for (const [key, value] of Object.entries(inferData)) {
      if (value === '') {
        return {
          message: `Field "${key}" can not be empty.`,
          inferData
        }
      }
    }

    const [isAliasExist] = await db
      .select()
      .from(post)
      .where(
        and(
          not(eq(post.id, id)), //
          eq(post.alias, inferData.alias)
        )
      )
      .limit(1)

    if (isAliasExist !== undefined) {
      return {
        message: `Alias named "${inferData.alias}" already exists.`,
        inferData
      }
    }

    await db.update(post).set(inferData).where(eq(post.id, id))

    redirect(
      303,
      resolve('/posts/[id]', {
        id: Number.isNaN(parseInt(params.id))
          ? inferData.alias
          : id.toString()
      })
    )
  }
} satisfies Actions
