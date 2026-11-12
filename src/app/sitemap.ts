import type { MetadataRoute } from 'next';
import { GUIDES } from '@/lib/guides';
import { PRODUCTS } from '@/lib/products';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...Object.values(PRODUCTS).map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: absoluteUrl('/guides'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...GUIDES.map((g) => ({
      url: absoluteUrl(`/guides/${g.slug}`),
      lastModified: new Date(g.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: absoluteUrl('/sources'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...['/privacy', '/terms', '/refund-policy'].map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
