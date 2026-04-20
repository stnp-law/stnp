import { team } from '@/lib/data/team';
import styles from './page.module.css';

export const metadata = {
  title: 'Our Team',
  description:
    'Meet the experienced legal professionals at Soaloan Tua Nababan & Partners.',
};

export default function TeamPage() {
  const partners = team.filter((m) => m.role === 'partner');
  const seniorAssociates = team.filter((m) => m.role === 'senior_associate');
  const associates = team.filter((m) => m.role === 'associate');

  const renderCard = (member) => (
    <div key={member.id} className={styles.teamCard}>
      <div className={styles.photoWrapper}>
        {member.photo ? (
          <img src={member.photo} alt={member.name} className={styles.photo} />
        ) : (
          <div className={styles.photoPlaceholder}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.memberName}>{member.name}</h3>
        <span className={styles.memberTitle}>{member.title}</span>
        <hr className="divider divider--left" />
        <p className={styles.memberBio}>{member.bio}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.breadcrumb}>Home / Our Team</span>
            <h1 className={styles.heroTitle}>Our Team</h1>
            <p className={styles.heroSubtitle}>
              Experienced legal professionals dedicated to achieving the best outcomes for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Leadership</span>
            <h2 className="section-title">Partners</h2>
            <hr className="divider" />
          </div>
          <div className={styles.teamGrid}>
            {partners.map(renderCard)}
          </div>
        </div>
      </section>

      {/* Senior Associates */}
      <section className={`section ${styles.associatesSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Experienced Counsel</span>
            <h2 className="section-title">Senior Associates</h2>
            <hr className="divider" />
          </div>
          <div className={styles.teamGrid}>
            {seniorAssociates.map(renderCard)}
          </div>
        </div>
      </section>

      {/* Associates */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Team</span>
            <h2 className="section-title">Associates</h2>
            <hr className="divider" />
          </div>
          <div className={styles.teamGrid}>
            {associates.map(renderCard)}
          </div>
        </div>
      </section>
    </>
  );
}
