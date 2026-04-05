<script lang="ts">
  import './layout.css'
  import '@fontsource-variable/noto-serif-kr/wght.css'

  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  let { children, data } = $props()
  const state = $derived(
    encodeURIComponent(page.url.pathname + page.url.search)
  )
</script>

<svelte:head>
  <title>txt.</title>
</svelte:head>

<div class="flex h-full max-h-270 w-full max-w-xl flex-col px-4 py-2">
  <nav class="flex justify-center gap-4">
    <div class="grow text-center">txt.</div>
    <div>
      {#if data.isAdmin}
        <form method="post" action={resolve('/auth/logout')}>
          <button type="submit">Logout</button>
        </form>
      {:else}
        <a href={resolve(`/auth/login?state=${state}`)}>Login</a>
      {/if}
    </div>
  </nav>

  <div class="cont flex grow flex-col">
    {@render children()}
  </div>
</div>
