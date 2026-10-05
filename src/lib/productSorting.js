const uploadedAt = (product) => {
  const timestamp = Date.parse(product.createdAt || product.created_at || '')
  return Number.isFinite(timestamp) ? timestamp : 0
}

// Undated legacy products follow dated uploads; never infer age from UUIDs.
export const newestProductsFirst = (products) => [...products].sort((a, b) => uploadedAt(b) - uploadedAt(a))
