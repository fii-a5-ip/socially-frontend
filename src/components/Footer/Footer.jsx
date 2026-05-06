import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import './Footer.css'

/**
 * Footer — Componentă pentru footer-ul aplicației.
 *
 * TODO (Elina + Mircea):
 * - Adăugați linkuri utile
 * - Adăugați social media icons
 * - Stilizați conform design-ului final
 */
function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer__container container">
        <div className="footer__links">
          <Link to="/about" className="footer__link footer__link--primary">{t('footer.about')}</Link>
          <Link to="/register" className="footer__link footer__link--secondary">{t('footer.register')}</Link>
        </div>
        <p className="footer__text">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}

export default Footer
