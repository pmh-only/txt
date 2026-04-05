<script lang="ts">
  import { resolve } from '$app/paths'
  import type { PageProps } from './$types'

  let { data, params }: PageProps = $props()
</script>

<svelte:head>
  <title>Delete #{data.post.id} - txt.</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main>
  <h1>Delete post #{data.post.id}</h1>

  <form method="POST" id="form">
    <input type="hidden" name="id" value={data.post.id} />

    <p>Are you sure?</p>
  </form>
</main>

<footer>
  <button form="form" type="submit">Submit</button>
  <a href={resolve('/posts/[id]', { id: params.id })}> Cancel </a>
</footer>
