import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'
import { buildDepartmentSubcategoryMap, productMatchesCategory } from '../lib/productCategories'

export const ListingPage = ({ title, subtitle, products, chips = [] }) => {
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
            <div className="supporting-text">{filteredProducts.length} products available</div>
            <div />
            <select className="select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
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

          {filteredProducts.length ? (
            <div className="products-grid">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
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
  const navigate = useNavigate()
  const { products } = useProducts()
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)
  const decodedCategory = decodeURIComponent(category)
  const menuTree = useMemo(() => buildMenuTree(menuItems), [menuItems])
  const departmentSubcategoryMap = useMemo(() => buildDepartmentSubcategoryMap(menuTree.departments), [menuTree.departments])
  const categoryProducts = products.filter((product) => productMatchesCategory(product, decodedCategory, departmentSubcategoryMap))
  const subcategories = [...new Set(categoryProducts.map((product) => product.subcategory).filter(Boolean))]

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

  return (
    <ListingPage
      title={decodedCategory}
      subtitle={`Discover ${decodedCategory} listings arranged in a high-density marketplace layout with direct retail purchase flow.`}
      products={categoryProducts}
      chips={subcategories.map((subcategory) => ({ label: subcategory, onClick: () => navigate(`/category/${encodeURIComponent(decodedCategory)}/subcategory/${encodeURIComponent(subcategory)}`) }))}
    />
  )
}

export default CategoryPage
