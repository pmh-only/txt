<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { onMount } from 'svelte'
  import { detectLang, localeMap } from '$lib/lang'
  import type { PageProps } from './$types'

  let { data, params }: PageProps = $props()

  onMount(() =>
    fetch(
      resolve('/posts/[id]/view', {
        id: data.post.id.toString()
      }),
      { method: 'POST' }
    )
  )

  const lang = $derived(detectLang(data.post.content))

  const description = $derived(
    data.post.contentPreview ?? `${data.post.title} — read on txt.`
  )
  const publishedAt = $derived(
    new Date(data.post.createdAt).toISOString()
  )
  const updatedAt = $derived(
    data.post.updatedAt
      ? new Date(data.post.updatedAt).toISOString()
      : null
  )
</script>

<svelte:head>
  <title>{data.post.title} - txt.</title>
  <meta name="description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{data.post.title} - txt." />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={page.url.href} />
  <meta property="article:published_time" content={publishedAt} />
  {#if updatedAt}
    <meta property="article:modified_time" content={updatedAt} />
  {/if}
  <meta name="twitter:title" content="{data.post.title} - txt." />
  <meta name="twitter:description" content={description} />
  <meta property="og:locale" content={localeMap[lang]} />
  <!-- @ts-expect-error content-language is valid but not in TS types -->
  <meta http-equiv="content-language" content={lang} />
  {#if data.post.visibility !== 'PUBLIC'}
    <meta name="robots" content="noindex" />
  {/if}
  <link
    rel="amphtml"
    href="{page.url.origin}/posts/{data.post.alias}/amp"
  />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<${'script'} type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: page.url.origin + '/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: data.post.title,
        item: page.url.origin + '/posts/' + data.post.alias
      }
    ]
  })}</script>`}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<${'script'} type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.post.title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    url: page.url.origin + '/posts/' + data.post.alias,
    publisher: { '@type': 'Organization', name: 'txt.' }
  })}</script>`}
</svelte:head>

<main>
  <h1>{data.post.title}.txt</h1>
  <div class="prose pb-4 select-text">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.post.content}
  </div>
</main>

<footer>
  <p><b>#{data.post.id} {data.post.title}</b></p>

  <p>
    {data.post.viewCount} views / {data.post.uniqueCount} uniques
  </p>

  <p>
    Posted At:
    {new Date(data.post.createdAt).toLocaleString()}
  </p>

  {#if data.post.updatedAt !== null}
    <p>
      Updated At:
      {new Date(data.post.updatedAt).toLocaleString()}
    </p>
  {/if}

  <section>
    {#if data.isAdmin}
      <a
        href={resolve('/posts/[id]/edit', {
          id: params.id
        })}
      >
        Edit
      </a>

      <a
        href={resolve('/posts/[id]/delete', {
          id: params.id
        })}
      >
        Delete
      </a>
    {/if}

    <a href={resolve('/')}>Back</a>
  </section>
</footer>
