import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { SiteContentProvider } from './context/SiteContentContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Account from './pages/Account'
import CategoryPage from './pages/CategoryPage'
import SubcategoryPage from './pages/SubcategoryPage'
import Checkout from './pages/Checkout'
import GenericPage from './pages/GenericPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ContactUs from './pages/ContactUs'
import TrackOrder from './pages/TrackOrder'
import Admin from './pages/Admin'
import AdminProductForm from './pages/AdminProductForm'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <SiteContentProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/category/:category/subcategory/:subcategory" element={<SubcategoryPage />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/track" element={<TrackOrder />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/product/new" element={<AdminProductForm />} />
                  <Route path="/admin/product/:id" element={<AdminProductForm />} />
                  <Route path="/:page" element={<GenericPage />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </SiteContentProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
