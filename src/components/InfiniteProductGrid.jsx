import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'

export default function InfiniteProductGrid({ products }) {
  const [visibleCount, setVisibleCount] = useState(24)
  const sentinel = useRef(null)
  const hasMore = visibleCount < products.length

  useEffect(() => {
    if (!hasMore || !sentinel.current) return
    let advanced = false
    const advance = () => {
      if (advanced) return
      advanced = true
      setVisibleCount((count) => Math.min(count + 24, products.length))
    }
    const target = sentinel.current
    if (!('IntersectionObserver' in window)) {
      const check = () => { if (target.getBoundingClientRect().top < window.innerHeight + 300) advance() }
      window.addEventListener('scroll', check, { passive: true })
      check()
      return () => window.removeEventListener('scroll', check)
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) advance()
    }, { rootMargin: '300px 0px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, visibleCount, products.length])

  return <>
    <div className="products-grid">
      {products.slice(0, visibleCount).map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
    {hasMore && <div ref={sentinel} className="catalog-scroll-sentinel" aria-hidden="true" />}
    <span className="catalog-screen-reader-status" role="status">{Math.min(visibleCount, products.length)} of {products.length} products loaded</span>
  </>
}
