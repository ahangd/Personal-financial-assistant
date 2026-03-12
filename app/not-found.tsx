import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">页面不存在</h1>
        <p className="mt-3 text-muted-foreground">
          你访问的页面可能已被移动或删除。
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

