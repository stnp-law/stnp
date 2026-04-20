import Link from 'next/link';
import { getPosts, getCategories } from '@/lib/api';
import { decodeHtmlEntities, stripHtml } from '@/lib/utils';
import styles from './page.module.css';

export const metadata = {
  title: 'Articles',
  description:
    'Read the latest legal insights, articles, and updates from Soaloan Tua Nababan & Partners.',
};

export default async function ArticlesPage() {
  const [postsResult, categories] = await Promise.all([
    getPosts({ perPage: 12 }),
    getCategories(),
  ]);

  const posts = postsResult.data || [];

  return (
    <>
      {/* Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.breadcrumb}>Home / Insights</span>
            <h1 className={styles.heroTitle}>Insights</h1>
            <p className={styles.heroSubtitle}>
              Stay informed with the latest legal perspectives from our team.
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section">
        <div className="container">
          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className={styles.categoryTabs}>
              <span className={`${styles.tab} ${styles.tabActive}`}>All</span>
              {categories.filter(c => c.slug !== 'uncategorized').map((cat) => (
                <span key={cat.id} className={styles.tab}>{cat.name}</span>
              ))}
            </div>
          )}

          {/* Post Grid */}
          {posts.length > 0 ? (
            <div className={styles.postsGrid}>
              {posts.map((post) => {
                const featuredImg =
                  post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const category =
                  post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Article';
                const date = new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <article key={post.id} className={styles.postCard}>
                    <div className={styles.postImage}>
                      {featuredImg ? (
                        <img src={featuredImg} alt={post.title.rendered} />
                      ) : (
                        <div className={styles.postImagePlaceholder}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                      )}
                      <span className={styles.postBadge}>{category}</span>
                    </div>
                    <div className={styles.postBody}>
                      <time className={styles.postDate}>{date}</time>
                      <h3 className={styles.postTitle}>
                        <Link href={`/insights/${post.slug}`}>
                          {decodeHtmlEntities(post.title.rendered)}
                        </Link>
                      </h3>
                      <p className={styles.postExcerpt}>
                        {stripHtml(post.excerpt.rendered).substring(0, 150)}…
                      </p>
                      <Link href={`/insights/${post.slug}`} className={styles.readMore}>
                        Read More
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>No insights published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
