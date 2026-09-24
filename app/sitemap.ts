import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.kantrybes.lt', lastModified: new Date() },
    { url: 'https://www.kantrybes.lt/dev', lastModified: new Date() },
    { url: 'https://www.kantrybes.lt/dj', lastModified: new Date() },
  ]
}
