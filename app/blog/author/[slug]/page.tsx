// app/blog/author/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAuthorBySlug, getBlogPostsByAuthor } from '@/lib/cosmic';
import type { Metadata } from 'next';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  
  if (!author) {
    return { title: 'Author Not Found' };
  }
  
  return {
    title: `Articles by ${author.metadata?.name || author.title}`,
    description: author.metadata?.bio || `Read articles written by ${author.metadata?.name || author.title}`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getBlogPostsByAuthor(slug, 12)
  ]);
  
  if (!author) {
    notFound();
  }

  const authorName = author.metadata?.name || author.title;
  const authorBio = author.metadata?.bio;
  const authorPhoto = author.metadata?.photo;
  const authorEmail = author.metadata?.email;

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Author Hero */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-200 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          
          {authorPhoto?.imgix_url && (
            <img
              src={`${authorPhoto.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
              alt={authorName}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-xl object-cover"
            />
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{authorName}</h1>
          
          {authorBio && (
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-6">{authorBio}</p>
          )}
          
          {authorEmail && (
            <a
              href={`mailto:${authorEmail}`}
              className="inline-flex items-center text-white hover:text-accent-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {authorEmail}
            </a>
          )}
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Articles by {authorName}
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles published yet.</p>
              <Link href="/blog" className="btn-primary mt-6">
                View All Articles
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Blog Post Card Component
function BlogPostCard({ post }: { post: any }) {
  const featuredImage = post.metadata?.featured_image?.imgix_url;
  const categories = post.metadata?.categories;
  const publishedDate = post.metadata?.published_date;
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {featuredImage && (
          <img
            src={`${featuredImage}?w=800&h=400&fit=crop&auto=format,compress`}
            alt={post.metadata?.title || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-6">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, 2).map((cat: any) => (
              <span
                key={cat.id}
                className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded"
              >
                {cat.metadata?.name || cat.title}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {post.metadata?.title || post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.metadata?.excerpt}
        </p>
        {publishedDate && (
          <time className="text-sm text-gray-500">
            {new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>
        )}
      </div>
    </Link>
  );
}