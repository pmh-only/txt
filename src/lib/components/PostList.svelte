<script lang="ts">
  import { resolve } from '$app/paths'
  import type { post } from '../server/db/schema'

  let { posts }: { posts: Array<typeof post.$inferSelect> } = $props()
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
      </p>
      <p class="text-xs">{post.contentPreview ?? ''}</p>
    </a>
  </li>
{/each}
