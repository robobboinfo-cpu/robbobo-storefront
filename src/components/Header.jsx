import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Blocks,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Headphones,
  House,
  Menu,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sofa,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useSiteContent } from '../context/SiteContentContext'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems, subscribeToStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'

const Header = () => {
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { currentUser } = useAuth()
  const { siteContent } = useSiteContent()
  const [searchQuery, setSearchQuery] = useState('')
  const [megaOpen, setMegaOpen] = useState(false)
  const [showAllMobileDepartments, setShowAllMobileDepartments] = useState(false)
  const [mobileDepartmentId, setMobileDepartmentId] = useState('')
  const [activeMegaCategory, setActiveMegaCategory] = useState('')
  const [hidden, setHidden] = useState(false)
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)
  const lastScrollY = useRef(0)

  const categories = siteContent.categories || []
  const storeBrand = siteContent.storeBrand
  const categoryOptions = useMemo(() => categories.map((category) => category.name), [categories])
  const menuTree = useMemo(() => buildMenuTree(menuItems), [menuItems])
  const subnavItems = menuTree.subnavItems
  const utilityItems = menuTree.utilityItems
  const departments = menuTree.departments
  const mobileMenuContent = siteContent.homeContent?.mobileMenu || {}
  const activeDepartment = useMemo(
    () => departments.find((department) => department.id === activeMegaCategory) || departments[0] || null,
    [activeMegaCategory, departments]
  )
  const visibleMobileDepartments = showAllMobileDepartments ? departments : departments.slice(0, 6)

  useEffect(() => {
    if (!megaOpen || !window.matchMedia('(max-width: 760px)').matches) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [megaOpen])
  const activeSections = activeDepartment?.sections || []
  const drawerQuickLinks = subnavItems.slice(0, 6)
  const mobileDepartment = useMemo(
    () => departments.find((department) => department.id === mobileDepartmentId) || null,
    [departments, mobileDepartmentId]
  )

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > lastScrollY.current

      if (currentScrollY < 24) {
        setHidden(false)
      } else if (scrollingDown && currentScrollY > 120) {
        setHidden(true)
        setMegaOpen(false)
      } else if (!scrollingDown) {
        setHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const { data } = await fetchStoreMenuItems(supabase)
        setMenuItems(data || defaultStoreMenuItems)
      } catch {
        setMenuItems(defaultStoreMenuItems)
      }
    }

    loadMenuItems()

    const channel = subscribeToStoreMenuItems(supabase, loadMenuItems)
    const handleFocus = () => loadMenuItems()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadMenuItems()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!departments.length) {
      setActiveMegaCategory('')
      return
    }

    if (!departments.some((department) => department.id === activeMegaCategory)) {
      setActiveMegaCategory(departments[0].id)
    }
  }, [activeMegaCategory, departments])

  const handleSearch = () => {
    const query = searchQuery.trim()
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products')
    setMegaOpen(false)
  }

  const toggleMega = () => setMegaOpen((value) => !value)

  const closeMega = () => {
    setMegaOpen(false)
    setShowAllMobileDepartments(false)
    setMobileDepartmentId('')
  }

  const getDrawerIcon = (label) => {
    const text = String(label || '').toLowerCase()

    if (text.includes('deal')) return <Flame size={18} />
    if (text.includes('new')) return <Sparkles size={18} />
    if (text.includes('track')) return <ChevronRight size={18} />
    if (text.includes('customer')) return <User size={18} />
    if (text.includes('electronic')) return <Headphones size={18} />
    if (text.includes('fashion')) return <ShoppingBag size={18} />
    if (text.includes('home')) return <Sofa size={18} />
    if (text.includes('beauty')) return <Sparkles size={18} />
    if (text.includes('sport')) return <Dumbbell size={18} />
    if (text.includes('kids')) return <Blocks size={18} />

    return <ChevronRight size={18} />
  }

  return (
    <>
      <header className="amazon-header">
        <div className="amazon-topnav">
          <button
            type="button"
            className="amazon-mobile-menu mobile-only"
            onClick={toggleMega}
            aria-label={megaOpen ? 'Close menu' : 'Open menu'}
          >
            {megaOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <button
            type="button"
            className="amazon-logo"
            onClick={() => {
              navigate('/')
              closeMega()
            }}
            aria-label={storeBrand.name}
          >
            <img
              className="amazon-logo-image"
              src="/robbobo%20logo.png"
              alt={storeBrand.name}
            />
          </button>

          <button
            type="button"
            className="amazon-mobile-account mobile-only"
            onClick={() => {
              navigate(currentUser ? '/account' : '/login')
              closeMega()
            }}
          >
            <small>Hello</small>
            <strong>{currentUser ? currentUser.name.split(' ')[0] : 'Sign in'}</strong>
          </button>

          <button type="button" className="amazon-cart amazon-cart-slot" onClick={() => navigate('/cart')}>
            <span className="amazon-cart-count">{cartCount}</span>
            <ShoppingCart size={34} strokeWidth={1.8} />
            <strong>Cart</strong>
          </button>

          <div className="amazon-searchbar amazon-searchbar-slot">
            <select defaultValue="All" aria-label="Search category">
              <option>All</option>
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              placeholder={`Search ${storeBrand.name}`}
            />
            <button type="button" className="amazon-searchbtn" onClick={handleSearch} aria-label="Search">
              <Search size={21} />
            </button>
          </div>

          <button type="button" className="amazon-navitem amazon-account-slot desktop-only" onClick={() => navigate(currentUser ? '/account' : '/login')}>
            <small>Hello, {currentUser ? currentUser.name.split(' ')[0] : 'sign in'}</small>
            <strong>Account & Lists</strong>
          </button>

          <button type="button" className="amazon-navitem amazon-returns-slot desktop-only" onClick={() => navigate('/track')}>
            <small>Returns</small>
            <strong>& Orders</strong>
          </button>
        </div>

        <div className="amazon-subnav">
          <div className="page-shell amazon-subnav-inner">
            <button type="button" className={`amazon-subnav-all desktop-only ${megaOpen ? 'amz-mega-trigger-active' : ''}`} onClick={toggleMega}>
              <Menu size={18} />
              <span>All</span>
            </button>

            {subnavItems.map((item) => (
              <button
                key={item.id || item.label}
                type="button"
                className="amazon-subnav-link"
                onClick={() => {
                  navigate(item.path || '/products')
                  closeMega()
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {megaOpen ? (
          <div className="amz-mega-panel desktop-only">
            <div className="amz-mega-body">
              <div className="amz-mega-left">
                <div className="amz-mega-left-heading">Shop by department</div>
                {departments.map((department) => (
                  <button
                    key={department.id}
                    type="button"
                    className={`amz-mega-cat-btn ${activeMegaCategory === department.id ? 'active' : ''}`}
                    onMouseEnter={() => setActiveMegaCategory(department.id)}
                    onClick={() => {
                      navigate(department.path || '/products')
                      closeMega()
                    }}
                  >
                    <span>{department.label}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
                {utilityItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="amz-mega-cat-btn"
                    onClick={() => {
                      navigate(item.path || '/products')
                      closeMega()
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>

              <div className="amz-mega-right">
                {activeSections.length > 0 ? (
                  activeSections.map((section) => (
                    <div key={section.id || section.label} className="amz-mega-section">
                      <div className="amz-mega-section-heading">{section.label}</div>
                      {section.items.map((item) => (
                        <button
                          key={item.id || item.label}
                          type="button"
                          className="amz-mega-link"
                          onClick={() => {
                            navigate(item.path || `/products?search=${encodeURIComponent(item.label)}`)
                            closeMega()
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', color: '#565959' }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f1111' }}>Browse {activeDepartment?.label || 'departments'}</p>
                    <button
                      type="button"
                      className="amz-mega-link"
                      style={{ marginTop: 12 }}
                      onClick={() => {
                        navigate(activeDepartment?.path || '/products')
                        closeMega()
                      }}
                    >
                      See all {activeDepartment?.label || 'department'} products
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {megaOpen ? (
        <>
          <div className="amazon-mobile-drawer-shell mobile-only" onClick={closeMega} aria-hidden="true">
            <div className="amazon-mobile-drawer open" onClick={(event) => event.stopPropagation()}>
              <div className="amazon-mobile-drawer-head">
                <button
                  type="button"
                  className="amazon-mobile-drawer-account"
                  onClick={() => {
                    navigate(currentUser ? '/account' : '/login')
                    closeMega()
                  }}
                >
                  {mobileMenuContent.signInLabel || (currentUser ? 'My account' : 'Sign in')}
                </button>
                <button
                  type="button"
                  className="amazon-mobile-drawer-close"
                  onClick={closeMega}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <button
                type="button"
                className="amazon-mobile-drawer-home"
                onClick={() => {
                  navigate('/')
                  closeMega()
                }}
              >
                <span>{mobileMenuContent.homeLabel || `${storeBrand.name} Home`}</span>
                <House size={18} />
              </button>

              {drawerQuickLinks.length ? (
                <section className="amazon-mobile-drawer-section">
                  <h3>{mobileMenuContent.quickLinksLabel || 'Quick links'}</h3>
                  <div className="amazon-mobile-drawer-links">
                    {drawerQuickLinks.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="amazon-mobile-drawer-link"
                        onClick={() => {
                          navigate(item.path || '/products')
                          closeMega()
                        }}
                      >
                        <span className="amazon-mobile-drawer-link-icon">{getDrawerIcon(item.label)}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {utilityItems.length ? (
                <section className="amazon-mobile-drawer-section">
                  <h3>{mobileMenuContent.featuredLabel || 'Trending'}</h3>
                  <div className="amazon-mobile-drawer-links">
                    {utilityItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="amazon-mobile-drawer-link"
                        onClick={() => {
                          navigate(item.path || '/products')
                          closeMega()
                        }}
                      >
                        <span className="amazon-mobile-drawer-link-icon">{getDrawerIcon(item.label)}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {!mobileDepartment ? (
                <section className="amazon-mobile-drawer-section">
                  <h3>{mobileMenuContent.departmentsLabel || 'Top Departments'}</h3>
                  <div className="amazon-mobile-drawer-links">
                    {visibleMobileDepartments.map((department) => (
                      <button
                        key={department.id}
                        type="button"
                        className="amazon-mobile-drawer-link amazon-mobile-drawer-link-strong"
                        onClick={() => setMobileDepartmentId(department.id)}
                      >
                        <span className="amazon-mobile-drawer-link-icon">{getDrawerIcon(department.label)}</span>
                        <span className="amazon-mobile-drawer-link-copy">
                          <strong>{department.label}</strong>
                          <small>{department.sections.length ? `${department.sections.length} sections` : 'Browse department'}</small>
                        </span>
                        <span className="amazon-mobile-drawer-link-chevron">
                          <ChevronRight size={18} />
                        </span>
                      </button>
                    ))}
                  </div>
                  {departments.length > 6 ? (
                    <button
                      type="button"
                      className="amazon-mobile-drawer-seeall"
                      onClick={() => setShowAllMobileDepartments((current) => !current)}
                    >
                      {showAllMobileDepartments
                        ? (mobileMenuContent.seeLessLabel || 'See less')
                        : (mobileMenuContent.seeAllLabel || 'See all')}
                    </button>
                  ) : null}
                </section>
              ) : (
                <section className="amazon-mobile-drawer-section amazon-mobile-drawer-section-detail">
                  <button
                    type="button"
                    className="amazon-mobile-drawer-back"
                    onClick={() => setMobileDepartmentId('')}
                  >
                    <ChevronLeft size={18} />
                    <span>{mobileMenuContent.departmentsLabel || 'Top Departments'}</span>
                  </button>
                  <div className="amazon-mobile-drawer-detail-head">
                    <span className="amazon-mobile-drawer-link-icon">{getDrawerIcon(mobileDepartment.label)}</span>
                    <div className="amazon-mobile-drawer-link-copy">
                      <strong>{mobileDepartment.label}</strong>
                      <small>{mobileDepartment.sections.length ? `${mobileDepartment.sections.length} sections` : 'Browse department'}</small>
                    </div>
                  </div>
                  <div className="amazon-mobile-drawer-subtree">
                    <button
                      type="button"
                      className="amazon-mobile-drawer-subtree-all"
                      onClick={() => {
                        navigate(mobileDepartment.path || '/products')
                        closeMega()
                      }}
                    >
                      Shop all {mobileDepartment.label}
                    </button>

                    {mobileDepartment.sections.map((section) => (
                      <div key={section.id} className="amazon-mobile-drawer-subgroup">
                        <p className="amazon-mobile-drawer-subgroup-title">{section.label}</p>
                        <div className="amazon-mobile-drawer-subgroup-links">
                          {section.items.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              className="amazon-mobile-drawer-sublink"
                              onClick={() => {
                                navigate(item.path || `/products?search=${encodeURIComponent(item.label)}`)
                                closeMega()
                              }}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="amz-mega-backdrop desktop-only" onClick={closeMega} aria-hidden="true" />
        </>
      ) : null}
    </>
  )
}

export default Header
