import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const VISITOR_KEY = 'rbb_storefront_visitor_token'
const SESSION_KEY = 'rbb_storefront_session_token'
const LAST_VISIT_KEY = 'rbb_storefront_last_visit'
const THROTTLE_MS = 120000

const ensureToken = (key) => {
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const token = `${key}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  localStorage.setItem(key, token)
  return token
}

const getVisitSignature = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LAST_VISIT_KEY) || 'null')
    return raw
  } catch {
    return null
  }
}

const setVisitSignature = (payload) => {
  localStorage.setItem(LAST_VISIT_KEY, JSON.stringify(payload))
}

const StorefrontActivityTracker = () => {
  const location = useLocation()
  const { currentUser } = useAuth()

  useEffect(() => {
    const path = `${location.pathname}${location.search}`
    if (!path || path.startsWith('/admin')) return

    const lastVisit = getVisitSignature()
    if (lastVisit?.path === path && Date.now() - Number(lastVisit?.timestamp || 0) < THROTTLE_MS) {
      return
    }

    setVisitSignature({ path, timestamp: Date.now() })

    const visitorToken = ensureToken(VISITOR_KEY)
    const sessionToken = ensureToken(SESSION_KEY)

    supabase.from('storefront_visits').insert([{
      page_path: path,
      page_title: document.title || 'Robbobo',
      visitor_token: visitorToken,
      session_token: sessionToken,
      user_email: currentUser?.email || null,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
      created_at: new Date().toISOString(),
    }]).then(() => {}).catch(() => {})
  }, [currentUser?.email, location.pathname, location.search])

  return null
}

export default StorefrontActivityTracker
