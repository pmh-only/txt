const SERVICE_URL_KEY = 'serviceUrl'
const DEFAULT_SERVICE_URL = 'https://txt.pmh.so'

async function getServiceUrl() {
  return new Promise((resolve) => {
    chrome.storage.sync.get([SERVICE_URL_KEY], (data) => {
      resolve(data[SERVICE_URL_KEY] ?? DEFAULT_SERVICE_URL)
    })
  })
}

async function getSessionToken(serviceUrl) {
  return new Promise((resolve) => {
    chrome.cookies.get(
      { url: serviceUrl, name: 'SESSION_TOKEN' },
      (cookie) => {
        resolve(cookie?.value ?? null)
      }
    )
  })
}

async function extractPageText(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const selectors = ['article', 'main', '[role="main"]', 'body']
        for (const sel of selectors) {
          const el = document.querySelector(sel)
          if (el) {
            const text = el.innerText?.trim()
            if (text && text.length > 100) return text.slice(0, 4000)
          }
        }
        return document.body.innerText?.slice(0, 4000) ?? ''
      }
    })
    return results?.[0]?.result ?? ''
  } catch {
    return ''
  }
}

function setBadge(text, color) {
  chrome.action.setBadgeText({ text })
  chrome.action.setBadgeBackgroundColor({ color })
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || tab.url.startsWith('chrome://')) return

  setBadge('...', '#888')

  try {
    const serviceUrl = await getServiceUrl()
    const token = await getSessionToken(serviceUrl)

    if (!token) {
      setBadge('!', '#e00')
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'txt — not logged in',
        message: `Sign in at ${serviceUrl} first.`
      })
      setTimeout(() => setBadge('', '#888'), 3000)
      return
    }

    const content = await extractPageText(tab.id)

    const res = await fetch(`${serviceUrl}/api/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        url: tab.url,
        title: tab.title ?? '',
        content
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message ?? `HTTP ${res.status}`)
    }

    if (data.duplicate) {
      setBadge('=', '#888')
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'txt — already saved',
        message: `${serviceUrl}/posts/${data.alias}`
      })
    } else {
      setBadge('✓', '#080')
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'txt — bookmarked',
        message: `${serviceUrl}/posts/${data.alias}`
      })
    }
  } catch (err) {
    setBadge('!', '#e00')
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'txt — error',
      message: err.message ?? 'Something went wrong.'
    })
  }

  setTimeout(() => setBadge('', '#888'), 4000)
})
