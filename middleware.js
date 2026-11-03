import { next } from '@vercel/functions'

// Target the crawler observed in visitor records, not countries or all bots.
export default function middleware(request) {
  const path = new URL(request.url).pathname
  const isPageRead = request.method === 'GET' || request.method === 'HEAD'
  const reflectionCrawler = /\bReflectionbot(?:\/|\b)/i.test(request.headers.get('user-agent') || '')
  if (isPageRead && reflectionCrawler && path !== '/robots.txt' && !path.startsWith('/api/')) {
    return new Response('This crawler is not permitted to access this website.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store', Vary: 'User-Agent' },
    })
  }
  return next()
}

export const config = { matcher: '/((?!api/|assets/|images/|robots.txt).*)' }
