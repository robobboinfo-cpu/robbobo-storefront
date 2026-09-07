import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, PackageSearch, RotateCcw, ShieldCheck, Truck, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getOrdersForUser } from '../lib/localOrderStore'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const STATUS_STYLES = {
  processing: { background: '#fef3c7', color: '#92400e' },
  packed: { background: '#dbeafe', color: '#1d4ed8' },
  shipped: { background: '#ede9fe', color: '#6d28d9' },
  delivered: { background: '#dcfce7', color: '#166534' },
}

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''))

const Account = () => {
  const { currentUser, logout } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [remoteOrders, setRemoteOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState({})
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    if (!currentUser) return
    const fetchOrders = async () => {
      setOrdersLoading(true)
      setOrdersError('')

      try {
        const normalizedEmail = String(currentUser.email || '').trim().toLowerCase()
        const remoteResults = []

        if (isUuid(currentUser.id)) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', currentUser.id)
            .order('created_at', { ascending: false })

          if (error) {
            setRemoteOrders([])
            setOrdersError('Live order sync is unavailable. Showing saved account data only.')
            setOrdersLoading(false)
            return
          }

          remoteResults.push(...(data || []))
        }

        if (normalizedEmail) {
          const [{ data: customerEmailData, error: customerEmailError }, { data: userEmailData, error: userEmailError }] = await Promise.all([
            supabase
              .from('orders')
              .select('*')
              .eq('customer_email', normalizedEmail)
              .order('created_at', { ascending: false }),
            supabase
              .from('orders')
              .select('*')
              .eq('user_email', normalizedEmail)
              .order('created_at', { ascending: false }),
          ])

          if (customerEmailError || userEmailError) {
            setRemoteOrders([])
            setOrdersError('Live order sync is unavailable. Showing saved account data only.')
            setOrdersLoading(false)
            return
          }

          remoteResults.push(...(customerEmailData || []), ...(userEmailData || []))
        }

        const seen = new Set()
        const deduped = remoteResults.filter((order) => {
          const key = order.order_number || order.id
          if (!key || seen.has(key)) return false
          seen.add(key)
          return true
        })

        deduped.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        setRemoteOrders(deduped)
      } catch {
        setRemoteOrders([])
        setOrdersError('Live order sync is unavailable. Showing saved account data only.')
      } finally {
        setOrdersLoading(false)
      }
    }
    fetchOrders()
  }, [currentUser])

  const orders = useMemo(() => {
    const localOrders = getOrdersForUser(currentUser)
    const all = [...remoteOrders, ...localOrders]
    const seen = new Set()
    return all.filter((order) => {
      const key = order.order_number || order.id
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [currentUser, remoteOrders])

  const toggleExpanded = (orderKey) => {
    setExpandedOrders((current) => ({ ...current, [orderKey]: !current[orderKey] }))
  }

  const reorderItems = (items = []) => {
    items.forEach((item) => addToCart(item, item.quantity || 1))
  }

  if (!currentUser) {
    return (
      <div className="page-section">
        <div className="page-shell">
          <div className="empty-shell page-card">
            <h2 style={{ margin: '0 0 12px', color: '#222' }}>Sign in to view your account</h2>
            <button type="button" className="btn-primary" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </div>
      </div>
    )
  }

  const firstName = (currentUser.name || currentUser.email || 'Customer').split(' ')[0]
  const totalOrders = orders.length
  const deliveredOrders = orders.filter((order) => String(order.status || '').toLowerCase() === 'delivered').length
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">My account</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>
            Hello, {firstName}
          </h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Manage your orders, profile, and account settings.
          </p>
        </section>

        <section className="three-col-grid">
          <div className="info-card">
            <div className="alibaba-panel-title">Orders placed</div>
            <div className="price-main">{totalOrders}</div>
            <div className="supporting-text">Across local and synced order history</div>
          </div>
          <div className="info-card">
            <div className="alibaba-panel-title">Delivered orders</div>
            <div className="price-main">{deliveredOrders}</div>
            <div className="supporting-text">Completed deliveries on this account</div>
          </div>
          <div className="info-card">
            <div className="alibaba-panel-title">Total spent</div>
            <div className="price-main">GHc{totalSpent.toFixed(2)}</div>
            <div className="supporting-text">Combined total across all saved orders</div>
          </div>
        </section>

        <section className="account-layout">
          <aside className="page-grid profile-panel">
            <div className="dashboard-card">
              <div className="alibaba-action-icon" style={{ width: 72, height: 72, marginBottom: 14, background: '#f3f3f3' }}>
                <User size={28} />
              </div>
              <h2 style={{ margin: 0, color: '#222' }}>{currentUser.name}</h2>
              <p className="supporting-text">{currentUser.email}</p>
              <div className="page-grid" style={{ gap: 10, marginTop: 18 }}>
                <button type="button" className="btn-ghost" onClick={() => navigate('/track')}>
                  <PackageSearch size={14} /> Track order
                </button>
                <button type="button" className="btn-dark" onClick={() => { logout(); navigate('/') }}>
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </div>

            <div className="info-card" style={{ background: '#f0fdf4' }}>
              <div className="stack-row" style={{ alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={16} color="#0f9d58" />
                <strong style={{ color: '#222' }}>Verified account</strong>
              </div>
              <p className="supporting-text" style={{ marginBottom: 0, marginTop: 6 }}>
                Your orders and personal data are protected and stored securely.
              </p>
            </div>

            <div className="info-card">
              <div className="alibaba-panel-title">Profile details</div>
              <div className="page-grid" style={{ gap: 8 }}>
                <div className="supporting-text"><strong style={{ color: '#222' }}>Full name:</strong> {currentUser.name}</div>
                <div className="supporting-text"><strong style={{ color: '#222' }}>Email:</strong> {currentUser.email}</div>
                <div className="supporting-text"><strong style={{ color: '#222' }}>Account mode:</strong> {currentUser.user_metadata?.local_fallback ? 'Offline fallback account' : 'Connected account'}</div>
                <div className="supporting-text"><strong style={{ color: '#222' }}>Customer ID:</strong> {currentUser.id}</div>
              </div>
            </div>
          </aside>

          <div className="page-grid">
            <div className="dashboard-card">
              <h2 style={{ marginTop: 0, color: '#222' }}>Order history</h2>
              <p className="supporting-text">Orders you've placed through checkout.</p>
              {ordersError ? <div className="notice" style={{ marginBottom: 14 }}>{ordersError}</div> : null}
              {ordersLoading ? <p className="supporting-text">Loading orders...</p> : null}
              {!ordersLoading && !orders.length ? (
                <div className="empty-shell" style={{ padding: 24 }}>
                  <p style={{ margin: 0, color: '#565959' }}>No orders yet. <button type="button" style={{ border: 'none', background: 'none', color: 'var(--alibaba-orange-strong)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/products')}>Start shopping</button></p>
                </div>
              ) : null}
              <div className="page-grid" style={{ gap: 14 }}>
                {orders.map((order) => (
                  <article key={order.order_number || order.id} className="page-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: 18, borderBottom: '1px solid #e5e7eb', background: '#f7f7f8', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <strong style={{ display: 'block', color: '#222' }}>{order.order_number || order.id}</strong>
                        <span className="supporting-text">{new Date(order.created_at).toLocaleString()}</span>
                        <div className="supporting-text" style={{ marginTop: 6 }}>{(order.items || []).length} items</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          className="alibaba-badge soft"
                          style={STATUS_STYLES[(order.status || 'processing').toLowerCase()] || STATUS_STYLES.processing}
                        >
                          {order.status}
                        </span>
                        <div style={{ marginTop: 8, fontWeight: 800, color: '#222' }}>GHc{Number(order.total).toFixed(2)}</div>
                        <div className="supporting-text" style={{ marginTop: 6 }}>
                          Payment: {(order.payment_method || 'cash_on_delivery').replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: 18 }} className="page-grid">
                      <div className="summary-lines" style={{ marginBottom: 6 }}>
                        <div className="summary-line"><span>Subtotal</span><strong>GHc{Number(order.subtotal || 0).toFixed(2)}</strong></div>
                        <div className="summary-line"><span>Shipping</span><strong>GHc{Number(order.shipping || 0).toFixed(2)}</strong></div>
                        <div className="summary-line"><span>Tax</span><strong>GHc{Number(order.tax || 0).toFixed(2)}</strong></div>
                      </div>
                      {(order.items || []).map((item, index) => (
                        <div key={`${order.order_number}-${index}`} className="order-item">
                          <div className="order-thumb">
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                          </div>
                          <div>
                            <strong style={{ color: '#222' }}>{item.name}</strong>
                            <div className="supporting-text">Qty {item.quantity}</div>
                          </div>
                          <strong>GHc{Number(item.subtotal || item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                      ))}

                      <div className="stack-row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => toggleExpanded(order.order_number || order.id)}
                        >
                          <Truck size={14} />
                          Shipping details
                          <ChevronDown
                            size={14}
                            style={{ transform: expandedOrders[order.order_number || order.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                          />
                        </button>

                        <div className="stack-row">
                          <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => navigate(`/track?orderNumber=${encodeURIComponent(order.order_number || '')}`)}
                          >
                            <PackageSearch size={14} />
                            Track this order
                          </button>
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => reorderItems(order.items || [])}
                          >
                            <RotateCcw size={14} />
                            Reorder
                          </button>
                        </div>
                      </div>

                      {expandedOrders[order.order_number || order.id] ? (
                        <div className="info-card" style={{ padding: 16 }}>
                          <strong style={{ display: 'block', color: '#222', marginBottom: 8 }}>Shipping address</strong>
                          <div className="supporting-text">
                            {[
                              order.shipping_address?.firstName && order.shipping_address?.lastName
                                ? `${order.shipping_address.firstName} ${order.shipping_address.lastName}`
                                : order.customer_name,
                              order.shipping_address?.address,
                              order.shipping_address?.city,
                              order.shipping_address?.state,
                              order.shipping_address?.zipCode,
                              order.shipping_address?.country,
                              order.shipping_address?.phone,
                            ].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Account
