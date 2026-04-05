<script lang="ts">
  import './layout.css'
  import '@fontsource-variable/noto-serif-kr/wght.css'

  import favicon from '$lib/assets/favicon.webp'

  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { browser } from '$app/environment'

  let { children } = $props()
  const state = $derived(
    encodeURIComponent(page.url.pathname + page.url.search)
  )

  $effect(() => {
    if (browser) {
      const lang = document.querySelector('meta[http-equiv="content-language"]')?.getAttribute('content') ?? 'en'
      document.documentElement.lang = lang
    }
  })
</script>

<svelte:head>
  <title>txt.</title>
  <meta name="description" content="A minimalist writing space." />
  <meta property="og:site_name" content="txt." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary" />
  <link rel="canonical" href={page.url.origin + page.url.pathname} />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
  <link rel="alternate" type="application/rss+xml" title="txt. RSS Feed" href="/rss.xml" />
  <meta name="theme-color" content="#2e2e2e" />
  <link rel="apple-touch-icon" href={favicon} />
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
