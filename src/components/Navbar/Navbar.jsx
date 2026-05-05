import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useTranslation } from '../../hooks/useTranslation'
import flagRO from '../../assets/flag-ro.png'
import flagEN from '../../assets/flag-en.png'
import './Navbar.css'

/* ── Inline SVG Icons (no lucide-react needed) ── */
const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconBell = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const IconMoon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)
const IconSun = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const IconSettings = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

/* ── Dropdown ── */
function Dropdown({ trigger, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="nb-dropdown" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && <div className="nb-dropdown__menu" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}

/* ── Navbar ── */
function NavBtn({ to, icon }) {
  const location = useLocation()
  return (
    <Link to={to} className={`nb-icon-btn${location.pathname === to ? ' nb-icon-btn--active' : ''}`}>
      {icon}
    </Link>
  )
}

function Navbar() {
  const { theme, toggleTheme, lang, setLang } = useApp()
  const { t } = useTranslation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      {/* Top bar */}
      <nav className="nb-top">
        <div className="nb-top__inner">
                  <Link to="/" className="nb-logo">Socially</Link>
          <div className="nb-top__nav">
            <NavBtn to="/" icon={<IconHome />} />
            <NavBtn to="/mode" icon={<IconUsers />} />
            <NavBtn to="/notifications" icon={<IconBell />} />
            <NavBtn to="/profile" icon={<IconUser />} />
          </div>

          <div className="nb-top__controls">

            <Dropdown trigger={
              <button className="nb-icon-btn nb-lang-btn">
                <img src={lang === 'RO' ? flagRO : flagEN} alt={lang} className="nb-flag" />
                <span className="nb-lang-label">{lang}</span>
                <IconChevron />
              </button>
            }>
              <button className="nb-dropdown__item" onClick={() => setLang('RO')}>
                <img src={flagRO} alt="RO" className="nb-flag" /> Română
              </button>
              <button className="nb-dropdown__item" onClick={() => setLang('EN')}>
                <img src={flagEN} alt="EN" className="nb-flag" /> English
              </button>
            </Dropdown>

            <button 
              className="nb-icon-btn" 
              onClick={toggleTheme}
              title={theme === 'light' ? t('navbar.theme.dark') : t('navbar.theme.light')}
            >
              {theme === 'light' ? <IconMoon /> : <IconSun />}
            </button>

            <Dropdown trigger={
              <button className="nb-icon-btn"><IconSettings /></button>
            }>
              <Link className="nb-dropdown__item" to="/privacy">
                {t('navbar.privacy')}
              </Link>
              <Link className="nb-dropdown__item" to="/help">
                {t('navbar.help')}
              </Link>
              <Link className="nb-dropdown__item" to="/about">
                {t('navbar.settings_about')}
              </Link>
            </Dropdown>

          </div>
        </div>
      </nav>

      {/* Bottom bar — mobile only */}
      <nav className="nb-bottom">
        <NavBtn to="/" icon={<IconHome />} />
        <NavBtn to="/mode" icon={<IconUsers />} />
        <NavBtn to="/notifications" icon={<IconBell />} />
        <NavBtn to="/profile" icon={<IconUser />} />
      </nav>
    </>
  )
}

export default Navbar
