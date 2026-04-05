<script lang="ts">
  import { resolve } from '$app/paths'
  import PostDisplay from '$lib/components/PostList.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<svelte:head>
  <title>Posts - txt.</title>
</svelte:head>

<main>
  <section>
    <h2>Populars</h2>
    <ul>
      <PostDisplay posts={data.populars} />
    </ul>
  </section>

  <section>
    <h2>Latests</h2>
    <ul>
      <PostDisplay posts={data.latests} />
    </ul>
  </section>
</main>

<footer>
  {#if data.isAdmin}
    <a href={resolve('/posts/new')}>Create</a>
  {/if}
</footer>
