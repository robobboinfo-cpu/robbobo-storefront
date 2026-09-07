import { useMemo, useState } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import PaystackPop from '@paystack/inline-js'
import { supabase } from '../lib/supabase'
import { saveLocalOrder } from '../lib/localOrderStore'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const buildOrderNumber = () => `RBB-${Date.now().toString().slice(-8)}`
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''))
const isOrdersRlsError = (error) => error?.code === '42501' || /row-level security policy/i.test(error?.message || '')

const Checkout = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentReference = searchParams.get('reference') || searchParams.get('trxref') || ''
  const isPaymentReturn = Boolean(paymentReference)
  const { cartItems, cartTotal, clearCart } = useCart()
  const { currentUser } = useAuth()
  const accountEmail = String(currentUser?.email || '').trim().toLowerCase()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: accountEmail || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Ghana',
  })
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderComplete, setOrderComplete] = useState(null)
  const [error, setError] = useState('')
  const [savedLocallyNotice, setSavedLocallyNotice] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('paystack')
  const [verifyingPayment, setVerifyingPayment] = useState(isPaymentReturn)
  const verificationStarted = useRef(false)

  const shipping = useMemo(() => (cartTotal >= 500 ? 0 : 35), [cartTotal])
  const tax = useMemo(() => Number((cartTotal * 0.05).toFixed(2)), [cartTotal])
  const total = useMemo(() => Number((cartTotal + shipping + tax).toFixed(2)), [cartTotal, shipping, tax])

  const completePaystackOrder = useCallback(async (reference, pendingRaw) => {
    const pending = JSON.parse(pendingRaw)
    if (pending.reference !== reference) throw new Error('Payment reference does not match the pending order.')

    const verifyResponse = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
    const verification = await verifyResponse.json()
    if (!verifyResponse.ok || !verification.verified) throw new Error(verification.error || 'Payment verification failed.')
    if (verification.amount !== Math.round(Number(pending.order.total) * 100)) throw new Error('The amount paid does not match the order total.')

    const paidOrder = { ...pending.order, payment_status: 'paid', payment_method: 'paystack', payment_reference: reference, paid_at: verification.paidAt }
    const { data, error: supabaseError } = await supabase.from('orders').insert([paidOrder]).select().single()
    const saved = supabaseError || !data ? { ...paidOrder, saved_locally: true } : data
    saveLocalOrder(saved)
    clearCart()
    setOrderComplete(saved)
    setSavedLocallyNotice(Boolean(supabaseError || !data))
    window.sessionStorage.removeItem('robbobo_pending_paystack_order')
    window.history.replaceState({}, '', '/checkout')
  }, [clearCart])

  useEffect(() => {
    const reference = paymentReference
    if (!reference || verificationStarted.current) return
    verificationStarted.current = true
    const pendingRaw = window.sessionStorage.getItem('robbobo_pending_paystack_order')
    if (!pendingRaw) {
      setError('Pending order details were not found. Please contact support with your Paystack reference.')
      setVerifyingPayment(false)
      return
    }

    const verifyPayment = async () => {
      setPlacingOrder(true)
      try {
        await completePaystackOrder(reference, pendingRaw)
      } catch (caughtError) {
        setError(caughtError?.message || 'Unable to verify payment.')
      } finally {
        setPlacingOrder(false)
        setVerifyingPayment(false)
      }
    }
    verifyPayment()
  }, [completePaystackOrder, paymentReference])

  if (!cartItems.length && !orderComplete && !isPaymentReturn) return <Navigate to="/cart" replace />

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const placeOrder = async () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country']
    const missing = requiredFields.find((field) => !formData[field]?.trim())
    if (missing) {
      setError('Please complete all required shipping fields.')
      return
    }

    setPlacingOrder(true)
    setError('')

    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    const orderEmail = accountEmail || String(formData.email || '').trim().toLowerCase()
    const orderPayload = {
      order_number: buildOrderNumber(),
      customer_id: isUuid(currentUser?.id) ? currentUser.id : null,
      customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
      customer_email: orderEmail,
      user_email: orderEmail,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        subtotal: Number((item.price * item.quantity).toFixed(2)),
      })),
      subtotal: Number(cartTotal.toFixed(2)),
      shipping,
      tax,
      total,
      status: 'processing',
      payment_status: 'pending',
      payment_method: 'cash_on_delivery',
      shipping_method: 'standard',
      estimated_delivery: estimatedDelivery,
      shipping_address: { ...formData, email: orderEmail },
      created_at: new Date().toISOString(),
    }

    try {
      if (paymentMethod === 'paystack') {
        const initializeResponse = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: orderEmail, items: cartItems.map(({ id, quantity }) => ({ id, quantity })) }),
        })
        const payment = await initializeResponse.json().catch(() => null)
        if (!payment) throw new Error('The Paystack payment service is unavailable. Run the app with Vercel Dev or use the deployed site.')
        if (!initializeResponse.ok || !payment.access_code) throw new Error(payment.error || 'Unable to start Paystack checkout.')
        if (payment.amount !== Math.round(total * 100)) throw new Error('Payment total does not match the order total.')
        const pendingRaw = JSON.stringify({ reference: payment.reference, order: { ...orderPayload, payment_method: 'paystack' } })
        window.sessionStorage.setItem('robbobo_pending_paystack_order', pendingRaw)

        const popup = new PaystackPop()
        popup.resumeTransaction(payment.access_code, {
          onSuccess: async (transaction) => {
            setPlacingOrder(true)
            setVerifyingPayment(true)
            setError('')
            try {
              await completePaystackOrder(transaction.reference || payment.reference, pendingRaw)
            } catch (caughtError) {
              setError(caughtError?.message || 'Unable to verify payment.')
            } finally {
              setVerifyingPayment(false)
              setPlacingOrder(false)
            }
          },
          onCancel: () => {
            setError('Payment was cancelled. Your cart has not been changed.')
            setPlacingOrder(false)
          },
          onError: (paystackError) => {
            setError(paystackError?.message || 'Paystack could not complete the payment.')
            setPlacingOrder(false)
          },
        })
        return
      }

      const { data, error: supabaseError } = await supabase.from('orders').insert([orderPayload]).select().single()
      if (supabaseError) {
        console.error('[Checkout] Supabase order insert failed:', supabaseError.message, supabaseError)
        if (isOrdersRlsError(supabaseError)) {
          console.warn('[Checkout] Orders policy fix required: apply SUPABASE_LIVE_ORDERS_FIX.sql in Supabase.')
        }
      }
      const saved = supabaseError ? { ...orderPayload, saved_locally: true } : data
      saveLocalOrder(saved)
      clearCart()
      setOrderComplete(saved)
      setSavedLocallyNotice(Boolean(supabaseError))
    } catch (caughtError) {
      console.error('[Checkout] Unexpected order error:', caughtError)
      if (paymentMethod === 'paystack') {
        setError(caughtError?.message || 'Unable to start Paystack checkout. Please try again.')
        return
      }
      const fallbackOrder = { ...orderPayload, saved_locally: true }
      saveLocalOrder(fallbackOrder)
      clearCart()
      setOrderComplete(fallbackOrder)
      setSavedLocallyNotice(true)
      setError(caughtError?.message || '')
    } finally {
      setPlacingOrder(false)
    }
  }

  if (isPaymentReturn && verifyingPayment && !orderComplete) {
    return (
      <div className="page-section">
        <div className="page-shell">
          <div className="empty-shell page-card">
            <span className="alibaba-badge orange">Confirming payment</span>
            <h1 className="section-title" style={{ marginTop: 14 }}>Please wait...</h1>
            <p className="section-copy">We are securely verifying your Paystack payment and preparing your order.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isPaymentReturn && error && !orderComplete) {
    return (
      <div className="page-section">
        <div className="page-shell">
          <div className="empty-shell page-card">
            <span className="alibaba-badge orange">Payment verification</span>
            <h1 className="section-title" style={{ marginTop: 14 }}>We could not confirm your order</h1>
            <p className="section-copy">{error}</p>
            <div className="stack-row" style={{ justifyContent: 'center', marginTop: 18 }}>
              <button type="button" className="btn-primary" onClick={() => window.location.reload()}>Try verification again</button>
              <button type="button" className="btn-ghost" onClick={() => navigate('/contact')}>Contact support</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="page-section">
        <div className="page-shell">
          <div className="empty-shell page-card">
            <span className="alibaba-badge orange">Order confirmed</span>
            <h1 className="section-title" style={{ marginTop: 14 }}>Your order is on its way!</h1>
            <p className="section-copy">Thank you for shopping at Robbobo. We'll process your order as quickly as possible.</p>
            <div className="summary-card" style={{ maxWidth: 360, margin: '18px auto 0' }}>
              <div style={{ fontWeight: 800, color: '#222' }}>{orderComplete.order_number}</div>
              <div className="supporting-text" style={{ marginTop: 6 }}>Total: GHc{Number(orderComplete.total).toFixed(2)}</div>
              <div className="supporting-text">Payment: {orderComplete.payment_method === 'paystack' ? 'Paid securely with Paystack' : 'Cash on delivery'}</div>
            </div>
            {(savedLocallyNotice || orderComplete.saved_locally) ? (
              <div className="notice" style={{ maxWidth: 520, margin: '16px auto 0' }}>
                Your order is confirmed on this device. If you need help before live tracking appears, keep your order number and contact support.
              </div>
            ) : null}
            <div className="stack-row" style={{ justifyContent: 'center', marginTop: 18 }}>
              {currentUser ? <button type="button" className="btn-primary" onClick={() => navigate('/account')}>View my orders</button> : <button type="button" className="btn-primary" onClick={() => navigate('/products')}>Continue shopping</button>}
              <button type="button" className="btn-ghost" onClick={() => navigate('/track')}>Track order</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">Checkout</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>Complete your order</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Enter your shipping details to confirm your Robbobo order.
          </p>
        </section>

        <section className="checkout-layout">
          <div className="page-card" style={{ padding: 24 }}>
            <h2 style={{ marginTop: 0, color: '#222' }}>Shipping information</h2>
            <div className="form-grid two">
              {[
                ['firstName', 'First name'],
                ['lastName', 'Last name'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['address', 'Address'],
                ['city', 'City'],
                ['state', 'State / Region'],
                ['zipCode', 'Zip code'],
              ].map(([name, label]) => (
                <label key={name} className="page-grid" style={{ gap: 8 }}>
                  <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>{label}</span>
                  <input
                    className="field"
                    name={name}
                    value={name === 'email' ? (accountEmail || formData.email) : formData[name]}
                    onChange={onChange}
                    readOnly={name === 'email' && Boolean(accountEmail)}
                  />
                </label>
              ))}
              <label className="page-grid" style={{ gap: 8 }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Country</span>
                <input className="field" name="country" value={formData.country} onChange={onChange} />
              </label>
            </div>
            {error ? <div className="alert" style={{ marginTop: 16 }}>{error}</div> : null}
          </div>

          <aside className="page-grid">
            <div className="summary-card">
              <h2 style={{ margin: 0, color: '#222' }}>Order summary</h2>
              <div className="page-grid" style={{ gap: 12, marginTop: 16 }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="order-thumb">
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <strong style={{ color: '#222' }}>{item.name}</strong>
                      <div className="supporting-text">Qty {item.quantity}</div>
                    </div>
                    <strong>GHc{(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <div className="summary-lines" style={{ marginTop: 18 }}>
                <div className="summary-line"><span>Subtotal</span><strong>GHc{cartTotal.toFixed(2)}</strong></div>
                <div className="summary-line"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : `GHc${shipping.toFixed(2)}`}</strong></div>
                <div className="summary-line"><span>Tax (5%)</span><strong>GHc{tax.toFixed(2)}</strong></div>
              </div>
              <div className="summary-total">
                <span style={{ fontWeight: 700, color: '#222' }}>Total</span>
                <span className="price-main">GHc{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-card checkout-payment-methods">
              <h3>Payment method</h3>
              <label className={paymentMethod === 'paystack' ? 'active' : ''}>
                <input type="radio" name="paymentMethod" value="paystack" checked={paymentMethod === 'paystack'} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span><strong>Paystack</strong><small>Card, mobile money, bank and other available methods</small></span>
              </label>
              <label className={paymentMethod === 'cash_on_delivery' ? 'active' : ''}>
                <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={(event) => setPaymentMethod(event.target.value)} />
                <span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span>
              </label>
            </div>
            <button type="button" className="btn-secondary" style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: 8 }} onClick={placeOrder} disabled={placingOrder}>
              {placingOrder ? (paymentMethod === 'paystack' ? 'Connecting to Paystack...' : 'Placing order...') : (paymentMethod === 'paystack' ? `Pay GHc${total.toFixed(2)} with Paystack` : 'Place order')}
            </button>
            <div className="info-card">
              <div className="supporting-text">Paystack payments are verified securely before your order is confirmed. Your secret payment credentials never pass through Robbobo.</div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default Checkout
