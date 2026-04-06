import { useState, useEffect } from 'react';
import { Users, Heart, Sparkles, Zap } from 'lucide-react';

// Importurile reparate de noi
import Navbar from "../../components/Navbar/Navbar";
import "./Landing.css";
import heroImage from "./poza.png";

// ==========================================
// COMPONENTA: Hero
// ==========================================
function Hero({ language }) {
    const translations = {
        RO: {
            title1: 'COMUNITATEA TA,',
            title2: 'AMPLIFICATĂ',
            description: 'Descoperă un loc unde conexiunile prosperă, ideile înfloresc și prieteniile se dezvoltă. Alătură-te nouă în construirea a ceva extraordinar împreună.'
        },
        EN: {
            title1: 'YOUR COMMUNITY,',
            title2: 'AMPLIFIED',
            description: 'Discover a place where connections thrive, ideas flourish, and friendships bloom. Join us in building something extraordinary together.'
        }
    };

    const t = translations[language] || translations['RO'];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src={heroImage} alt="Imaginea principala" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/80" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                <div className="space-y-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                        {t.title1}
                        <br />
                        <span className="text-primary">{t.title2}</span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto">
                        {t.description}
                    </p>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-primary flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    );
}

// ==========================================
// COMPONENTA: Features
// ==========================================
function Features({ language }) {
    const translations = {
        RO: {
            title: 'De ce să alegi',
            subtitle: 'Tot ce ai nevoie pentru a construi și dezvolta comunitatea ta într-o singură platformă puternică',
            features: [
                {
                    icon: Users,
                    title: 'Conectează-te & Implică-te',
                    description: 'Construiește relații semnificative cu persoane cu aceleași interese din întreaga lume.',
                },
                {
                    icon: Heart,
                    title: 'Împărtășește Pasiunea Ta',
                    description: 'Exprimă-te liber și împărtășește ceea ce contează cel mai mult pentru tine cu comunitatea ta.',
                },
                {
                    icon: Sparkles,
                    title: 'Descoperă Conținut',
                    description: 'Explorează conținut selectat adaptat intereselor tale și descoperă noi perspective.',
                },
                {
                    icon: Zap,
                    title: 'Actualizări în Timp Real',
                    description: 'Rămâi conectat cu notificări instant și conversații în timp real.',
                },
            ]
        },
        EN: {
            title: 'Why Choose',
            subtitle: 'Everything you need to build and nurture your community in one powerful platform',
            features: [
                {
                    icon: Users,
                    title: 'Connect & Engage',
                    description: 'Build meaningful relationships with like-minded individuals from around the world.',
                },
                {
                    icon: Heart,
                    title: 'Share Your Passion',
                    description: 'Express yourself freely and share what matters most to you with your community.',
                },
                {
                    icon: Sparkles,
                    title: 'Discover Content',
                    description: 'Explore curated content tailored to your interests and discover new perspectives.',
                },
                {
                    icon: Zap,
                    title: 'Real-time Updates',
                    description: 'Stay connected with instant notifications and real-time conversations.',
                },
            ]
        }
    };

    const t = translations[language] || translations['RO'];

    return (
        <section className="py-20 bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {t.title} <span className="text-primary">Socially</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {t.features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="p-6 rounded-2xl bg-background border border-border hover:border-primary transition-all hover:shadow-lg group"
                            >
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                                    <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
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
function CTA({ language }) {
    const translations = {
        RO: {
            title: 'Gata să te Alături Comunității Noastre?',
            description: 'Fii parte din ceva mai mare. Conectează-te cu mii de membri care împărtășesc interesele și pasiunile tale.',
            button: 'Înregistrează-te Acum',
            disclaimer: 'Nu este necesar card de credit • Gratuit pentru totdeauna • Anulare oricând'
        },
        EN: {
            title: 'Ready to Join Our Community?',
            description: 'Be part of something bigger. Connect with thousands of members who share your interests and passions.',
            button: 'Sign Up Now',
            disclaimer: 'No credit card required • Free forever • Cancel anytime'
        }
    };

    const t = translations[language] || translations['RO'];

    return (
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                    {t.title}
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                    {t.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary text-primary-foreground text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl">
                        {t.button}
                    </button>
                </div>
                <p className="mt-8 text-sm text-muted-foreground">
                    {t.disclaimer}
                </p>
            </div>
        </section>
    );
}

// ==========================================
// COMPONENTA PRINCIPALĂ
// ==========================================
export default function Landing() {
    const [isDark, setIsDark] = useState(false);
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved ? saved.toUpperCase() : 'RO';
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {Navbar && (
                <Navbar
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                />
            )}
            <main>
                <Hero language={language} />
                <Features language={language} />
                <CTA language={language} />
            </main>
        </div>
    );
} 