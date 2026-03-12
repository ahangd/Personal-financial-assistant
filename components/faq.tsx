import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";

const faq = [
  {
    question: "智能助手能回答哪些问题？",
    answer:
      "可解答理财概念（如复利、定投、ETF）、基金与股票区别、保险配置、储蓄规划等。也可根据你的年龄、收入、风险偏好给出资产配置建议。仅供参考，不构成投资建议。",
  },
  {
    question: "需要注册登录吗？",
    answer:
      "当前版本无需注册。对话历史会保存在浏览器本地，清除缓存后可能丢失。后续版本可能支持账号与云端同步。",
  },
  {
    question: "DIFY 如何配置？",
    answer:
      "在项目根目录创建 .env.local，参考 .env.local.example 填入 DIFY_API_KEY 和 DIFY API Base URL。在 DIFY 控制台创建应用后即可获取。",
  },
  {
    question: "知识库内容会更新吗？",
    answer:
      "会持续补充与更新。欢迎反馈希望看到的话题，我们会优先整理。",
  },
  {
    question: "工具计算结果准确吗？",
    answer:
      "复利与定投工具采用标准公式计算，结果为理论值。实际投资受市场波动、费用等影响，仅供参考。",
  },
  {
    question: "是否收费？",
    answer:
      "本网站免费使用。DIFY 调用可能产生模型费用，取决于你的 DIFY 配置与用量。",
  },
];

const FAQ = () => {
  return (
    <div id="faq" className="w-full max-w-screen-xl mx-auto py-8 xs:py-16 px-6">
      <h2 className="md:text-center text-3xl xs:text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tighter">
        常见问题
      </h2>
      <p className="mt-1.5 md:text-center xs:text-lg text-muted-foreground">
        关于理财知识网站的常见问题
      </p>

      <div className="min-h-[550px] md:min-h-[320px] xl:min-h-[300px]">
        <Accordion
          type="single"
          collapsible
          className="mt-8 space-y-4 md:columns-2 gap-4"
        >
          {faq.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`question-${index}`}
              className="bg-accent py-1 px-4 rounded-xl border-none !mt-0 !mb-4 break-inside-avoid"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                  className={cn(
                    "flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                    "text-start text-lg"
                  )}
                >
                  {question}
                  <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="text-[15px]">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
