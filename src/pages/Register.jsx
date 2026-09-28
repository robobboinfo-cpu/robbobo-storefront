import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import AuthPassword from '../components/AuthPassword'
import { normalizeGhanaPhone } from '../lib/ghanaPhone'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/account'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return
    setError('')
    const normalizedPhone = normalizeGhanaPhone(phone)
    if (!name.trim()) return setError('Please enter your full name.')
    if (!normalizedPhone) return setError('Enter a Ghana phone number, for example 024 123 4567.')
    if (!agreeTerms) return setError('Please agree to the terms and privacy policy.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    setLoading(true)
    try {
      const result = await register(name.trim(), email.trim(), password, normalizedPhone)
      if (result.success) navigate(from, { replace: true })
      else setError(result.message || 'Unable to create your account. Please try again.')
    } catch {
      setError('Unable to create your account right now. Please try again.')
    } finally { setLoading(false) }
  }

  return <AuthLayout registering>
    <header className="shop-auth-heading"><h2>Join the good finds.</h2><p>Create your Robbobo shopping account.</p></header>
    {error && <p className="shop-auth-error" role="alert">{error}</p>}
    <form onSubmit={handleSubmit} className="shop-auth-form">
      <div className="shop-auth-field"><label htmlFor="phone">Phone number</label><div className="shop-auth-phone"><span aria-label="Ghana, country code +233"><span className="shop-auth-flag" aria-hidden="true"></span> +233</span><input id="phone" name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="24 123 4567" aria-describedby="phone-help" value={phone} onChange={(event) => setPhone(event.target.value)} required /></div><small id="phone-help">Ghana numbers only. You can also enter 024 123 4567.</small></div>
      <div className="shop-auth-field"><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" placeholder="Your full name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
      <div className="shop-auth-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
      <AuthPassword id="password" label="Password" value={password} onChange={(event) => setPassword(event.target.value)} describedBy="password-help" />
      <small id="password-help" className="shop-auth-password-help">Use at least 6 characters.</small>
      <AuthPassword id="confirm-password" label="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
      <label className="shop-auth-terms"><input type="checkbox" checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} required /><span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</span></label>
      <button className="shop-auth-submit" disabled={loading}>{loading ? 'Creating account...' : 'Create my account'}</button>
    </form>
    <p className="shop-auth-switch">Already shopping with us? <Link to="/login" state={{ from }}>Sign in</Link></p>
  </AuthLayout>
}
