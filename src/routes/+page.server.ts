import { desc, eq } from 'drizzle-orm'
import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const latests = await db
    .select()
    .from(post)
    .where(eq(post.visibility, 'PUBLIC'))
    .orderBy(desc(post.id))
    .limit(10)

  const populars = await db
    .select()
    .from(post)
    .where(eq(post.visibility, 'PUBLIC'))
    .orderBy(desc(post.viewCount))
    .limit(10)

  return {
    latests,
    populars
  }
}
