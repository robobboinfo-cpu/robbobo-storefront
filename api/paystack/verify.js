import process from 'node:process'

const json = (response, status, body) => response.status(status).json(body)

export default async function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error: 'Method not allowed' })
  if (!process.env.PAYSTACK_SECRET_KEY) return json(response, 500, { error: 'Paystack is not configured.' })
  const reference = String(request.query?.reference || '')
  if (!/^[A-Za-z0-9.=-]+$/.test(reference)) return json(response, 400, { error: 'Invalid transaction reference.' })

  const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })
  const result = await paystackResponse.json()
  const transaction = result.data
  if (!paystackResponse.ok || !result.status || transaction?.status !== 'success') return json(response, 400, { error: result.message || 'Payment was not successful.' })
  if (transaction.currency !== 'GHS') return json(response, 400, { error: 'Unexpected payment currency.' })
  return json(response, 200, { verified: true, reference: transaction.reference, amount: transaction.amount, currency: transaction.currency, channel: transaction.channel, paidAt: transaction.paid_at })
}
