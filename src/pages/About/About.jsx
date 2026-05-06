import React from 'react';

import { Users, Cpu, Rocket, CalendarHeart } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import './About.css';

function About() {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          className="about-hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-badge">{t('about.hero.badge')}</div>
          <h1 className="about-title">{t('about.hero.title')}</h1>
          <p className="about-subtitle">
            {t('about.hero.desc')}
          </p>
        </motion.div>
      </section>

      {/* How it works Section */}
      <section className="about-features wrapper">
        <div className="section-heading">
          <h2>{t('about.features.title')}</h2>
          <p>{t('about.features.subtitle')}</p>
        </div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon-wrapper"><Cpu size={32} className="feature-icon" /></div>
            <h3>{t('about.f1.title')}</h3>
            <p>{t('about.f1.desc')}</p>
          </motion.div>

          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon-wrapper"><Users size={32} className="feature-icon" /></div>
            <h3>{t('about.f2.title')}</h3>
            <p>{t('about.f2.desc')}</p>
          </motion.div>

          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon-wrapper"><CalendarHeart size={32} className="feature-icon" /></div>
            <h3>{t('about.f3.title')}</h3>
            <p>{t('about.f3.desc')}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy / Team Section */}
      <section className="about-manifesto wrapper">
        <motion.div 
          className="manifesto-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Rocket size={40} className="manifesto-icon" />
          <h2>{t('about.manifesto.title')}</h2>
          <p>
            {t('about.manifesto.desc')}
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default About;
