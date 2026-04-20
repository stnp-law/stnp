import Link from 'next/link';
import { getPosts, getPostBySlug } from '@/lib/api';
import { decodeHtmlEntities, stripHtml } from '@/lib/utils';
import styles from './page.module.css';

export async function generateStaticParams() {
  const result = await getPosts({ perPage: 50 });
  const posts = result.data || [];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  const yoast = post.yoast_head_json;
  return {
    title: yoast?.title || decodeHtmlEntities(post.title.rendered),
    description: yoast?.description || stripHtml(post.excerpt.rendered).substring(0, 160),
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className={styles.notFound}>
        <div className="container">
          <h1>Article Not Found</h1>
          <p>The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/insights" className="btn btn--dark">Back to Insights</Link>
        </div>
      </div>
    );
  }

  const featuredImg = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Article';
  const author = post._embedded?.['author']?.[0]?.name || 'STNP';
  const date = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Article Hero */}
      <section className={styles.articleHero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.metaRow}>
              <span className={styles.badge}>{category}</span>
              <time className={styles.date}>{date}</time>
            </div>
            <h1
              className={styles.articleTitle}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div className={styles.authorRow}>
              <span className={styles.author}>By {author}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="section">
        <div className={`container container--narrow`}>
          {featuredImg && (
            <div className={styles.featuredImage}>
              <img src={featuredImg} alt={post.title.rendered.replace(/<[^>]+>/g, '')} />
            </div>
          )}
          <div
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* Back link */}
          <div className={styles.backLink}>
            <Link href="/insights">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Insights
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
