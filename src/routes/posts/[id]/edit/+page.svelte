<script lang="ts">
  import { resolve } from '$app/paths'
  import { enhance } from '$app/forms'
  import { beforeNavigate } from '$app/navigation'
  import PostEditor from '$lib/components/PostEditor.svelte'
  import type { PageProps } from './$types'

  let { data, form, params }: PageProps = $props()

  let submitting = $state(false)
  let dirty = $state(false)

  beforeNavigate(({ cancel }) => {
    if (dirty && !submitting && !confirm('Leave without saving?'))
      cancel()
  })
</script>

<svelte:head>
  <title>Edit #{data.post.id} - txt.</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="flex flex-col">
  <h1>Edit post #{data.post.id}</h1>

  <form
    method="POST"
    id="form"
    class="flex grow flex-col"
    oninput={() => (dirty = true)}
    use:enhance={() => {
      submitting = true
      return async ({ update }) => {
        await update()
        submitting = false
      }
    }}
  >
    <input type="hidden" name="id" value={data.post.id} />

    {#if form?.message}
      <p class="text-red-400">{form.message}</p>
      <PostEditor data={form.inferData} />
    {:else}
      <PostEditor data={data.post} />
    {/if}
  </form>
</main>

<footer>
  <button type="submit" form="form" disabled={submitting}>
    {submitting ? 'Saving...' : 'Submit'}
  </button>
  <a href={resolve('/posts/[id]', { id: params.id })}>Cancel</a>
</footer>
