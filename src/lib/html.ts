export const polishHtml = (html: string): string => {
  if (typeof DOMParser === 'undefined') return ''
  const dom = new DOMParser().parseFromString(html, 'text/html')

  dom.body.querySelectorAll('*').forEach((el) => {
    if (el.firstChild?.nodeType === Node.TEXT_NODE) {
      el.firstChild.textContent = ' ' + el.firstChild.textContent
    }
  })

  return dom.body.innerText
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .trim()
}
