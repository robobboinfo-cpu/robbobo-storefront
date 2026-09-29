import { createContext, useContext, useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

export const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)
  const notifyCart = (message) => setNotification({ message })

  useEffect(() => {
    if (!notification) return
    const timer = window.setTimeout(() => setNotification(null), 3000)
    return () => window.clearTimeout(timer)
  }, [notification])

  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem('aurevia_cart')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('aurevia_cart', JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    notifyCart('Product added to cart successfully.')
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
    notifyCart('Product removed from cart.')
  }

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.find(item => item.id === productId)
    if (!item || item.quantity === quantity) return
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
    notifyCart(`Cart quantity updated to ${quantity}.`)
  }

  const clearCart = () => setCartItems([])

  const cartTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0)
  // The header badge represents distinct products, not the total unit quantity.
  const cartCount = cartItems.length

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      notifyCart,
    }}>
      {children}
      <div className="cart-confirmation-region" role="status" aria-live="polite" aria-atomic="true">
        {notification && <div className="cart-confirmation">
          <Check size={22} aria-hidden="true" />
          <span>{notification.message}</span>
          <button type="button" aria-label="Dismiss cart notification" onClick={() => setNotification(null)}><X size={18} /></button>
        </div>}
      </div>
    </CartContext.Provider>
  )
}
