import {
  index,
  integer,
  sqliteTable,
  text,
  unique
} from 'drizzle-orm/sqlite-core'

export const post = sqliteTable('post', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  contentPreview: text('content_preview'),
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

export const view = sqliteTable(
  'view',
  {
    postId: integer('id').notNull(),
    ipAddr: text('ip').notNull()
  },
  (t) => [
    unique().on(t.postId, t.ipAddr),
    index('post_id').on(t.postId)
  ]
)
