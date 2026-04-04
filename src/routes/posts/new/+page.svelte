<script lang="ts">
  import { resolve } from '$app/paths'
  import PostEditor from '$lib/components/PostEditor.svelte'
  import type { PageProps } from './$types'

  let { form }: PageProps = $props()
</script>

<svelte:head>
  <title>New post - txt.</title>
</svelte:head>

<h1>New post</h1>

<form method="POST">
  {#if form?.message}
    <p>{form.message}</p>
    <PostEditor data={form.inferData} />
  {:else}
    <PostEditor />
  {/if}

  <button type="submit">Submit</button>
  <a href={resolve('/')}>Cancel</a>
</form>
