export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
        },
      ],
      sitemap: 'https://mains.dev/sitemap.xml',
      host: 'https://mains.dev',
    };
  }