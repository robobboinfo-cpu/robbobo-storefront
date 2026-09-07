import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { allProducts as localProducts } from '../data/products'
import { extractProductCategories } from '../lib/productCategories'

const ProductContext = createContext()

export const useProducts = () => useContext(ProductContext)

// Maps exact Supabase column names to the shape the app expects
const normalize = (p) => ({
  id: p.id,
  name: p.name || '',
  price: parseFloat(p.price) || 0,
  oldPrice: parseFloat(p.old_price) || parseFloat(((p.price || 0) * 1.3).toFixed(2)),
  image: p.image || (Array.isArray(p.images) ? p.images[0] : '') || '',
  images: Array.isArray(p.images) ? p.images : [],
  category: p.category || 'General',
  subcategory: p.subcategory || 'General',
  description: p.description || '',
  tag: p.tag || '',
  rating: parseFloat(p.rating) || 4.5,
  reviews: parseInt(p.reviews_count) || 0,
  colors: Array.isArray(p.colors) ? p.colors : [],
  sold: p.orders_count ? `${p.orders_count} sold` : '',
  categories: extractProductCategories(p),
  specs: {},
})

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error || !(data || []).length) {
        if (!isMounted) return
        setError(error?.message || null)
        setProducts(localProducts)
      } else {
        if (!isMounted) return
        setError(null)
        setProducts((data || []).map(normalize))
      }
      if (isMounted) setLoading(false)
    }

    fetchProducts()

    const channel = supabase
      .channel('public-products-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts()
      })
      .subscribe()

    const handleFocus = () => fetchProducts()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchProducts()
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      isMounted = false
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
      supabase.removeChannel(channel)
    }
  }, [])

  const getProductById = (id) =>
    products.find(p => String(p.id) === String(id)) || null

  return (
    <ProductContext.Provider value={{ products, loading, error, getProductById }}>
      {children}
    </ProductContext.Provider>
  )
}
