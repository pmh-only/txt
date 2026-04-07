<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import Link from '@tiptap/extension-link'
  import Image from '@tiptap/extension-image'
  import Underline from '@tiptap/extension-underline'
  import {
    Table,
    TableRow,
    TableHeader,
    TableCell
  } from '@tiptap/extension-table'
  import { TextStyle } from '@tiptap/extension-text-style'
  import Highlight from '@tiptap/extension-highlight'
  import Subscript from '@tiptap/extension-subscript'
  import Superscript from '@tiptap/extension-superscript'
  import { polishHtml } from '$lib/html'

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
  let titleVal = $state(data.title)
  // svelte-ignore state_referenced_locally
  let aliasVal = $state(data.alias)
  // svelte-ignore state_referenced_locally
  let aliasManual = $state(data.alias !== '')

  function slugify(s: string) {
    return s
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function onTitleInput(e: Event) {
    titleVal = (e.target as HTMLInputElement).value
    if (!aliasManual) aliasVal = slugify(titleVal)
  }

  // svelte-ignore state_referenced_locally
  let content = $state(data.content)
  let tick = $state(0)

  const isActive = $derived.by(() => {
    void tick
    return (name: string, attrs?: Record<string, unknown>) =>
      editor?.isActive(name, attrs) ?? false
  })

  function promptLink() {
    const prev = editor?.getAttributes('link').href ?? ''
    const href = prompt('URL', prev)
    if (href === null) return
    if (href === '') {
      editor?.chain().focus().unsetLink().run()
    } else {
      editor?.chain().focus().setLink({ href }).run()
    }
  }

  function promptImage() {
    const src = prompt('Image URL')
    if (!src) return
    editor?.chain().focus().setImage({ src }).run()
  }

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Highlight,
        Subscript,
        Superscript,
        Link.configure({ openOnClick: false }),
        Image,
        Table.configure({ resizable: false }),
        TableRow,
        TableHeader,
        TableCell
      ],
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
    value={polishHtml(content)
      .replace(/[\r\n]+/g, ' ')
      .slice(0, 47) + '...'}
  />

  <label>
    <p>title</p>
    <input name="title" value={titleVal} oninput={onTitleInput} />
  </label>
  <label>
    <p>alias</p>
    <input
      name="alias"
      value={aliasVal}
      oninput={(e) => {
        aliasVal = (e.target as HTMLInputElement).value
        aliasManual = true
      }}
    />
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
      class:decoration-solid={isActive('underline')}
      onclick={() => editor?.chain().focus().toggleUnderline().run()}
    >
      underline
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
      class:decoration-solid={isActive('highlight')}
      onclick={() => editor?.chain().focus().toggleHighlight().run()}
    >
      mark
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('subscript')}
      onclick={() => editor?.chain().focus().toggleSubscript().run()}
    >
      sub
    </button>
    <button
      type="button"
      class:decoration-solid={isActive('superscript')}
      onclick={() =>
        editor?.chain().focus().toggleSuperscript().run()}
    >
      sup
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
    <span class="text-theme-500">|</span>
    <button
      type="button"
      class:decoration-solid={isActive('link')}
      onclick={promptLink}
    >
      link
    </button>
    <button type="button" onclick={promptImage}> image </button>
    <span class="text-theme-500">|</span>
    <button
      type="button"
      onclick={() =>
        editor
          ?.chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run()}
    >
      table
    </button>
    <button
      type="button"
      onclick={() => editor?.chain().focus().addColumnBefore().run()}
    >
      +col
    </button>
    <button
      type="button"
      onclick={() => editor?.chain().focus().deleteColumn().run()}
    >
      -col
    </button>
    <button
      type="button"
      onclick={() => editor?.chain().focus().addRowBefore().run()}
    >
      +row
    </button>
    <button
      type="button"
      onclick={() => editor?.chain().focus().deleteRow().run()}
    >
      -row
    </button>
    <button
      type="button"
      onclick={() => editor?.chain().focus().deleteTable().run()}
    >
      -table
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
