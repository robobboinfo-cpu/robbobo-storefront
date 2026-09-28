export function normalizeGhanaPhone(value) {
  const compact = String(value || '').replace(/[\s()-]/g, '')
  const national = compact.replace(/^(?:\+233|00233|233|0)/, '')
  return /^[1-9]\d{8}$/.test(national) ? `+233${national}` : null
}
