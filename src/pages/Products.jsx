import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useSiteContent } from '../context/SiteContentContext'
import InfiniteProductGrid from '../components/InfiniteProductGrid'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems } from '../lib/storeMenu'
import { selectDealProducts } from '../lib/dealProducts'
import { supabase } from '../lib/supabase'
import { buildDepartmentSubcategoryMap, productMatchesCategory } from '../lib/productCategories'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  return <ProductsListing key={searchParams.toString()} />
}

function ProductsListing() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products, loading } = useProducts()
  const { siteContent } = useSiteContent()
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const searchTerm = searchParams.get('search') || ''
  const sortBy = searchParams.get('sort') || 'popular'
  const dealsOnly = searchParams.get('deals') === 'true'
  const menuTree = useMemo(() => buildMenuTree(menuItems), [menuItems])
  const departmentSubcategoryMap = useMemo(() => buildDepartmentSubcategoryMap(menuTree.departments), [menuTree.departments])

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const { data } = await fetchStoreMenuItems(supabase)
        setMenuItems(data || defaultStoreMenuItems)
      } catch {
        setMenuItems(defaultStoreMenuItems)
      }
    }

    loadMenuItems()
  }, [])

  const dealSelection = useMemo(() => selectDealProducts(products), [products])
  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (selectedCategory !== 'All') list = list.filter((product) => productMatchesCategory(product, selectedCategory, departmentSubcategoryMap))

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase()
      list = list.filter((product) => [product.name, product.description, product.category, product.subcategory, ...(product.categories || [])].filter(Boolean).some((field) => field.toLowerCase().includes(query)))
    }

    if (dealsOnly) list = selectDealProducts(list).products

    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        list.sort((a, b) => Number(b.id) - Number(a.id))
        break
      default:
        if (dealsOnly && !list.some((product) => product.oldPrice > product.price)) list.sort((a, b) => a.price - b.price)
        else list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    }

    return list
  }, [dealsOnly, departmentSubcategoryMap, products, searchTerm, selectedCategory, sortBy])

  const allCategories = [{ name: 'All' }, ...(siteContent.categories || [])]

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">{dealsOnly ? "Today's Deals" : 'All products'}</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>{dealsOnly ? "Today's Deals" : 'Browse the full catalog'}</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>
            {dealsOnly ? (dealSelection.budgetPicks ? 'Explore lower-priced finds from across the store, starting with the most affordable.' : 'Browse products with reduced prices across the store.') : "Search, filter by category, sort by price or rating, and find exactly what you need from Robobbo's full product range."}
          </p>
        </section>

        <section className="listing-layout">
          <aside className="filter-panel">
            <div>
              <p className="alibaba-panel-title">Quick filters</p>
              <div className="category-chip-row">
                <button type="button" className={`filter-chip ${dealsOnly ? 'active' : ''}`} onClick={() => navigate('/products?deals=true')}>Deals</button>
                <button type="button" className="filter-chip" onClick={() => navigate('/products?sort=newest')}>New arrivals</button>
                <button type="button" className="filter-chip" onClick={() => navigate('/category/Electronics')}>Electronics</button>
              </div>
            </div>

            <div>
              <p className="alibaba-panel-title">Categories</p>
              <div className="category-list">
                {allCategories.map((category) => (
                  <button key={category.name} type="button" className={selectedCategory === category.name ? 'active' : ''} onClick={() => { setSelectedCategory(category.name) }}>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="page-grid">
            <div className="stack-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="supporting-text">{loading ? 'Loading products...' : `${filteredProducts.length} results`}</span>
              {dealsOnly ? <span className="alibaba-badge orange">{filteredProducts.some((product) => product.oldPrice > product.price) ? 'Reduced prices' : 'Budget picks'}</span> : null}
            </div>

            <InfiniteProductGrid key={`${selectedCategory}/${searchTerm}/${sortBy}/${dealsOnly}`} products={filteredProducts} />
            {loading && !filteredProducts.length && <p role="status">Loading products...</p>}
            {!loading && !filteredProducts.length && <p className="empty-shell">No products match these filters. Try another category or browse all products.</p>}

          </div>
        </section>
      </div>
    </div>
  )
}
