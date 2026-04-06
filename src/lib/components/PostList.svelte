<script lang="ts">
  import { resolve } from '$app/paths'
  import type { post } from '../server/db/schema'

  let { posts }: { posts: Array<typeof post.$inferSelect> } = $props()

  function relativeTime(ms: number): string {
    const d = Math.floor((Date.now() - ms) / 86400000)
    if (d === 0) return 'today'
    if (d === 1) return 'yesterday'
    if (d < 30) return `${d}d ago`
    const m = Math.floor(d / 30)
    if (m < 12) return `${m}mo ago`
    return `${Math.floor(m / 12)}y ago`
  }
</script>

{#each posts as post (post.id)}
  <li class="mb-2">
    <a
      href={resolve('/posts/[id]', {
        id: post.alias
      })}
    >
      <p>
        <b>#{post.id}</b>
        {post.title}.txt
        <span class="text-xs text-theme-500"
          >{relativeTime(post.createdAt)}</span
        >
      </p>
      <p class="text-xs">{post.contentPreview ?? ''}</p>
    </a>
  </li>
{/each}
