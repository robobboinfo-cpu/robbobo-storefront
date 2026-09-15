import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Headphones, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Smartphone, Truck } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems, subscribeToStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'

const Footer = () => {
  const { siteContent } = useSiteContent()
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)
  const storeBrand = siteContent.storeBrand

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

  const footerSections = useMemo(() => buildMenuTree(menuItems).footerSections, [menuItems])

  const appStores = [
    { name: 'App Store', url: import.meta.env.VITE_APP_STORE_URL?.trim() || 'https://apps.apple.com/', platform: 'ios' },
    { name: 'Google Play', url: import.meta.env.VITE_GOOGLE_PLAY_URL?.trim() || 'https://play.google.com/store/apps', platform: 'android' },
  ]
  const benefits = [
    { icon: <Truck size={27} strokeWidth={1.6} aria-hidden="true" />, title: 'Delivery to your door', copy: `Shop from anywhere in ${storeBrand.deliveryLabel}`, path: '/shipping' },
    { icon: <ShieldCheck size={27} strokeWidth={1.6} aria-hidden="true" />, title: 'Secure payments', copy: 'Pay with confidence', path: '/checkout' },
    { icon: <RotateCcw size={27} strokeWidth={1.6} aria-hidden="true" />, title: 'Returns & refunds', copy: 'Support with your purchase', path: '/returns' },
    { icon: <Headphones size={27} strokeWidth={1.6} aria-hidden="true" />, title: 'Here to help', copy: 'Talk to our friendly team', path: '/contact' },
  ]

  return (
    <footer className="store-footer">
      <div className="page-shell">
        <div className="store-footer-benefits">
          {benefits.map(({ icon, title, copy, path }) => (
            <Link className="store-footer-benefit" to={path} key={title}>
              <span className="store-footer-icon">{icon}</span>
              <span><strong>{title}</strong><small>{copy}</small></span>
            </Link>
          ))}
        </div>

        <div className="store-footer-grid">
          <section className="store-footer-support" aria-labelledby="footer-support-title">
            <h2 id="footer-support-title">Support</h2>
            <p className="store-footer-intro">Everyday essentials. A little closer.</p>
            <address>
              <span><MapPin size={16} aria-hidden="true" />{storeBrand.supportLocation}</span>
              <a href={`mailto:${storeBrand.supportEmail}`}><Mail size={16} aria-hidden="true" />{storeBrand.supportEmail}</a>
              <a href={`tel:${storeBrand.supportPhone.replace(/[^+\d]/g, '')}`}><Phone size={16} aria-hidden="true" />{storeBrand.supportPhone}</a>
            </address>
            <Link to="/contact" className="store-footer-contact">Contact our team <span aria-hidden="true">&rarr;</span></Link>
          </section>

          <nav aria-label="Footer account">
            <h2>Account</h2>
            <Link to="/account">My account</Link>
            <Link to="/login">Log in / Register</Link>
            <Link to="/cart">Shopping cart</Link>
            <Link to="/track">Track my order</Link>
            <Link to="/products">Shop all products</Link>
          </nav>

          <nav aria-label="Footer quick links">
            <h2>Quick links</h2>
            {footerSections.filter((section) => section.key === 'footer_company').flatMap((section) => section.items).map((item) => (
              item.path ? <Link key={item.id} to={item.path}>{item.label}</Link> : <span key={item.id}>{item.label}</span>
            ))}
            <Link to="/returns">Returns & refunds</Link>
          </nav>

          <section className="store-footer-app" aria-labelledby="footer-app-title">
            <h2 id="footer-app-title">Download app</h2>
            <p>Your everyday finds, on the go.</p>
            <div className="store-footer-downloads">
              <div className="store-footer-phone" aria-hidden="true"><Smartphone size={40} strokeWidth={1.3} /><span>robobbo<span>.</span></span></div>
              <div className="store-footer-badges">
                {appStores.map(({ name, url, platform }) => {
                  const content = <>
                    {platform === 'ios' ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.1 12.3c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.2-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.9-1.2 1.2-2.5 1.2-2.5-.1 0-2.2-.8-2.2-3.8ZM14.8 6c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2-.5 2.7-1.3Z" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 3 11 9L4 21Z" fill="#4bd2bc" /><path d="m4 3 14 8-3 1Z" fill="#57b9ff" /><path d="m4 21 14-8-3-1Z" fill="#ff7778" /><path d="m15 12 3-1 3 1-3 1Z" fill="#ffd166" /></svg>
                    )}
                    <span><small>{platform === 'ios' ? 'Download on the' : 'GET IT ON'}</small><strong>{name}</strong></span>
                  </>
                  return <a className="store-footer-badge" key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name} (opens in a new tab)`}>{content}</a>
                })}
              </div>
            </div>
          </section>
        </div>

        <div className="store-footer-bottom">
          <Link to="/" className="store-footer-brand" aria-label={`${storeBrand.name} home`}>
            <img src="/robbobo%20logo.png" alt={storeBrand.name} />
          </Link>
          <span>{storeBrand.copyrightLine}</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowUp size={15} aria-hidden="true" /></button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
