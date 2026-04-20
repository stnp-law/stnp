import { firmInfo } from '@/lib/data/team';
import styles from './page.module.css';

export const metadata = {
  title: 'About Us',
  description:
    'Learn about Soaloan Tua Nababan & Partners — a full-service Jakarta law firm founded in 2018, dedicated to truth, justice, and excellence.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className={styles.pageHero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.breadcrumb}>Home / About Us</span>
            <h1 className={styles.heroTitle}>About Our Firm</h1>
            <p className={styles.heroSubtitle}>
              A legacy of excellence in legal services since 2018
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <span className="section-label">Our Story</span>
              <h2 className="section-title">
                Building Trust Through<br />Legal Excellence
              </h2>
              <hr className="divider divider--left" />
              <p className={styles.storyText}>
                Soaloan Tua Nababan & Partners was established in 2018 by{' '}
                <strong>{firmInfo.founder}</strong> with a clear vision: to provide
                international-caliber legal services rooted in integrity and
                Indonesian expertise. Based in the prestigious Prudential Tower
                in South Jakarta, our firm has quickly earned recognition for
                delivering strategic counsel across a wide spectrum of legal disciplines.
              </p>
              <p className={styles.storyText}>
                Our team combines deep knowledge of Indonesian law with practical
                business acumen, allowing us to serve both domestic and international
                clients with equal proficiency. We believe that the best legal
                outcomes are achieved through thorough preparation, creative
                strategy, and unwavering commitment to our clients&apos; interests.
              </p>
            </div>
            <div className={styles.storyStats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>2018</div>
                <div className={styles.statLabel}>Established</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>6</div>
                <div className={styles.statLabel}>Practice Areas</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>100+</div>
                <div className={styles.statLabel}>Cases Handled</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>Jakarta</div>
                <div className={styles.statLabel}>Headquarters</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Foundation</span>
            <h2 className="section-title">Guiding Principles</h2>
            <hr className="divider" />
          </div>
          <div className={styles.principlesGrid}>
            {firmInfo.principles.map((p, i) => (
              <div key={i} className={styles.principleCard}>
                <div className={styles.principleIcon}>
                  <span>0{i + 1}</span>
                </div>
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleDesc}>{p.description}</p>
                <div className={styles.principleAccent} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section">
        <div className="container">
          <div className={styles.locationGrid}>
            <div className={styles.locationInfo}>
              <span className="section-label">Our Location</span>
              <h2 className="section-title">Visit Our Office</h2>
              <hr className="divider divider--left" />
              <address className={styles.addressBlock}>
                <p>
                  <strong>{firmInfo.address.line1}</strong><br />
                  {firmInfo.address.line2}<br />
                  {firmInfo.address.city}, {firmInfo.address.postal}<br />
                  {firmInfo.address.country}
                </p>
              </address>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <div>
                    {firmInfo.phone.map((p, i) => (
                      <span key={i}>{p}<br /></span>
                    ))}
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href={`mailto:${firmInfo.email}`}>{firmInfo.email}</a>
                </div>
              </div>
            </div>
            <div className={styles.mapPlaceholder}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.302305370211!2d106.81998357582531!3d-6.20963026094602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5005f6a484f%3A0xa695d1d572dbf6ae!2sSoaloan%20Tua%20Nababan%20%26%20Partners!5e0!3m2!1sen!2sid!4v1712850000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="STNP Office Location"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
