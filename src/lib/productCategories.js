export const CATEGORY_META_KEY = '__categories'

export const normalizeCategoryList = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item || '').trim()).filter(Boolean))]
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return normalizeCategoryList(parsed)
    } catch {
      return []
    }
  }

  return []
}

const normalizeCategoryName = (value) => String(value || '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const categoryNamesOverlap = (selectedCategory, candidateCategory) => {
  const selected = normalizeCategoryName(selectedCategory)
  const candidate = normalizeCategoryName(candidateCategory)

  if (!selected || !candidate) return false
  if (selected === candidate) return true

  const selectedWords = selected.split(' ').filter(Boolean)
  const candidateWords = candidate.split(' ').filter(Boolean)

  if (!selectedWords.length || !candidateWords.length) return false

  const candidateWordSet = new Set(candidateWords)
  const selectedWordSet = new Set(selectedWords)

  const selectedContainedInCandidate = selectedWords.every((word) => candidateWordSet.has(word))
  const candidateContainedInSelected = candidateWords.every((word) => selectedWordSet.has(word))

  return selectedContainedInCandidate || candidateContainedInSelected
}

const normalizeSpecsValue = (value) => {
  if (!value) return {}

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch {
      return {}
    }
  }

  return typeof value === 'object' && !Array.isArray(value) ? value : {}
}

export const extractProductCategories = (product) => {
  const specs = normalizeSpecsValue(product?.specs)
  const categories = [
    String(product?.category || '').trim(),
    ...normalizeCategoryList(product?.categories),
    ...normalizeCategoryList(specs[CATEGORY_META_KEY]),
  ]

  return [...new Set(categories.filter(Boolean))]
}

export const buildDepartmentSubcategoryMap = (departments = []) => (
  new Map(
    departments.map((department) => [
      department.label,
      new Set(
        (department.sections || []).flatMap((section) => (section.items || []).map((item) => item.label))
      ),
    ])
  )
)

export const productMatchesCategory = (product, category, departmentSubcategoryMap = new Map()) => {
  const selectedCategories = extractProductCategories(product)
  if (selectedCategories.some((item) => categoryNamesOverlap(category, item))) return true

  const subcategories = departmentSubcategoryMap.get(category)
  if (!subcategories) return false

  return Boolean(product.subcategory && subcategories.has(product.subcategory))
}

export const productMatchesSubcategory = (product, category, subcategory, departmentSubcategoryMap = new Map()) => (
  Boolean(product.subcategory === subcategory && productMatchesCategory(product, category, departmentSubcategoryMap))
)
