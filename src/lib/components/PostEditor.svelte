<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import { polishHtml } from '$lib/client/html'

  let {
    data = {
      title: '',
      alias: '',
      content: '',
      visibility: 'PUBLIC'
    }
  }: {
    data?: {
      title: string
      alias: string
      content: string
      visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE'
    }
  } = $props()

  let editorEl: HTMLElement
  let editor: Editor

  // svelte-ignore state_referenced_locally
  let content = $state(data.content)
  let tick = $state(0)

  const isActive = $derived.by(() => {
    void tick
    return (name: string, attrs?: Record<string, unknown>) =>
      editor?.isActive(name, attrs) ?? false
  })

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [StarterKit],
      content: data.content,
      editorProps: {
        attributes: { class: 'prose grow' }
      },
      onUpdate({ editor: e }) {
        content = e.getHTML()
      },
      onTransaction() {
        tick++
      }
    })
  })

  onDestroy(() => editor?.destroy())
</script>

<div class="flex grow flex-col">
  <input
    type="hidden"
    name="contentPreview"
    value={polishHtml(content).slice(0, 47) + '...'}
  />

  <label>
    <p>title</p>
    <input name="title" value={data.title} />
  </label>
  <label>
    <p>alias</p>
    <input name="alias" value={data.alias} />
  </label>

  <div class="flex">
    <label>
      <input
        type="radio"
        name="visibility"
        value="PUBLIC"
        checked={data.visibility === 'PUBLIC'}
      />
      <p>PUBLIC</p>
    </label>
    <label>
      <input
        type="radio"
        name="visibility"
        value="UNLISTED"
        checked={data.visibility === 'UNLISTED'}
      />
      <p>UNLISTED</p>
    </label>
    <label>
      <input
        type="radio"
        name="visibility"
        value="PRIVATE"
        checked={data.visibility === 'PRIVATE'}
      />
      <p>PRIVATE</p>
    </label>
  </div>

  <div class="flex flex-wrap gap-x-3 gap-y-1 py-1 text-sm">
    <button
      type="button"
      class:decoration-solid={isActive('bold')}
      onclick={() => editor?.chain().focus().toggleBold().run()}
    >
      bold
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('italic')}
      onclick={() => editor?.chain().focus().toggleItalic().run()}
    >
      italic
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('strike')}
      onclick={() => editor?.chain().focus().toggleStrike().run()}
    >
      strike
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('code')}
      onclick={() => editor?.chain().focus().toggleCode().run()}
    >
      code
    </button>
    <span class="text-theme-500">|</span>
    <button
      type="button"
      class:decoration-solid={isActive('heading', { level: 1 })}
      onclick={() =>
        editor?.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      h1
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('heading', { level: 2 })}
      onclick={() =>
        editor?.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      h2
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('heading', { level: 3 })}
      onclick={() =>
        editor?.chain().focus().toggleHeading({ level: 3 }).run()}
    >
      h3
    </button>
    <span class="text-theme-500">|</span>
    <button
      type="button"
      class:decoration-solid={isActive('bulletList')}
      onclick={() => editor?.chain().focus().toggleBulletList().run()}
    >
      list
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('orderedList')}
      onclick={() =>
        editor?.chain().focus().toggleOrderedList().run()}
    >
      ordered
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('blockquote')}
      onclick={() => editor?.chain().focus().toggleBlockquote().run()}
    >
      quote
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('codeBlock')}
      onclick={() => editor?.chain().focus().toggleCodeBlock().run()}
    >
      codeblock
    </button>
  </div>

  <div
    class="editor-content flex grow flex-col border-t border-theme-500 py-2"
    bind:this={editorEl}
  ></div>

  <input type="hidden" name="content" value={content} />

  <style>
    .editor-content :global(.tiptap) {
      outline: none;
      min-height: 8rem;
    }
  </style>
</div>
