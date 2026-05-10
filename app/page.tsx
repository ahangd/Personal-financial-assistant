import { Navbar } from "@/components/navbar"
import Hero from "@/components/hero"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AuthGateLink } from "@/components/auth/AuthGateLink"
import { Button } from "@/components/ui/button"

const sectionButtonClassName =
  "h-14 min-w-[220px] rounded-[999px] bg-[#1D1B34] px-8 text-[16px] font-semibold text-white shadow-none hover:bg-[#17152A]"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <main>
        <Hero />
        <section className="bg-[#FFFFFF] px-6 pb-24 pt-6 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-[760px] text-center">
              <h2
                className="text-3xl font-semibold tracking-[-0.04em] text-[#1D1B34] sm:text-4xl lg:text-[54px]"
                style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}
              >
                {"\u4ece\u7406\u89e3\uff0c\u8d70\u5230\u6f14\u7ec3\u4e0e\u9a8c\u8bc1"}
              </h2>
            </div>

            <div className="mt-12 space-y-8">
              <section className="overflow-hidden rounded-[36px] bg-[#F8F7FF]">
                <div className="grid min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative overflow-hidden bg-[#F9F3CF] p-8 sm:p-10">
                    <div className="absolute left-12 top-12 h-4 w-4 rounded-full bg-[#6EA8FF]" />
                    <div className="absolute bottom-12 right-14 h-5 w-5 rounded-[7px] bg-[#B885FF]" />
                    <div className="absolute left-10 top-1/2 h-3 w-16 -rotate-12 rounded-full bg-[#7FD68B]" />
                    <div className="absolute right-10 top-1/3 h-3 w-14 rotate-12 rounded-full bg-[#FF8F87]" />
                    <div className="relative flex h-full items-center justify-center">
                      <div className="relative flex h-[320px] w-[320px] items-center justify-center">
                        <div className="absolute h-28 w-28 rounded-full bg-[#D7A60E]" />
                        <div className="absolute inset-x-0 top-0 flex justify-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white text-[32px] shadow-[0_14px_40px_rgba(29,27,52,0.08)]">
                            {"\ud83d\udcd8"}
                          </div>
                        </div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2">
                          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white text-[28px] shadow-[0_14px_40px_rgba(29,27,52,0.08)]">
                            {"\ud83d\udccc"}
                          </div>
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white text-[28px] shadow-[0_14px_40px_rgba(29,27,52,0.08)]">
                            {"\ud83e\udde0"}
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 flex justify-center">
                          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white text-[30px] shadow-[0_14px_40px_rgba(29,27,52,0.08)]">
                            {"\ud83d\udcd6"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center bg-[#F8F7FF] p-8 sm:p-10 lg:p-14">
                    <div className="max-w-[430px]">
                      <p className="text-sm font-medium text-[#F34E8E]">
                        {"\u7406\u8d22\u767e\u79d1"}
                      </p>
                      <h3
                        className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#1D1B34] sm:text-4xl"
                        style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}
                      >
                        {"\u5148\u628a\u6982\u5ff5\u770b\u660e\u767d"}
                      </h3>
                      <p className="mt-5 text-base leading-8 text-[#6D7590] sm:text-[18px]">
                        {
                          "\u4ece\u590d\u5229\u3001\u4f30\u503c\u5230\u5b9a\u6295\u4e0e\u8d44\u4ea7\u914d\u7f6e\uff0c\u628a\u96f6\u6563\u77e5\u8bc6\u6536\u6210\u4e00\u5957\u80fd\u7528\u6765\u5224\u65ad\u7684\u6846\u67b6\u3002"
                        }
                      </p>
                      <div className="mt-8">
                        <Button asChild className={sectionButtonClassName}>
                          <Link href="/knowledge">
                            {"\u6d4f\u89c8\u767e\u79d1"}
                            <ArrowRight strokeWidth={2.2} />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[36px] bg-[#F8F7FF]">
                <div className="grid min-h-[520px] lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="flex items-center bg-[#F8F7FF] p-8 sm:p-10 lg:p-14">
                    <div className="max-w-[430px]">
                      <p className="text-sm font-medium text-[#F34E8E]">
                        {"\u6a21\u62df\u76d8"}
                      </p>
                      <h3
                        className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#1D1B34] sm:text-4xl"
                        style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}
                      >
                        {"\u5148\u7ec3\u4e60\uff0c\u518d\u4e0b\u51b3\u5b9a"}
                      </h3>
                      <p className="mt-5 text-base leading-8 text-[#6D7590] sm:text-[18px]">
                        {
                          "\u7528\u6a21\u62df\u8d44\u91d1\u7ec3\u4e60\u4e0b\u5355\u3001\u4ed3\u4f4d\u53d8\u5316\u548c\u76c8\u4e8f\u611f\u53d7\uff0c\u628a\u60f3\u6cd5\u5148\u8d70\u4e00\u904d\uff0c\u4e0d\u7528\u4e00\u4e0a\u6765\u5c31\u62ff\u771f\u91d1\u767d\u94f6\u4ea4\u5b66\u8d39\u3002"
                        }
                      </p>
                      <div className="mt-8">
                        <Button asChild className={sectionButtonClassName}>
                          <AuthGateLink href="/tools/paper">
                            {"\u8fdb\u5165\u6a21\u62df\u76d8"}
                            <ArrowRight strokeWidth={2.2} />
                          </AuthGateLink>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-[#E8E0FF] p-8 sm:p-10">
                    <div className="absolute right-12 top-12 h-4 w-4 rounded-full bg-[#F56BB3]" />
                    <div className="absolute bottom-12 left-14 h-4 w-4 rounded-full bg-[#6EA8FF]" />
                    <div className="absolute left-1/2 top-12 h-3 w-14 -rotate-12 rounded-full bg-[#7FD68B]" />
                    <div className="relative flex h-full items-center justify-center">
                      <div className="grid grid-cols-3 gap-6">
                        {[
                          "#D9EEFF",
                          "#FFE0EF",
                          "#DFF6E4",
                          "#FFF3D1",
                          "#E8E0FF",
                          "#FFD8D8",
                        ].map((color, index) => (
                          <div
                            key={index}
                            className="flex h-24 w-24 items-center justify-center rounded-full border-[5px] border-white/80 text-[24px] shadow-[0_16px_34px_rgba(72,60,123,0.12)]"
                            style={{ backgroundColor: color }}
                          >
                            {["\ud83d\udc64", "\ud83d\udcca", "\ud83d\udcc9", "\ud83d\udcb0", "\ud83d\udcc8", "\ud83d\udcdd"][index]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[36px] bg-[#F8F7FF]">
                <div className="grid min-h-[520px] lg:grid-cols-[1.02fr_0.98fr]">
                  <div className="relative overflow-hidden bg-[#F3F5FF] p-8 sm:p-10">
                    <div className="absolute left-12 top-12 h-4 w-4 rounded-full bg-[#6EA8FF]" />
                    <div className="absolute bottom-12 right-12 h-0 w-0 border-b-[28px] border-l-[20px] border-r-[20px] border-b-[#FFD85A] border-l-transparent border-r-transparent rotate-90" />
                    <div className="absolute right-16 top-20 h-3 w-14 rotate-12 rounded-full bg-[#FF8F87]" />
                    <div className="relative flex h-full items-center justify-center">
                      <div className="w-full max-w-[430px] rounded-[30px] bg-[#1D1B34] p-6 text-white shadow-[0_30px_70px_rgba(29,27,52,0.16)]">
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                              Backtest
                            </div>
                            <div className="mt-2 text-2xl font-semibold">
                              {"\u5386\u53f2\u56de\u6d4b"}
                            </div>
                          </div>
                          <div className="text-sm text-white/65">
                            {"2018 \u2014 2025"}
                          </div>
                        </div>
                        <div className="mt-8 flex h-44 items-end gap-3">
                          {[48, 72, 66, 96, 88, 120, 136, 150].map((height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-[18px] bg-gradient-to-t from-[#6EA8FF] via-[#8F7DFF] to-[#F56BB3]"
                              style={{ height }}
                            />
                          ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between text-sm text-white/65">
                          <span>{"\u7b56\u7565\u66f2\u7ebf"}</span>
                          <span>{"+42.8%"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center bg-[#F8F7FF] p-8 sm:p-10 lg:p-14">
                    <div className="max-w-[430px]">
                      <p className="text-sm font-medium text-[#F34E8E]">
                        {"\u5386\u53f2\u56de\u6d4b"}
                      </p>
                      <h3
                        className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#1D1B34] sm:text-4xl"
                        style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}
                      >
                        {"\u7528\u5386\u53f2\u6570\u636e\u9a8c\u8bc1\u60f3\u6cd5"}
                      </h3>
                      <p className="mt-5 text-base leading-8 text-[#6D7590] sm:text-[18px]">
                        {
                          "\u628a\u4f60\u7684\u6301\u6709\u3001\u5b9a\u6295\u6216\u7b80\u5355\u7b56\u7565\u653e\u5230\u5386\u53f2\u533a\u95f4\u91cc\uff0c\u770b\u5b83\u5728\u4e0d\u540c\u6bb5\u843d\u91cc\u7684\u771f\u5b9e\u8868\u73b0\u3002"
                        }
                      </p>
                      <div className="mt-8">
                        <Button asChild className={sectionButtonClassName}>
                          <AuthGateLink href="/tools/backtest">
                            {"\u5f00\u59cb\u56de\u6d4b"}
                            <ArrowRight strokeWidth={2.2} />
                          </AuthGateLink>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[36px] bg-[#F8F7FF]">
                <div className="grid min-h-[520px] lg:grid-cols-[0.98fr_1.02fr]">
                  <div className="flex items-center bg-[#F8F7FF] p-8 sm:p-10 lg:p-14">
                    <div className="max-w-[430px]">
                      <p className="text-sm font-medium text-[#F34E8E]">
                        {"\u5de5\u5177"}
                      </p>
                      <h3
                        className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#1D1B34] sm:text-4xl"
                        style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}
                      >
                        {"\u628a\u60f3\u6cd5\u53d8\u6210\u53ef\u8ba1\u7b97\u7684\u51b3\u7b56"}
                      </h3>
                      <p className="mt-5 text-base leading-8 text-[#6D7590] sm:text-[18px]">
                        {
                          "\u4ece\u590d\u5229\u8ba1\u7b97\u3001\u5b9a\u6295\u6a21\u62df\u5230\u6295\u8d44\u7ec4\u5408\u5206\u6790\uff0c\u628a\u7b3c\u7edf\u7684\u611f\u89c9\u62c6\u6210\u53ef\u4ee5\u5bf9\u6bd4\u3001\u53ef\u4ee5\u8c03\u6574\u3001\u53ef\u4ee5\u590d\u76d8\u7684\u53c2\u6570\u3002"
                        }
                      </p>
                      <div className="mt-8">
                        <Button asChild className={sectionButtonClassName}>
                          <Link href="/tools">
                            {"\u6d4f\u89c8\u5de5\u5177"}
                            <ArrowRight strokeWidth={2.2} />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden bg-[#EAF4FF] p-8 sm:p-10">
                    <div className="absolute left-12 top-12 h-4 w-4 rounded-full bg-[#6EA8FF]" />
                    <div className="absolute right-12 top-16 h-4 w-4 rounded-full bg-[#F56BB3]" />
                    <div className="absolute bottom-14 left-16 h-3 w-16 rotate-12 rounded-full bg-[#7FD68B]" />
                    <div className="absolute bottom-12 right-16 h-0 w-0 border-b-[24px] border-l-[18px] border-r-[18px] border-b-[#FFD85A] border-l-transparent border-r-transparent -rotate-90" />
                    <div className="relative flex h-full items-center justify-center">
                      <div className="grid w-full max-w-[420px] grid-cols-2 gap-4">
                        {[
                          ["\u590d\u5229\u8ba1\u7b97", "\ud83d\udcc8"],
                          ["\u5b9a\u6295\u6a21\u62df", "\ud83d\udcc5"],
                          ["\u7ec4\u5408\u5206\u6790", "\ud83d\udcca"],
                          ["\u66f4\u591a\u5de5\u5177", "\u2699\ufe0f"],
                        ].map(([label, icon]) => (
                          <div
                            key={label}
                            className="rounded-[28px] bg-white p-6 shadow-[0_18px_38px_rgba(29,27,52,0.08)]"
                          >
                            <div className="text-[28px]">{icon}</div>
                            <div className="mt-6 text-base font-semibold text-[#1D1B34]">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
