import Link from 'next/link';
import { getBlogPosts, getBlogCategories, getFeaturedBlogPosts } from '@/lib/cosmic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Stories, recipes, and insights from Golden Hills Ranch. Learn about sustainable farming, grass-fed beef, and ranch life.',
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

const POSTS_PER_PAGE = 9;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  const [{ posts, total }, categories, featuredPosts] = await Promise.all([
    getBlogPosts(POSTS_PER_PAGE, skip),
    getBlogCategories(),
    currentPage === 1 ? getFeaturedBlogPosts(3) : Promise.resolve([])
  ]);

  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Ranch Stories & Insights</h1>
          <p className="text-xl text-primary-100">
            Discover sustainable farming practices, delicious recipes, and life on the ranch
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Featured Posts (only on first page) */}
        {currentPage === 1 && featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {currentPage === 1 ? 'Latest Articles' : `Articles - Page ${currentPage}`}
            </h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No blog posts found.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    {currentPage > 1 && (
                      <Link
                        href={`/blog?page=${currentPage - 1}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </Link>
                    )}
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        href={`/blog?page=${page}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                    
                    {currentPage < totalPages && (
                      <Link
                        href={`/blog?page=${currentPage + 1}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/blog/category/${category.slug}`}
                        className="text-gray-700 hover:text-primary-600 transition-colors flex items-center"
                      >
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                        {category.metadata?.name || category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-primary-50 rounded-xl p-6 border-2 border-primary-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Shop Our Products
              </h3>
              <p className="text-gray-600 mb-4">
                Try our grass-fed beef and other farm products mentioned in our articles.
              </p>
              <Link href="/products" className="btn-primary w-full text-center">
                View Products
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Featured Post Card Component
function FeaturedPostCard({ post }: { post: any }) {
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
        <div className="absolute top-4 left-4">
          <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {post.metadata?.title || post.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.metadata?.excerpt}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          {author && <span>{author.metadata?.name || author.title}</span>}
          {publishedDate && (
            <>
              <span className="mx-2">•</span>
              <time>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// Blog Post Card Component
function BlogPostCard({ post }: { post: any }) {
  const featuredImage = post.metadata?.featured_image?.imgix_url;
  const author = post.metadata?.author;
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