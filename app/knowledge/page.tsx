import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ARTICLES, CATEGORIES } from "@/data/knowledge";
import Link from "next/link";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "理财百科 - 理财知识网站",
  description: "系统学习理财知识，从入门到进阶",
};

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <RequireAuth>
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">理财百科</h1>
          <p className="text-muted-foreground mb-8">
            系统学习理财知识，建立正确的投资观念
          </p>

          {CATEGORIES.map((cat) => {
            const items = ARTICLES.filter((a) => a.category === cat);
            if (items.length === 0) return null;
            return (
              <section key={cat} className="mb-12">
                <h2 className="text-xl font-semibold mb-4">{cat}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((article) => (
                    <Link key={article.id} href={`/knowledge/${article.id}`}>
                      <Card className="h-full hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-2">
                          <h3 className="font-medium line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.summary}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <span className="text-sm text-primary flex items-center gap-1">
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
