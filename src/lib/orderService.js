import { supabase } from './supabase'

// Create a new order in the database
export const createOrder = async (orderData) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderData.orderNumber,
          user_email: orderData.email,
          items: orderData.items,
          total: orderData.total,
          shipping_address: orderData.shippingAddress,
          shipping_method: orderData.shippingMethod,
          payment_method: orderData.paymentMethod,
          status: 'pending',
          created_at: new Date().toISOString(),
          estimated_delivery: orderData.estimatedDelivery,
        },
      ])
      .select()

    if (error) {
      console.error('Error creating order:', error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error('Failed to create order:', error)
    throw error
  }
}

// Get order by order number
export const getOrderByNumber = async (orderNumber) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

// Get orders by email
export const getOrdersByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

// Update order status
export const updateOrderStatus = async (orderNumber, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('order_number', orderNumber)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

// Save contact form submission
export const submitContact = async (contactData) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          subject: contactData.subject,
          category: contactData.category,
          message: contactData.message,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Contact submission error:', error)
      const isConfigError =
        error.message?.toLowerCase().includes('missing supabase') ||
        error.message?.toLowerCase().includes('environment variable')
      throw new Error(
        isConfigError
          ? 'Message service is temporarily unavailable. Please email us directly at care@robbobo.com'
          : error.message || 'Failed to send message. Please try again.'
      )
    }
    return data[0]
  } catch (caughtError) {
    console.error('Contact submission failed:', caughtError)
    throw caughtError
  }
}

// Get all products from database
export const getAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Get product by ID
export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Create a new product (admin only)
export const createProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

// Update product (admin only)
export const updateProduct = async (productId, updates) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Delete product (admin only)
export const deleteProduct = async (productId) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}
