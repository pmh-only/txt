import { error, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import type { Actions, PageServerLoad } from './$types'
import { resolve } from '$app/paths'
import { validateToken } from '$lib/server/crypto'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async ({ parent }) => {
  const { isAdmin } = await parent()
  if (!isAdmin) {
    error(404, {
      message: 'Not Found'
    })
  }
}

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
      .where(eq(post.alias, inferData.alias))
      .limit(1)

    if (isAliasExist !== undefined) {
      return {
        message: `Alias named "${inferData.alias}" already exists.`,
        inferData
      }
    }

    await db.insert(post).values(inferData)
    redirect(303, resolve('/posts/[id]', { id: inferData.alias }))
  }
} satisfies Actions
