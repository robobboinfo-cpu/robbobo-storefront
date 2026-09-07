import allProducts from '../../src/data/products.js'
import process from 'node:process'
import { createClient } from '@supabase/supabase-js'

const json = (response, status, body) => response.status(status).json(body)

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'Method not allowed' })
  if (!process.env.PAYSTACK_SECRET_KEY) return json(response, 500, { error: 'Paystack is not configured.' })

  const email = String(request.body?.email || '').trim().toLowerCase()
  const requestedItems = Array.isArray(request.body?.items) ? request.body.items : []
  if (!/^\S+@\S+\.\S+$/.test(email) || !requestedItems.length) return json(response, 400, { error: 'A valid email and cart are required.' })

  const catalog = new Map(allProducts.map((product) => [String(product.id), product]))
  const supabaseUrl = String(process.env.VITE_SUPABASE_URL || '').trim()
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (/^https?:\/\//i.test(supabaseUrl) && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
      const { data: remoteProducts } = await supabase
        .from('products')
        .select('id,name,price,status')
        .eq('status', 'active')
      for (const product of remoteProducts || []) catalog.set(String(product.id), product)
    } catch (error) {
      console.warn('[Paystack] Remote product validation unavailable; using bundled catalog.', error?.message)
    }
  }
  const items = requestedItems.map((item) => {
    const product = catalog.get(String(item.id))
    const quantity = Math.max(1, Math.min(99, Number.parseInt(item.quantity, 10) || 1))
    return product ? { id: product.id, name: product.name, price: Number(product.price), quantity } : null
  }).filter(Boolean)
  if (items.length !== requestedItems.length) return json(response, 400, { error: 'One or more products are invalid.' })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 500 ? 0 : 35
  const tax = Number((subtotal * 0.05).toFixed(2))
  const total = Number((subtotal + shipping + tax).toFixed(2))
  const amount = Math.round(total * 100)
  const reference = `RBB-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
  const protocol = request.headers['x-forwarded-proto'] || (request.headers.host?.includes('localhost') ? 'http' : 'https')
  const origin = process.env.APP_URL || `${protocol}://${request.headers.host}`

  const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      amount,
      currency: 'GHS',
      reference,
      callback_url: `${origin}/checkout`,
      metadata: { order_total: total, cart_items: items.map(({ id, quantity }) => ({ id, quantity })) },
    }),
  })
  const result = await paystackResponse.json()
  if (!paystackResponse.ok || !result.status) return json(response, 502, { error: result.message || 'Unable to initialize payment.' })
  return json(response, 200, { ...result.data, amount, currency: 'GHS' })
}
