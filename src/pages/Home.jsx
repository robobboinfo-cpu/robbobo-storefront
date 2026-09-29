import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import BrandSlideshow from '../components/BrandSlideshow'
import { useSiteContent } from '../context/SiteContentContext'
import { useProducts } from '../context/ProductContext'
import { productMatchesCategory } from '../lib/productCategories'
import { supabase } from '../lib/supabase'
import { brandText } from '../lib/brandText'

const categoryImageFallback = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=700&fit=crop&q=85'

const featuredDepartments = [
  { key: 'wireless', title: 'Wireless audio', copy: 'Your music, without the wires.', image: '/images/featured/wireless.jpg', search: 'wireless' },
  { key: 'headphones', title: 'Headphones', copy: 'Find a pair for your favourite playlist, the daily commute or a quiet moment.', image: '/images/featured/headphones.jpg', search: 'headphones' },
  { key: 'accessories', title: 'Bags & accessories', copy: 'The finishing touch for your everyday.', image: '/images/featured/accessories.jpg', search: 'bag' },
  { key: 'desk', title: 'On your desk', copy: 'Keyboards and more for your setup.', image: '/images/featured/desk.jpg', search: 'keyboard' },
  { key: 'gaming', title: 'Gaming gear', copy: 'Make your next session a good one.', image: '/images/featured/gaming.jpg', search: 'gaming' },
]

const normalizeBanner = (banner, fallbackImage) => ({
  id: banner.id,
  title: brandText(banner.title || 'Shop Robobbo'),
  subtitle: brandText(banner.subtitle || ''),
  image: banner.image_url || fallbackImage,
  buttonText: brandText(banner.button_text || 'Shop now'),
  targetUrl: banner.target_url || '/products',
  sortOrder: Number(banner.sort_order || 0),
})

const Home = () => {
  const navigate = useNavigate()
  const { products } = useProducts()
  const { siteContent } = useSiteContent()
  const categories = useMemo(() => siteContent.categories || [], [siteContent.categories])
  const homeContent = siteContent.homeContent
  const [selectedDepartment, setSelectedDepartment] = useState('All')
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
  const newArrivals = useMemo(() => [...products].reverse().slice(0, 6), [products])
  const discoveryProducts = useMemo(() => products.filter((product) => selectedDepartment === 'All' || productMatchesCategory(product, selectedDepartment)).slice(0, 6), [products, selectedDepartment])
  const deals = useMemo(() => products.filter((product) => product.oldPrice > product.price).sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)).slice(0, 3), [products])
  const productShelves = useMemo(() => {
    const shown = new Set([...newArrivals, ...products.slice(0, 6), ...deals].map((product) => product.id))
    const sections = [
      { title: 'Electronics for every day', category: 'Electronics' },
      { title: 'Home essentials', category: 'Home & Living' },
      { title: 'Refresh your wardrobe', category: 'Fashion' },
      { title: 'More to discover', category: null },
    ]

    return sections.map((section) => {
      const items = products.filter((product) => !shown.has(product.id) && (!section.category || productMatchesCategory(product, section.category))).slice(0, section.category ? 6 : 12)
      items.forEach((product) => shown.add(product.id))
      return { ...section, items, href: section.category ? `/category/${encodeURIComponent(section.category)}` : '/products' }
    }).filter((section) => section.items.length)
  }, [products, newArrivals, deals])
  const collections = [
    { category: 'Home & Living', title: 'Small changes. Fresh spaces.', copy: 'Make room for slow mornings, cosy corners and a little everyday order.', action: 'Refresh your space', tone: 'home' },
    { category: 'Electronics', title: 'A smarter everyday setup.', copy: 'Find your next listening companion, desk upgrade or go-to gadget.', action: 'Explore the tech edit', tone: 'tech' },
    { category: 'Fashion', title: 'Good days start with your style.', copy: 'Bring a fresh perspective to the pieces you reach for again and again.', action: 'Find your next look', tone: 'style' },
  ].map((collection) => ({ ...collection, image: categories.find((category) => category.name === collection.category)?.image })).filter((collection) => collection.image)

  const renderProduct = (product) => <ProductCard key={product.id} product={product} />

  return (
    <div className="amazon-home page-section">
      <section className="amazon-home-hero-shell">
        <div className="amazon-home-hero-inner">
          <button type="button" className="amazon-hero-arrow left" aria-label="Previous banner" disabled={heroSlides.length < 2} onClick={() => setActiveSlide((c) => (c - 1 + heroSlides.length) % heroSlides.length)}><ChevronLeft size={25} aria-hidden="true" /></button>
          <Link className="amazon-home-hero-image" to={active?.targetUrl || '/products'} aria-label={active?.title || 'Shop Robobbo'}>
            <img src={active?.image || ''} alt="" />
          </Link>
          <button type="button" className="amazon-hero-arrow right" aria-label="Next banner" disabled={heroSlides.length < 2} onClick={() => setActiveSlide((c) => (c + 1) % heroSlides.length)}><ChevronRight size={25} aria-hidden="true" /></button>
        </div>
      </section>

      <BrandSlideshow brands={homeContent.brands} />

      <div className="page-shell storefront-home">
        <section className="storefront-welcome">
          <div><h1>Find your next everyday favourite.</h1><p>For your space, your style and everything in between. Explore a little more of Robobbo.</p></div>
          <Link className="storefront-text-link" to="/products">Explore the store <ArrowRight size={18} /></Link>
        </section>
        <section className="storefront-section">
          <div className="storefront-heading"><h2>Shop by Categories</h2><button type="button" onClick={() => navigate('/products')}>View all categories <ArrowRight size={15} /></button></div>
          <div className="storefront-categories">
            {categories.map((category) => (
              <Link key={category.name} className="storefront-category" to={`/category/${encodeURIComponent(category.name)}`}>
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = categoryImageFallback
                  }}
                />
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="storefront-section">
          <div className="storefront-heading"><h2>New Arrivals</h2><button type="button" onClick={() => navigate('/products?sort=newest')}>View all new arrivals <ArrowRight size={15} /></button></div>
          <div className="products-grid">
            {newArrivals.map(renderProduct)}
          </div>
        </section>

        <section className="storefront-section storefront-feature-grid" aria-label="Featured shopping collections">
          {featuredDepartments.map((department) => (
            <Link key={department.key} className={`storefront-feature-tile storefront-feature-${department.key}`} to={`/products?search=${encodeURIComponent(department.search)}`}>
              <img loading="lazy" src={department.image} alt="" />
              <div className="storefront-feature-copy">
                <h2>{department.title}</h2>
                <p>{department.copy}</p>
                <span className="storefront-feature-cta">Shop now<span className="storefront-feature-sr">: {department.title}</span></span>
              </div>
            </Link>
          ))}
        </section>

        <section className="storefront-section" aria-labelledby="collections-heading">
          <div className="storefront-heading"><div><h2 id="collections-heading">A little inspiration for your everyday</h2></div></div>
          <div className="storefront-collections">
            {collections.map((collection) => (
              <Link key={collection.category} className={`storefront-collection ${collection.tone}`} to={`/category/${encodeURIComponent(collection.category)}`}>
                <img loading="lazy" src={collection.image} alt="" />
                <div><h3>{collection.title}</h3><p>{collection.copy}</p><span className="storefront-text-link">{collection.action} <ArrowRight size={17} /></span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="storefront-section storefront-discover" aria-labelledby="discover-heading">
          <div className="storefront-heading"><div><h2 id="discover-heading">What are you shopping for?</h2></div><Link className="storefront-text-link" to={selectedDepartment === 'All' ? '/products' : `/category/${encodeURIComponent(selectedDepartment)}`}>Explore more <ArrowRight size={15} /></Link></div>
          <div className="storefront-departments" role="group" aria-label="Filter featured products by department">
            {['All', ...categories.map((category) => category.name)].map((name) => <button key={name} type="button" aria-pressed={selectedDepartment === name} onClick={() => setSelectedDepartment(name)}>{name === 'All' ? 'A bit of everything' : name}</button>)}
          </div>
          <div className="products-grid" aria-live="polite">{discoveryProducts.map(renderProduct)}</div>
          {!discoveryProducts.length && <p className="storefront-empty">More finds are on the way. Explore another department for now.</p>}
        </section>

        {deals.length > 0 && <section className="storefront-section storefront-deals" aria-labelledby="deals-heading">
          <div className="storefront-heading"><div><h2 id="deals-heading">Make a little room for a good deal</h2></div><Link className="storefront-text-link" to="/products?deals=true">Shop all deals <ArrowRight size={15} /></Link></div>
          <div className="products-grid">{deals.map(renderProduct)}</div>
        </section>}

        {productShelves.map((section) => (
          <section key={section.title} className="storefront-section" aria-label={section.title}>
            <div className="storefront-heading">
              <h2>{section.title}</h2>
              <Link className="storefront-text-link" to={section.href}>View all <ArrowRight size={15} /></Link>
            </div>
            <div className="products-grid">{section.items.map(renderProduct)}</div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Home
