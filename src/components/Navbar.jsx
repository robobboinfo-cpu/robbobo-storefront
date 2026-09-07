import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const categories = [
  "Electronics",
  "Clothing & Apparel",
  "Home & Garden",
  "Beauty & Health",
  "Sports & Outdoors",
  "Toys & Hobbies",
  "Automotive",
  "Food & Beverages",
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cartCount } = useCart()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) navigate(`/products?search=${searchTerm}`)
  }

  return (
    <header className={`w-full sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-400 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>Welcome to <span className="text-white font-medium">Robbobo</span> — Global Trade Marketplace</span>
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <span>Hi, <span className="text-white">{currentUser.name}</span></span>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition">Sign In</Link>
                <span className="text-gray-700">|</span>
                <Link to="/register" className="text-orange-400 hover:text-orange-300 transition">Join Free</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-extrabold tracking-tight text-gray-900">ROBBOBO</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden focus-within:border-gray-400 transition">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-gray-900 text-white px-5 hover:bg-gray-800 transition">
                <Search size={16} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition rounded-lg hover:bg-gray-50">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link to="/account" className="p-2 text-gray-600 hover:text-gray-900 transition rounded-lg hover:bg-gray-50" title="Account">
                  <User size={20} />
                </Link>
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 transition">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex p-2 text-gray-600 hover:text-gray-900 transition rounded-lg hover:bg-gray-50">
                <User size={20} />
              </Link>
            )}

            <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="border-b border-gray-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-7 py-2 text-[13px]">
            <div
              className="relative"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => setCategoryOpen(false)}
            >
              <button className="flex items-center gap-1 font-semibold text-gray-800 hover:text-orange-500 transition py-1">
                All Categories
                <ChevronDown size={13} className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-1 w-52 z-50 border border-gray-100 animate-slide-down">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${cat}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {['Top Ranking', 'New Arrivals', 'Deals', 'Trade Assurance'].map(item => (
              <Link key={item} to="/products" className="text-gray-500 hover:text-gray-900 transition">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b px-4 py-4 animate-slide-down">
          <form onSubmit={handleSearch} className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2.5 outline-none text-sm"
            />
            <button type="submit" className="bg-gray-900 text-white px-4">
              <Search size={16} />
            </button>
          </form>
          <div className="flex flex-col">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="py-2.5 text-sm text-gray-600 border-b border-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
          {!currentUser && (
            <div className="flex gap-3 mt-4">
              <Link to="/login" className="flex-1 text-center py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Join Free</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar