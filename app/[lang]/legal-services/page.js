import Link from 'next/link';
import { serviceCategories, proBono } from '@/lib/data/services';
import { getDictionary } from '@/lib/dictionaries';
import styles from './page.module.css';

export const metadata = {
  title: 'Legal Services',
  description:
    'Explore STNP\'s core practice areas grouped by Dispute Resolution, Corporate & Commercial, and Industry Focus.',
};

const serviceIcons = {
  scale: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 6v36M8 16l16-6 16 6M8 16l-2 12h12L16 16M40 16l-2 12h12L48 16" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="24" cy="6" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  gavel: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="18" y="6" width="18" height="8" rx="2" transform="rotate(45 27 10)" strokeLinejoin="round" />
      <path d="M12 32l-6 6M6 38l12 4M42 42H6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 22L10 34" strokeLinecap="round" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="12" width="32" height="30" rx="1" strokeLinejoin="round" />
      <path d="M24 4v8M16 4h16" strokeLinecap="round" />
      <rect x="14" y="18" width="6" height="6" rx="0.5" />
      <rect x="28" y="18" width="6" height="6" rx="0.5" />
      <rect x="14" y="28" width="6" height="6" rx="0.5" />
      <rect x="28" y="28" width="6" height="6" rx="0.5" />
      <path d="M20 42v-6h8v6" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 42V10M6 42h36" strokeLinecap="round" />
      <path d="M12 34l8-10 6 6 10-14" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="36" cy="16" r="3" />
    </svg>
  ),
  landmark: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 4L4 16h40L24 4z" strokeLinejoin="round" />
      <path d="M8 16v22M16 16v22M24 16v22M32 16v22M40 16v22" strokeLinecap="round" />
      <rect x="4" y="38" width="40" height="4" rx="1" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 40C12 40 8 20 24 8c16 12 12 32 12 32" strokeLinejoin="round" />
      <path d="M24 8v32" strokeLinecap="round" />
      <path d="M18 20c3 2 6 2 6 2M30 20c-3 2-6 2-6 2M16 28c4 2 8 2 8 2M32 28c-4 2-8 2-8 2" strokeLinecap="round" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="16" width="32" height="24" rx="2" strokeLinejoin="round" />
      <path d="M16 16v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4M8 24h32" strokeLinecap="round" />
    </svg>
  ),
  flow: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="32" width="12" height="8" rx="1" />
      <rect x="28" y="32" width="12" height="8" rx="1" />
      <rect x="18" y="8" width="12" height="8" rx="1" />
      <path d="M14 32v-8h20v8M24 24v-8" strokeLinejoin="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 4L6 12v14c0 14 18 20 18 20s18-6 18-20V12L24 4z" strokeLinejoin="round" />
      <path d="M24 16v16M18 24l6 6 6-12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M26 4L10 26h14l-4 18 18-22H24l6-18z" strokeLinejoin="round" />
    </svg>
  ),
  crane: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 42h36M12 42L24 8M36 42L24 8M24 8l16-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 28h16M20 18h8M40 4v16" strokeLinecap="round" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="18" />
      <path d="M16 16l6 16 10-6-6-16z" strokeLinejoin="round" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M24 42l-2-2C10 28 6 22 6 15c0-6 5-11 11-11 4 0 8 3 10 7 2-4 6-7 10-7 6 0 11 5 11 11 0 7-4 13-16 25l-2 2z" strokeLinejoin="round" />
    </svg>
  ),
};

export default async function LegalServicesPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      {/* Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.breadcrumb}>{dict.nav.home} / {dict.nav.services}</span>
            <h1 className={styles.heroTitle}>{dict.nav.services}</h1>
            <p className={styles.heroSubtitle}>
              {dict.home.servicesSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section">
        <div className="container">
          {serviceCategories.map((category) => (
            <div key={category.id} id={category.id} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{category.title[lang] || category.title.en}</h2>
                <hr className="divider" />
              </div>
              <div className={styles.servicesList}>
                {category.services.map((service, i) => (
                  <div
                    key={service.id}
                    className={`${styles.serviceRow} ${i % 2 !== 0 ? styles.serviceRowReversed : ''}`}
                  >
                    <div className={styles.serviceIconBlock}>
                      <div className={styles.serviceIconLarge}>
                        {serviceIcons[service.icon]}
                      </div>
                      <div className={styles.serviceNumber}>0{i + 1}</div>
                    </div>
                    <div className={styles.serviceInfo}>
                      <h3 className={styles.serviceTitle}>{service.title[lang] || service.title.en}</h3>
                      <hr className="divider divider--left" />
                      <p className={styles.serviceDesc}>{service.description[lang] || service.description.en}</p>
                      <Link href={`/${lang}/contact`} className={styles.serviceCta}>
                        {dict.home.learnMore}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pro Bono Section */}
          <div className={`${styles.categorySection} ${styles.proBonoSection}`} style={{ marginTop: 'var(--space-3xl)' }}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.categoryTitle}>{proBono.title[lang] || proBono.title.en}</h2>
              <hr className="divider" />
            </div>
            <div className={styles.servicesList}>
              <div className={styles.serviceRow}>
                <div className={styles.serviceIconBlock}>
                  <div className={styles.serviceIconLarge}>
                    {serviceIcons[proBono.icon]}
                  </div>
                </div>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceTitle}>{proBono.title[lang] || proBono.title.en}</h3>
                  <hr className="divider divider--left" />
                  <p className={styles.serviceDesc}>{proBono.description[lang] || proBono.description.en}</p>
                  <Link href={`/${lang}/contact`} className={styles.serviceCta}>
                    {dict.home.schedule}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section--dark ${styles.ctaSection}`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">{dict.home.ctaLabel}</span>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-md)' }}>
            {dict.home.ctaTitle}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto var(--space-xl)', fontSize: 'var(--text-lg)' }}>
            {dict.home.ctaText}
          </p>
          <Link href={`/${lang}/contact`} className="btn btn--primary">
            {dict.home.schedule}
          </Link>
        </div>
      </section>
    </>
  );
}
