// app/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPages, getPageBySlug } from '@/lib/cosmic';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page) {
    return { title: 'Page Not Found' };
  }
  
  return {
    title: page.metadata?.title || page.title,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page) {
    notFound();
  }

  const { metadata } = page;
  const title = metadata?.title || page.title;
  const heroImage = metadata?.hero_image;
  const content = metadata?.content || '';

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: heroImage 
              ? `url(${heroImage.imgix_url}?w=1920&h=400&fit=crop&auto=format,compress)`
              : 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="prose-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </section>
    </div>
  );
}