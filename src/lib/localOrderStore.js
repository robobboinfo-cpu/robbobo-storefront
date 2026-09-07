const STORAGE_KEY = "aurevia_orders"

const parseSafe = (value) => {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const loadLocalOrders = () => {
  if (typeof window === "undefined") return []
  const stored = parseSafe(window.localStorage.getItem(STORAGE_KEY))
  return Array.isArray(stored) ? stored : []
}

export const saveLocalOrder = (order) => {
  if (typeof window === "undefined") return order
  const existing = loadLocalOrders()
  const next = [order, ...existing]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return order
}

export const getOrdersForUser = (user) => {
  if (!user) return []
  const orders = loadLocalOrders()
  return orders.filter(
    (order) => order.customer_id === user.id || order.customer_email === user.email
  )
}

export const findOrder = ({ orderNumber, email }) => {
  const normalizedOrderNumber = orderNumber?.trim().toUpperCase()
  const normalizedEmail = email?.trim().toLowerCase()

  const orders = loadLocalOrders()

  return orders.find((order) => {
    if (normalizedOrderNumber) {
      return String(order.order_number).toUpperCase() === normalizedOrderNumber
    }
    if (normalizedEmail) {
      return String(order.customer_email || "").toLowerCase() === normalizedEmail
    }
    return false
  }) || null
}
