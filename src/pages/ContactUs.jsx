import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useSiteContent } from '../context/SiteContentContext'
import { submitContact } from '../lib/orderService'
import { buildMenuTree, defaultStoreMenuItems, fetchStoreMenuItems, subscribeToStoreMenuItems } from '../lib/storeMenu'
import { supabase } from '../lib/supabase'

const ContactUs = () => {
  const navigate = useNavigate()
  const { siteContent } = useSiteContent()
  const storeBrand = siteContent.storeBrand
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', category: 'general', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [menuItems, setMenuItems] = useState(defaultStoreMenuItems)

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

  const supportQuickLinks = useMemo(() => {
    const footerSupport = buildMenuTree(menuItems).footerSections.find((section) => section.key === 'footer_support')
    return footerSupport?.items.slice(0, 3) || []
  }, [menuItems])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await submitContact(formData)
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', category: 'general', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (caughtError) {
      setError(caughtError?.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">Support center</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>Contact {storeBrand.name}</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>
            Reach the {storeBrand.name} team for order support, delivery questions, product issues, or general help.
          </p>
        </section>

        <section className="support-grid">
          <div className="page-card" style={{ padding: 24 }}>
            <h2 style={{ marginTop: 0, color: '#222' }}>Send us a message</h2>
            {submitted ? <div className="notice" style={{ marginBottom: 14 }}>Thank you. Your message has been sent successfully.</div> : null}
            {error ? <div className="alert" style={{ marginBottom: 14 }}>{error}</div> : null}
            <form onSubmit={handleSubmit} className="page-grid" style={{ gap: 14 }}>
              <div className="form-grid two">
                <input className="field" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
                <input className="field" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email address" required />
              </div>
              <div className="form-grid two">
                <input className="field" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
                <select className="select" name="category" value={formData.category} onChange={handleChange}>
                  <option value="general">General inquiry</option>
                  <option value="support">Customer support</option>
                  <option value="sales">Sales</option>
                  <option value="feedback">Feedback</option>
                  <option value="bug">Bug report</option>
                </select>
              </div>
              <input className="field" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
              <textarea className="textarea" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help" required />
              <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send message'}</button>
            </form>
          </div>

          <div className="page-grid">
            <div className="info-card">
              <h3 style={{ marginTop: 0, color: '#222' }}>Contact information</h3>
              <div className="page-grid" style={{ gap: 14 }}>
                <div className="stack-row" style={{ alignItems: 'flex-start', gap: 10 }}><Mail size={16} color="#ff5a0a" /><div><strong>{storeBrand.supportEmail}</strong><div className="supporting-text">Email support</div></div></div>
                <div className="stack-row" style={{ alignItems: 'flex-start', gap: 10 }}><Phone size={16} color="#ff5a0a" /><div><strong>{storeBrand.supportPhone}</strong><div className="supporting-text">Call center</div></div></div>
                <div className="stack-row" style={{ alignItems: 'flex-start', gap: 10 }}><MapPin size={16} color="#ff5a0a" /><div><strong>{storeBrand.supportLocation}</strong><div className="supporting-text">{storeBrand.supportLocationNote}</div></div></div>
              </div>
            </div>
            <div className="info-card" style={{ background: '#fff7ed' }}>
              <h3 style={{ marginTop: 0, color: '#222' }}>Quick links</h3>
              <div className="page-grid" style={{ gap: 10 }}>
                {supportQuickLinks.map((item) => (
                  <button key={item.id} type="button" className="btn-ghost" onClick={() => navigate(item.path)}>{item.label}</button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ContactUs
