import React from 'react';
import { ShieldCheck, Eye, Database } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation'; 
import '../About/About.css';

function Privacy() {
    const { t } = useTranslation(); 

    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                    <div className="hero-badge">{t('navbar.privacy')}</div>
                    <h1 className="about-title">{t('privacy.title')}</h1>
                    <p className="about-subtitle">{t('privacy.subtitle')}</p>
                </div>
            </section>

            <section className="about-features wrapper">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper"><ShieldCheck size={32} className="feature-icon" /></div>
                        <h3>{t('privacy.card1.title')}</h3>
                        <p>{t('privacy.card1.desc')}</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper"><Database size={32} className="feature-icon" /></div>
                        <h3>{t('privacy.card2.title')}</h3>
                        <p>{t('privacy.card2.desc')}</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper"><Eye size={32} className="feature-icon" /></div>
                        <h3>{t('privacy.card3.title')}</h3>
                        <p>{t('privacy.card3.desc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Privacy;