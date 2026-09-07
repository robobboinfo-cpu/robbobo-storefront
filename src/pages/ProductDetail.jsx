import { useContext, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Heart, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { CartContext } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'

const hiddenSpecs = new Set(['stock', 'stock_count', 'inventory', 'quantity', 'qty', 'remaining', 'available_stock'])
const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL']

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { products, getProductById, loading } = useProducts()
  const product = getProductById(id)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [activeTab, setActiveTab] = useState('Details')
  const [wishlisted, setWishlisted] = useState(false)

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((item) => item.category === product.category && String(item.id) !== String(product.id)).slice(0, 4)
  }, [product, products])

  if (loading) return <div className="page-section"><div className="page-shell"><div className="empty-shell">Loading product...</div></div></div>
  if (!product) return (
    <div className="page-section"><div className="page-shell"><div className="empty-shell page-card">
      <h1>Product not found</h1><p className="section-copy">This listing may have been removed or the link is invalid.</p>
      <button type="button" className="btn-primary" onClick={() => navigate('/products')}>Back to products</button>
    </div></div></div>
  )

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null
  const images = product.images?.length ? product.images : [product.image]
  const colors = product.colors || []
  const specs = Object.entries(product.specs || {}).filter(([key]) => !hiddenSpecs.has(String(key).toLowerCase()))
  const sizes = product.specs?.sizes ? String(product.specs.sizes).split(/[,/-]/).map((size) => size.trim()).filter(Boolean) : defaultSizes
  const tabs = ['Details', 'Materials', 'Size & Fit', 'Shipping & Returns']
  const tabCopy = {
    Details: product.description,
    Materials: product.specs?.material || product.specs?.materials || 'Made with durable, quality-tested materials selected for everyday comfort and long-lasting use.',
    'Size & Fit': product.specs?.fit || product.specs?.sizes || 'Designed for a comfortable everyday fit. Choose your usual size or review the available options above.',
    'Shipping & Returns': 'Fast tracked delivery is available. Eligible items can be returned in their original condition within 30 days.',
  }

  return (
    <div className="pdp-page"><div className="page-shell">
      <div className="pdp-breadcrumbs">
        <button type="button" onClick={() => navigate('/')}>Home</button><span>/</span>
        <button type="button" onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}>{product.category}</button><span>/</span><span>{product.name}</span>
      </div>

      <section className="pdp-hero">
        <div className="pdp-gallery">
          <div className="pdp-thumbnails">
            {images.slice(0, 5).map((image, index) => (
              <button key={`${product.id}-${index}`} type="button" className={`pdp-thumb ${activeImage === index ? 'active' : ''}`} onClick={() => setActiveImage(index)}>
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
          <div className="pdp-main-image"><img src={images[activeImage]} alt={product.name} /></div>
        </div>

        <div className="pdp-buy-panel">
          <span className="pdp-tag">{product.tag || 'Popular pick'}</span>
          <h1>{product.name}</h1>
          <div className="pdp-rating"><span className="pdp-stars">★★★★★</span><strong>{product.rating || 4.5}</strong><span>({product.reviews || 0} reviews)</span></div>
          <div className="pdp-price-row">
            <strong>GHc{product.price.toFixed(2)}</strong>
            {product.oldPrice ? <del>GHc{product.oldPrice.toFixed(2)}</del> : null}
            {discount ? <span>{discount}% OFF</span> : null}
          </div>
          <p className="pdp-lead">{product.description}</p>

          {colors.length > 0 && <div className="pdp-option-block">
            <div className="pdp-option-heading"><strong>Color</strong><span>Option {selectedColor + 1}</span></div>
            <div className="pdp-swatches">{colors.map((color, index) => (
              <button key={`${color}-${index}`} type="button" className={selectedColor === index ? 'active' : ''} style={{ backgroundColor: color }} aria-label={`Select color ${index + 1}`} onClick={() => setSelectedColor(index)} />
            ))}</div>
          </div>}

          {product.category === 'Fashion' && <div className="pdp-option-block">
            <div className="pdp-option-heading"><strong>Size</strong><button type="button">Size guide</button></div>
            <div className="pdp-sizes">{sizes.map((size) => <button key={size} type="button" className={selectedSize === size ? 'active' : ''} onClick={() => setSelectedSize(size)}>{size}</button>)}</div>
          </div>}

          <div className="pdp-quantity"><span>Quantity</span><div className="pdp-qty-control">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><strong>{quantity}</strong><button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button>
          </div></div>

          <div className="pdp-actions">
            <button type="button" className="pdp-add-button" onClick={() => addToCart(product, quantity)}><ShoppingBag size={18} /> Add to cart</button>
            <button type="button" className={`pdp-wishlist ${wishlisted ? 'active' : ''}`} aria-label="Add to wishlist" onClick={() => setWishlisted((value) => !value)}><Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} /></button>
          </div>
          <div className="pdp-benefits">
            <div><Truck size={18} /><span><strong>Free shipping</strong><small>On eligible orders</small></span></div>
            <div><RotateCcw size={18} /><span><strong>Easy returns</strong><small>30-day return policy</small></span></div>
            <div><ShieldCheck size={18} /><span><strong>Secure payment</strong><small>Protected checkout</small></span></div>
          </div>
        </div>
      </section>

      <section className="pdp-details">
        <div className="pdp-detail-copy">
          <div className="pdp-tabs" role="tablist">{tabs.map((tab) => <button key={tab} type="button" className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
          <p>{tabCopy[activeTab]}</p>
          {activeTab === 'Details' && specs.length > 0 && <ul className="pdp-feature-list">{specs.slice(0, 6).map(([key, value]) => <li key={key}><Check size={15} /><span><strong>{key.replace(/_/g, ' ')}:</strong> {value}</span></li>)}</ul>}
        </div>
        <div className="pdp-detail-image"><img src={images[1] || product.image} alt={`${product.name} detail`} /></div>
      </section>

      {related.length > 0 && <section className="pdp-related">
        <div className="pdp-section-heading"><h2>You may also like</h2><button type="button" onClick={() => navigate(`/category/${encodeURIComponent(product.category)}`)}>View all <span>→</span></button></div>
        <div className="pdp-related-grid">{related.map((item) => (
          <article key={item.id} className="pdp-related-card" onClick={() => navigate(`/product/${item.id}`)}>
            <div><img src={item.image} alt={item.name} /></div><button type="button" aria-label="Add to wishlist" onClick={(event) => event.stopPropagation()}><Heart size={17} /></button>
            <h3>{item.name}</h3><strong>GHc{item.price.toFixed(2)}</strong>
          </article>
        ))}</div>
      </section>}
    </div></div>
  )
}

export default ProductDetail
