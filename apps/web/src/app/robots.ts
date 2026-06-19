import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/lead-capture', '/success'],
      },
    ],
    sitemap: 'https://motofin.in/sitemap.xml',
  };
}
