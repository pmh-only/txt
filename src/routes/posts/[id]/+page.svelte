<script lang="ts">
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<main>
  <h1>{data.post.title}</h1>

  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html data.post.content}

  <section class="metadata">
    <p>
      {data.post.viewCount} views / {data.post.uniqueCount} uniques
    </p>
    <p>Posted At: {new Date(data.post.createdAt).toLocaleString()}</p>
    {#if data.post.updatedAt !== null}
      <p>
        Updated At: {new Date(data.post.updatedAt).toLocaleString()}
      </p>
    {/if}
  </section>
</main>
