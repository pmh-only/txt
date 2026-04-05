<script lang="ts">
  import { resolve } from '$app/paths'
  import PostEditor from '$lib/components/PostEditor.svelte'
  import type { PageProps } from './$types'

  let { form }: PageProps = $props()
</script>

<svelte:head>
  <title>New post - txt.</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-col">
  <h1>New post</h1>

  <form method="POST" id="form" class="flex grow flex-col">
    {#if form?.message}
      <p class="text-red-400">{form.message}</p>
      <PostEditor data={form.inferData} />
    {:else}
      <PostEditor />
    {/if}
  </form>
</main>

<footer>
  <button type="submit" form="form">Submit</button>
  <a href={resolve('/')}>Cancel</a>
</footer>
