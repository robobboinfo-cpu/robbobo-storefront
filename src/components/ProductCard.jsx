import { Link } from 'react-router-dom'
import { MapPin, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const rating = product.rating || 4.5

  return (
    <article className="product-card amazon-product-card">
      <Link to={`/product/${product.id}`} className="product-card-link" aria-label={`View ${product.name}`}>
        <div className="product-media amazon-product-media">
          {product.tag ? <span className="product-card-tag">{product.tag}</span> : null}
          <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.style.display = 'none' }} />
        </div>

        <div className="product-body amazon-product-body">
          <h3 className="product-title amazon-product-title">{product.name}</h3>
          <div className="amazon-rating-row">
            <span className="amazon-stars"><Star size={14} fill="currentColor" /><span>{rating}</span></span>
            <span className="supporting-text">{product.reviews || 0} reviews</span>
          </div>

          <div className="product-card-location">
            <MapPin size={13} />
            <span>Robbobo Store · {product.category}</span>
          </div>

          <div className="product-card-pricing">
            <span className="product-card-current">GHc {product.price.toFixed(2)}</span>
            {product.oldPrice ? <span className="price-old">GHc {product.oldPrice.toFixed(2)}</span> : null}
          </div>
        </div>
      </Link>

      <button type="button" className="product-card-add" onClick={() => addToCart(product, 1)}>
        <ShoppingCart size={16} />
        Add to cart
      </button>
    </article>
  )
}

export default ProductCard
