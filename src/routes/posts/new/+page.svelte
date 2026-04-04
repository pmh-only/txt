<form method="POST">
  <label>
    <p>title</p>
    <input name="title" required />
  </label>
  <label>
    <p>alias</p>
    <input name="alias" required />
  </label>
  <label>
    <p>content</p>
    <textarea name="content" required></textarea>
  </label>

  <div>
    <p>visibility</p>

    <label>
      <input
        type="radio"
        name="visibility"
        value="PUBLIC"
        checked
        required
      /> PUBLIC
    </label>
    <label>
      <input
        type="radio"
        name="visibility"
        value="UNLISTED"
        required
      /> UNLISTED
    </label>
    <label>
      <input
        type="radio"
        name="visibility"
        value="PRIVATE"
        required
      /> PRIVATE
    </label>
  </div>

  <button type="submit">Submit</button>
</form>
