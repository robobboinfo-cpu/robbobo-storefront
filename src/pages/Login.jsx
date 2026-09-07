import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, PackageSearch, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSiteContent } from '../context/SiteContentContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { siteContent } = useSiteContent()
  const loginContent = siteContent.authContent.login
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const icons = [<ShieldCheck size={18} key="secure" />, <PackageSearch size={18} key="track" />, <User size={18} key="user" />]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    if (result.success) {
      navigate(from)
    } else {
      const isFetchFailure = /failed to fetch|networkerror|network request/i.test(result.message || '')
      setError(isFetchFailure ? 'Sign-in temporarily unavailable. Please try again.' : result.message)
    }

    setLoading(false)
  }

  return (
    <div className="auth-shell">
      <div className="page-shell auth-grid">
        <section className="auth-brand-panel" style={{ background: 'var(--alibaba-navy)', color: '#fff' }}>
          <span className="alibaba-badge orange">{loginContent.badge}</span>
          <h1 style={{ color: '#fff', marginTop: 16, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>{loginContent.heroTitle}</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginTop: 10 }}>{loginContent.heroSubtitle}</p>
          <div className="auth-list">
            {loginContent.highlights.map((item, index) => (
              <div key={item.title} className="auth-list-item">
                <span className="auth-list-icon" style={{ background: 'rgba(255,255,255,0.1)' }}>{icons[index] || icons[0]}</span>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{item.title}</div>
                  <div className="supporting-text" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.copy}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="auth-card">
          <h2 style={{ margin: '0 0 6px', color: '#222' }}>{loginContent.cardTitle}</h2>
          <p className="supporting-text" style={{ marginTop: 0 }}>{loginContent.cardSubtitle}</p>
          {error ? <div className="alert" style={{ marginTop: 14 }}>{error}</div> : null}

          <form onSubmit={handleSubmit} className="page-grid" style={{ gap: 14, marginTop: 18 }}>
            <label className="page-grid" style={{ gap: 8 }}>
              <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Email address</span>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', top: 15, left: 14, color: '#6b7280' }} />
                <input className="field" style={{ paddingLeft: 40 }} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" required />
              </div>
            </label>
            <label className="page-grid" style={{ gap: 8 }}>
              <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Password</span>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: 15, left: 14, color: '#6b7280' }} />
                <input className="field" style={{ paddingLeft: 40, paddingRight: 42 }} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="********" required />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', top: 10, right: 10, border: 'none', background: 'none' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <button type="submit" className="btn-secondary" style={{ width: '100%', padding: '14px', borderRadius: 8, fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="summary-card" style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 800, marginBottom: 6, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{loginContent.testAccountTitle}</div>
            <div className="supporting-text">{loginContent.testAccountLineOne}</div>
            <div className="supporting-text">{loginContent.testAccountLineTwo}</div>
          </div>

          <p className="supporting-text" style={{ marginTop: 18 }}>
            {loginContent.footerPrompt} <Link to="/register" state={{ from }} style={{ color: 'var(--alibaba-orange-strong)', fontWeight: 700 }}>{loginContent.footerLinkLabel}</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Login
