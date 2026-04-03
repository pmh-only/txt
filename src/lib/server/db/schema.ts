import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const post = sqliteTable('post', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  alias: text('alias').notNull().unique(),
  visibility: text('visibility', {
    enum: ['PUBLIC', 'UNLISTED', 'PRIVATE']
  }).notNull(),
  viewCount: integer('view_count')
    .notNull()
    .$default(() => 0),
  uniqueCount: integer('unique_count')
    .notNull()
    .$default(() => 0),
  createdAt: integer('created_at')
    .notNull()
    .$default(() => Date.now()),
  updatedAt: integer('updated_at')
})
