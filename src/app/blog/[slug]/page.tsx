import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Custom simple parser to render basic markdown elements into HTML
function renderMarkdown(md: string): string {
  // Normalize line endings
  let text = md.replace(/\r\n/g, "\n");

  // Bold (**bold**)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic (*italic*)
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Links ([text](url))
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--color-accent); text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = text.split("\n");
  let inList = false;
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith("### ")) {
      return `<h3 style="font-size: 1.5rem; margin-top: 2rem; margin-bottom: 0.75rem; font-family: var(--font-heading); font-weight: 700; color: var(--text-main);">${trimmed.slice(4)}</h3>`;
    }
    if (trimmed.startsWith("## ")) {
      return `<h2 style="font-size: 1.85rem; margin-top: 2.25rem; margin-bottom: 1rem; font-family: var(--font-heading); font-weight: 700; color: var(--text-main);">${trimmed.slice(3)}</h2>`;
    }
    if (trimmed.startsWith("# ")) {
      return `<h1 style="font-size: 2.25rem; margin-top: 2.5rem; margin-bottom: 1.25rem; font-family: var(--font-heading); font-weight: 700; color: var(--text-main);">${trimmed.slice(2)}</h1>`;
    }

    // Bullet list items
    if (trimmed.startsWith("- ")) {
      let prefix = "";
      if (!inList) {
        inList = true;
        prefix = '<ul style="margin-bottom: 1.25rem; padding-left: 1.5rem; list-style-type: disc;">';
      }
      return `${prefix}<li style="margin-bottom: 0.5rem; color: var(--text-main);">${trimmed.slice(2)}</li>`;
    }

    // Paragraph or empty line
    if (inList) {
      inList = false;
      if (trimmed === "") {
        return "</ul>";
      }
      return `</ul><p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--text-main); font-size: 1.05rem;">${trimmed}</p>`;
    }

    if (trimmed === "") {
      return "";
    }

    return `<p style="margin-bottom: 1.25rem; line-height: 1.75; color: var(--text-main); font-size: 1.05rem;">${trimmed}</p>`;
  });

  if (inList) {
    processedLines.push("</ul>");
  }

  return processedLines.join("\n");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    return {
      title: "Artículo no encontrado",
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Blog`,
    description: post.seoDescription || post.content.substring(0, 160).replace(/[#*`_-]/g, ""),
  };
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const parsedContent = renderMarkdown(post.content);

  return (
    <article style={{ maxWidth: "800px", margin: "2rem auto 4rem auto", padding: "0 1.5rem" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", paddingBottom: "1.5rem" }}>
        <div style={{ color: "var(--color-accent)", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          Blog / DG Audiosound
        </div>
        <h1 style={{ fontSize: "2.75rem", fontFamily: "var(--font-heading)", fontWeight: 700, lineHeight: 1.15, color: "var(--text-main)", marginBottom: "1rem" }}>
          {post.title}
        </h1>
        <div style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
          Publicado el {formattedDate}
        </div>
      </header>

      {post.imageUrl && (
        <div style={{ width: "100%", height: "auto", maxHeight: "450px", overflow: "hidden", borderRadius: "12px", marginBottom: "2rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      )}

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "1.1rem",
          lineHeight: "1.8",
          color: "var(--text-main)",
        }}
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
    </article>
  );
}
