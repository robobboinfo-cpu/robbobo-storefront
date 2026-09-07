import { supabase } from './supabase'

export const defaultNavigationItems = [
  { id: 'nav-deals', label: "Today's Deals", path: '/products?deals=true', section: 'subnav', sort_order: 1, is_active: true },
  { id: 'nav-new-arrivals', label: 'New Arrivals', path: '/products?sort=newest', section: 'subnav', sort_order: 2, is_active: true },
  { id: 'nav-top-picks', label: 'Top Picks', path: '/products?sort=popular', section: 'subnav', sort_order: 3, is_active: true },
  { id: 'nav-customer-service', label: 'Customer Service', path: '/contact', section: 'subnav', sort_order: 4, is_active: true },
  { id: 'nav-track-order', label: 'Track Order', path: '/track', section: 'subnav', sort_order: 5, is_active: true },
  { id: 'nav-electronics', label: 'Electronics', path: '/category/Electronics', section: 'subnav', sort_order: 6, is_active: true },
  { id: 'nav-fashion', label: 'Fashion', path: '/category/Fashion', section: 'subnav', sort_order: 7, is_active: true },
  { id: 'nav-home', label: 'Home & Living', path: '/category/Home%20%26%20Living', section: 'subnav', sort_order: 8, is_active: true },
  { id: 'nav-beauty', label: 'Beauty', path: '/category/Beauty', section: 'subnav', sort_order: 9, is_active: true },
]

const normalizeItem = (item) => ({
  id: item.id,
  label: item.label || 'Menu item',
  path: item.path || '/products',
  section: item.section || 'subnav',
  sort_order: Number(item.sort_order || 0),
  is_active: item.is_active !== false,
})

export const fetchNavigationItems = async () => {
  const { data, error } = await supabase
    .from('store_navigation')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error || !Array.isArray(data) || !data.length) {
    return { data: defaultNavigationItems, error }
  }

  return { data: data.map(normalizeItem), error: null }
}
