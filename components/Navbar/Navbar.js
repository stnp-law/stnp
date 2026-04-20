'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpenText,
  Building2,
  Landmark,
  Mail,
  Newspaper,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-react';
import styles from './Navbar.module.css';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import StaggeredMenu from './StaggeredMenu';
import DropdownNavigation from '@/components/ui/dropdown-navigation';

// Hierarchy order: links after index 0 are "forward" from Home
// and "back" when navigating back to Home.
function getTransitionType(fromPath, toHref) {
  if (toHref === '/' || toHref.endsWith('/')) return ['nav-back'];
  return ['nav-forward'];
}

const submenuCopy = {
  en: {
    firm: 'Learn who we are, how we work, and what anchors our counsel.',
    services: 'Explore the firm’s core legal services and strategic capabilities.',
    team: 'Meet the advocates behind STNP’s litigation and advisory work.',
    insights: 'Read the latest firm articles, commentary, and legal updates.',
    contact: 'Reach the firm directly to discuss your matter or schedule a consultation.',
    consultation: 'Start a conversation with STNP about your legal needs.',
    profile: 'Review the professionals representing the firm across key matters.',
    expertise: 'See the practice areas where STNP advises and litigates.',
  },
  id: {
    firm: 'Pelajari siapa kami, cara kami bekerja, dan dasar pendekatan hukum kami.',
    services: 'Jelajahi layanan hukum utama dan kapabilitas strategis STNP.',
    team: 'Kenali para advokat di balik pekerjaan litigasi dan advisory STNP.',
    insights: 'Baca artikel, ulasan, dan pembaruan hukum terbaru dari firma kami.',
    contact: 'Hubungi firma secara langsung untuk membahas kebutuhan hukum Anda.',
    consultation: 'Mulai percakapan dengan STNP mengenai kebutuhan hukum Anda.',
    profile: 'Tinjau para profesional yang mewakili firma dalam berbagai perkara penting.',
    expertise: 'Lihat bidang praktik tempat STNP memberikan nasihat dan pendampingan.',
  },
  zh: {
    firm: '了解我们的事务所、工作方式，以及支撑法律服务的方法。',
    services: '查看 STNP 的核心法律服务与战略能力。',
    team: '认识负责 STNP 诉讼与顾问业务的专业律师团队。',
    insights: '阅读事务所最新文章、评论与法律动态。',
    contact: '直接联系事务所，讨论您的法律需求或预约咨询。',
    consultation: '就您的法律事务与 STNP 展开初步沟通。',
    profile: '查看代表本所在重要事务中提供服务的专业人士。',
    expertise: '了解 STNP 提供咨询与代理的主要业务领域。',
  },
};

function buildDropdownNavItems(d, lang) {
  const copy = submenuCopy[lang] || submenuCopy.en;

  return [
    {
      id: 1,
      label: d.home,
      href: `/${lang}`,
    },
    {
      id: 2,
      label: d.about,
      href: `/${lang}/about-us`,
    },
    {
      id: 3,
      label: d.services,
      subMenus: [
        {
          title: d.legalServices || d.services,
          items: [
            {
              label: d.legalServices || d.services,
              description: copy.expertise,
              href: `/${lang}/legal-services`,
              icon: Scale,
            },
            {
              label: d.contact,
              description: copy.contact,
              href: `/${lang}/contact`,
              icon: Mail,
            },
          ],
        },
      ],
    },
    {
      id: 4,
      label: d.team,
      href: `/${lang}/team-profile`,
    },
    {
      id: 5,
      label: d.insights,
      href: `/${lang}/insights`,
    },
    {
      id: 6,
      label: d.contact,
      href: `/${lang}/contact`,
    },
  ];
}

export default function Navbar({ navDict, lang = 'en' }) {
  const pathname = usePathname();
  const router = useRouter();

  const fallbackKeys = {
    home: 'Home', about: 'About', services: 'Services',
    team: 'Team', insights: 'Insights', contact: 'Contact',
    consultation: 'Consultation', freeConsultation: 'Free Consultation'
  };
  const d = navDict || fallbackKeys;

  const navLinks = [
    { href: `/${lang}`, label: d.home },
    { href: `/${lang}/about-us`, label: d.about },
    { href: `/${lang}/legal-services`, label: d.services },
    { href: `/${lang}/team-profile`, label: d.team },
    { href: `/${lang}/insights`, label: d.insights },
    { href: `/${lang}/contact`, label: d.contact },
  ];

  const dropdownNavItems = buildDropdownNavItems(d, lang);

  // Scroll detection for glassmorphism header
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = () => {
      const pathSegments = pathname.split('/').filter(Boolean);
      const isHome = pathSegments.length <= 1;
      
      // Home threshold lowered to 150px to ensure it transitions early enough
      const threshold = isHome ? 150 : 20;
      
      header.classList.toggle('is-scrolled', window.scrollY > threshold);

      // Strict bottom detection: scrollHeight - scrollTop == clientHeight
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = Math.ceil(window.scrollY);
      const clientHeight = window.innerHeight;
      
      const isAtBottom = (scrollTop + clientHeight) >= scrollHeight;
      header.classList.toggle('is-at-footer', isAtBottom);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname, lang]);

  return (
    <header
      id="site-header"
      className={`${styles.header} ${styles.ready}`}
      style={{ viewTransitionName: 'site-header' }}
    >
      <nav className={styles.nav}>
        {/* Logo — going to Home is always nav-back */}
        <Link
          href={`/${lang}`}
          className={styles.logo}
          aria-label="Home"
          transitionTypes={['nav-back']}
          onClick={(e) => {
            const homePath = `/${lang}`;
            const normalizedCurrent = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
            if (normalizedCurrent === homePath) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <img
            src="/images/logo.png"
            alt="Soaloan Tua Nababan & Partners Logo"
            className={styles.logoImage}
          />
        </Link>

        <div className={styles.desktopNavigation}>
          <DropdownNavigation
            navItems={dropdownNavItems}
            currentPath={pathname}
            getTransitionType={getTransitionType}
          />
        </div>

        {/* Desktop: CTA Button, Language Switcher, and Theme Toggle */}
        <div className={styles.desktopControls}>
          <LanguageSwitcher lang={lang} pathname={pathname} router={router} />
          <ThemeToggle />
        </div>

        {/* Mobile/Tablet: StaggeredMenu — replaces the bugged hamburger */}
        <StaggeredMenu
          navLinks={navLinks}
          lang={lang}
          pathname={pathname}
          router={router}
          navDict={d}
          getTransitionType={getTransitionType}
        />
      </nav>
    </header>
  );
}
