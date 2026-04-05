<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
</script>

<svelte:head>
  <title>{page.status} {page.error?.message ?? 'Error'} - txt.</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main>
  <h1>Hmm...</h1>
  <p>{page.error?.message}</p>
</main>

<footer>
  <a href={resolve('/')}>Okay</a>
</footer>
