import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { ListingPage } from './CategoryPage'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'
import { buildDepartmentSubcategoryMap, productMatchesSubcategory } from '../lib/productCategories'

const SubcategoryPage = () => {
  const { category, subcategory } = useParams()
  const { products } = useProducts()
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)
  const decodedCategory = decodeURIComponent(category)
  const decodedSubcategory = decodeURIComponent(subcategory)
  const menuTree = useMemo(() => buildMenuTree(menuItems), [menuItems])
  const departmentSubcategoryMap = useMemo(() => buildDepartmentSubcategoryMap(menuTree.departments), [menuTree.departments])
  const filtered = products.filter((product) => productMatchesSubcategory(product, decodedCategory, decodedSubcategory, departmentSubcategoryMap))

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
      title={decodedSubcategory}
      subtitle={`All ${decodedSubcategory} items from ${decodedCategory}, presented in an Alibaba-style product gallery.`}
      products={filtered}
    />
  )
}

export default SubcategoryPage
