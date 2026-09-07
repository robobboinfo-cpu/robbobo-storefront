import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems, subscribeToStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'

const Footer = () => {
  const navigate = useNavigate()
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

  return (
    <footer className="amazon-footer">
      <button type="button" className="amazon-footer-back" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top
      </button>

      <div className="amazon-footer-main">
        <div className="page-shell amazon-footer-grid">
          {footerSections.map((section) => (
            <div key={section.key}>
              <h4>{section.title}</h4>
              {section.items.map((item) => (
                item.path ? (
                  <button key={item.id} type="button" className="amazon-footer-link" onClick={() => navigate(item.path)}>
                    {item.label}
                  </button>
                ) : (
                  <span key={item.id} className="amazon-footer-link">{item.label}</span>
                )
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="amazon-footer-bottom">
        <div className="page-shell amazon-footer-bottom-inner">
          <div className="amazon-footer-brand">{storeBrand.wordmark.toLowerCase()}</div>
          <div className="amazon-footer-meta">
            <span>{storeBrand.supportEmail}</span>
            <span>{storeBrand.supportPhone}</span>
            <span>{storeBrand.copyrightLine}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
