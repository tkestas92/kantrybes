export const CONSENT_VERSION = 1
export const CONSENT_STORAGE_KEY = 'consent'

const SIX_MONTHS_MS = 183 * 24 * 60 * 60 * 1000
const SIX_MONTHS_SEC = 183 * 24 * 60 * 60

export type ConsentRecord = {
  thirdParty: boolean | null
  ts: number | null
  version: number
}

export const EMPTY_CONSENT: ConsentRecord = {
  thirdParty: null,
  ts: null,
  version: CONSENT_VERSION,
}

function parseRecord(raw: string | null): ConsentRecord | null {
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as Partial<ConsentRecord>
    if (data.version !== CONSENT_VERSION) return null
    if (typeof data.thirdParty !== 'boolean' || typeof data.ts !== 'number') return null
    if (Date.now() - data.ts >= SIX_MONTHS_MS) return null
    return { thirdParty: data.thirdParty, ts: data.ts, version: CONSENT_VERSION }
  } catch {
    return null
  }
}

function readCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )consent=([^;]*)/)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

export function readConsent(): ConsentRecord {
  if (typeof window === 'undefined') return EMPTY_CONSENT
  let stored: string | null = null
  try {
    stored = localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch {
    stored = null
  }
  const records = [parseRecord(readCookie()), parseRecord(stored)].filter(
    (record): record is ConsentRecord => record !== null
  )
  if (records.length === 0) return EMPTY_CONSENT
  records.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))
  return records[0]
}

export function writeConsent(thirdParty: boolean): ConsentRecord {
  const record: ConsentRecord = { thirdParty, ts: Date.now(), version: CONSENT_VERSION }
  const raw = JSON.stringify(record)
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, raw)
  } catch {
    // The cookie still stores the choice if storage is blocked.
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `consent=${encodeURIComponent(raw)}; Max-Age=${SIX_MONTHS_SEC}; Path=/; SameSite=Lax${secure}`
  return record
}

export function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim() ?? '')
    .filter((name) => name === '_ga' || name.startsWith('_ga_'))
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`]
  for (const name of names) {
    for (const domain of domains) {
      const domainPart = domain ? `; domain=${domain}` : ''
      document.cookie = `${name}=; Max-Age=0; Path=/${domainPart}`
    }
  }
}

export function denyAnalyticsConsent() {
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}
