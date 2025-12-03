import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CosmicBadge from '@/components/CosmicBadge';
import { getSiteSettings } from '@/lib/cosmic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: {
      default: settings?.metadata?.ranch_name || 'Golden Hills Ranch',
      template: `%s | ${settings?.metadata?.ranch_name || 'Golden Hills Ranch'}`,
    },
    description: settings?.metadata?.tagline || 'Sustainable Family Farming Since 1952',
    icons: {
      icon: [
        {
          url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌾</text></svg>",
          type: 'image/svg+xml',
        }
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className="min-h-screen flex flex-col bg-earth-50">
        <Header settings={settings} />
        <main className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  );
}