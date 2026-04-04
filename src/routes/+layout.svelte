<script lang="ts">
  import './layout.css'
  import favicon from '$lib/assets/favicon.svg'
  import { resolve } from '$app/paths'

  let { children, data } = $props()
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav>
  {#if data.isAdmin}
    Logged in
    <a href={resolve('/auth/logout')}> Logout</a>
  {:else}
    <a href={resolve('/auth/login')}> Login</a>
  {/if}
</nav>

<main>
  {@render children()}
</main>
