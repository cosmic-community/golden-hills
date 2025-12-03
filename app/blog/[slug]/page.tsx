// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from '@/lib/cosmic';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { posts } = await getBlogPosts(100, 0);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }
  
  return {
    title: post.metadata?.title || post.title,
    description: post.metadata?.meta_description || post.metadata?.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogPosts(post.id, 3);

  const { metadata } = post;
  const title = metadata?.title || post.title;
  const featuredImage = metadata?.featured_image;
  const content = metadata?.content || '';
  const excerpt = metadata?.excerpt;
  const author = metadata?.author;
  const categories = metadata?.categories;
  const tags = metadata?.tags;
  const publishedDate = metadata?.published_date;

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: featuredImage 
              ? `url(${featuredImage.imgix_url}?w=1920&h=500&fit=crop&auto=format,compress)`
              : 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/category/${cat.slug}`}
                  className="text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                >
                  {cat.metadata?.name || cat.title}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {excerpt && (
            <p className="text-xl text-gray-200 mb-6">{excerpt}</p>
          )}
          <div className="flex items-center justify-center gap-4 text-sm">
            {author && (
              <Link 
                href={`/blog/author/${author.slug}`}
                className="flex items-center gap-2 hover:text-accent-300 transition-colors"
              >
                {author.metadata?.photo?.imgix_url && (
                  <img
                    src={`${author.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={author.metadata?.name || author.title}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                )}
                <span className="font-medium">{author.metadata?.name || author.title}</span>
              </Link>
            )}
            {publishedDate && (
              <>
                <span>•</span>
                <time>{new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <div className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:text-primary-700 hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:list-inside
              prose-ol:my-6 prose-ol:list-decimal prose-ol:list-inside
              prose-li:text-gray-700 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-4 prose-blockquote:italic
              prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            ">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 ml-6 list-disc">
                      {children}
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                      target={href?.startsWith('http') ? '_blank' : undefined}
                      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1 rounded-full transition-colors"
                    >
                      #{tag.metadata?.name || tag.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {author && author.metadata?.bio && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex gap-6">
                  {author.metadata?.photo?.imgix_url && (
                    <img
                      src={`${author.metadata.photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                      alt={author.metadata?.name || author.title}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      About {author.metadata?.name || author.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{author.metadata.bio}</p>
                    <Link
                      href={`/blog/author/${author.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View all posts by {author.metadata?.name || author.title} →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try Our Products?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Experience the quality and flavor mentioned in our articles
          </p>
          <Link href="/products" className="btn-primary bg-accent-500 hover:bg-accent-600">
            Shop Our Products
          </Link>
        </div>
      </section>
    </div>
  );
}

// Related Post Card Component
function RelatedPostCard({ post }: { post: any }) {
  const featuredImage = post.metadata?.featured_image?.imgix_url;
  const categories = post.metadata?.categories;
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-earth-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
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
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
            {categories[0].metadata?.name || categories[0].title}
          </span>
        )}
        <h3 className="text-lg font-bold text-gray-900 mt-3 group-hover:text-primary-600 transition-colors line-clamp-2">
          {post.metadata?.title || post.title}
        </h3>
      </div>
    </Link>
  );
}