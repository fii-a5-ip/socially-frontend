import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import flagRO from '../../assets/flag-ro.png'
import flagEN from '../../assets/flag-en.png'
import './PublicNavbar.css'

/* ── Inline SVG Icons ── */
const IconMoon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const IconSun = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

/* ── Flag SVGs ── 
const FlagRO = () => (
  <svg width="22" height="22" viewBox="0 0 3 2" className="pnb-flag">
    <rect width="1" height="2" fill="#002B7F"/>
    <rect x="1" width="1" height="2" fill="#FCD116"/>
    <rect x="2" width="1" height="2" fill="#CE1126"/>
  </svg>
)

const FlagEN = () => (
  <svg width="22" height="22" viewBox="0 0 60 30" className="pnb-flag">
    <rect width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
)
*/
/* ── Dropdown ── */
function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="pnb-dropdown" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className="pnb-dropdown__menu" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ── PublicNavbar ── */
function PublicNavbar() {
  const { theme, toggleTheme, lang, setLang } = useApp()

  return (
    <>
      {/* Top bar */}
      <nav className="pnb-top">
        <div className="pnb-top__inner">

          {/* Brand — desktop only */}
          <Link to="/" className="pnb-brand" title="Socially">
            Socially
          </Link>

          {/* Auth buttons */}
          <div className="pnb-auth">
            <Link to="/login" className="pnb-auth__btn">
              {lang === 'RO' ? 'Autentificare' : 'Login'}
            </Link>
            <Link to="/register" className="pnb-auth__btn">
              {lang === 'RO' ? 'Înregistrare' : 'Register'}
            </Link>
          </div>

          {/* Right controls */}
          <div className="pnb-top__controls">

            {/* About — desktop only */}
            <Link to="/about" className="pnb-about">
              {lang === 'RO' ? 'Despre' : 'About'}
            </Link>

            {/* Language selector */}
            <Dropdown
              trigger={
                <button className="pnb-icon-btn pnb-lang-btn">
                  <img src={lang === 'RO' ? flagRO : flagEN} alt={lang} className="pnb-flag" />
                  <span className="pnb-lang-label">{lang}</span>
                  <IconChevron />
                </button>
              }
            >
              <button className="pnb-dropdown__item" onClick={() => setLang('RO')}>
                <img src={flagRO} alt="RO" className="pnb-flag" /> Română
              </button>
              <button className="pnb-dropdown__item" onClick={() => setLang('EN')}>
                <img src={flagEN} alt="EN" className="pnb-flag" /> English
              </button>
            </Dropdown>

            {/* Theme toggle */}
            <button
              className="pnb-icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <IconMoon /> : <IconSun />}
            </button>

          </div>
        </div>
      </nav>

      {/* Bottom bar — mobile only */}
      <nav className="pnb-bottom">
        <Link to="/" className="pnb-bottom__brand" title="Socially">
          Socially
        </Link>
        <Link to="/about" className="pnb-bottom__about">
          {lang === 'RO' ? 'Despre' : 'About'}
        </Link>
      </nav>
    </>
  )
}

export default PublicNavbar