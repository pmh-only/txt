<script lang="ts">
  import PostEditor from '../../../../lib/components/PostEditor.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<h1>Edit post #{data.post.id}</h1>

<form method="POST">
  <input type="hidden" name="id" value={data.post.id} />

  <PostEditor data={data.post} />
  <button type="submit">Submit</button>
</form>
