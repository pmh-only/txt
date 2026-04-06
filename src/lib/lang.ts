const KOREAN_RE = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/

/** Returns 'ko' if Korean characters make up >20% of sampled text, else 'en'. */
export function detectLang(text: string): 'ko' | 'en' {
  const sample = text.slice(0, 500).replace(/\s/g, '')
  if (!sample.length) return 'en'
  const korean = sample
    .split('')
    .filter((c) => KOREAN_RE.test(c)).length
  return korean / sample.length > 0.2 ? 'ko' : 'en'
}

export const localeMap = { ko: 'ko_KR', en: 'en_US' } as const
