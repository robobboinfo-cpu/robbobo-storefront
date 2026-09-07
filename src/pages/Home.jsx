import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSiteContent } from '../context/SiteContentContext'
import { useProducts } from '../context/ProductContext'
import { supabase } from '../lib/supabase'

const categoryImageFallback = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=700&fit=crop&q=85'

const normalizeBanner = (banner, fallbackImage) => ({
  id: banner.id,
  title: banner.title || 'Shop Robbobo',
  subtitle: banner.subtitle || '',
  image: banner.image_url || fallbackImage,
  buttonText: banner.button_text || 'Shop now',
  targetUrl: banner.target_url || '/products',
  sortOrder: Number(banner.sort_order || 0),
})

const Home = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { products } = useProducts()
  const { siteContent } = useSiteContent()
  const categories = useMemo(() => siteContent.categories || [], [siteContent.categories])
  const homeContent = siteContent.homeContent
  const [activeSlide, setActiveSlide] = useState(0)
  const [heroSlides, setHeroSlides] = useState(homeContent.fallbackSlides)

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from('homepage_banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (!error && Array.isArray(data) && data.length) {
        const fallbackImage = homeContent.fallbackSlides[0]?.image || ''
        setHeroSlides(data.map((banner) => normalizeBanner(banner, fallbackImage)))
      } else {
        setHeroSlides(homeContent.fallbackSlides)
      }
    }

    fetchBanners()
  }, [homeContent.fallbackSlides])

  useEffect(() => {
    if (!heroSlides.length) return undefined
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 5000)
    return () => window.clearInterval(timer)
  }, [heroSlides.length])

  const safeActiveSlide = heroSlides.length ? activeSlide % heroSlides.length : 0
  const active = heroSlides[safeActiveSlide]
  const heroTitleWords = String(active?.title || '').trim().split(/\s+/)
  const heroAccentWord = heroTitleWords.pop() || ''
  const heroTitleLead = heroTitleWords.join(' ')
  const newArrivals = useMemo(() => [...products].reverse().slice(0, 6), [products])
  const bestSellers = useMemo(() => [...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 3), [products])

  const handleHeroAction = () => {
    if (!active?.targetUrl) return
    if (/^https?:\/\//i.test(active.targetUrl)) {
      window.location.href = active.targetUrl
      return
    }
    navigate(active.targetUrl)
  }

  return (
    <div className="amazon-home page-section">
      <section className="amazon-home-hero-shell">
        <div className="page-shell amazon-home-hero-inner">
          <button type="button" className="amazon-hero-arrow left" onClick={() => setActiveSlide((c) => (c - 1 + heroSlides.length) % heroSlides.length)}>‹</button>
          <div className="amazon-home-hero-copy">
            <h1><span>{heroTitleLead}</span> <em>{heroAccentWord}</em></h1>
            <p>{active?.subtitle}</p>
            <button type="button" className="btn-secondary" onClick={handleHeroAction}>{active?.buttonText || 'Shop now'}</button>
          </div>
          <div className="amazon-home-hero-image">
            <img src={active?.image || ''} alt="" />
          </div>
          <button type="button" className="amazon-hero-arrow right" onClick={() => setActiveSlide((c) => (c + 1) % heroSlides.length)}>›</button>
        </div>
      </section>

      <div className="page-shell storefront-home">
        <section className="storefront-section">
          <div className="storefront-heading"><h2>Shop by Categories</h2><button type="button" onClick={() => navigate('/products')}>View all categories <ArrowRight size={15} /></button></div>
          <div className="storefront-categories">
            {categories.slice(0, 6).map((category) => (
              <button key={category.name} type="button" className="storefront-category" onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}>
                <img
                  src={category.image}
                  alt={category.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = categoryImageFallback
                  }}
                />
                <span><strong>{category.name}</strong><small>Shop now</small><ArrowRight size={15} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="storefront-section">
          <div className="storefront-heading"><h2>New Arrivals</h2><button type="button" onClick={() => navigate('/products?sort=newest')}>View all new arrivals <ArrowRight size={15} /></button></div>
          <div className="storefront-arrivals">
            {newArrivals.map((product) => (
              <article key={product.id} className="storefront-product-card">
                <button type="button" className="storefront-wish" aria-label="Add to wishlist"><Heart size={16} /></button>
                <button type="button" className="storefront-product-image" onClick={() => navigate(`/product/${product.id}`)}><img src={product.image} alt={product.name} /></button>
                <h3>{product.name}</h3><strong>GHc{product.price.toFixed(2)}</strong>
                <div className="storefront-rating"><span>★★★★★</span><small>({product.reviews || 0})</small></div>
                <button type="button" className="storefront-cart" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product, 1)}><ShoppingCart size={16} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="storefront-section">
          <div className="storefront-heading"><h2>Best Sellers</h2><button type="button" onClick={() => navigate('/products?sort=popular')}>View all best sellers <ArrowRight size={15} /></button></div>
          <div className="storefront-bestsellers">
            {bestSellers.map((product) => (
              <article key={product.id} className="storefront-bestseller">
                <span className="storefront-badge">Bestseller</span>
                <button type="button" className="storefront-best-image" onClick={() => navigate(`/product/${product.id}`)}><img src={product.image} alt={product.name} /></button>
                <div className="storefront-best-copy"><h3>{product.name}</h3><strong>GHc{product.price.toFixed(2)}</strong><div className="storefront-rating"><span>★★★★★</span><small>({product.reviews || 0})</small></div><p>{product.description}</p><button type="button" onClick={() => addToCart(product, 1)}>Quick add</button></div>
                <button type="button" className="storefront-best-cart" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product, 1)}><ShoppingCart size={16} /></button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
