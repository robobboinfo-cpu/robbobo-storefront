import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'
import initializePaystack from './api/paystack/initialize.js'
import verifyPaystack from './api/paystack/verify.js'

const readJsonBody = (request) => new Promise((resolve, reject) => {
  let body = ''
  request.on('data', (chunk) => {
    body += chunk
    if (body.length > 1_000_000) reject(new Error('Request body is too large.'))
  })
  request.on('end', () => {
    try { resolve(body ? JSON.parse(body) : {}) } catch (error) { reject(error) }
  })
  request.on('error', reject)
})

const paystackDevApi = () => ({
  name: 'robbobo-paystack-dev-api',
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      const url = new URL(request.url, 'http://localhost')
      const handler = url.pathname === '/api/paystack/initialize'
        ? initializePaystack
        : url.pathname === '/api/paystack/verify'
          ? verifyPaystack
          : null
      if (!handler) return next()

      response.status = (statusCode) => { response.statusCode = statusCode; return response }
      response.json = (payload) => {
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify(payload))
        return response
      }

      try {
        request.query = Object.fromEntries(url.searchParams)
        request.body = request.method === 'POST' ? await readJsonBody(request) : {}
        await handler(request, response)
      } catch (error) {
        response.status(500).json({ error: error?.message || 'Payment service error.' })
      }
    })
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.PAYSTACK_SECRET_KEY = env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY
  process.env.APP_URL = env.APP_URL || process.env.APP_URL
  process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
  process.env.VITE_SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  return { plugins: [react(), paystackDevApi()] }
})
