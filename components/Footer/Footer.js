'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { firmInfo } from '@/lib/data/team';
import { serviceCategories, proBono } from '@/lib/data/services';
import styles from './Footer.module.css';
import Beams from './Beams';
import DisclaimerModal from './DisclaimerModal';

export default function Footer({ dict, lang = 'en' }) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [openPracticeArea, setOpenPracticeArea] = useState(null);
  const currentYear = new Date().getFullYear();
  const address = firmInfo.address;

  const d = dict?.footer || {
    quickLinks: "Quick Links",
    practiceAreas: "Practice Areas",
    contactUs: "Contact Us",
    aboutUs: "About Us",
    legalServices: "Legal Services",
    ourTeam: "Our Team",
    insights: "Insights",
    contact: "Contact",
    disclaimer: "Soaloan Tua Nababan & Partners (STNP) is an independent legal practice based in Jakarta, Indonesia.",
    disclaimerButton: "Legal Disclaimer"
  };
  return (
    <footer id="site-footer" className={styles.footer}>
      {/* Dynamic Background */}
      <div className={styles.beamsWrapper}>
        <Beams
          beamWidth={2}
          beamHeight={30}
          beamNumber={20}
          lightColor="#C4A35A"
          speed={4}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={30}
        />
      </div>

      {/* Gold accent line */}
      <div className={styles.accentLine} />

      <div className={`container ${styles.grid}`}>
        {/* Column 1: About */}
        <div className={styles.col}>
          <div className={styles.footerLogo}>
            <img 
              src="/images/logo.png" 
              alt="Soaloan Tua Nababan & Partners Logo"
              className={styles.logoImage}
            />
          </div>
          <p className={styles.about}>
            {firmInfo.tagline}
          </p>
          <hr className={styles.divider} />
          <p className={styles.quote}>
            &ldquo;{firmInfo.quote}&rdquo;
            <span className={styles.quoteAuthor}>— {firmInfo.quoteAuthor}</span>
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{d.quickLinks}</h4>
          <ul className={styles.linkList}>
            <li><Link href={`/${lang}/about-us`}>{d.aboutUs}</Link></li>
            <li><Link href={`/${lang}/legal-services`}>{d.legalServices}</Link></li>
            <li><Link href={`/${lang}/team-profile`}>{d.ourTeam}</Link></li>
            <li><Link href={`/${lang}/insights`}>{d.insights}</Link></li>
            <li><Link href={`/${lang}/contact`}>{d.contact}</Link></li>
          </ul>
        </div>

        {/* Column 3: Practice Areas */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{d.practiceAreas}</h4>
          <div className={styles.practiceAccordion}>
            {serviceCategories.map((category) => {
              const isOpen = openPracticeArea === category.id;

              return (
                <div key={category.id} className={styles.practiceGroup}>
                  <div className={styles.practiceGroupHeader}>
                    <Link
                      href={`/${lang}/legal-services#${category.id}`}
                      className={styles.practiceGroupTitleLink}
                    >
                      {category.title[lang] || category.title.en}
                    </Link>
                    <button
                      type="button"
                      className={styles.practiceGroupToggle}
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${category.title[lang] || category.title.en}`}
                      onClick={() =>
                        setOpenPracticeArea(isOpen ? null : category.id)
                      }
                    >
                      <span
                        className={`${styles.practiceGroupArrow} ${isOpen ? styles.practiceGroupArrowOpen : ''}`}
                        aria-hidden="true"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  </div>
                  <div
                    className={`${styles.practiceGroupPanel} ${isOpen ? styles.practiceGroupPanelOpen : ''}`}
                    aria-hidden={!isOpen}
                  >
                    <div className={styles.practiceGroupPanelInner}>
                      <ul className={styles.practiceServiceList}>
                        {category.services.map((service) => (
                          <li key={service.id}>
                            <Link href={`/${lang}/legal-services#${category.id}`}>
                              {service.title[lang] || service.title.en}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={styles.practiceGroup}>
              <Link
                href={`/${lang}/legal-services#${proBono.id}`}
                className={styles.practiceGroupTitleLink}
              >
                {proBono.title[lang] || proBono.title.en}
              </Link>
            </div>
          </div>
        </div>

        {/* Column 4: Contact */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{d.contactUs}</h4>
          <address className={styles.address}>
            <div className={styles.addressItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                {address.line1}<br />
                {address.line2}<br />
                {address.city}, {address.postal}
              </span>
            </div>
            <div className={styles.addressItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>
                {firmInfo.phone[0]}<br />
                {firmInfo.phone[1]}
              </span>
            </div>
            <div className={styles.addressItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href={`mailto:${firmInfo.email}`}>{firmInfo.email}</a>
            </div>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomContent}`}>
          <p className={styles.copyright}>
            &copy; {currentYear} {firmInfo.fullName}. All rights reserved.
          </p>
          <div className={styles.disclaimerGroup}>
            <p className={styles.disclaimer}>
              {d.disclaimer}
            </p>
            <button 
              className={styles.disclaimerBtn}
              onClick={() => setIsDisclaimerOpen(true)}
            >
              {d.disclaimerButton}
            </button>
          </div>
        </div>
      </div>

      <DisclaimerModal 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
        dict={dict} 
      />
    </footer>
  );
}
