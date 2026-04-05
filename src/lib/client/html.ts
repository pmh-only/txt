export const polishHtml = (html: string): string => {
  const dom = new DOMParser().parseFromString(html, 'text/html')

  dom.body.querySelectorAll('*').forEach((el) => {
    if (el.firstChild?.nodeType === Node.TEXT_NODE) {
      el.firstChild.textContent = ' ' + el.firstChild.textContent
    }
  })

  return dom.body.innerText
    .replace(/[\r\n]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
