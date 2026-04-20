'use client';

import React, { Children, cloneElement, forwardRef, isValidElement, useMemo, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CardSwap.css';

gsap.registerPlugin(ScrollTrigger);

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card-swap-item ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  scale: 1 - (i * 0.05),
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    scale: slot.scale,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    opacity: 1,
    visibility: 'visible'
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 40,
  verticalDistance = 50,
  skewAmount = 4,
  children
}) => {
  const container = useRef(null);
  const triggerRef = useRef(null);
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useRef([]);
  
  // Ensure refs array is as long as children
  if (refs.current.length !== childArr.length) {
    refs.current = childArr.map((_, i) => refs.current[i] || React.createRef());
  }

  useLayoutEffect(() => {
    const total = childArr.length;
    const elements = refs.current.map(r => r.current);
    
    // Initial placement
    elements.forEach((el, i) => {
      placeNow(el, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    const ctx = gsap.context(() => {
      const sectionTrigger = triggerRef.current.closest('.card-swap-section') || triggerRef.current.closest('section');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'cardSwapTrigger',
          trigger: sectionTrigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });

      const cards = [...elements];
      const numSwaps = total - 1; 

      for (let s = 0; s < numSwaps; s++) {
        const front = cards.shift();
        const rest = [...cards];
        
        const label = `swap${s}`;
        tl.addLabel(label, s * 1.0); // Force label to exactly the integer second

        // Boost z-index immediately so the dropping card doesn't clip through others
        tl.set(front, { zIndex: 100 }, label);

        // Step 1: Drop the front card down and fade it out to prevent layout popping
        tl.to(front, {
          y: 400, // Drop it lower so it clears the viewport cleanly
          opacity: 0, // Fade out so moving its zIndex is invisible
          scale: 0.85,
          duration: 0.4,
          ease: 'power2.inOut'
        }, label);

        // Step 2: Smoothly bring the rest of the cards forward
        rest.forEach((el, i) => {
          const slot = makeSlot(i, cardDistance, verticalDistance, total);
          // Set their correct structural z-index mid-animation to avoid pops
          tl.set(el, { zIndex: slot.zIndex }, `${label}+=0.3`);
          tl.to(el, {
            x: slot.x,
            y: slot.y,
            scale: slot.scale,
            duration: 0.8,
            ease: 'power2.inOut'
          }, `${label}+=0.1`);
        });

        // Step 3: Loop the dropped card to the back of the stack
        const backIdx = total - 1;
        const backSlot = makeSlot(backIdx, cardDistance, verticalDistance, total);
        
        // Move it quietly to the back while it is invisible
        tl.set(front, { 
          zIndex: backSlot.zIndex,
          x: backSlot.x,
          y: backSlot.y,
          scale: backSlot.scale
        }, `${label}+=0.45`);
        
        // Fade it back in at its new position in the back
        tl.to(front, {
          opacity: 1,
          duration: 0.3,
          ease: 'power1.inOut'
        }, `${label}+=0.5`);
        
        cards.push(front);
      }
      
      // Pad out the end just in case GSAP truncates
      tl.set({}, {}, numSwaps * 1.0);
    }, triggerRef);

    return () => ctx.revert();
  }, [childArr.length, cardDistance, verticalDistance, skewAmount]);

  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  
  // onUpdate logic appended separately because it needs refs that might be null initially
  useLayoutEffect(() => {
    const trigger = ScrollTrigger.getById('cardSwapTrigger'); // Define ID so we can fetch it
    if (trigger) {
      trigger.vars.onUpdate = (self) => {
        const p = self.progress;
        if (prevBtnRef.current) {
          prevBtnRef.current.style.opacity = p <= 0.05 ? '0.3' : '1';
          prevBtnRef.current.style.pointerEvents = p <= 0.05 ? 'none' : 'auto';
        }
        if (nextBtnRef.current) {
          nextBtnRef.current.style.opacity = p >= 0.95 ? '0.3' : '1';
          nextBtnRef.current.style.pointerEvents = p >= 0.95 ? 'none' : 'auto';
        }
      };
    }
  }, []);

  const handleNext = () => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  const handlePrev = () => window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs.current[i],
          style: { 
            width, 
            height, 
            position: 'absolute',
            top: '50%',
            left: '50%',
            ...(child.props.style ?? {}) 
          }
        })
      : child
  );

  return (
    <div ref={triggerRef} className="card-swap-trigger">
      <div ref={container} className="card-swap-container" style={{ width, height }}>
        {rendered}
      </div>
      
      <div className="card-swap-controls">
        <button ref={prevBtnRef} onClick={handlePrev} className="card-swap-btn" aria-label="Previous Card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button ref={nextBtnRef} onClick={handleNext} className="card-swap-btn" aria-label="Next Card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CardSwap;
