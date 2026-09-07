import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CARD_WIDTH = 196

const ProductRail = ({ title, products = [], seeAllRoute }) => {
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  if (!products.length) return null

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: direction * CARD_WIDTH * 4,
      behavior: 'smooth',
    })
  }

  return (
    <section className="page-card amazon-strip-card product-rail">
      <div className="amazon-section-head">
        <h2>{title}</h2>
        <button type="button" className="amazon-panel-link" onClick={() => navigate(seeAllRoute)}>
          See all
        </button>
      </div>

      <div className="product-rail-shell">
        <button type="button" className="product-rail-arrow left desktop-only" onClick={() => scrollByAmount(-1)} aria-label={`Scroll ${title} left`}>
          <ChevronLeft size={20} />
        </button>

        <div ref={scrollRef} className="product-rail-scroll">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="product-rail-card">
              <div className="product-rail-media">
                <img src={product.image} alt={product.name} onError={(e) => { e.target.style.display = 'none' }} />
              </div>
              <div className="product-rail-name">{product.name}</div>
              <div className="product-rail-price">GHc{product.price.toFixed(2)}</div>
            </Link>
          ))}
        </div>

        <button type="button" className="product-rail-arrow right desktop-only" onClick={() => scrollByAmount(1)} aria-label={`Scroll ${title} right`}>
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}

export default ProductRail
