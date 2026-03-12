import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, BookOpen, Calculator, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { ARTICLES } from "@/data/knowledge";
import { getAllChapters } from "@/data/course";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "智能理财助手",
    description: "接入 DIFY Agent，解答理财问题、解释概念、提供规划建议。",
    href: "/chat",
    cta: "开始对话",
  },
  {
    icon: BookOpen,
    title: "理财百科",
    description: "入门、投资、保险、储蓄、税务等分类知识，系统学习理财。",
    href: "/knowledge",
    cta: "浏览百科",
  },
  {
    icon: Calculator,
    title: "理财工具",
    description: "复利计算器、定投收益模拟，助你直观理解收益与规划。",
    href: "/tools",
    cta: "使用工具",
  },
];

const RECOMMENDED = ARTICLES.slice(0, 3);

const Features = () => {
  const courseChapters = getAllChapters().slice(0, 3);
  return (
    <div
      id="features"
      className="max-w-screen-xl mx-auto w-full py-12 xs:py-20 px-6"
    >
      <h2 className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl sm:text-center sm:mx-auto">
        一站式理财学习平台
      </h2>
      <p className="mt-4 text-muted-foreground sm:text-center">
        智能问答、知识库、实用工具，助你建立正确理财观念
      </p>
      <div className="mt-8 xs:mt-14 w-full mx-auto grid md:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="h-full flex flex-col border rounded-xl overflow-hidden shadow-none hover:border-primary/50 transition-colors">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary" />
                <h4 className="!mt-3 text-xl font-bold tracking-tight">
                  {feature.title}
                </h4>
                <p className="mt-1 text-muted-foreground text-sm xs:text-[17px]">
                  {feature.description}
                </p>
              </CardHeader>
              <CardContent className="mt-auto">
                <span className="text-primary font-medium flex items-center gap-1">
                  {feature.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">投资第一课</h3>
        <p className="text-muted-foreground mb-6">
          有知有行·投资第一课：从门外汉到 80 分投资者，系统学习投资常识。
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {courseChapters.map((ch) => (
            <Link key={ch.slug} href={`/course/${ch.slug}`}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <h4 className="font-semibold line-clamp-2">{ch.title}</h4>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm text-primary flex items-center gap-1">
                    阅读 <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/course">
            <Card className="inline-flex items-center gap-2 px-6 py-3 border rounded-xl hover:border-primary/50 transition-colors">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-medium">查看全部章节</span>
              <ArrowRight className="h-4 w-4" />
            </Card>
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">推荐阅读</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {RECOMMENDED.map((article) => (
            <Link key={article.id} href={`/knowledge/${article.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader>
                  <h4 className="font-semibold line-clamp-2">{article.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm text-primary flex items-center gap-1">
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
};

export default Features;
