import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Edit2, LayoutGrid, Plus, Search, Trash2 } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { getAllProducts, deleteProduct } from '../lib/orderService'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'

const buildSubcategoryMap = (departments) => Object.fromEntries(
  departments.map((department) => [
    department.label,
    (department.sections || []).map((section) => ({
      heading: section.label,
      items: (section.items || []).map((item) => item.label),
    })),
  ])
)

const Admin = () => {
  const navigate = useNavigate()
  const { siteContent } = useSiteContent()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterSubcategory, setFilterSubcategory] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [subNavOpen, setSubNavOpen] = useState(false)
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)

  useEffect(() => {
    fetchStoreMenuItems(supabase)
      .then(({ data }) => setMenuItems(data || defaultStoreMenuItems))
      .catch(() => setMenuItems(defaultStoreMenuItems))
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getAllProducts()
        setProducts(data || [])
      } catch (caughtError) {
        setError('Failed to load products')
        console.error(caughtError)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const menuTree = useMemo(() => buildMenuTree(menuItems), [menuItems])
  const categories = siteContent.categories?.length
    ? siteContent.categories
    : menuTree.departments.map((department) => ({ name: department.label }))
  const subcategoryMap = useMemo(() => buildSubcategoryMap(menuTree.departments), [menuTree.departments])

  const handleCategoryChange = (value) => {
    setFilterCategory(value)
    setFilterSubcategory('all')
  }

  const subcategorySections = useMemo(
    () => (filterCategory === 'all' ? [] : subcategoryMap[filterCategory] || []),
    [filterCategory, subcategoryMap]
  )

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchCat = filterCategory === 'all' || product.category === filterCategory
        const matchSub =
          filterSubcategory === 'all' ||
          (product.subcategory || '').toLowerCase().includes(filterSubcategory.toLowerCase())
        return matchSearch && matchCat && matchSub
      }),
    [products, searchTerm, filterCategory, filterSubcategory]
  )

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((product) => product.id !== productId))
      setShowDeleteConfirm(null)
    } catch (caughtError) {
      setError('Failed to delete product')
      console.error(caughtError)
    }
  }

  if (loading) {
    return (
      <div className="page-section">
        <div className="page-shell">
          <div className="empty-shell page-card">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">Admin</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>Product management</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Manage the Robbobo product catalog - add, edit, and remove listings.
          </p>
        </section>

        <section className="page-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LayoutGrid size={16} color="#ff5a0a" />
              <strong style={{ color: '#0f1111', fontSize: '0.95rem' }}>Browse by subcategory</strong>
              <span className="supporting-text">- navigate to any storefront subcategory page</span>
            </div>
            <button
              type="button"
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', padding: '6px 12px' }}
              onClick={() => setSubNavOpen((value) => !value)}
            >
              {subNavOpen ? 'Collapse' : 'Expand all'}
              <ChevronDown
                size={14}
                style={{ transform: subNavOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </button>
          </div>

          {subNavOpen && (
            <div className="page-grid" style={{ gap: 24, marginTop: 20 }}>
              {categories.map((category) => {
                const sections = subcategoryMap[category.name] || []
                if (!sections.length) return null

                return (
                  <div key={category.name}>
                    <button
                      type="button"
                      style={{ border: 'none', background: 'none', padding: 0, fontWeight: 800, color: 'var(--alibaba-orange-strong)', fontSize: '0.9rem', marginBottom: 12, cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
                    >
                      {category.name}
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                      {sections.map((section) => (
                        <div key={section.heading}>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#565959', marginBottom: 6 }}>
                            {section.heading}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {section.items.map((item) => (
                              <button
                                key={item}
                                type="button"
                                style={{ border: '1px solid #d5d9d9', borderRadius: 6, background: '#f7f7f8', padding: '3px 10px', fontSize: '0.8rem', cursor: 'pointer', color: '#0f1111' }}
                                onClick={() => navigate(`/category/${encodeURIComponent(category.name)}/subcategory/${encodeURIComponent(item)}`)}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {error ? <div className="alert">{error}</div> : null}

        <section className="listing-toolbar">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) 190px 260px auto',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#6b7280' }} />
              <input
                className="field"
                style={{ paddingLeft: 40 }}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by product name..."
              />
            </div>

            <select
              className="select"
              value={filterCategory}
              onChange={(event) => handleCategoryChange(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>

            <select
              className="select"
              value={filterSubcategory}
              onChange={(event) => setFilterSubcategory(event.target.value)}
              disabled={filterCategory === 'all' || subcategorySections.length === 0}
              style={{ opacity: filterCategory === 'all' ? 0.5 : 1 }}
              title={filterCategory === 'all' ? 'Select a category first to filter by subcategory' : 'Filter by subcategory'}
            >
              <option value="all">
                {filterCategory === 'all' ? '- Select a category first -' : 'All subcategories'}
              </option>
              {subcategorySections.map((section) => (
                <optgroup key={section.heading} label={section.heading}>
                  {section.items.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            <button
              type="button"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              onClick={() => navigate('/admin/product/new')}
            >
              <Plus size={14} /> Add product
            </button>
          </div>

          {(filterCategory !== 'all' || filterSubcategory !== 'all' || searchTerm) && (
            <div className="stack-row" style={{ marginTop: 12, gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="supporting-text">Filters:</span>
              {filterCategory !== 'all' && <span className="alibaba-badge soft">{filterCategory}</span>}
              {filterSubcategory !== 'all' && <span className="alibaba-badge soft">{filterSubcategory}</span>}
              {searchTerm && <span className="alibaba-badge soft">"{searchTerm}"</span>}
              <button
                type="button"
                style={{ border: 'none', background: 'none', color: 'var(--alibaba-orange-strong)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                onClick={() => { setFilterCategory('all'); setFilterSubcategory('all'); setSearchTerm('') }}
              >
                Clear all
              </button>
              <span className="supporting-text">{filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </section>

        <section className="table-shell">
          {filteredProducts.length ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="stack-row" style={{ alignItems: 'center', gap: 12 }}>
                        {product.image
                          ? <img src={product.image} alt={product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb', flexShrink: 0 }} />
                          : <div style={{ width: 48, height: 48, background: '#f3f3f3', borderRadius: 8, flexShrink: 0 }} />
                        }
                        <div>
                          <strong style={{ color: '#222', fontSize: '0.9rem' }}>{product.name}</strong>
                          <div className="supporting-text">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="alibaba-badge soft" style={{ fontSize: '0.74rem' }}>
                        {product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      {product.subcategory
                        ? <span className="supporting-text">{product.subcategory}</span>
                        : <span style={{ color: '#ccc' }}>-</span>}
                    </td>
                    <td>
                      <strong style={{ color: '#222' }}>GHc{Number(product.price).toFixed(2)}</strong>
                      {product.old_price
                        ? <div className="supporting-text" style={{ textDecoration: 'line-through' }}>GHc{Number(product.old_price).toFixed(2)}</div>
                        : null}
                    </td>
                    <td>{product.stock ?? '-'} units</td>
                    <td>
                      <div className="stack-row">
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}
                          onClick={() => navigate(`/admin/product/${product.id}`)}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', color: '#dc2626' }}
                          onClick={() => setShowDeleteConfirm(product.id)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                      {showDeleteConfirm === product.id && (
                        <div className="alert" style={{ marginTop: 10 }}>
                          <div style={{ marginBottom: 10, fontWeight: 600 }}>Delete "{product.name}"?</div>
                          <div className="stack-row">
                            <button type="button" className="btn-ghost" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
                            <button type="button" className="btn-primary" onClick={() => handleDelete(product.id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-shell">
              <h3 style={{ margin: 0, color: '#222' }}>No products found</h3>
              <p className="section-copy">Try adjusting your search or category filters.</p>
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                onClick={() => navigate('/admin/product/new')}
              >
                <Plus size={14} /> Add your first product
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Admin
