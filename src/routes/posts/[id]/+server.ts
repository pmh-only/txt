import { count, eq, sql } from 'drizzle-orm'
import { db } from '../../../lib/server/db'
import { post, view } from '../../../lib/server/db/schema'
import type { RequestHandler } from './$types'

export const HEAD: RequestHandler = async ({
  params,
  request,
  getClientAddress
}) => {
  const id = parseInt(params.id)
  const ip =
    request.headers.get('x-forwarded-for') || getClientAddress()

  await db
    .insert(view)
    .values({
      postId: id,
      ipAddr: ip
    })
    .onConflictDoNothing()

  const [result] = await db
    .select({ uniqueCount: count() })
    .from(view)
    .where(eq(view.postId, id))

  const uniqueCount = result?.uniqueCount ?? 0

  await db
    .update(post)
    .set({ viewCount: sql`${post.viewCount} + 1`, uniqueCount })
    .where(eq(post.id, id))

  return new Response()
}
