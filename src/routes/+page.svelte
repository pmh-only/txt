<script lang="ts">
  import { resolve } from '$app/paths'
  import PostDisplay from '$lib/components/PostList.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<svelte:head>
  <title>Posts - txt.</title>
</svelte:head>

<h1>Latest txt.</h1>
<ul>
  <PostDisplay posts={data.latests} />
</ul>

<h1>Popular txts.</h1>
<ul>
  <PostDisplay posts={data.populars} />
</ul>

{#if data.isAdmin}
  <a href={resolve('/posts/new')}>Create</a>
{/if}
