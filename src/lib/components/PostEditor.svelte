<script lang="ts">
  import { TrixEditor } from 'svelte-trix'

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

  // svelte-ignore state_referenced_locally
  let value = $state(data.content)
</script>

<label>
  <p>title</p>
  <input name="title" value={data.title} />
</label>
<label>
  <p>alias</p>
  <input name="alias" value={data.alias} />
</label>
<label>
  <p>content</p>
  <TrixEditor bind:value />
</label>

<div>
  <p>visibility</p>

  <label>
    <input
      type="radio"
      name="visibility"
      value="PUBLIC"
      checked={data.visibility === 'PUBLIC'}
    /> PUBLIC
  </label>
  <label>
    <input
      type="radio"
      name="visibility"
      value="UNLISTED"
      checked={data.visibility === 'UNLISTED'}
    /> UNLISTED
  </label>
  <label>
    <input
      type="radio"
      name="visibility"
      value="PRIVATE"
      checked={data.visibility === 'PRIVATE'}
    /> PRIVATE
  </label>
</div>
