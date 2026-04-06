<script lang="ts">
  let { children, data } = $props()
</script>

<svelte:head>
  <title>{data.post.title}.txt - text.</title>
</svelte:head>

{@render children()}
