'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, CaretDown } from '@phosphor-icons/react';
import styles from './Navbar.module.css';

const languages = [
  { code: 'en', label: 'English', flagCode: 'us' },
  { code: 'id', label: 'Indonesian', flagCode: 'id' },
  { code: 'zh', label: '中文', flagCode: 'cn' }
];

export default function LanguageSwitcher({ lang, pathname, router }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLanguageChange = (newLang) => {
    if (newLang === lang) {
      setIsOpen(false);
      return;
    }

    const segments = pathname.split('/');
    if (segments.length >= 2) {
      segments[1] = newLang; // replace current lang segment
      router.push(segments.join('/') || `/${newLang}`);
    } else {
      router.push(`/${newLang}`);
    }
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div className={styles.switcherContainer} ref={containerRef}>
      <button 
        className={`${styles.switcherToggle} ${isOpen ? styles.active : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe weight="regular" size={18} className={styles.switcherIcon} />
        <span className={styles.langLabel}>{currentLang.code.toUpperCase()}</span>
        <CaretDown weight="bold" size={12} className={`${styles.caretIcon} ${isOpen ? styles.rotated : ''}`} />
      </button>

      {isOpen && (
        <ul className={styles.switcherDropdown} role="listbox">
          {languages.map((l) => (
            <li 
              key={l.code}
              className={`${styles.switcherItem} ${l.code === lang ? styles.itemSelected : ''}`}
              onClick={() => handleLanguageChange(l.code)}
              role="option"
              aria-selected={l.code === lang}
            >
              <div className={styles.itemContent}>
                <span className={`fi fi-${l.flagCode} ${styles.flagIcon}`}></span>
                <span className={styles.itemLabel}>{l.label}</span>
              </div>
              {l.code === lang && (
                <div className={styles.activeDot} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
