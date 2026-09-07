const searchPath = (label) => `/products?search=${encodeURIComponent(label)}`

const footerDefaults = [
  { id: 'footer-shop-all-products', kind: 'footer_shop', parent_id: null, label: 'All Products', path: '/products', sort_order: 1, is_active: true },
  { id: 'footer-shop-electronics', kind: 'footer_shop', parent_id: null, label: 'Electronics', path: '/category/Electronics', sort_order: 2, is_active: true },
  { id: 'footer-shop-fashion', kind: 'footer_shop', parent_id: null, label: 'Fashion', path: '/category/Fashion', sort_order: 3, is_active: true },
  { id: 'footer-shop-home', kind: 'footer_shop', parent_id: null, label: 'Home & Living', path: '/category/Home%20%26%20Living', sort_order: 4, is_active: true },
  { id: 'footer-shop-beauty', kind: 'footer_shop', parent_id: null, label: 'Beauty', path: '/category/Beauty', sort_order: 5, is_active: true },
  { id: 'footer-support-track', kind: 'footer_support', parent_id: null, label: 'Track Order', path: '/track', sort_order: 1, is_active: true },
  { id: 'footer-support-shipping', kind: 'footer_support', parent_id: null, label: 'Shipping Info', path: '/shipping', sort_order: 2, is_active: true },
  { id: 'footer-support-returns', kind: 'footer_support', parent_id: null, label: 'Returns & Refunds', path: '/returns', sort_order: 3, is_active: true },
  { id: 'footer-support-faq', kind: 'footer_support', parent_id: null, label: 'FAQ', path: '/faq', sort_order: 4, is_active: true },
  { id: 'footer-support-contact', kind: 'footer_support', parent_id: null, label: 'Contact Us', path: '/contact', sort_order: 5, is_active: true },
  { id: 'footer-company-about', kind: 'footer_company', parent_id: null, label: 'About Robbobo', path: '/about', sort_order: 1, is_active: true },
  { id: 'footer-company-privacy', kind: 'footer_company', parent_id: null, label: 'Privacy Policy', path: '/privacy', sort_order: 2, is_active: true },
  { id: 'footer-company-terms', kind: 'footer_company', parent_id: null, label: 'Terms of Service', path: '/terms', sort_order: 3, is_active: true },
  { id: 'footer-company-accessibility', kind: 'footer_company', parent_id: null, label: 'Accessibility', path: '/accessibility', sort_order: 4, is_active: true },
  { id: 'footer-company-cookies', kind: 'footer_company', parent_id: null, label: 'Cookie Settings', path: '/cookies', sort_order: 5, is_active: true },
  { id: 'footer-connect-facebook', kind: 'footer_connect', parent_id: null, label: 'Facebook', path: '', sort_order: 1, is_active: true },
  { id: 'footer-connect-instagram', kind: 'footer_connect', parent_id: null, label: 'Instagram', path: '', sort_order: 2, is_active: true },
  { id: 'footer-connect-twitter', kind: 'footer_connect', parent_id: null, label: 'Twitter / X', path: '', sort_order: 3, is_active: true },
  { id: 'footer-connect-whatsapp', kind: 'footer_connect', parent_id: null, label: 'WhatsApp', path: '', sort_order: 4, is_active: true },
]

export const defaultStoreMenuItems = [
  { id: 'subnav-deals', kind: 'subnav', parent_id: null, label: "Today's Deals", path: '/products?deals=true', sort_order: 1, is_active: true },
  { id: 'subnav-new-arrivals', kind: 'subnav', parent_id: null, label: 'New Arrivals', path: '/products?sort=newest', sort_order: 2, is_active: true },
  { id: 'subnav-top-picks', kind: 'subnav', parent_id: null, label: 'Top Picks', path: '/products?sort=popular', sort_order: 3, is_active: true },
  { id: 'subnav-customer-service', kind: 'subnav', parent_id: null, label: 'Customer Service', path: '/contact', sort_order: 4, is_active: true },
  { id: 'subnav-track-order', kind: 'subnav', parent_id: null, label: 'Track Order', path: '/track', sort_order: 5, is_active: true },
  { id: 'subnav-electronics', kind: 'subnav', parent_id: null, label: 'Electronics', path: '/category/Electronics', sort_order: 6, is_active: true },
  { id: 'subnav-fashion', kind: 'subnav', parent_id: null, label: 'Fashion', path: '/category/Fashion', sort_order: 7, is_active: true },
  { id: 'subnav-home-living', kind: 'subnav', parent_id: null, label: 'Home & Living', path: '/category/Home%20%26%20Living', sort_order: 8, is_active: true },
  { id: 'subnav-beauty', kind: 'subnav', parent_id: null, label: 'Beauty', path: '/category/Beauty', sort_order: 9, is_active: true },
  { id: 'utility-all-departments', kind: 'utility', parent_id: null, label: 'All departments', path: '/products', sort_order: 1, is_active: true },
  { id: 'utility-deals', kind: 'utility', parent_id: null, label: "Today's deals", path: '/products?deals=true', sort_order: 2, is_active: true },
  { id: 'utility-new-arrivals', kind: 'utility', parent_id: null, label: 'New arrivals', path: '/products?sort=newest', sort_order: 3, is_active: true },
  { id: 'dept-electronics', kind: 'department', parent_id: null, label: 'Electronics', path: '/category/Electronics', sort_order: 1, is_active: true },
  { id: 'dept-fashion', kind: 'department', parent_id: null, label: 'Fashion', path: '/category/Fashion', sort_order: 2, is_active: true },
  { id: 'dept-home-living', kind: 'department', parent_id: null, label: 'Home & Living', path: '/category/Home%20%26%20Living', sort_order: 3, is_active: true },
  { id: 'dept-beauty', kind: 'department', parent_id: null, label: 'Beauty', path: '/category/Beauty', sort_order: 4, is_active: true },
  { id: 'dept-sports', kind: 'department', parent_id: null, label: 'Sports', path: '/category/Sports', sort_order: 5, is_active: true },
  { id: 'dept-kids-toys', kind: 'department', parent_id: null, label: 'Kids & Toys', path: '/category/Kids%20%26%20Toys', sort_order: 6, is_active: true },
  { id: 'section-electronics-audio', kind: 'mega_section', parent_id: 'dept-electronics', label: 'Audio', path: null, sort_order: 1, is_active: true },
  { id: 'section-electronics-mobile', kind: 'mega_section', parent_id: 'dept-electronics', label: 'Mobile', path: null, sort_order: 2, is_active: true },
  { id: 'section-electronics-work', kind: 'mega_section', parent_id: 'dept-electronics', label: 'Work Setup', path: null, sort_order: 3, is_active: true },
  { id: 'section-electronics-smart-home', kind: 'mega_section', parent_id: 'dept-electronics', label: 'Smart Home', path: null, sort_order: 4, is_active: true },
  { id: 'section-fashion-women', kind: 'mega_section', parent_id: 'dept-fashion', label: 'Women', path: null, sort_order: 1, is_active: true },
  { id: 'section-fashion-men', kind: 'mega_section', parent_id: 'dept-fashion', label: 'Men', path: null, sort_order: 2, is_active: true },
  { id: 'section-fashion-footwear', kind: 'mega_section', parent_id: 'dept-fashion', label: 'Footwear', path: null, sort_order: 3, is_active: true },
  { id: 'section-fashion-accessories', kind: 'mega_section', parent_id: 'dept-fashion', label: 'Accessories', path: null, sort_order: 4, is_active: true },
  { id: 'section-home-bedroom', kind: 'mega_section', parent_id: 'dept-home-living', label: 'Bedroom', path: null, sort_order: 1, is_active: true },
  { id: 'section-home-kitchen', kind: 'mega_section', parent_id: 'dept-home-living', label: 'Kitchen', path: null, sort_order: 2, is_active: true },
  { id: 'section-home-furniture', kind: 'mega_section', parent_id: 'dept-home-living', label: 'Furniture', path: null, sort_order: 3, is_active: true },
  { id: 'section-home-decor', kind: 'mega_section', parent_id: 'dept-home-living', label: 'Decor & Light', path: null, sort_order: 4, is_active: true },
  { id: 'section-beauty-skincare', kind: 'mega_section', parent_id: 'dept-beauty', label: 'Skincare', path: null, sort_order: 1, is_active: true },
  { id: 'section-beauty-haircare', kind: 'mega_section', parent_id: 'dept-beauty', label: 'Haircare', path: null, sort_order: 2, is_active: true },
  { id: 'section-beauty-makeup', kind: 'mega_section', parent_id: 'dept-beauty', label: 'Makeup', path: null, sort_order: 3, is_active: true },
  { id: 'section-beauty-wellness', kind: 'mega_section', parent_id: 'dept-beauty', label: 'Wellness', path: null, sort_order: 4, is_active: true },
  { id: 'section-sports-fitness', kind: 'mega_section', parent_id: 'dept-sports', label: 'Fitness', path: null, sort_order: 1, is_active: true },
  { id: 'section-sports-running', kind: 'mega_section', parent_id: 'dept-sports', label: 'Running', path: null, sort_order: 2, is_active: true },
  { id: 'section-sports-outdoor', kind: 'mega_section', parent_id: 'dept-sports', label: 'Outdoor', path: null, sort_order: 3, is_active: true },
  { id: 'section-sports-recovery', kind: 'mega_section', parent_id: 'dept-sports', label: 'Recovery', path: null, sort_order: 4, is_active: true },
  { id: 'section-kids-learning', kind: 'mega_section', parent_id: 'dept-kids-toys', label: 'Learning', path: null, sort_order: 1, is_active: true },
  { id: 'section-kids-play', kind: 'mega_section', parent_id: 'dept-kids-toys', label: 'Play', path: null, sort_order: 2, is_active: true },
  { id: 'section-kids-outdoor', kind: 'mega_section', parent_id: 'dept-kids-toys', label: 'Outdoor Play', path: null, sort_order: 3, is_active: true },
  { id: 'section-kids-baby', kind: 'mega_section', parent_id: 'dept-kids-toys', label: 'Baby', path: null, sort_order: 4, is_active: true },
  ...[
    ['section-electronics-audio', ['Headphones', 'Earbuds', 'Bluetooth Speakers', 'Gaming Headsets']],
    ['section-electronics-mobile', ['Smartphones', 'Smart Watches', 'Power Banks', 'Accessories']],
    ['section-electronics-work', ['Webcams', 'Mechanical Keyboards', 'Gaming Mice', 'Hard Drives']],
    ['section-electronics-smart-home', ['Smart Bulbs', 'Smart Lights', 'Thermostats', 'Security Cameras']],
    ['section-fashion-women', ['Dresses', 'Tops', 'Jeans & Pants', 'Handbags']],
    ['section-fashion-men', ['T-Shirts', 'Shirts', 'Trousers', 'Suits & Blazers']],
    ['section-fashion-footwear', ['Sneakers', 'Sandals', 'Boots', 'Sports Shoes']],
    ['section-fashion-accessories', ['Watches', 'Belts', 'Sunglasses', 'Travel Bags']],
    ['section-home-bedroom', ['Bedsheets', 'Pillows', 'Curtains', 'Mattresses']],
    ['section-home-kitchen', ['Cookware', 'Coffee Makers', 'Storage', 'Bakeware']],
    ['section-home-furniture', ['Dining Tables', 'Shelving', 'Desks', 'Outdoor Furniture']],
    ['section-home-decor', ['Plants & Pots', 'Rugs', 'Table Lamps', 'Smart Lights']],
    ['section-beauty-skincare', ['Serums', 'Moisturizers', 'Sunscreen', 'Face Masks']],
    ['section-beauty-haircare', ['Shampoos', 'Conditioners', 'Hair Oils', 'Styling']],
    ['section-beauty-makeup', ['Foundation', 'Lipstick', 'Mascara', 'Eyeshadow']],
    ['section-beauty-wellness', ['Vitamins', 'Essential Oils', 'Diffusers', 'Self-care Kits']],
    ['section-sports-fitness', ['Dumbbells', 'Resistance Bands', 'Yoga Mats', 'Jump Ropes']],
    ['section-sports-running', ['Running Shoes', 'Sports Socks', 'Armbands', 'Water Bottles']],
    ['section-sports-outdoor', ['Camping Gear', 'Backpacks', 'Tents', 'Hiking Poles']],
    ['section-sports-recovery', ['Foam Rollers', 'Massage Guns', 'Ice Packs', 'Compression']],
    ['section-kids-learning', ['Building Blocks', 'Puzzles', 'STEM Kits', 'Art Sets']],
    ['section-kids-play', ['Action Figures', 'Dolls', 'Board Games', 'Card Games']],
    ['section-kids-outdoor', ['Bikes', 'Scooters', 'Balls', 'Skipping Ropes']],
    ['section-kids-baby', ['Baby Clothes', 'Rattles', 'Strollers', 'Baby Monitors']],
  ].flatMap(([parentId, labels]) =>
    labels.map((label, index) => ({
      id: `${parentId}-item-${index + 1}`,
      kind: 'mega_link',
      parent_id: parentId,
      label,
      path: searchPath(label),
      sort_order: index + 1,
      is_active: true,
    }))
  ),
  ...footerDefaults,
]

const normalizeItem = (item) => ({
  id: item.id,
  kind: item.kind || 'subnav',
  parent_id: item.parent_id || null,
  label: item.label || 'Menu item',
  path: item.path || '',
  sort_order: Number(item.sort_order || 0),
  is_active: item.is_active !== false,
})

const isSupportedKind = (kind) => kind !== 'footer_earn'

const sortItems = (items) => [...items].sort((a, b) => {
  const orderDiff = Number(a.sort_order || 0) - Number(b.sort_order || 0)
  if (orderDiff !== 0) return orderDiff
  return String(a.label || '').localeCompare(String(b.label || ''))
})

const resolveMenuPaths = (items = []) => {
  const normalized = items.map(normalizeItem).filter((item) => isSupportedKind(item.kind))
  const byId = new Map(normalized.map((item) => [item.id, item]))

  return normalized.map((item) => {
    if (item.kind === 'department' && item.label) {
      return { ...item, path: `/category/${encodeURIComponent(item.label)}` }
    }

    if (item.kind === 'mega_link' && item.label) {
      const section = byId.get(item.parent_id)
      const department = section ? byId.get(section.parent_id) : null
      if (department?.label) {
        return {
          ...item,
          path: `/category/${encodeURIComponent(department.label)}/subcategory/${encodeURIComponent(item.label)}`,
        }
      }
    }

    return item
  })
}

const mergeWithDefaultStoreMenuItems = (items = []) => {
  const merged = new Map(defaultStoreMenuItems.map((item) => [item.id, normalizeItem(item)]))

  items.forEach((item) => {
    const normalized = normalizeItem(item)
    const existing = merged.get(normalized.id) || {}
    merged.set(normalized.id, { ...existing, ...normalized })
  })

  return resolveMenuPaths([...merged.values()])
}

export const buildMenuTree = (items = defaultStoreMenuItems) => {
  const activeItems = resolveMenuPaths(items).filter((item) => item.is_active !== false)
  const byParent = new Map()

  activeItems.forEach((item) => {
    const key = item.parent_id || 'root'
    const current = byParent.get(key) || []
    current.push(item)
    byParent.set(key, current)
  })

  const childrenOf = (parentId, kind) =>
    sortItems((byParent.get(parentId) || []).filter((item) => item.kind === kind))

  const subnavItems = sortItems(activeItems.filter((item) => item.kind === 'subnav'))
  const utilityItems = sortItems(activeItems.filter((item) => item.kind === 'utility'))
  const footerSections = [
    { key: 'footer_shop', title: 'Shop' },
    { key: 'footer_support', title: 'Support' },
    { key: 'footer_company', title: 'Company' },
    { key: 'footer_connect', title: 'Connect' },
  ].map((section) => ({
    ...section,
    items: sortItems(activeItems.filter((item) => item.kind === section.key)),
  }))
  const departments = sortItems(activeItems.filter((item) => item.kind === 'department')).map((department) => ({
    ...department,
    sections: childrenOf(department.id, 'mega_section').map((section) => ({
      ...section,
      items: childrenOf(section.id, 'mega_link'),
    })),
  }))

  return { subnavItems, utilityItems, departments, footerSections, rawItems: activeItems }
}

export const fetchStoreMenuItems = async (supabase) => {
  const { data, error } = await supabase
    .from('store_menu_items')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !Array.isArray(data) || !data.length) {
    return { data: defaultStoreMenuItems, error }
  }

  return { data: mergeWithDefaultStoreMenuItems(data), error: null }
}

export const subscribeToStoreMenuItems = (supabase, onChange) =>
  supabase
    .channel('public-store-menu-items')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'store_menu_items' }, onChange)
    .subscribe()
