import { useState } from 'react'
import { Pause, Play } from 'lucide-react'

export default function BrandSlideshow({ brands = [] }) {
  const [paused, setPaused] = useState(false)
  const [failedImages, setFailedImages] = useState([])
  const logos = (Array.isArray(brands) ? brands : []).filter((brand) => brand?.name && brand?.image && brand.active !== false && !failedImages.includes(brand.image))
  if (!logos.length) return null

  const moving = logos.length > 1
  const renderLogos = (duplicate = false) => (
    <div className="brand-slideshow-group" aria-hidden={duplicate || undefined}>
      {logos.map((brand, index) => (
        <div className="brand-slideshow-logo" key={`${brand.image}-${index}`}>
          <img src={brand.image} alt={duplicate ? '' : brand.name} onError={() => setFailedImages((current) => current.includes(brand.image) ? current : [...current, brand.image])} />
        </div>
      ))}
    </div>
  )

  return (
    <section className={`brand-slideshow${moving ? ' is-moving' : ''}${paused ? ' is-paused' : ''}`} aria-label="Our brands">
      <div className="page-shell brand-slideshow-inner">
        <div className="brand-slideshow-window">
          <div className="brand-slideshow-track" style={{ '--brand-duration': `${Math.max(25, logos.length * 5)}s` }}>
            {renderLogos()}
            {moving && renderLogos(true)}
          </div>
        </div>
        {moving && <button type="button" className="brand-slideshow-toggle" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play brand slideshow' : 'Pause brand slideshow'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}
      </div>
    </section>
  )
}
