import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, PackageSearch, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSiteContent } from '../context/SiteContentContext'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const { siteContent } = useSiteContent()
  const registerContent = siteContent.authContent.register
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/account'
  const icons = [<ShieldCheck size={18} key="secure" />, <User size={18} key="user" />, <PackageSearch size={18} key="package" />]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!agreeTerms) return setError('Please agree to the terms and conditions.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    const result = await register(name, email, password)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      const isFetchFailure = /failed to fetch|networkerror|network request/i.test(result.message || '')
      setError(isFetchFailure ? 'Registration temporarily unavailable. Please try again.' : result.message)
    }
    setLoading(false)
  }

  return (
    <div className="auth-shell">
      <div className="page-shell auth-grid">
        <section className="auth-brand-panel" style={{ background: 'var(--alibaba-navy)', color: '#fff' }}>
          <span className="alibaba-badge orange">{registerContent.badge}</span>
          <h1 style={{ color: '#fff', marginTop: 16, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>{registerContent.heroTitle}</h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginTop: 10 }}>{registerContent.heroSubtitle}</p>
          <div className="auth-list">
            {registerContent.highlights.map((item, index) => (
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
          <h2 style={{ margin: '0 0 6px', color: '#222' }}>{registerContent.cardTitle}</h2>
          <p className="supporting-text" style={{ marginTop: 0 }}>{registerContent.cardSubtitle}</p>
          {error ? <div className="alert" style={{ marginTop: 14 }}>{error}</div> : null}

          <form onSubmit={handleSubmit} className="page-grid" style={{ gap: 14, marginTop: 18 }}>
            <label className="page-grid" style={{ gap: 8 }}>
              <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Full name</span>
              <input className="field" value={name} onChange={(event) => setName(event.target.value)} placeholder="John Doe" required />
            </label>
            <label className="page-grid" style={{ gap: 8 }}>
              <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Email address</span>
              <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" required />
            </label>
            <label className="page-grid" style={{ gap: 8 }}>
              <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Password</span>
              <div style={{ position: 'relative' }}>
                <input className="field" style={{ paddingRight: 42 }} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required />
                <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', top: 10, right: 10, border: 'none', background: 'none' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label className="page-grid" style={{ gap: 8 }}>
              <span className="supporting-text" style={{ color: '#222', fontWeight: 700 }}>Confirm password</span>
              <div style={{ position: 'relative' }}>
                <input className="field" style={{ paddingRight: 42 }} type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} style={{ position: 'absolute', top: 10, right: 10, border: 'none', background: 'none' }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label className="stack-row" style={{ alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} />
              <span className="supporting-text">
                {registerContent.termsPrefix} <Link to="/terms" style={{ color: 'var(--alibaba-orange-strong)' }}>{registerContent.termsLabel}</Link> and <Link to="/privacy" style={{ color: 'var(--alibaba-orange-strong)' }}>{registerContent.privacyLabel}</Link>.
              </span>
            </label>
            <button type="submit" className="btn-secondary" style={{ width: '100%', padding: '14px', borderRadius: 8, fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="supporting-text" style={{ marginTop: 18 }}>
            {registerContent.footerPrompt} <Link to="/login" style={{ color: 'var(--alibaba-orange-strong)', fontWeight: 700 }}>{registerContent.footerLinkLabel}</Link>
          </p>
        </section>
      </div>
    </div>
  )
}

export default Register
