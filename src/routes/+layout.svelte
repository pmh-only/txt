<script lang="ts">
  import './layout.css'
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
  <nav class="flex justify-end gap-4">
    {#if data.isAdmin}
      Logged in
      <form method="post" action={resolve('/auth/logout')}>
        <button type="submit">Logout</button>
      </form>
    {:else}
      <a href={resolve(`/auth/login?state=${state}`)}>Login</a>
    {/if}
  </nav>

  <div class="cont flex grow flex-col">
    {@render children()}
  </div>
</div>
