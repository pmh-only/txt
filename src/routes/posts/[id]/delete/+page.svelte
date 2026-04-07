<script lang="ts">
  import { resolve } from '$app/paths'
  import { enhance } from '$app/forms'
  import type { PageProps } from './$types'

  let { data, params }: PageProps = $props()

  let submitting = $state(false)
</script>

<svelte:head>
  <title>Delete #{data.post.id} - txt.</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main>
  <h1>Delete post #{data.post.id}</h1>

  <form
    method="POST"
    id="form"
    use:enhance={() => {
      submitting = true
      return async ({ update }) => {
        await update()
        submitting = false
      }
    }}
  >
    <input type="hidden" name="id" value={data.post.id} />
    <p>Delete "{data.post.title}"?</p>
  </form>
</main>

<footer>
  <button form="form" type="submit" disabled={submitting}>
    {submitting ? 'Deleting...' : 'Delete'}
  </button>
  <a href={resolve('/posts/[id]', { id: params.id })}>Cancel</a>
</footer>
