<script lang="ts">
  import { resolve } from '$app/paths'
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'

  let { data, params }: PageProps = $props()

  onMount(() => fetch(data.post.id.toString(), { method: 'HEAD' }))
</script>

<main>
  <section class="prose">
    <h1>{data.post.title}.txt</h1>

    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html data.post.content}
  </section>
</main>

<footer>
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
