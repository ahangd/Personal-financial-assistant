import { AuthGateLink } from "@/components/auth/AuthGateLink";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from "next/link";

export const NavMenu = (props: NavigationMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            href="/"
            className="text-sm text-[#6C6C6C] transition-colors hover:text-[#0B0B0B]"
          >
            {"\u9996\u9875"}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <AuthGateLink
            href="/chat"
            className="text-sm text-[#6C6C6C] transition-colors hover:text-[#0B0B0B]"
          >
            {"\u667a\u80fd\u52a9\u624b"}
          </AuthGateLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            href="/knowledge"
            className="text-sm text-[#6C6C6C] transition-colors hover:text-[#0B0B0B]"
          >
            {"\u7406\u8d22\u767e\u79d1"}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <AuthGateLink
            href="/tools/paper"
            className="text-sm text-[#6C6C6C] transition-colors hover:text-[#0B0B0B]"
          >
            {"\u6a21\u62df\u76d8"}
          </AuthGateLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <AuthGateLink
            href="/tools/backtest"
            className="text-sm text-[#6C6C6C] transition-colors hover:text-[#0B0B0B]"
          >
            {"\u5386\u53f2\u56de\u6d4b"}
          </AuthGateLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <AuthGateLink
            href="/tools"
            className="text-sm text-[#6C6C6C] transition-colors hover:text-[#0B0B0B]"
          >
            {"\u5de5\u5177"}
          </AuthGateLink>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
