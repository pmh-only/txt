<script lang="ts">
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
  <textarea name="content" value={data.content}></textarea>
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
