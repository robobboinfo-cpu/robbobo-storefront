import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthPassword({ id, label, value, onChange, autoComplete = 'new-password', describedBy }) {
  const [visible, setVisible] = useState(false)
  return <div className="shop-auth-field">
    <label htmlFor={id}>{label}</label>
    <div className="shop-auth-password">
      <input id={id} name={id} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} aria-describedby={describedBy} required />
      <button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </div>
  </div>
}
