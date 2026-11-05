// Stable during a visit (including catalog refreshes), varied on the next visit.
export const randomizeHomeProducts = (products, seed) => products
  .map((product) => {
    let rank = seed >>> 0
    for (const char of String(product.id)) rank = Math.imul(rank ^ char.charCodeAt(0), 16777619) >>> 0
    return { product, rank }
  })
  .sort((a, b) => a.rank - b.rank || String(a.product.id).localeCompare(String(b.product.id)))
  .map(({ product }) => product)
