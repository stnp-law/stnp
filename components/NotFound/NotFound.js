import Image from 'next/image';
import Link from 'next/link';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <Image 
          src="/images/404-bg.png"
          alt="Atmospheric Sky"
          fill
          priority
          quality={100}
          className={styles.backgroundImage}
        />
        <div className={styles.overlay}></div>
        <div className={styles.overlayDark}></div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.logo}>STNP</div>
        <div className={styles.navAction}>
          <Link href="/">+ Menu</Link>
        </div>
      </nav>

      <main className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.quote}>
          “Not all those who wander are lost.”
        </h1>
        <div className={styles.author}>— J.R.R. Tolkien</div>
        
        <Link href="/" className={styles.backBtn}>
          RETURN TO HOME
        </Link>
      </main>
    </div>
  );
}
