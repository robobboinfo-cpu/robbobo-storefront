const header = (request, name) => {
  const value = request.headers[name]
  const text = String(Array.isArray(value) ? value[0] : value || '').slice(0, 200)
  try { return decodeURIComponent(text) } catch { return text }
}

// Vercel supplies approximate IP-derived location. Never cache across visitors
// or retain their IP address. No browser location permission is needed.
export default function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0')
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })
  return response.status(200).json({
    city: header(request, 'x-vercel-ip-city'),
    region: header(request, 'x-vercel-ip-country-region'),
    country: header(request, 'x-vercel-ip-country'),
  })
}
