import { Users, Heart, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTranslation } from '../../hooks/useTranslation';
import { useApp } from '../../context/AppContext';

import "./Landing.css";
import heroImage from "./poza.png";

// ==========================================
// COMPONENTA: Hero
// ==========================================
function Hero() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src={heroImage} alt="Imaginea principala" className="w-full h-full object-cover" />
                <div className="absolute inset-0 hero-overlay" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                <div className="space-y-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] leading-tight">
                        {t('landing.hero.title1')}
                        <br />
                        <span className="text-[var(--color-primary)]">{t('landing.hero.title2')}</span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-[var(--text-primary)] opacity-80 max-w-3xl mx-auto">
                        {t('landing.hero.desc')}
                    </p>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-[var(--color-primary)] flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-[var(--color-primary)] rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    );
}

// ==========================================
// COMPONENTA: Features
// ==========================================
function Features() {
    const { t } = useTranslation();

    const features = [
        {
            icon: Users,
            title: t('landing.feature1.title'),
            description: t('landing.feature1.desc'),
        },
        {
            icon: Heart,
            title: t('landing.feature2.title'),
            description: t('landing.feature2.desc'),
        },
        {
            icon: Sparkles,
            title: t('landing.feature3.title'),
            description: t('landing.feature3.desc'),
        },
        {
            icon: Zap,
            title: t('landing.feature4.title'),
            description: t('landing.feature4.desc'),
        },
    ];

    return (
        <section className="py-20 bg-[var(--bg-card)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        {t('landing.features.title')} <span className="text-[var(--color-primary)]">Socially</span>
                    </h2>
                    <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                        {t('landing.features.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all hover:shadow-lg group"
                            >
                                <div className="w-14 h-14 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:scale-110 transition-all">
                                    <Icon className="h-7 w-7 text-[var(--color-primary)] group-hover:text-[var(--text-inverse)] transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                                <p className="text-[var(--text-muted)]">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ==========================================
// COMPONENTA: CTA (Call to Action)
// ==========================================
function CTA() {
    const { t } = useTranslation();

    // Aici era secretul! Folosim "isLoggedIn"
    const { isLoggedIn } = useApp();

    // Dacă utilizatorul este logat, ascundem secțiunea complet
    if (isLoggedIn) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-br from-[var(--color-primary-subtle)] via-[var(--bg-primary)] to-[var(--color-primary-subtle)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                    {t('landing.cta.title')}
                </h2>
                <p className="text-lg sm:text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
                    {t('landing.cta.desc')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="w-full sm:w-auto px-10 py-4 rounded-full bg-[var(--color-primary)] text-[var(--text-inverse)] text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl inline-block">
                        {t('landing.cta.btn')}
                    </Link>
                </div>
                <p className="mt-8 text-sm text-[var(--text-muted)]">
                    {t('landing.cta.disclaimer')}
                </p>
            </div>
        </section>
    );
}
/*function CTA() {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-gradient-to-br from-[var(--color-primary-subtle)] via-[var(--bg-primary)] to-[var(--color-primary-subtle)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                    {t('landing.cta.title')}
                </h2>
                <p className="text-lg sm:text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
                    {t('landing.cta.desc')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-[var(--color-primary)] text-[var(--text-inverse)] text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl">
                        {t('landing.cta.btn')}
                    </button>
                </div>
                <p className="mt-8 text-sm text-[var(--text-muted)]">
                    {t('landing.cta.disclaimer')}
                </p>
            </div>
        </section>
    );
}*/

// ==========================================
// COMPONENTA PRINCIPALĂ
// ==========================================
export default function Landing() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-250">
            <main>
                <Hero />
                <Features />
                <CTA />
            </main>
        </div>
    );
} 