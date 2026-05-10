import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ARTICLES, CATEGORIES } from "@/data/knowledge";

export const metadata = {
  title: "理财百科 - 理财知识网站",
  description: "系统学习理财知识，从入门到进阶。",
};

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <RequireAuth>
        <div className="mx-auto max-w-screen-xl px-4 py-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            返回主页
          </Link>

          <h1 className="mb-2 text-3xl font-bold">理财百科</h1>
          <p className="mb-8 text-muted-foreground">
            系统学习理财知识，建立正确的投资观念
          </p>

          {CATEGORIES.map((cat) => {
            const items = ARTICLES.filter((article) => article.category === cat);
            if (items.length === 0) return null;

            return (
              <section key={cat} className="mb-12">
                <h2 className="mb-4 text-xl font-semibold">{cat}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((article) => (
                    <Link key={article.id} href={`/knowledge/${article.id}`}>
                      <Card className="h-full transition-colors hover:border-primary/50">
                        <CardHeader className="pb-2">
                          <h3 className="line-clamp-2 font-medium">{article.title}</h3>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {article.summary}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <span className="flex items-center gap-1 text-sm text-primary">
                            阅读全文 <ArrowRight className="h-4 w-4" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </RequireAuth>
    </div>
  );
}
