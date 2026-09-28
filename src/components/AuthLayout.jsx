import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({ children, registering = false }) {
  return (
    <main className="shop-auth">
      <div className="shop-auth-frame">
        <aside className="shop-auth-story">
          <Link to="/" className="shop-auth-logo" aria-label="Robobbo home"><img src="/robbobo%20logo.png" alt="Robobbo" /></Link>
          <div className="shop-auth-story-body">
            <h1>{registering ? 'Your next great find starts here.' : 'Back for something good?'}</h1>
            <p>{registering ? 'A home refresh, a new look, or something just for you. Make it yours with Robobbo.' : 'Your favourites, your orders, your next discovery. Pick up where you left off.'}</p>
            <ol className="shop-auth-steps">
              <li><span>01</span><strong>{registering ? 'Create your account' : 'Sign in to your account'}</strong></li>
              <li><span>02</span><strong>Find something you love</strong></li>
              <li><span>03</span><strong>Make it yours</strong></li>
            </ol>
          </div>
        </aside>
        <section className="shop-auth-panel">
          <Link to="/" className="shop-auth-back"><ArrowLeft size={15} /> Back to shop</Link>
          <div className="shop-auth-form-wrap">{children}</div>
          <p className="shop-auth-bottom">Shopping for your everyday.</p>
        </section>
      </div>
    </main>
  )
}
