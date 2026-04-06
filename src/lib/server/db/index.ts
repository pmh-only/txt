import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { env } from '$env/dynamic/private'
import { readFileSync } from 'fs'

const client = new Database(env.DATABASE_URL ?? 'data/local.db')

export const db = drizzle(client, { schema })

// If the schema was previously applied via drizzle-kit push (no migration
// tracking table), seed __drizzle_migrations so migrate() skips existing work.
const schemaExists = client
  .prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='post'")
  .get()

if (schemaExists) {
  client.exec(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at NUMERIC
    )
  `)

  const count = (
    client.prepare('SELECT COUNT(*) as n FROM "__drizzle_migrations"').get() as { n: number }
  ).n

  if (count === 0) {
    const journal = JSON.parse(readFileSync('drizzle/meta/_journal.json', 'utf-8'))
    const insert = client.prepare(
      'INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES (?, ?)'
    )
    for (const entry of journal.entries) {
      insert.run(entry.tag, entry.when)
    }
  }
}

migrate(db, { migrationsFolder: 'drizzle' })
