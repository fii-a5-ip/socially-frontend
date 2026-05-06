import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import './ModeSelection.css'

/**
 * ModeSelection — Design sincronizat cu Landing Page-ul (fără elemente decorative).
 *
 * Responsabil: Criss
 */

const ArrowIcon = ({ stroke = 'var(--color-primary)' }) => (
  <svg viewBox="0 0 20 20" fill="none" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 10h12M11 6l5 4-5 4"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function ModeSelection() {
  const { t } = useTranslation()

  return (
    <div className="mode-selection">
      
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 48 }}>
        
        <header className="mode-selection__header" style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="mode-selection__eyebrow" style={{
              color: 'var(--color-primary-dark)', fontWeight: 700, letterSpacing: 1, fontSize: 18, marginBottom: 8
            }}>{t('mode.welcome')}</p>
          
          <h1 className="mode-selection__title">
            {t('mode.title1')}<span>{t('mode.title2')}</span>
          </h1>
          
          <p className="mode-selection__subtitle">
            {t('mode.subtitle')}
          </p>
        </header>

        <div className="mode-selection__cards-wrap" style={{
            display: "flex", flexWrap: "wrap", gap: 38, justifyContent: "center",
            margin: "0 auto 40px", alignItems: "stretch", maxWidth: 820
          }}
        >

          {/* ─── Card Groups ─── */}
          <Link to="/groups" className="mode-selection__card mode-selection__card--groups" style={{
              background: 'var(--bg-card)', borderRadius: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1.5px solid var(--color-primary-light)",
              minWidth: 296, flex: "1 1 320px", maxWidth: 340, padding: "36px 34px 30px 34px",
              textDecoration: "none"
            }}>
            
            <div className="mode-selection__icon-wrap" aria-hidden="true" style={{
                fontSize: 37, marginBottom: 17, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2
              }}>👥</div>
            
            <span className="mode-selection__card-tag" style={{
                background: 'var(--color-primary)', color: "white", borderRadius: "1em",
                fontWeight: 600, padding: "4px 16px", fontSize: "0.85rem", marginBottom: 12
              }}>{t('mode.groups.tag')}</span>
            
            <h2 style={{ fontSize: 26, margin: "4px 0 11px", fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('mode.groups.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', minHeight: 54, fontSize: '0.95rem' }}>
              {t('mode.groups.desc')}
            </p>
            
            <div className="mode-selection__arrow" style={{
                display: "flex", alignItems: "center", gap: 7, marginTop: 22,
                fontWeight: 600, color: 'var(--color-primary-dark)', fontSize: 16
              }}>
              {t('mode.groups.btn')} <ArrowIcon stroke="var(--color-primary-dark)" />
            </div>
          </Link>

          {/* ─── Card Solo ─── */}
          <Link to="/discover" className="mode-selection__card mode-selection__card--solo" style={{
              background: 'var(--bg-card)', borderRadius: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1.5px solid var(--color-accent-light)",
              minWidth: 296, flex: "1 1 320px", maxWidth: 340, padding: "36px 34px 30px 34px",
              textDecoration: "none"
            }}>
            
            <div className="mode-selection__icon-wrap" aria-hidden="true" style={{
                fontSize: 36, marginBottom: 17, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2
              }}>🧭</div>
            
            <span className="mode-selection__card-tag" style={{
                background: 'var(--color-accent)', color: 'var(--text-primary)', borderRadius: "1em",
                fontWeight: 600, padding: "4px 16px", fontSize: "0.85rem", marginBottom: 12
              }}>{t('mode.solo.tag')}</span>
            
            <h2 style={{ fontSize: 26, margin: "4px 0 11px", fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('mode.solo.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', minHeight: 54, fontSize: '0.95rem' }}>
              {t('mode.solo.desc')}
            </p>
            
            <div className="mode-selection__arrow" style={{
                display: "flex", alignItems: "center", gap: 7, marginTop: 22,
                fontWeight: 600, color: 'var(--color-accent-dark, var(--color-accent))', fontSize: 16
              }}>
              {t('mode.solo.btn')} <ArrowIcon stroke="var(--color-accent-dark, var(--color-accent))" />
            </div>
          </Link>

        </div>

        <div style={{
          textAlign: "center", margin: "26px 0 0", fontSize: 15,
          color: 'var(--text-muted)', fontWeight: 500
        }}>
          {t('mode.footer')}
        </div>
      </div>
    </div>
  )
}

export default ModeSelection