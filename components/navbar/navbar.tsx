import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthGateLink } from "@/components/auth/AuthGateLink";
import ThemeToggle from "../theme-toggle";
import { Button } from "@/components/ui/button";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  return (
    <nav className="border-b border-[#F0F0F0] bg-[#FFFFFF]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-[20px] font-medium text-[#0B0B0B]"
          style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}
        >
          FinLounge
        </Link>

        <div className="hidden items-center gap-6 text-[14px] font-medium text-[#6C6C6C] md:flex">
          <Link href="/chat" className="transition-colors hover:text-[#0B0B0B]">
            {"\u667a\u80fd\u52a9\u624b"}
          </Link>
          <Link
            href="/knowledge"
            className="transition-colors hover:text-[#0B0B0B]"
          >
            {"\u7406\u8d22\u767e\u79d1"}
          </Link>
          <AuthGateLink
            href="/tools/paper"
            className="transition-colors hover:text-[#0B0B0B]"
          >
            {"\u6a21\u62df\u76d8"}
          </AuthGateLink>
          <AuthGateLink
            href="/tools/backtest"
            className="transition-colors hover:text-[#0B0B0B]"
          >
            {"\u5386\u53f2\u56de\u6d4b"}
          </AuthGateLink>
          <Link href="/tools" className="transition-colors hover:text-[#0B0B0B]">
            {"\u5de5\u5177"}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            className="hidden h-12 rounded-[999px] bg-[#1D1B34] px-6 text-[15px] font-semibold text-white shadow-none hover:bg-[#17152A] sm:inline-flex"
          >
            <AuthGateLink href="/chat">
              {"\u8fdb\u5165\u52a9\u624b"}
              <ArrowRight strokeWidth={2.2} />
            </AuthGateLink>
          </Button>
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
