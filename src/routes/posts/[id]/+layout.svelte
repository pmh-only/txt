<script lang="ts">
  let { children, data } = $props()
</script>

<svelte:head>
  <title>{data.post.title} - txt.</title>
</svelte:head>

<main>
  {@render children()}
</main>
