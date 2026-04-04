<script lang="ts">
  import PostEditor from '$lib/components/PostEditor.svelte'
  import type { PageProps } from './$types'

  let { form }: PageProps = $props()
</script>

<h1>New post</h1>

<form method="POST">
  {#if form?.message}
    <p>{form.message}</p>
    <PostEditor data={form.inferData} />
  {:else}
    <PostEditor />
  {/if}

  <button type="submit">Submit</button>
</form>
