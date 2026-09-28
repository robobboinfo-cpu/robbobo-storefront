export function selectDealProducts(products) {
  const priced = products.filter((product) => Number.isFinite(product.price) && product.price > 0)
  const discounted = priced.filter((product) => product.oldPrice > product.price)
  if (discounted.length) return { products: discounted, budgetPicks: false }
  // When no markdowns are recorded, feature the lowest-priced quarter of the catalog.
  const count = Math.min(priced.length, Math.max(24, Math.ceil(priced.length / 4)))
  return { products: [...priced].sort((a, b) => a.price - b.price).slice(0, count), budgetPicks: true }
}
