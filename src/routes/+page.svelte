<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import PostDisplay from '$lib/components/PostList.svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<svelte:head>
  <title>Posts - txt.</title>
  <meta name="description" content="Browse all posts on txt." />
  <meta property="og:title" content="Posts - txt." />
  <meta
    property="og:description"
    content="Browse all posts on txt."
  />
  <meta name="twitter:title" content="Posts - txt." />
  <meta
    name="twitter:description"
    content="Browse all posts on txt."
  />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<${'script'} type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'txt.',
    url: page.url.origin
  })}</script>`}
</svelte:head>

<main>
  <section>
    <h2>Populars</h2>
    <ul>
      <PostDisplay posts={data.populars} />
    </ul>
  </section>

  <section>
    <h2>Latests</h2>
    <ul>
      <PostDisplay posts={data.latests} />
    </ul>
  </section>
</main>

<footer>
  {#if data.isAdmin}
    <a href={resolve('/posts/new')}>Create</a>
  {/if}
</footer>
