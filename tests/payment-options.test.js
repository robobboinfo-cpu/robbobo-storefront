import test from 'node:test'
import assert from 'node:assert/strict'
import process from 'node:process'
import handler from '../api/paystack/initialize.js'

test('payment initialization validates current choices and preserves them in payment metadata', async () => {
  const originalFetch = globalThis.fetch
  const previous = { ...process.env }
  process.env.PAYSTACK_SECRET_KEY = 'test-only'
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-only'
  const payments = []
  globalThis.fetch = async (input, init) => {
    const url = String(input?.url || input)
    if (url.includes('/rest/v1/products')) return new Response(JSON.stringify([{ id: 'shirt', name: 'Shirt', price: 100, status: 'active', specs: { __options: { enabled: true, groups: [{ name: 'Size', values: ['M', 'L'] }] } } }]), { headers: { 'Content-Type': 'application/json' } })
    if (url === 'https://api.paystack.co/transaction/initialize') {
      const payment = JSON.parse(init.body)
      assert.equal(typeof payment.metadata, 'string', 'Paystack metadata must be a JSON string')
      payments.push(payment)
      return new Response(JSON.stringify({ status: true, data: { access_code: 'mock' } }), { headers: { 'Content-Type': 'application/json' } })
    }
    throw new Error(`Unexpected request: ${url}`)
  }
  const run = async (items) => {
    const response = { status(code) { this.code = code; return this }, json(body) { this.body = body; return this } }
    await handler({ method: 'POST', body: { email: 'test@example.com', items }, headers: { host: 'localhost' } }, response)
    return response
  }
  try {
    assert.equal((await run([{ id: 'shirt', quantity: 1 }])).code, 400)
    assert.equal((await run([{ id: 'shirt', quantity: 1, selectedOptions: { Size: 'XXL' } }])).code, 400)
    assert.equal(payments.length, 0)
    const items = [{ id: 'shirt', quantity: 1, selectedOptions: { Size: 'M' } }, { id: 'shirt', quantity: 2, selectedOptions: { Size: 'L' } }]
    assert.equal((await run(items)).code, 200)
    assert.deepEqual(JSON.parse(payments[0].metadata).cart_items, items)
    assert.equal(payments[0].amount, 30000)
    assert.equal(JSON.parse(payments[0].metadata).order_total, 300)
    // Above the former free-shipping/discount threshold, charge only products too.
    assert.equal((await run([{ id: 'shirt', quantity: 6, selectedOptions: { Size: 'M' }, price: 1 }])).code, 200)
    assert.equal(payments[1].amount, 60000)
  } finally {
    globalThis.fetch = originalFetch
    for (const name of ['PAYSTACK_SECRET_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']) {
      if (previous[name] === undefined) delete process.env[name]
      else process.env[name] = previous[name]
    }
  }
})
