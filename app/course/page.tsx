import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllChapters } from "@/data/course";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata = {
  title: "投资第一课 - 理财知识网站",
  description: "有知有行·投资第一课：从门外汉到 80 分投资者，系统学习投资常识与长期投资理念。",
};

export default function CoursePage() {
  const chapters = getAllChapters();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 py-12 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl xs:text-4xl font-bold tracking-tight">
            投资第一课
          </h1>
          <p className="mt-4 text-muted-foreground xs:text-lg max-w-2xl">
            有知有行·投资第一课：从门外汉到 80 分投资者。系统理解钱从哪来、哪种投资回报最高、如何做好资产配置与长期投资。
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((ch) => (
            <Link key={ch.slug} href={`/course/${ch.slug}`}>
              <Card className="h-full border rounded-xl shadow-none hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary shrink-0" />
                    <h2 className="font-semibold text-base line-clamp-2">
                      {ch.title}
                    </h2>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm text-primary font-medium flex items-center gap-1">
                    阅读 <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
