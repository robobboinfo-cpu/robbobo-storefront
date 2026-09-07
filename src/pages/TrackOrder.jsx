import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, CircleHelp, Mail, MapPin, Package, Search, Truck } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { findOrder, loadLocalOrders } from '../lib/localOrderStore'
import { supabase } from '../lib/supabase'

const TRACK_STEPS = [
  { key: 'placed', label: 'Order Placed', offsetHours: 0, detail: 'We received your order and started verification.' },
  { key: 'processing', label: 'Processing', offsetHours: 6, detail: 'Your order is being reviewed and prepared.' },
  { key: 'packed', label: 'Packed', offsetHours: 24, detail: 'Your items are packed and ready for dispatch.' },
  { key: 'shipped', label: 'Shipped', offsetHours: 48, detail: 'The parcel has left the Robbobo fulfillment point.' },
  { key: 'out_for_delivery', label: 'Out for Delivery', offsetHours: 96, detail: 'The courier is on the final delivery route.' },
  { key: 'delivered', label: 'Delivered', offsetHours: 120, detail: 'The order has been delivered successfully.' },
]

const STATUS_TO_STEP = {
  pending: 'placed',
  placed: 'placed',
  processing: 'processing',
  packed: 'packed',
  shipped: 'shipped',
  out_for_delivery: 'out_for_delivery',
  'out for delivery': 'out_for_delivery',
  delivered: 'delivered',
}

const ESTIMATED_DAYS = { placed: 6, processing: 5, packed: 4, shipped: 2, out_for_delivery: 1, delivered: 0 }
const addHours = (dateValue, hours) => new Date(new Date(dateValue).getTime() + hours * 60 * 60 * 1000)
const addDays = (dateValue, days) => addHours(dateValue, days * 24)

const formatDate = (value, options = {}) => {
  if (!value) return 'Not available'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...options })
}

const formatDateTime = (value) => {
  if (!value) return 'Pending update'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Pending update'
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const normalizeOrder = (order) => {
  if (!order) return null
  const createdAt = order.created_at || new Date().toISOString()
  const normalizedStatus = STATUS_TO_STEP[String(order.status || 'processing').toLowerCase()] || 'processing'
  const estimatedDelivery = order.estimated_delivery || addDays(createdAt, ESTIMATED_DAYS[normalizedStatus]).toISOString()
  const items = Array.isArray(order.items) ? order.items : []
  const shippingAddress = order.shipping_address || {}

  return {
    ...order,
    created_at: createdAt,
    status: normalizedStatus,
    statusLabel: TRACK_STEPS.find((step) => step.key === normalizedStatus)?.label || 'Processing',
    estimated_delivery: estimatedDelivery,
    items,
    subtotal: Number(order.subtotal || 0),
    shipping: Number(order.shipping || 0),
    tax: Number(order.tax || 0),
    total: Number(order.total || 0),
    payment_method: order.payment_method || 'cash_on_delivery',
    payment_status: order.payment_status || 'pending',
    customer_name: order.customer_name || `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Customer',
    customer_email: order.customer_email || order.user_email || '',
    shipping_address: shippingAddress,
    deliveryAddress: [shippingAddress.address, shippingAddress.city, shippingAddress.state, shippingAddress.zipCode, shippingAddress.country].filter(Boolean).join(', '),
  }
}

const dedupeOrders = (orders) => {
  const seen = new Set()
  return orders.filter((order) => {
    const key = order.order_number || order.id
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const buildTimeline = (order) => {
  const activeIndex = Math.max(TRACK_STEPS.findIndex((step) => step.key === order.status), 0)
  return TRACK_STEPS.map((step, index) => {
    const fallbackTimestamp = addHours(order.created_at, step.offsetHours).toISOString()
    const timestamp = step.key === 'delivered' && activeIndex < index ? null : fallbackTimestamp
    let state = 'upcoming'
    if (index < activeIndex) state = 'done'
    if (index === activeIndex) state = order.status === 'delivered' ? 'done' : 'active'
    return { ...step, timestamp, state }
  })
}

const buildActivity = (timeline) =>
  timeline
    .filter((step) => step.state !== 'upcoming')
    .map((step) => ({ key: step.key, title: step.label, time: step.timestamp, detail: step.detail, active: step.state === 'active' }))
    .reverse()

const fetchRemoteOrders = async ({ mode, value }) => {
  const queryValue = value.trim()
  if (!queryValue) return []

  if (mode === 'order') {
    const { data, error } = await supabase.from('orders').select('*').eq('order_number', queryValue.toUpperCase()).maybeSingle()
    if (error || !data) return []
    return [data]
  }

  const email = queryValue.toLowerCase()
  const primary = await supabase.from('orders').select('*').eq('customer_email', email).order('created_at', { ascending: false })
  if (!primary.error && Array.isArray(primary.data) && primary.data.length) return primary.data
  const fallback = await supabase.from('orders').select('*').eq('user_email', email).order('created_at', { ascending: false })
  if (!fallback.error && Array.isArray(fallback.data) && fallback.data.length) return fallback.data
  return []
}

const getLocalOrdersForEmail = (email) => {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) return []
  return loadLocalOrders().filter((order) => String(order.customer_email || '').toLowerCase() === normalizedEmail)
}

const TrackOrder = () => {
  const navigate = useNavigate()
  const { siteContent } = useSiteContent()
  const storeBrand = siteContent.storeBrand
  const trackOrderContent = siteContent.trackOrderContent
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('orderNumber') ? 'order' : 'email')
  const [value, setValue] = useState(searchParams.get('orderNumber') || '')
  const [orders, setOrders] = useState([])
  const [selectedOrderKey, setSelectedOrderKey] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sourceNote, setSourceNote] = useState('')

  const selectedOrder = useMemo(() => {
    if (!orders.length) return null
    return orders.find((item) => (item.order_number || item.id) === selectedOrderKey) || orders[0]
  }, [orders, selectedOrderKey])

  const timeline = useMemo(() => (selectedOrder ? buildTimeline(selectedOrder) : []), [selectedOrder])
  const activity = useMemo(() => buildActivity(timeline), [timeline])

  const runSearch = async (searchMode, searchValue) => {
    const trimmed = searchValue.trim()
    if (!trimmed) {
      setSearched(true)
      setOrders([])
      setSelectedOrderKey('')
      setSourceNote('')
      return
    }

    setLoading(true)
    setSearched(true)
    setSourceNote('')

    try {
      const remoteOrders = (await fetchRemoteOrders({ mode: searchMode, value: trimmed })).map(normalizeOrder).filter(Boolean)
      if (remoteOrders.length) {
        const deduped = dedupeOrders(remoteOrders)
        setOrders(deduped)
        setSelectedOrderKey(deduped[0].order_number || deduped[0].id)
        setSourceNote(searchMode === 'email' ? 'Showing tracked orders for this email address.' : 'Live tracking details loaded.')
        setLoading(false)
        return
      }
    } catch {
      // fall back below
    }

    const localOrders = searchMode === 'order' ? [findOrder({ orderNumber: trimmed })] : [findOrder({ email: trimmed }), ...getLocalOrdersForEmail(trimmed)]
    const normalizedLocal = dedupeOrders(localOrders.map(normalizeOrder).filter(Boolean))
    setOrders(normalizedLocal)
    setSelectedOrderKey(normalizedLocal[0]?.order_number || normalizedLocal[0]?.id || '')
    setSourceNote(normalizedLocal.length ? 'Showing saved tracking details from this device.' : '')
    setLoading(false)
  }

  useEffect(() => {
    const presetOrderNumber = searchParams.get('orderNumber')
    if (!presetOrderNumber) return
    setMode('order')
    setValue(presetOrderNumber)
    runSearch('order', presetOrderNumber)
  }, [searchParams])

  const handleSearch = async (event) => {
    event.preventDefault()
    await runSearch(mode, value)
  }

  const activeLabel = selectedOrder?.statusLabel || 'Processing'

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner" style={{ padding: 28 }}>
          <span className="alibaba-badge soft">{trackOrderContent.badge}</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>{trackOrderContent.title}</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: 720 }}>{trackOrderContent.subtitle}</p>
        </section>

        <section className="page-card" style={{ padding: 24 }}>
          <form onSubmit={handleSearch} className="page-grid" style={{ gap: 16 }}>
            <div className="category-chip-row">
              <button type="button" className={`filter-chip ${mode === 'order' ? 'active' : ''}`} onClick={() => setMode('order')}>Order Number</button>
              <button type="button" className={`filter-chip ${mode === 'email' ? 'active' : ''}`} onClick={() => setMode('email')}>Email Search</button>
            </div>
            <div className="toolbar-grid">
              <input className="field" value={value} onChange={(event) => setValue(event.target.value)} placeholder={mode === 'order' ? 'RBB-12345678' : 'you@example.com'} />
              <div />
              <button type="submit" className="btn-primary" disabled={loading}>
                <Search size={14} style={{ marginRight: 8 }} />
                {loading ? 'Searching...' : 'Track order'}
              </button>
            </div>
          </form>
        </section>

        {searched && !loading && !selectedOrder ? (
          <section className="empty-shell page-card">
            <CircleHelp size={28} style={{ margin: '0 auto 12px', color: 'var(--alibaba-orange)' }} />
            <h2 style={{ margin: 0, color: '#222' }}>{trackOrderContent.noOrderTitle}</h2>
            <p className="section-copy" style={{ maxWidth: 520, marginInline: 'auto' }}>{trackOrderContent.noOrderDescription}</p>
            <div className="stack-row" style={{ justifyContent: 'center' }}>
              <button type="button" className="btn-primary" onClick={() => navigate('/account')}>{trackOrderContent.accountButton}</button>
              <button type="button" className="btn-ghost" onClick={() => navigate('/contact')}>{trackOrderContent.contactButton}</button>
            </div>
          </section>
        ) : null}

        {selectedOrder ? (
          <section className="page-grid" style={{ gap: 20 }}>
            {sourceNote ? <div className="notice">{sourceNote}</div> : null}

            {mode === 'email' && orders.length > 1 ? (
              <article className="page-card" style={{ padding: 20 }}>
                <div className="amazon-section-head" style={{ marginBottom: 12 }}>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#222' }}>Orders for this email</h2>
                  <span className="supporting-text">{orders.length} matches</span>
                </div>
                <div className="category-chip-row">
                  {orders.map((order) => {
                    const key = order.order_number || order.id
                    const isActive = key === (selectedOrder.order_number || selectedOrder.id)
                    return (
                      <button key={key} type="button" className={`filter-chip ${isActive ? 'active' : ''}`} onClick={() => setSelectedOrderKey(key)}>
                        {order.order_number} · {formatDate(order.created_at, { month: 'short', day: 'numeric' })}
                      </button>
                    )
                  })}
                </div>
              </article>
            ) : null}

            <article className="page-card track-hero-status" style={{ padding: 24 }}>
              <div>
                <div className="alibaba-badge orange">Current delivery status</div>
                <h2 style={{ margin: '12px 0 6px', color: '#222' }}>{activeLabel}</h2>
                <p className="section-copy" style={{ margin: 0 }}>
                  {selectedOrder.status === 'delivered'
                    ? `Delivered on ${formatDate(selectedOrder.estimated_delivery, { weekday: 'long' })}.`
                    : `Expected by ${formatDate(selectedOrder.estimated_delivery, { weekday: 'long' })}. Your order is being handled by ${storeBrand.name} Delivery.`}
                </p>
              </div>
              <div className="track-hero-map">
                <div className="track-hero-route" />
                <Truck size={22} color="#9a3412" />
                <MapPin size={22} color="#9a3412" />
              </div>
            </article>

            <div className="split-grid" style={{ gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)', gap: 20 }}>
              <article className="page-card" style={{ padding: 24 }}>
                <div className="stack-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="alibaba-badge soft">Tracking summary</span>
                    <h2 style={{ margin: '12px 0 6px', color: '#222' }}>{selectedOrder.order_number || selectedOrder.id}</h2>
                    <div className="supporting-text">Placed on {formatDate(selectedOrder.created_at)}</div>
                    <div className="supporting-text">Estimated delivery: {formatDate(selectedOrder.estimated_delivery)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price-main">GHc{selectedOrder.total.toFixed(2)}</div>
                    <div className="supporting-text" style={{ textTransform: 'capitalize' }}>{String(selectedOrder.payment_method).replace(/_/g, ' ')}</div>
                  </div>
                </div>

                <div className="three-col-grid" style={{ marginTop: 20, gap: 16, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                  <div className="info-card" style={{ padding: 16 }}>
                    <div className="alibaba-panel-title">Customer</div>
                    <strong style={{ color: '#222' }}>{selectedOrder.customer_name}</strong>
                    <div className="supporting-text" style={{ marginTop: 6 }}>{selectedOrder.customer_email || 'Email not available'}</div>
                  </div>
                  <div className="info-card" style={{ padding: 16 }}>
                    <div className="alibaba-panel-title">Delivery address</div>
                    <strong style={{ color: '#222' }}>{selectedOrder.deliveryAddress || 'Address not available'}</strong>
                  </div>
                  <div className="info-card" style={{ padding: 16 }}>
                    <div className="alibaba-panel-title">Current status</div>
                    <strong style={{ color: '#222' }}>{selectedOrder.statusLabel}</strong>
                    <div className="supporting-text" style={{ marginTop: 6 }}>Payment status: {String(selectedOrder.payment_status).replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </article>

              <aside className="page-grid" style={{ gap: 20 }}>
                <article className="page-card" style={{ padding: 24 }}>
                  <div className="stack-row" style={{ alignItems: 'center', gap: 10 }}>
                    <MapPin size={18} color="#ff5a0a" />
                    <h3 style={{ margin: 0, color: '#222' }}>Delivery information</h3>
                  </div>
                  <div className="page-grid" style={{ gap: 10, marginTop: 14 }}>
                    <div>
                      <div className="supporting-text">Shipping address</div>
                      <strong style={{ color: '#222' }}>{selectedOrder.deliveryAddress || 'Address not available'}</strong>
                    </div>
                    <div>
                      <div className="supporting-text">Estimated delivery</div>
                      <strong style={{ color: '#222' }}>{formatDate(selectedOrder.estimated_delivery, { weekday: 'short' })}</strong>
                    </div>
                    <div>
                      <div className="supporting-text">{trackOrderContent.carrierNoteLabel}</div>
                      <strong style={{ color: '#222' }}>{trackOrderContent.carrierNoteText}</strong>
                    </div>
                  </div>
                </article>

                <article className="page-card" style={{ padding: 24 }}>
                  <div className="stack-row" style={{ alignItems: 'center', gap: 10 }}>
                    <Mail size={18} color="#ff5a0a" />
                    <h3 style={{ margin: 0, color: '#222' }}>{trackOrderContent.helpTitle}</h3>
                  </div>
                  <div className="page-grid" style={{ gap: 12, marginTop: 14 }}>
                    <button type="button" className="btn-primary" onClick={() => navigate('/contact')}>{trackOrderContent.contactSupportOrderButton}</button>
                    <button type="button" className="btn-ghost" onClick={() => navigate('/account')}>{trackOrderContent.viewAllOrdersButton}</button>
                  </div>
                </article>
              </aside>
            </div>

            <article className="page-card" style={{ padding: 24 }}>
              <div className="stack-row" style={{ alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <Truck size={18} color="#ff5a0a" />
                <h3 style={{ margin: 0, color: '#222' }}>{trackOrderContent.shipmentProgressTitle}</h3>
              </div>
              <div className="track-stepper">
                {timeline.map((step) => (
                  <div key={step.key} className={`track-step ${step.state}`}>
                    <div className="track-step-node">
                      {step.state === 'done' ? <Check size={14} /> : <span />}
                    </div>
                    <strong>{step.label}</strong>
                    <span>{formatDateTime(step.timestamp)}</span>
                  </div>
                ))}
              </div>
            </article>

            <div className="split-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 20 }}>
              <article className="page-card" style={{ padding: 24 }}>
                <div className="stack-row" style={{ alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <Package size={18} color="#ff5a0a" />
                  <h3 style={{ margin: 0, color: '#222' }}>{trackOrderContent.itemsTitle}</h3>
                </div>
                <div className="page-grid" style={{ gap: 14 }}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={`${selectedOrder.order_number || selectedOrder.id}-${index}`} className="result-item page-card" style={{ padding: 16, borderRadius: 16 }}>
                      <button type="button" className="order-thumb" style={{ width: 72, height: 72, border: 'none', padding: 0, cursor: item.id ? 'pointer' : 'default' }} onClick={() => item.id && navigate(`/product/${item.id}`)}>
                        {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </button>
                      <div>
                        <strong style={{ color: '#222' }}>{item.name}</strong>
                        <div className="supporting-text">Quantity: {item.quantity}</div>
                        <div className="supporting-text">Unit price: GHc{Number(item.price || 0).toFixed(2)}</div>
                      </div>
                      <strong>GHc{Number(item.subtotal || Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="page-card" style={{ padding: 24 }}>
                <h3 style={{ marginTop: 0, color: '#222' }}>{trackOrderContent.shipmentActivityTitle}</h3>
                <div className="track-activity-list">
                  {activity.map((entry) => (
                    <div key={entry.key} className={`track-activity-item ${entry.active ? 'active' : ''}`}>
                      <div className="track-activity-dot" />
                      <div>
                        <strong>{entry.title}</strong>
                        <div className="supporting-text">{formatDateTime(entry.time)}</div>
                        <div className="supporting-text" style={{ marginTop: 4 }}>{entry.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default TrackOrder
