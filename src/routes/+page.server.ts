import { desc, eq } from 'drizzle-orm'
import { db } from '$lib/server/db'
import { post } from '$lib/server/db/schema'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent()

  const latests = await db
    .select()
    .from(post)
    .where(
      layoutData.isAdmin ? undefined : eq(post.visibility, 'PUBLIC')
    )
    .orderBy(desc(post.id))
    .limit(10)

  const populars = await db
    .select()
    .from(post)
    .where(
      layoutData.isAdmin ? undefined : eq(post.visibility, 'PUBLIC')
    )
    .orderBy(desc(post.viewCount))
    .limit(5)

  return {
    latests,
    populars
  }
}
