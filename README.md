# Golden Hills Ranch

![Golden Hills Ranch](https://imgix.cosmicjs.com/e656ec70-a044-11ed-81f2-f50e185dd248-U6t80TWJ1DM.jpg?w=1200&h=400&fit=crop&auto=format,compress)

A beautiful, responsive website for Golden Hills Ranch - a sustainable family farm selling grass-fed beef, raw milk, sheep cheese, and other whole food and sustainable goods and accessories. Built with Next.js 16 and powered by Cosmic CMS.

## Features

- 🥩 **Product Catalog** - Browse grass-fed beef, dairy, eggs, pantry items, and farm goods
- 🏷️ **Category Filtering** - Filter products by category with smooth transitions
- ⭐ **Featured Products** - Highlight best-selling and seasonal items
- 📖 **Informational Pages** - Learn about farming practices and the ranch's story
- 📱 **Fully Responsive** - Beautiful on all devices
- 🎨 **Modern Design** - Warm, earthy color palette with professional typography
- ⚡ **Fast Performance** - Server-side rendering with Next.js 16
- 📝 **CMS-Powered** - All content manageable through Cosmic

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=692f81704cd83d586adfb1a1&clone_repository=692f830d4cd83d586adfb8a7)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a website for Golden Hills Ranch that sells grass-fed beef, raw milk, sheep cheese, and other whole food and sustainable goods and accessories."

### Code Generation Prompt

> "Based on the content model I created for Golden Hills Ranch, now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [Cosmic](https://www.cosmicjs.com/docs) - Headless CMS
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the Golden Hills Ranch bucket

### Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Cosmic credentials to `.env.local`:
```
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

5. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view your site.

## Cosmic SDK Examples

### Fetching Products
```typescript
import { cosmic } from '@/lib/cosmic'

const { objects: products } = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching Featured Products
```typescript
const { objects: featured } = await cosmic.objects
  .find({ type: 'products', 'metadata.featured': true })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Fetching Site Settings
```typescript
const { object: settings } = await cosmic.objects
  .findOne({ type: 'site-settings' })
  .props(['id', 'slug', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This application uses three Object Types from your Cosmic bucket:

### Products
- Name, Description, Price, Category, Featured flag, and Image
- Categories: Grass-Fed Beef, Dairy, Eggs, Pantry, Farm Goods

### Pages
- Title, Hero Image, and Markdown Content
- Used for About Us and Farming Practices pages

### Site Settings (Singleton)
- Ranch Name, Tagline, Logo
- Contact: Phone, Email, Address
- Social: Instagram URL, Facebook URL

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy

### Netlify
1. Push your code to GitHub
2. Import in [Netlify](https://netlify.com)
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy

<!-- README_END -->