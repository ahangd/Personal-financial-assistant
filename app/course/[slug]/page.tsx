import { Navbar } from "@/components/navbar";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getChapterBySlug, getAllChapters } from "@/data/course";
import { getChapterContent } from "@/lib/course-content";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllChapters().map((ch) => ({ slug: ch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return { title: "章节不存在" };
  return {
    title: `${chapter.title} - 投资第一课`,
    description: `投资第一课：${chapter.title}`,
  };
}

export default async function CourseChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const content = getChapterContent(slug);
  const chapters = getAllChapters();
  const idx = chapters.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Link
          href="/course"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回投资第一课
        </Link>

        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {chapter.title}
          </h1>
        </header>

        {content ? (
          <MarkdownRenderer content={content} className="course-chapter" />
        ) : (
          <p className="text-muted-foreground">
            本章节内容暂不可用，请确保项目根目录存在《投资第一课》文档。
          </p>
        )}

        <nav className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
          {prev ? (
            <Link
              href={`/course/${prev.slug}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/course/${next.slug}`}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground ml-auto"
            >
              {next.title}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  );
}
