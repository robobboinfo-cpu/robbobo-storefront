import { useNavigate, useParams } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'

const GenericPage = () => {
  const { page } = useParams()
  const navigate = useNavigate()
  const { siteContent } = useSiteContent()
  const content = siteContent.infoPages?.[page] || { title: 'Page not found', description: 'The requested page does not exist.', sections: [] }

  return (
    <div className="page-section">
      <div className="page-shell page-grid">
        <section className="page-card amazon-page-banner">
          <span className="alibaba-badge soft">Information page</span>
          <h1 className="section-title" style={{ color: '#fff', marginTop: 12 }}>{content.title}</h1>
          <p className="section-copy" style={{ color: 'rgba(255,255,255,0.78)' }}>{content.description}</p>
        </section>

        <section className="info-grid three-col-grid">
          {content.sections.map((section) => (
            <div key={section.heading} className="info-card">
              <h2 style={{ marginTop: 0, color: '#222' }}>{section.heading}</h2>
              <div className="page-grid" style={{ gap: 10 }}>
                {section.items.map((item) => <div key={item} className="supporting-text">• {item}</div>)}
              </div>
            </div>
          ))}
        </section>

        {!content.sections.length ? (
          <div className="empty-shell page-card">
            <button type="button" className="btn-primary" onClick={() => navigate('/')}>Return home</button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default GenericPage
