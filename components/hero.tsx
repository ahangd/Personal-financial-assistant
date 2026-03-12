import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  MessageCircle,
  BookOpen,
  Calculator,
  GraduationCap,
  LineChart,
  CandlestickChart,
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden border-b border-accent">
      <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <div className="max-w-xl">
          <Badge className="rounded-full py-1 border-none">
            理财知识 · 智能助手
          </Badge>
          <h1 className="mt-6 max-w-[24ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            系统学习理财，建立正确投资观念
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg text-muted-foreground">
            AI 智能助手解答理财问题，理财百科系统学习知识，实用工具助你规划未来。专注教育，不荐股不卖课。
          </p>
          <div className="mt-12 flex flex-col sm:flex-row flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full text-base"
              asChild
            >
              <Link href="/chat">
                <MessageCircle className="!h-5 !w-5" /> 智能助手 <ArrowUpRight className="!h-5 !w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
              asChild
            >
              <Link href="/course">
                <GraduationCap className="!h-5 !w-5" /> 投资第一课
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
              asChild
            >
              <Link href="/knowledge">
                <BookOpen className="!h-5 !w-5" /> 理财百科
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
              asChild
            >
              <Link href="/tools">
                <Calculator className="!h-5 !w-5" /> 理财工具
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
              asChild
            >
              <Link href="/tools/paper">
                <CandlestickChart className="!h-5 !w-5" /> 模拟盘
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full text-base shadow-none"
              asChild
            >
              <Link href="/tools/backtest">
                <LineChart className="!h-5 !w-5" /> 历史回测
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative lg:max-w-lg xl:max-w-xl w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl aspect-square flex items-center justify-center">
          <MessageCircle className="w-32 h-32 text-primary/30" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
