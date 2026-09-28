import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import AuthPassword from '../components/AuthPassword'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    try {
      const result = await login(email.trim(), password)
      if (result.success) navigate(from, { replace: true })
      else setError(result.message || 'Unable to sign in. Please try again.')
    } catch {
      setError('Unable to sign in right now. Please try again.')
    } finally { setLoading(false) }
  }

  return <AuthLayout>
    <header className="shop-auth-heading"><h2>Welcome back, shopper.</h2><p>Sign in for your next find.</p></header>
    {location.state?.requireSignIn && <p className="shop-auth-notice">Sign in to finish your order. Your cart is saved.</p>}
    {error && <p className="shop-auth-error" role="alert">{error}</p>}
    <form onSubmit={handleSubmit} className="shop-auth-form">
      <div className="shop-auth-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
      <AuthPassword id="password" label="Password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
      <button className="shop-auth-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in to shop'}</button>
    </form>
    <p className="shop-auth-switch">New to Robobbo? <Link to="/register" state={{ from }}>Create an account</Link></p>
    <p className="shop-auth-legal">By signing in, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
  </AuthLayout>
}
