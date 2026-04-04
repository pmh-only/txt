<script lang="ts">
  import './layout.css'
  import favicon from '$lib/assets/favicon.svg'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  let { children, data } = $props()
  const state = $derived(
    encodeURIComponent(page.url.pathname + page.url.search)
  )
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav>
  {#if data.isAdmin}
    Logged in
    <form method="post" action={resolve('/auth/logout')}>
      <button type="submit">Logout</button>
    </form>
  {:else}
    <a href={resolve(`/auth/login?state=${state}`)}>Login</a>
  {/if}
</nav>

<main>
  {@render children()}
</main>
