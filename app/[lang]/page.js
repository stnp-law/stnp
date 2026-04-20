import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import { getPosts } from '@/lib/api';
import { firmInfo } from '@/lib/data/team';
import { serviceCategories } from '@/lib/data/services';
import { pastClients } from '@/lib/data/clients';
import { decodeHtmlEntities, stripHtml } from '@/lib/utils';
import BorderGlow from '@/components/Components/BorderGlow/BorderGlow';
import CardSwap, { Card } from '@/components/Animations/CardSwap/CardSwap';
import Prism from '@/components/Animations/Prism/Prism';
import MagicRings from '@/components/Animations/MagicRings/MagicRings';
import HeroScrollButton from '@/components/Components/HeroScrollButton/HeroScrollButton';
import HeroParallax from '@/components/Animations/HeroParallax/HeroParallax';
import { 
  Scales, 
  Gavel, 
  Buildings, 
  ChartBar, 
  Bank, 
  Leaf, 
  Briefcase, 
  GitMerge, 
  Shield, 
  Lightning, 
  HardHat, 
  Compass, 
  Heart 
} from '@phosphor-icons/react/dist/ssr';
import styles from './page.module.css';

/* Phosphor icons mapping */
const iconMapping = {
  scale: Scales,
  gavel: Gavel,
  building: Buildings,
  chart: ChartBar,
  landmark: Bank,
  leaf: Leaf,
  briefcase: Briefcase,
  flow: GitMerge,
  shield: Shield,
  bolt: Lightning,
  crane: HardHat,
  compass: Compass,
  heart: Heart,
};

const CLIENT_PRESENTATION_OVERRIDES = {
  'Bank Negara Indonesia': { variant: 'monogram-tag', tag: 'BNI' },
  'PT PLN (Persero)': {
    variant: 'registry-line',
    tag: 'PT',
    main: 'PLN',
    tail: '(Persero)',
  },
  'Kartanegara Energi Perkasa': {
    variant: 'editorial-split',
    lead: 'Kartanegara',
    main: 'Energi',
    tail: 'Perkasa',
  },
};

function buildMonogram(name) {
  const tokens = name
    .replace(/^PT\s+/i, '')
    .replace(/\b(Tbk\.?|Persero|Limited|Indonesia)\b/gi, '')
    .split(/\s+/)
    .filter(Boolean);

  return tokens
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() || '')
    .join('');
}

function getClientDisplayName(name) {
  if (name.trim() === 'PT PLN (Persero)') {
    return 'PT PLN (Persero)';
  }

  return name.trim().replace(/^PT\s+/i, '').trim();
}

function splitClientName(name) {
  const normalized = getClientDisplayName(name);
  const words = normalized.split(/\s+/);

  if (words.length <= 1) {
    return { lead: normalized, main: '', tail: '' };
  }

  const tailToken = words[words.length - 1];
  const hasTail = /^(Tbk\.?|\(Persero\)|Persero)$/i.test(tailToken);
  const coreWords = hasTail ? words.slice(0, -1) : words;

  if (coreWords.length <= 1) {
    return {
      lead: coreWords.join(' '),
      main: '',
      tail: hasTail ? tailToken : '',
    };
  }

  if (coreWords.length === 2) {
    return {
      lead: coreWords[0],
      main: coreWords[1],
      tail: hasTail ? tailToken : '',
    };
  }

  const lead = coreWords[0];
  const main = coreWords[1];
  const tail = [coreWords.slice(2).join(' '), hasTail ? tailToken : ''].filter(Boolean).join(' ');

  return {
    lead,
    main,
    tail,
  };
}

function getClientPresentation(name) {
  const normalized = name.trim();
  const displayName = getClientDisplayName(normalized);
  const override = CLIENT_PRESENTATION_OVERRIDES[normalized];
  const words = displayName.split(/\s+/);
  const isLong = displayName.length > 24 || words.length >= 4;
  const prefersThreeLine = words.length >= 3 || /\b(Tbk\.?|\(Persero\)|Persero)\b/i.test(displayName);

  if (override?.variant === 'monogram-tag') {
    return {
      variant: 'monogram-tag',
      tag: override.tag || buildMonogram(displayName),
      name: displayName,
    };
  }

  if (override?.variant === 'editorial-split') {
    return {
      variant: 'editorial-split',
      lead: override.lead,
      main: override.main,
      tail: override.tail || '',
    };
  }

  if (override?.variant === 'condensed-block') {
    return {
      variant: 'condensed-block',
      name: override.name || displayName,
    };
  }

  if (override?.variant === 'registry-line') {
    return {
      variant: 'registry-line',
      tag: override.tag,
      main: override.main,
      tail: override.tail || '',
    };
  }

  if (!isLong && normalized !== displayName) {
    const registry = splitClientName(normalized);
    return {
      variant: 'registry-line',
      tag: registry.lead,
      main: registry.main || registry.lead,
      tail: registry.tail,
    };
  }

  if (isLong || prefersThreeLine) {
    const editorial = splitClientName(normalized);
    return {
      variant: 'editorial-split',
      lead: editorial.lead,
      main: editorial.main,
      tail: editorial.tail,
    };
  }

  return {
    variant: 'condensed-block',
    name: displayName,
  };
}

function renderClientSignature(presentation) {
  switch (presentation.variant) {
    case 'editorial-split':
      return (
        <div className={styles.clientEditorial}>
          <span className={styles.clientEditorialLead}>{presentation.lead}</span>
          <span className={styles.clientEditorialMain}>{presentation.main}</span>
          {presentation.tail ? <span className={styles.clientEditorialTail}>{presentation.tail}</span> : null}
        </div>
      );
    case 'registry-line':
      return (
        <div className={styles.clientRegistry}>
          <span className={styles.clientRegistryTag}>{presentation.tag}</span>
          <span className={styles.clientRegistryMain}>{presentation.main}</span>
          {presentation.tail ? <span className={styles.clientRegistryTail}>{presentation.tail}</span> : null}
        </div>
      );
    case 'monogram-tag':
      return (
        <div className={styles.clientMonogram}>
          <span className={styles.clientMonogramTag}>{presentation.tag}</span>
          <span className={styles.clientMonogramName}>{presentation.name}</span>
        </div>
      );
    default:
      return <span className={styles.clientCondensed}>{presentation.name}</span>;
  }
}

export const metadata = {
  title: 'Soaloan Tua Nababan & Partners — Law Firm Jakarta',
  description:
    'STNP is a full-service Jakarta law firm specializing in bankruptcy, commercial litigation, corporate law, project financing, infrastructure, and plantation.',
};



export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  /* Fetch latest 3 articles from WordPress */
  let latestPosts = [];
  try {
    const result = await getPosts({ perPage: 3 });
    latestPosts = result.data || [];
  } catch (e) {
    console.error('Failed to fetch posts:', e);
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <section className={`${styles.hero} ${styles.snapSection}`}>
        {/* Background Video hosted on WordPress */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.heroVideo}
        >
          {/* H.265 (HEVC) for highly-compressed modern playback (Safari/newer devices) */}
          <source src="/videos/hero-loop-hevc.mp4" type="video/mp4; codecs=hvc1" />
          {/* Default H.264 fallback for broader compatibility */}
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
          Your browser does not support the timelapse background video.
        </video>

        <div className={styles.heroSticky}>
          <HeroParallax className={styles.heroShell}>
            <div className={styles.heroNarrative}>
              <span className={styles.heroLabel}>{dict.home.heroLabel}</span>
              <h1 className={styles.heroTitle}>
                {dict.home.heroTitle1}<br />
                <span className={styles.heroTitleAccent}>{dict.home.heroTitle2}</span>
              </h1>
              <p className={styles.heroSubtitle}>
                {dict.home.heroSubtitle}
              </p>
              <hr className={styles.heroDivider} />
              <div className={styles.heroCta}>
                <Link href={`/${lang}/contact`} className="btn btn--primary">
                  {dict.home.heroCtaPrimary}
                </Link>
                <Link href="#practice-areas" className={styles.heroCtaOutline}>
                  {dict.home.heroCtaSecondary}
                </Link>
              </div>
            </div>
          </HeroParallax>
          
          <HeroScrollButton />
        </div>
      </section>

      {/* ===== ABOUT SUMMARY ===== */}
      <section className={`${styles.aboutSection} card-swap-section`}>
        <div className={styles.aboutSticky}>
          <Prism 
            animationType="3drotate" 
            glow={0.5} 
            colorFrequency={0.2} 
            bloom={0.5} 
            timeScale={0.3} 
          />
          <div className="container">
            <div className={styles.aboutGrid}>
              <div className={styles.aboutLeft}>
                <span className="section-label">{dict.home.aboutLabel}</span>
                <h2 className="section-title">{dict.home.aboutTitle}</h2>
                <hr className="divider divider--left" />
                <p className={styles.aboutText}>
                  {dict.home.aboutText.replace('{founder}', firmInfo.founder)}
                </p>
              </div>
              <div className={styles.aboutRight}>
                <CardSwap width="100%" height="auto">
                  {firmInfo.principles.map((p, i) => (
                    <Card key={i} className={styles.principleCardWrapper}>
                      <div className={styles.principleHeader}>
                        <div className={styles.principleNumber}>0{i + 1}</div>
                        <h4 className={styles.principleTitle}>{p.title}</h4>
                      </div>
                      <p className={styles.principleDesc}>{p.description}</p>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.aboutSnapTrack}>
          {firmInfo.principles.map((_, i) => (
            <div key={i} className={styles.snapPoint} />
          ))}
        </div>
      </section>

      {/* ===== PAST CLIENTS ===== */}
      <section className={`section ${styles.clientsSection} ${styles.snapSection}`}>
        <div className="container">
          <div className={styles.clientsShell}>
            <div className={styles.clientsIntro}>
              <span className={`section-label ${styles.clientsLabel}`}>{dict.home.clientsLabel}</span>
              <h2 className={`section-title ${styles.clientsTitle}`}>{dict.home.clientsTitle}</h2>
              <hr className={`divider divider--left ${styles.clientsDivider}`} />
            </div>

            <div className={styles.clientsGrid}>
              {pastClients.map((client, i) => {
                const presentation = getClientPresentation(client.name);

                return (
                  <div
                    key={client.name}
                    className={`${styles.clientCard} ${styles[`clientCard${presentation.variant
                      .split('-')
                      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                      .join('')}`]}`}
                    style={{ '--index': i }}
                  >
                    {renderClientSignature(presentation)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LEGAL SERVICES ===== */}
      <section id="practice-areas" className={`section section--alt ${styles.servicesSection} ${styles.snapSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">{dict.home.servicesLabel}</span>
            <h2 className="section-title">{dict.home.servicesTitle}</h2>
            <hr className="divider" />
            <p className="section-subtitle">
              {dict.home.servicesSubtitle}
            </p>
          </div>
          <div className={styles.atlasContainer}>
            {serviceCategories.map((category, catIndex) => {
              const leadService = category.services[0];
              const LeadIcon = iconMapping[leadService.icon] || Bank;
              const remainingServices = category.services.slice(1);
              
              return (
                <div 
                  key={category.id} 
                  className={styles.atlasRow}
                  style={{ '--index': catIndex }}
                >
                  <div className={styles.atlasHeader}>
                    <h3 className={styles.atlasCategoryTitle}>
                      {category.title[lang] || category.title.en}
                    </h3>
                  </div>
                  
                  <div className={styles.atlasLead}>
                    <div className={styles.atlasLeadIcon}>
                      <LeadIcon weight="light" size={40} />
                    </div>
                    <div className={styles.atlasLeadContent}>
                      <h4 className={styles.atlasLeadTitle}>
                        {leadService.title[lang] || leadService.title.en}
                      </h4>
                      <p className={styles.atlasLeadDesc}>
                        {leadService.description[lang] || leadService.description.en}
                      </p>
                      <Link 
                        href={`/${lang}/legal-services#${category.id}`}
                        className={styles.atlasLeadLink}
                      >
                        {dict.home.learnMore}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  <div className={styles.atlasBranches}>
                    {remainingServices.map(s => {
                      const BranchIcon = iconMapping[s.icon] || Bank;
                      return (
                        <Link 
                          key={s.id} 
                          href={`/${lang}/legal-services#${s.id}`}
                          className={styles.atlasBranch}
                        >
                          <BranchIcon size={20} weight="regular" className={styles.atlasBranchIcon} />
                          <span className={styles.atlasBranchTitle}>
                            {s.title[lang] || s.title.en}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== QUOTE BANNER ===== */}
      <section className={`${styles.quoteBanner} ${styles.snapSection}`}>
        <div className={styles.quotePortrait}>
          <img src="/images/quotes/portrait.webp" alt="Thomas Jefferson Portrait" />
        </div>
        <div className="container">
          <div className={styles.quoteContent}>
            <blockquote className={styles.blockquote}>
              <span className={styles.quoteOpen}>&ldquo;</span>
              {firmInfo.quote}
              <span className={styles.quoteClose}>&rdquo;</span>
            </blockquote>
            <div className={styles.quoteAuthorInfo}>
              <cite className={styles.quoteCite}>{firmInfo.quoteAuthor}</cite>
              <div className={styles.quoteSignature}>
                <img src="/images/quotes/signature.svg" alt="Thomas Jefferson Signature" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LATEST ARTICLES ===== */}
      {latestPosts.length > 0 && (
        <section className={`section ${styles.snapSection}`}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">{dict.home.insightsLabel}</span>
              <h2 className="section-title">{dict.home.articlesTitle}</h2>
              <hr className="divider" />
            </div>
            <div className={styles.articlesGrid}>
              {latestPosts.map((post) => {
                const featuredImg =
                  post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const category =
                  post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Article';
                const date = new Date(post.date).toLocaleDateString(lang === 'id' ? 'id-ID' : lang === 'zh' ? 'zh-CN' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                 });

                return (
                  <BorderGlow key={post.id} className={styles.articleCard} glowColor="40 80 80" borderRadius={12}>
                    <div className={styles.articleImage}>
                      {featuredImg ? (
                        <img src={featuredImg} alt={post.title.rendered} />
                      ) : (
                        <div className={styles.articleImagePlaceholder}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </div>
                      )}
                      <span className={styles.articleBadge}>{category}</span>
                    </div>
                    <div className={styles.articleBody}>
                      <time className={styles.articleDate}>{date}</time>
                      <h3 className={styles.articleTitle}>
                        <Link href={`/${lang}/insights/${post.slug}`}>
                          {decodeHtmlEntities(post.title.rendered)}
                        </Link>
                      </h3>
                      <p className={styles.articleExcerpt}>
                        {stripHtml(post.excerpt.rendered).substring(0, 120)}…
                      </p>
                    </div>
                  </BorderGlow>
                );
              })}
            </div>
            <div className={styles.articlesMore}>
              <Link href={`/${lang}/insights`} className="btn btn--dark">
                {dict.home.viewAll}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== CONTACT CTA ===== */}
      <section className={`section--dark ${styles.ctaSection} ${styles.snapSection}`}>
        <div className={styles.magicRingsWrapper}>
          <MagicRings
            color="#2c5f7c"
            colorTwo="#c4a35a"
            ringCount={5}
            speed={0.8}
            attenuation={12}
            lineThickness={1.5}
            baseRadius={0.25}
            radiusStep={0.15}
            opacity={0.6}
            followMouse={true}
            mouseInfluence={0.05}
            hoverScale={1.1}
            parallax={0.03}
          />
        </div>
        <div className="container">
          <div className={styles.ctaContent}>
            <span className="section-label">{dict.home.ctaLabel}</span>
            <h2 className={styles.ctaTitle}>
              {dict.home.ctaTitle}
            </h2>
            <p className={styles.ctaText}>
              {dict.home.ctaText}
            </p>
            <div className={styles.ctaActions}>
              <Link href={`/${lang}/contact`} className="btn btn--primary">
                {dict.home.schedule}
              </Link>
              <a href={`mailto:${firmInfo.email}`} className={styles.ctaEmail}>
                {dict.home.orEmail} <span>{firmInfo.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
