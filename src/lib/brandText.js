// Normalize customer-facing copy from older saved content without changing
// resource addresses, contact details, or identifiers.
export const brandText = (text) => text.replace(
  /https?:\/\/\S+|[\w.+-]+@[\w.-]+|\brobbobo\b/gi,
  (match) => {
    if (!/^robbobo$/i.test(match)) return match
    return match === match.toUpperCase() ? 'ROBOBBO' : 'Robobbo'
  },
)

const resourceFields = /^(id|key|slug|path|route|ctaRoute|targetUrl|url|href|src|image|icon|source|accent|dark|panelBackground|tileBackground|supportEmail|supportPhone)$/i

export const normalizeBrandContent = (value, field = '') => {
  if (resourceFields.test(field)) return value
  if (typeof value === 'string') return brandText(value)
  if (Array.isArray(value)) return value.map((item) => normalizeBrandContent(item, field))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeBrandContent(item, key)]))
  }
  return value
}
