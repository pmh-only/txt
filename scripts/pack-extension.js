import crx3 from 'crx3'
import {
  existsSync,
  readFileSync,
  writeFileSync,
  unlinkSync
} from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(
  readFileSync(resolve(root, 'extension/manifest.json'), 'utf-8')
)

const keyPath = resolve(root, '.extension-key.pem')
const keyFromEnv = process.env.EXTENSION_KEY_PEM
let tempKey = false

if (!existsSync(keyPath)) {
  if (!keyFromEnv) {
    throw new Error(
      'No .extension-key.pem file found and EXTENSION_KEY_PEM env var is not set.'
    )
  }
  writeFileSync(keyPath, keyFromEnv)
  tempKey = true
}

await crx3(
  [
    resolve(root, 'extension/manifest.json'),
    resolve(root, 'extension/background.js'),
    resolve(root, 'extension/popup.html'),
    resolve(root, 'extension/popup.js'),
    resolve(root, 'extension/icon16.png'),
    resolve(root, 'extension/icon48.png'),
    resolve(root, 'extension/icon128.png')
  ],
  {
    keyPath,
    crxPath: resolve(root, 'static/extension.crx'),
    zipPath: resolve(root, 'static/extension.zip'),
    xmlPath: resolve(root, 'static/updates.xml'),
    crxURL: 'https://txt.pmh.so/extension.crx',
    appVersion: manifest.version
  }
)

if (tempKey) unlinkSync(keyPath)

console.log(`extension packed (v${manifest.version})`)
