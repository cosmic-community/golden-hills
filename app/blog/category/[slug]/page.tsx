// app/blog/category/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogCategoryBySlug, getBlogPostsByCategory, getBlogCategories } from '@/lib/cosmic';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getBlogCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getBlogCategoryBySlug(slug);
  
  if (!category) {
    return { title: 'Category Not Found' };
  }
  
  return {
    title: `${category.metadata?.name || category.title} Articles`,
    description: category.metadata?.description || `Read articles about ${category.metadata?.name || category.title}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getBlogCategoryBySlug(slug),
    getBlogPostsByCategory(slug, 12)
  ]);
  
  if (!category) {
    notFound();
  }

  const categoryName = category.metadata?.name || category.title;
  const categoryDescription = category.metadata?.description;

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-200 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
          {categoryDescription && (
            <p className="text-xl text-primary-100">{categoryDescription}</p>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found in this category yet.</p>
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
  const author = post.metadata?.author;
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
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {post.metadata?.title || post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.metadata?.excerpt}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          {author && <span>{author.metadata?.name || author.title}</span>}
          {publishedDate && (
            <>
              <span className="mx-2">•</span>
              <time>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}