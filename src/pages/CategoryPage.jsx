import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import InfiniteProductGrid from '../components/InfiniteProductGrid'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'
import { buildDepartmentSubcategoryMap, productMatchesCategory } from '../lib/productCategories'

export const ListingPage = ({ title, subtitle, products, chips = [], loading = false }) => {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('popular')

  const filteredProducts = useMemo(() => {
    const list = [...products]
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
      default:
        list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    }
    return list
  }, [products, sortBy])

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">Category showcase</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>{title}</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>{subtitle}</p>
        </section>

        <section className="page-card" style={{ padding: 20 }}>
          <div className="toolbar-grid" style={{ marginBottom: 18 }}>
            <div className="supporting-text">{loading ? 'Loading products...' : `${filteredProducts.length} products available`}</div>
            <div />
            <select className="select" aria-label="Sort products" value={sortBy} onChange={(event) => { setSortBy(event.target.value) }}>
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
            </select>
          </div>

          {chips.length ? (
            <div style={{ marginBottom: 18 }}>
              <div className="supporting-text" style={{ marginBottom: 10, fontWeight: 700 }}>Filter by subcategory</div>
              <div className="category-chip-row">
                {chips.map((chip) => (
                  <button key={chip.label} type="button" className="filter-chip" onClick={chip.onClick}>{chip.label}</button>
                ))}
              </div>
            </div>
          ) : null}

          {loading && !filteredProducts.length ? <div className="empty-shell" role="status">Loading products...</div> : filteredProducts.length ? (
            <>
            <InfiniteProductGrid key={sortBy} products={filteredProducts} />

            </>
          ) : (
            <div className="empty-shell">
              <h3 style={{ margin: 0, color: '#222' }}>No products found</h3>
              <p className="section-copy">This section is ready for listings, but there are no matching items right now.</p>
              <button type="button" className="btn-primary" onClick={() => navigate('/products')}>Browse all products</button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const CategoryPage = () => {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)
  const [menuLoading, setMenuLoading] = useState(true)
  const decodedCategory = decodeURIComponent(category)
  const menuTree = useMemo(() => buildMenuTree(menuItems), [menuItems])
  const departmentSubcategoryMap = useMemo(() => buildDepartmentSubcategoryMap(menuTree.departments), [menuTree.departments])
  const sectionId = searchParams.get('section')
  const department = menuTree.departments.find((item) => item.label === decodedCategory)
  const section = department?.sections.find((item) => item.id === sectionId)
  const sectionSubcategories = new Set((section?.items || []).map((item) => item.label))
  const categoryProducts = products.filter((product) => (
    productMatchesCategory(product, decodedCategory, departmentSubcategoryMap)
    && (!sectionId || sectionSubcategories.has(product.subcategory))
  ))
  const subcategories = [...new Set(categoryProducts.map((product) => product.subcategory).filter(Boolean))]

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const { data } = await fetchStoreMenuItems(supabase)
        setMenuItems(data || defaultStoreMenuItems)
      } catch {
        setMenuItems(defaultStoreMenuItems)
      } finally {
        setMenuLoading(false)
      }
    }

    loadMenuItems()
  }, [])

  return (
    <ListingPage
      key={`${category}-${sectionId || ''}`}
      loading={loading || menuLoading}
      title={sectionId ? (section?.label || (menuLoading ? 'Loading section...' : 'Section not found')) : decodedCategory}
      subtitle={sectionId ? `Shop products from all subcategories in ${section?.label || 'this section'} of ${decodedCategory}.` : `Discover ${decodedCategory} listings arranged in a high-density marketplace layout with direct retail purchase flow.`}
      products={menuLoading ? [] : categoryProducts}
      chips={subcategories.map((subcategory) => ({ label: subcategory, onClick: () => navigate(`/category/${encodeURIComponent(decodedCategory)}/subcategory/${encodeURIComponent(subcategory)}`) }))}
    />
  )
}

export default CategoryPage
