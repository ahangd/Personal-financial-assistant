import { redirect } from "next/navigation"

export const metadata = {
  title: "理财工具 - 理财知识网站",
  description: "复利计算器、定投收益模拟等实用理财工具",
};

export default function ToolsPage() {
  redirect("/tools/compound")
}
