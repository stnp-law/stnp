'use client';

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import './StaggeredMenu.css';

/**
 * StaggeredMenu — STNP adaptation of the React Bits component.
 *
 * Replaces the buggy hamburger menu on non-landscape (≤1024px) viewports.
 * The component renders inside the existing fixed <header> and uses
 * position:fixed panels/prelayers to cover the full viewport.
 *
 * Props:
 *  - navLinks: Array<{ href, label }> — navigation items
 *  - lang: string — current locale, passed down to LanguageSwitcher
 *  - pathname: string — current pathname, passed down to LanguageSwitcher
 *  - router: Router — passed down to LanguageSwitcher
 *  - navDict: object — dictionary with `freeConsultation` key for the CTA
 *  - getTransitionType: (from, to) => string[] — view-transition type resolver
 */
export default function StaggeredMenu({
  navLinks = [],
  lang = 'en',
  pathname = '/',
  router,
  navDict = {},
  getTransitionType,
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  // GSAP animation refs
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const [textLines, setTextLines] = useState(['Menu', 'Close']);

  // STNP brand prelayer colours (navy tones)
  const colors = ['#1A2744', '#0A1628'];
  const accentColor = '#C4A35A';

  /* ------------------------------------------------------------------ */
  /* Initial GSAP setup                                                   */
  /* ------------------------------------------------------------------ */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll('.sm-prelayer'))
        : [];
      preLayerElsRef.current = preLayers;

      // Start all layers off-screen to the right
      gsap.set([panel, ...preLayers], { xPercent: 100 });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) {
        gsap.set(toggleBtnRef.current, { color: 'rgba(255,255,255,0.85)' });
      }
    });
    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------ */
  /* Lock/unlock body scroll                                              */
  /* ------------------------------------------------------------------ */
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* ------------------------------------------------------------------ */
  /* Build open timeline                                                  */
  /* ------------------------------------------------------------------ */
  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    );
    const controls = panel.querySelector('.sm-panel-controls');

    const layerStates = layers.map(el => ({
      el,
      start: Number(gsap.getProperty(el, 'xPercent')),
    }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
    if (controls) gsap.set(controls, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ paused: true });

    // Stagger prelayers in
    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: 'power4.out' },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    // Panel slides in
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    // Nav items animate up
    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' },
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' },
          },
          itemsStart + 0.1
        );
      }
    }

    // Controls fade in at the bottom
    if (controls) {
      tl.to(
        controls,
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
        panelInsertTime + panelDuration * 0.5
      );
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  /* ------------------------------------------------------------------ */
  /* Play open                                                            */
  /* ------------------------------------------------------------------ */
  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false; });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  /* ------------------------------------------------------------------ */
  /* Play close                                                           */
  /* ------------------------------------------------------------------ */
  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: 100,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        );
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
        const controls = panel.querySelector('.sm-panel-controls');
        if (controls) gsap.set(controls, { opacity: 0, y: 20 });
        busyRef.current = false;
      },
    });
  }, []);

  /* ------------------------------------------------------------------ */
  /* Animate icon (plus → X)                                             */
  /* ------------------------------------------------------------------ */
  const animateIcon = useCallback(opening => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    });
  }, []);

  /* ------------------------------------------------------------------ */
  /* Animate button colour                                                */
  /* ------------------------------------------------------------------ */
  const animateColor = useCallback(opening => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    colorTweenRef.current?.kill();
    colorTweenRef.current = gsap.to(btn, {
      color: 'rgba(255,255,255,0.85)',
      delay: 0.18,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  /* ------------------------------------------------------------------ */
  /* Animate "Menu" → "Close" text cycle                                 */
  /* ------------------------------------------------------------------ */
  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out',
    });
  }, []);

  /* ------------------------------------------------------------------ */
  /* Toggle                                                               */
  /* ------------------------------------------------------------------ */
  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      playOpen();
    } else {
      playClose();
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText]);

  /* ------------------------------------------------------------------ */
  /* Close and navigate                                                   */
  /* ------------------------------------------------------------------ */
  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [playClose, animateIcon, animateColor, animateText]);

  const handleLinkClick = useCallback((e, href) => {
    closeMenu();
    
    if (!href) return;
    const normalizedHref = href.endsWith("/") && href !== "/" ? href.slice(0, -1) : href;
    const normalizedCurrent = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

    if (normalizedHref === normalizedCurrent) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [closeMenu, pathname]);

  /* ------------------------------------------------------------------ */
  /* Click-away to close                                                  */
  /* ------------------------------------------------------------------ */
  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = e => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, closeMenu]);

  /* ------------------------------------------------------------------ */
  /* Build prelayer colours (same logic as React Bits original)           */
  /* ------------------------------------------------------------------ */
  const prelayerColors = (() => {
    const raw = colors.slice(0, 4);
    const arr = [...raw];
    if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
    return arr;
  })();

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div
      className="staggered-menu-wrapper"
      style={{ '--sm-accent': accentColor }}
      data-position="right"
      data-open={open || undefined}
    >
      {/* Staggered prelayers (slide behind the panel) */}
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {prelayerColors.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      {/* Toggle button — visible only at mobile/tablet */}
      <button
        ref={toggleBtnRef}
        className="sm-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        onClick={toggleMenu}
        type="button"
      >
        <span className="sm-toggle-textWrap" aria-hidden="true">
          <span ref={textInnerRef} className="sm-toggle-textInner">
            {textLines.map((l, i) => (
              <span className="sm-toggle-line" key={i}>{l}</span>
            ))}
          </span>
        </span>
        <span ref={iconRef} className="sm-icon" aria-hidden="true">
          <span ref={plusHRef} className="sm-icon-line" />
          <span ref={plusVRef} className="sm-icon-line" />
        </span>
      </button>

      {/* Full-screen menu panel */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
        aria-label="Navigation menu"
      >
        <div className="sm-panel-inner">
          {/* Nav links */}
          <ul
            className="sm-panel-list"
            role="list"
            data-numbering={true}
          >
            {navLinks.map((link, idx) => (
              <li className="sm-panel-itemWrap" key={link.href}>
                <Link
                  href={link.href}
                  className="sm-panel-item"
                  aria-label={`Go to ${link.label}`}
                  data-index={idx + 1}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  transitionTypes={
                    getTransitionType ? getTransitionType(pathname, link.href) : undefined
                  }
                >
                  <span className="sm-panel-itemLabel">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer controls: Language switcher, theme toggle, CTA */}
          <div className="sm-panel-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              <LanguageSwitcher lang={lang} pathname={pathname} router={router} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
