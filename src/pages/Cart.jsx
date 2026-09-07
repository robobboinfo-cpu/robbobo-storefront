import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()
  const [promoCode, setPromoCode] = useState('')

  if (!cartItems.length) {
    return (
      <div className="page-section">
        <div className="page-shell">
          <div className="empty-shell page-card">
            <div className="alibaba-action-icon" style={{ width: 72, height: 72, margin: '0 auto 14px' }}><ShoppingCart size={28} /></div>
            <h2 style={{ margin: 0, color: '#222' }}>Your cart is empty</h2>
            <p className="section-copy">Browse the catalog and add products to start checkout.</p>
            <button type="button" className="btn-primary" onClick={() => navigate('/products')}>Continue shopping</button>
          </div>
        </div>
      </div>
    )
  }

  const discount = cartTotal >= 500 ? cartTotal * 0.08 : 0
  const shipping = cartTotal >= 500 ? 0 : 35
  const tax = (cartTotal - discount) * 0.05
  const total = cartTotal - discount + shipping + tax

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">Shopping cart</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>Review your order</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Check your items, adjust quantities, and proceed to checkout when ready.
          </p>
        </section>

        <section className="cart-layout">
          <div className="page-card" style={{ overflow: 'hidden' }}>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-thumb">
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="page-grid" style={{ gap: 10 }}>
                  <button type="button" onClick={() => navigate(`/product/${item.id}`)} style={{ border: 'none', background: 'none', padding: 0, textAlign: 'left', fontSize: '1rem', fontWeight: 700, color: '#222' }}>
                    {item.name}
                  </button>
                  <div className="inline-stats">
                    <span className="supporting-text">SKU #{item.id}</span>
                  </div>
                  <div className="qty-stepper">
                    <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus size={14} /></button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                </div>
                <div className="page-grid" style={{ gap: 10, justifyItems: 'end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price-main">GHc{(item.price * item.quantity).toFixed(2)}</div>
                    <div className="supporting-text">GHc{item.price.toFixed(2)} each</div>
                  </div>
                  <button type="button" className="btn-ghost" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="page-grid">
            <div className="summary-card">
              <div style={{ fontWeight: 800, marginBottom: 10, color: '#0f1111', fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Promo code</div>
              <div className="stack-row">
                <input className="field" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Enter discount code" />
                <button type="button" className="btn-secondary">Apply</button>
              </div>
            </div>

            <div className="summary-card">
              <h2 style={{ margin: 0, color: '#222' }}>Order summary</h2>
              <div className="summary-lines" style={{ marginTop: 18 }}>
                <div className="summary-line"><span>Subtotal</span><strong>GHc{cartTotal.toFixed(2)}</strong></div>
                <div className="summary-line"><span>Discount</span><strong>-GHc{discount.toFixed(2)}</strong></div>
                <div className="summary-line"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : `GHc${shipping.toFixed(2)}`}</strong></div>
                <div className="summary-line"><span>Tax (5%)</span><strong>GHc{tax.toFixed(2)}</strong></div>
              </div>
              <div className="summary-total">
                <span style={{ fontWeight: 700, color: '#222' }}>Total</span>
                <span className="price-main">GHc{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="info-card" style={{ background: '#f0fdf4' }}>
              <div className="page-grid" style={{ gap: 12 }}>
                {[
                  { icon: <ShieldCheck size={16} color="#0f9d58" />, text: 'Secure checkout' },
                  { icon: <Truck size={16} color="#0f9d58" />, text: 'Tracked delivery' },
                  { icon: <ShoppingCart size={16} color="#0f9d58" />, text: 'Free returns eligible' },
                ].map((item) => (
                  <div key={item.text} className="stack-row" style={{ alignItems: 'center', gap: 8 }}>
                    {item.icon}
                    <span className="supporting-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: 8 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/products')}>Continue shopping</button>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default Cart
