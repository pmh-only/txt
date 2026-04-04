<script lang="ts">
  import { resolve } from '$app/paths'
  import type { post } from '../server/db/schema'

  let { posts }: { posts: Array<typeof post.$inferSelect> } = $props()
</script>

<ul>
  {#each posts as post (post.id)}
    <li>
      <a
        href={resolve('/posts/[id]', {
          id: post.alias
        })}
      >
        {post.title}
      </a>
    </li>
  {/each}
</ul>
