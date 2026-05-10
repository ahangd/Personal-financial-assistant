import Link from "next/link";

import { AuthGateLink } from "@/components/auth/AuthGateLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";

import { NavMenu } from "./nav-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>{"\u5bfc\u822a\u83dc\u5355"}</SheetTitle>
      </VisuallyHidden>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full border-0 bg-transparent text-[#0B0B0B] shadow-none hover:bg-transparent"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white px-6 pt-6">
        <Link href="/" className="text-lg font-medium text-[#0B0B0B]">
          FinLounge
        </Link>
        <NavMenu orientation="vertical" className="mt-10" />
        <div className="mt-8 space-y-4">
          <Button
            asChild
            className="h-11 w-full rounded-xl bg-[#0B0B0B] text-sm shadow-none"
          >
            <AuthGateLink href="/chat">
              {"\u8fdb\u5165\u52a9\u624b"}
            </AuthGateLink>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
