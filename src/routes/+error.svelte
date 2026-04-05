<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
</script>

<main>
  <h1>Hmm...</h1>
  <p>{page.error?.message}</p>
</main>

<footer>
  <a href={resolve('/')}>Okay</a>
</footer>
