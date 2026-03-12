import { Navbar } from "@/components/navbar";
import { ARTICLES } from "@/data/knowledge";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) return { title: "文章不存在" };
  return {
    title: `${article.title} - 理财百科`,
    description: article.summary,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回百科
        </Link>
        <header className="mb-8">
          <span className="text-sm text-primary font-medium">{article.category}</span>
          <h1 className="text-3xl font-bold mt-2">{article.title}</h1>
          <p className="text-muted-foreground mt-2">{article.summary}</p>
          <time className="text-sm text-muted-foreground mt-2 block">
            {article.createdAt}
          </time>
        </header>
        <MarkdownRenderer content={article.content} />
      </article>
    </div>
  );
}
