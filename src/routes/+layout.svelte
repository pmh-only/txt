<script lang="ts">
  import './layout.css'
  import '@fontsource-variable/noto-serif-kr/wght.css'

  import favicon from '$lib/assets/favicon.webp'

  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  let { children } = $props()
  const state = $derived(
    encodeURIComponent(page.url.pathname + page.url.search)
  )
</script>

<svelte:head>
  <title>txt.</title>
  <link rel="shortcut icon" href={favicon} type="image/webp" />
</svelte:head>

<div class="flex h-full max-h-270 w-full max-w-xl flex-col px-4 py-2">
  <nav class="text-center">
    <a href={resolve('/')}>txt</a><a
      href={resolve(`/auth?state=${state}`)}>.</a
    >
  </nav>

  <div class="cont flex grow flex-col">
    {@render children()}
  </div>
</div>
