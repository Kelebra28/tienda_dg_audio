import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dgaudiosound.com';

  // Fetch all published blog posts (excluding future scheduled posts)
  const posts = await prisma.post.findMany({
    where: { 
      published: true,
      OR: [
        { publishAt: null },
        { publishAt: { lte: new Date() } }
      ]
    },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  // Map posts to sitemap format
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch products if you have them, etc.
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/tienda/${product.id}`, // Asumiendo que esta es la ruta
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Add static routes
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tienda`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...productUrls, ...blogUrls];
}
