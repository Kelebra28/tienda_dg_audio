import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  const baseUrl = 'https://www.dgaudiosound.com';
  
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

  const urls = posts.map((post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
