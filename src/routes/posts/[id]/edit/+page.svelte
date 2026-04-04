<script lang="ts">
  import PostEditor from '$lib/components/PostEditor.svelte'
  import type { PageProps } from './$types'

  let { data, form }: PageProps = $props()
</script>

<h1>Edit post #{data.post.id}</h1>

<form method="POST">
  <input type="hidden" name="id" value={data.post.id} />

  {#if form?.message}
    <p>{form.message}</p>
    <PostEditor data={form.inferData} />
  {:else}
    <PostEditor data={data.post} />
  {/if}

  <button type="submit">Submit</button>
</form>
