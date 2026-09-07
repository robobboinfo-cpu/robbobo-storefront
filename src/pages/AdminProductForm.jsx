import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { createProduct, getProductById, updateProduct } from '../lib/orderService'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  old_price: '',
  stock: '',
  category: '',
  subcategory: '',
  image: '',
  images: '',
  rating: '',
  reviews: '',
}

const buildSubcategoryMap = (departments) => Object.fromEntries(
  departments.map((department) => [
    department.label,
    (department.sections || []).map((section) => ({
      heading: section.label,
      items: (section.items || []).map((item) => item.label),
    })),
  ])
)

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { siteContent } = useSiteContent()
  const isEdit = Boolean(id && id !== 'new')

  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedSection, setSelectedSection] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)

  useEffect(() => {
    fetchStoreMenuItems(supabase)
      .then(({ data }) => setMenuItems(data || defaultStoreMenuItems))
      .catch(() => setMenuItems(defaultStoreMenuItems))
  }, [])

  useEffect(() => {
    if (!isEdit) return

    const fetchProduct = async () => {
      try {
        const product = await getProductById(id)
        if (!product) {
          setError('Product not found')
          return
        }

        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price ?? '',
          old_price: product.old_price ?? '',
          stock: product.stock ?? '',
          category: product.category || '',
          subcategory: product.subcategory || '',
          image: product.image || '',
          images: Array.isArray(product.images) ? product.images.join(', ') : (product.images || ''),
          rating: product.rating ?? '',
          reviews: product.reviews ?? '',
        })
      } catch (caughtError) {
        setError('Failed to load product')
        console.error(caughtError)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, isEdit])

  const menuTree = useMemo(() => buildMenuTree(menuItems), [menuItems])
  const categories = siteContent.categories?.length
    ? siteContent.categories
    : menuTree.departments.map((department) => ({ name: department.label }))
  const subcategoryMap = useMemo(() => buildSubcategoryMap(menuTree.departments), [menuTree.departments])

  const subcategorySections = useMemo(
    () => (form.category ? (subcategoryMap[form.category] || []) : []),
    [form.category, subcategoryMap]
  )

  const subcategoryItems = useMemo(() => {
    if (!selectedSection) return []
    const section = subcategorySections.find((item) => item.heading === selectedSection)
    return section ? section.items : []
  }, [selectedSection, subcategorySections])

  useEffect(() => {
    if (!form.category || !form.subcategory || !subcategorySections.length) return
    const matchSection = subcategorySections.find((section) => section.items.includes(form.subcategory))
    if (matchSection) setSelectedSection(matchSection.heading)
  }, [form.category, form.subcategory, subcategorySections])

  const handleField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleCategoryChange = (event) => {
    setForm((current) => ({ ...current, category: event.target.value, subcategory: '' }))
    setSelectedSection('')
  }

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value)
    setForm((current) => ({ ...current, subcategory: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      old_price: form.old_price !== '' ? Number(form.old_price) : null,
      stock: form.stock !== '' ? Number(form.stock) : null,
      category: form.category || null,
      subcategory: form.subcategory || null,
      image: form.image.trim() || null,
      images: form.images ? form.images.split(',').map((item) => item.trim()).filter(Boolean) : [],
      rating: form.rating !== '' ? Number(form.rating) : null,
      reviews: form.reviews !== '' ? Number(form.reviews) : null,
    }

    try {
      if (isEdit) {
        await updateProduct(id, payload)
      } else {
        await createProduct(payload)
      }
      setSuccess(true)
      setTimeout(() => navigate('/admin'), 1200)
    } catch (caughtError) {
      setError(isEdit ? 'Failed to update product' : 'Failed to create product')
      console.error(caughtError)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-section">
        <div className="page-shell">
          <div className="empty-shell page-card">Loading product...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">Admin</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>
            {isEdit ? 'Edit product' : 'Add new product'}
          </h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>
            {isEdit ? 'Update the details for this product.' : 'Fill in the details to add a new product to the catalog.'}
          </p>
        </section>

        <div>
          <button
            type="button"
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.88rem' }}
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft size={14} /> Back to product list
          </button>
        </div>

        {error && <div className="alert">{error}</div>}
        {success && (
          <div className="alert" style={{ background: '#dcfce7', borderColor: '#86efac', color: '#166534' }}>
            {isEdit ? 'Product updated!' : 'Product created!'} Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="page-card" style={{ padding: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <label className="page-grid" style={{ gap: 6, gridColumn: '1 / -1' }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Product name *</span>
                <input
                  className="field"
                  value={form.name}
                  onChange={handleField('name')}
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  required
                />
              </label>

              <label className="page-grid" style={{ gap: 6, gridColumn: '1 / -1' }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Description</span>
                <textarea
                  className="field"
                  rows={4}
                  value={form.description}
                  onChange={handleField('description')}
                  placeholder="Describe the product..."
                  style={{ resize: 'vertical' }}
                />
              </label>

              <label className="page-grid" style={{ gap: 6 }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Price (GHc) *</span>
                <input
                  className="field"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleField('price')}
                  placeholder="0.00"
                  required
                />
              </label>

              <label className="page-grid" style={{ gap: 6 }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Original price (GHc) <span style={{ fontWeight: 400 }}>- optional, shows strikethrough</span></span>
                <input
                  className="field"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.old_price}
                  onChange={handleField('old_price')}
                  placeholder="Leave blank if no discount"
                />
              </label>

              <label className="page-grid" style={{ gap: 6 }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Stock (units)</span>
                <input
                  className="field"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleField('stock')}
                  placeholder="e.g. 50"
                />
              </label>

              <label className="page-grid" style={{ gap: 6 }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Rating <span style={{ fontWeight: 400 }}>(0-5)</span></span>
                <input
                  className="field"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleField('rating')}
                  placeholder="e.g. 4.5"
                />
              </label>

              <label className="page-grid" style={{ gap: 6 }}>
                <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Review count</span>
                <input
                  className="field"
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={handleField('reviews')}
                  placeholder="e.g. 128"
                />
              </label>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginTop: 4 }}>
                  <strong style={{ color: '#0f1111', fontSize: '0.95rem', display: 'block', marginBottom: 14 }}>
                    Category &amp; subcategory
                  </strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                    <label className="page-grid" style={{ gap: 6 }}>
                      <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Category</span>
                      <select className="select" value={form.category} onChange={handleCategoryChange}>
                        <option value="">- Select category -</option>
                        {categories.map((category) => (
                          <option key={category.name} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    </label>

                    <label className="page-grid" style={{ gap: 6 }}>
                      <span className="supporting-text" style={{ color: form.category ? '#222' : '#888', fontWeight: 700 }}>
                        Subcategory group
                      </span>
                      <select
                        className="select"
                        value={selectedSection}
                        onChange={handleSectionChange}
                        disabled={!form.category || subcategorySections.length === 0}
                        style={{ opacity: form.category ? 1 : 0.5 }}
                        title={!form.category ? 'Select a category first' : 'Select a subcategory group'}
                      >
                        <option value="">
                          {!form.category ? '- Select a category first -' : '- Select group -'}
                        </option>
                        {subcategorySections.map((section) => (
                          <option key={section.heading} value={section.heading}>{section.heading}</option>
                        ))}
                      </select>
                    </label>

                    <label className="page-grid" style={{ gap: 6 }}>
                      <span className="supporting-text" style={{ color: selectedSection ? '#222' : '#888', fontWeight: 700 }}>
                        Subcategory
                      </span>
                      <select
                        className="select"
                        value={form.subcategory}
                        onChange={handleField('subcategory')}
                        disabled={!selectedSection || subcategoryItems.length === 0}
                        style={{ opacity: selectedSection ? 1 : 0.5 }}
                        title={!selectedSection ? 'Select a group first' : 'Select a subcategory'}
                      >
                        <option value="">
                          {!selectedSection ? '- Select a group first -' : '- Select subcategory -'}
                        </option>
                        {subcategoryItems.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {(form.category || form.subcategory) && (
                    <div className="stack-row" style={{ marginTop: 12, gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="supporting-text">Selected:</span>
                      {form.category && <span className="alibaba-badge soft">{form.category}</span>}
                      {selectedSection && <span className="supporting-text">&gt;</span>}
                      {selectedSection && <span className="alibaba-badge soft">{selectedSection}</span>}
                      {form.subcategory && <span className="supporting-text">&gt;</span>}
                      {form.subcategory && <span className="alibaba-badge soft">{form.subcategory}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, marginTop: 4 }}>
                  <strong style={{ color: '#0f1111', fontSize: '0.95rem', display: 'block', marginBottom: 14 }}>Images</strong>
                  <div style={{ display: 'grid', gap: 14 }}>
                    <label className="page-grid" style={{ gap: 6 }}>
                      <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Main image URL</span>
                      <input
                        className="field"
                        value={form.image}
                        onChange={handleField('image')}
                        placeholder="https://..."
                      />
                      {form.image && (
                        <img
                          src={form.image}
                          alt="preview"
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }}
                          onError={(event) => { event.currentTarget.style.display = 'none' }}
                        />
                      )}
                    </label>
                    <label className="page-grid" style={{ gap: 6 }}>
                      <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>
                        Additional images <span style={{ fontWeight: 400 }}>- comma-separated URLs</span>
                      </span>
                      <textarea
                        className="field"
                        rows={3}
                        value={form.images}
                        onChange={handleField('images')}
                        placeholder="https://..., https://..., https://..."
                        style={{ resize: 'vertical' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stack-row" style={{ marginTop: 16, gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-ghost" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              disabled={saving}
            >
              <Save size={14} />
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProductForm
