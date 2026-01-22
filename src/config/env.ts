const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`)
const normalizeEnv = (value?: string) => value?.trim() ?? ''

const env = {
  apiBaseUrl: normalizeEnv(import.meta.env.VITE_API_BASE_URL),
  contactPath: normalizeEnv(import.meta.env.VITE_CONTACT_PATH) || '/contact',
  recaptchaSiteKey: normalizeEnv(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  portfolioTemplateUrl: normalizeEnv(import.meta.env.VITE_PORTFOLIO_TEMPLATE_URL),
}

function apiUrl (path: string) {
  const normalized = normalizePath(path)
  if (!env.apiBaseUrl) {
    return normalized
  }
  try {
    return new URL(normalized, env.apiBaseUrl).toString()
  } catch {
    return normalized
  }
}

export { apiUrl, env }
