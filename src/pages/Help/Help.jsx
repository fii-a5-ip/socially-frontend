import React from 'react';
import { MessageCircle, MapPin, Zap } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation'; 
import '../About/About.css';

function Help() {
    const { t } = useTranslation(); 

    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="about-hero-content">
                    <div className="hero-badge">{t('navbar.help')}</div>
                    <h1 className="about-title">{t('help.title')}</h1>
                    <p className="about-subtitle">{t('help.subtitle')}</p>
                </div>
            </section>

            <section className="about-features wrapper">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper"><Zap size={32} className="feature-icon" /></div>
                        <h3>{t('help.card1.title')}</h3>
                        <p>{t('help.card1.desc')}</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper"><MapPin size={32} className="feature-icon" /></div>
                        <h3>{t('help.card2.title')}</h3>
                        <p>{t('help.card2.desc')}</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper"><MessageCircle size={32} className="feature-icon" /></div>
                        <h3>{t('help.card3.title')}</h3>
                        <p>{t('help.card3.desc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Help;