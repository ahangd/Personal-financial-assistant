import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const footerSections = [
  {
    title: "产品",
    links: [
      { title: "智能助手", href: "/chat" },
      { title: "理财百科", href: "/knowledge" },
      { title: "理财工具", href: "/tools" },
      { title: "投资第一课", href: "/course" },
    ],
  },
  {
    title: "导航",
    links: [
      { title: "功能特性", href: "/#features" },
      { title: "常见问题", href: "/#faq" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-12 xs:mt-20 dark bg-background border-t">
      <div className="max-w-screen-xl mx-auto py-12 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 px-6">
        {footerSections.map(({ title, links }) => (
          <div key={title}>
            <h6 className="font-semibold text-foreground">{title}</h6>
            <ul className="mt-6 space-y-4">
              {links.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Separator />
      <div className="max-w-screen-xl mx-auto py-8 px-6">
        <p className="text-sm text-muted-foreground text-center">
          本网站内容仅供参考，不构成投资建议。投资有风险，决策需谨慎。
        </p>
      </div>
    </footer>
  );
};

export default Footer;
