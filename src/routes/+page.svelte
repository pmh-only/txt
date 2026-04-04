<script lang="ts">
  import PostDisplay from '$lib/components/PostDisplay.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<main>
  <h1>Latest .txts</h1>
  <ul>
    <PostDisplay posts={data.latests} />
  </ul>

  <h1>Popular .txts</h1>
  <ul>
    <PostDisplay posts={data.populars} />
  </ul>
</main>
