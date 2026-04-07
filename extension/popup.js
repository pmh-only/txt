const serviceUrlInput = document.getElementById('service-url')
const saveBtn = document.getElementById('save-btn')
const statusEl = document.getElementById('status')

chrome.storage.sync.get(['serviceUrl'], (data) => {
  serviceUrlInput.value = data.serviceUrl ?? ''
})

saveBtn.addEventListener('click', () => {
  const serviceUrl = serviceUrlInput.value.trim().replace(/\/$/, '')
  if (!serviceUrl) {
    statusEl.className = 'status error'
    statusEl.textContent = 'Service URL is required.'
    return
  }
  chrome.storage.sync.set({ serviceUrl }, () => {
    statusEl.className = 'status success'
    statusEl.textContent = 'Saved.'
    setTimeout(() => (statusEl.className = 'status'), 1500)
  })
})
