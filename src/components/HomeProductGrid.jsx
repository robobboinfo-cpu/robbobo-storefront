import { useState } from 'react'
import ProductCard from './ProductCard'

export default function HomeProductGrid({ products, initialCount, maxCount }) {
  const [extraCount, setExtraCount] = useState(0)
  const limit = Math.min(maxCount, products.length)
  const visibleCount = Math.min(initialCount + extraCount, limit)

  return <>
    <div className="products-grid">
      {products.slice(0, visibleCount).map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
    {visibleCount < limit && <div className="home-see-more">
      <button type="button" onClick={() => setExtraCount((count) => count + 150)}>See more products</button>
    </div>}
    <span className="catalog-screen-reader-status" role="status">{visibleCount} products shown in More to discover</span>
  </>
}
