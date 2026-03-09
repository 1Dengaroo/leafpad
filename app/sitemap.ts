import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://leafpad.vercel.app';
  const lastModified = new Date();

  return [
    {
      url: base,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${base}/markdown`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${base}/json-formatter`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${base}/diff-tool`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${base}/utilities`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8
    }
  ];
}
