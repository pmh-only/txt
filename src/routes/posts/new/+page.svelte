<script>
  import PostEditor from '$lib/components/PostEditor.svelte'
</script>

<h1>New post</h1>

<form method="POST">
  <PostEditor />
  <button type="submit">Submit</button>
</form>
