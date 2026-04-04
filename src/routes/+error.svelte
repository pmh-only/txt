<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
</script>

<h1>{page.error?.message}</h1>
<a href={resolve('/')}>Okay</a>
