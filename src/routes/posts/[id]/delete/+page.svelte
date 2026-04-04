<script lang="ts">
  import { resolve } from '$app/paths'
  import type { PageProps } from './$types'

  let { data, params }: PageProps = $props()
</script>

<h1>Delete post #{data.post.id}</h1>

<form method="POST">
  <input type="hidden" name="id" value={data.post.id} />

  <p>Are you sure?</p>
  <button type="submit">Submit</button>
  <a href={resolve('/posts/[id]', { id: params.id })}> Cancel </a>
</form>
