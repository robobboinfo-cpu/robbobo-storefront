// Storefront customers pay the listed product prices only.
export const orderTotals = (subtotal) => ({
  subtotal: Number(Number(subtotal).toFixed(2)),
  shipping: 0,
  tax: 0,
  total: Number(Number(subtotal).toFixed(2)),
})
