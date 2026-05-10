import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuthGateLink } from "@/components/auth/AuthGateLink";
import { Button } from "@/components/ui/button";

const accents = [
  {
    className: "h-4 w-4 rounded-full bg-[#6EA8FF]",
    style: {
      "--tx": "-520px",
      "--ty": "-248px",
      "--fx": "18px",
      "--fy": "-14px",
      "--rot": "0deg",
      "--frot": "0deg",
      "--delay": "0ms",
      "--float-duration": "7.5s",
    } as React.CSSProperties,
  },
  {
    className: "h-5 w-5 rounded-full bg-[#F56BB3]",
    style: {
      "--tx": "516px",
      "--ty": "242px",
      "--fx": "-14px",
      "--fy": "12px",
      "--rot": "0deg",
      "--frot": "0deg",
      "--delay": "80ms",
      "--float-duration": "8.2s",
    } as React.CSSProperties,
  },
  {
    className: "h-10 w-10 bg-[#FFD85A] [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]",
    style: {
      "--tx": "-565px",
      "--ty": "292px",
      "--fx": "10px",
      "--fy": "-16px",
      "--rot": "18deg",
      "--frot": "12deg",
      "--delay": "120ms",
      "--float-duration": "9.4s",
    } as React.CSSProperties,
  },
  {
    className: "h-0 w-0 border-b-[24px] border-l-[18px] border-r-[18px] border-b-[#7FD68B] border-l-transparent border-r-transparent",
    style: {
      "--tx": "548px",
      "--ty": "-236px",
      "--fx": "-10px",
      "--fy": "14px",
      "--rot": "14deg",
      "--frot": "-10deg",
      "--delay": "180ms",
      "--float-duration": "8.8s",
    } as React.CSSProperties,
  },
  {
    className: "h-3 w-16 rounded-full bg-[#7FD68B]",
    style: {
      "--tx": "-488px",
      "--ty": "58px",
      "--fx": "14px",
      "--fy": "-8px",
      "--rot": "-34deg",
      "--frot": "8deg",
      "--delay": "220ms",
      "--float-duration": "7.8s",
    } as React.CSSProperties,
  },
  {
    className: "h-3 w-14 rounded-full bg-[#FF8F87]",
    style: {
      "--tx": "502px",
      "--ty": "106px",
      "--fx": "-12px",
      "--fy": "10px",
      "--rot": "28deg",
      "--frot": "-6deg",
      "--delay": "260ms",
      "--float-duration": "8.6s",
    } as React.CSSProperties,
  },
  {
    className: "h-6 w-6 rounded-[8px] bg-[#B885FF]",
    style: {
      "--tx": "432px",
      "--ty": "-184px",
      "--fx": "-16px",
      "--fy": "-10px",
      "--rot": "22deg",
      "--frot": "10deg",
      "--delay": "320ms",
      "--float-duration": "9.2s",
    } as React.CSSProperties,
  },
  {
    className: "h-5 w-5 rounded-full bg-[#6EA8FF]",
    style: {
      "--tx": "-446px",
      "--ty": "-180px",
      "--fx": "12px",
      "--fy": "8px",
      "--rot": "0deg",
      "--frot": "0deg",
      "--delay": "360ms",
      "--float-duration": "8s",
    } as React.CSSProperties,
  },
];

const Hero = () => {
  return (
    <section className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden bg-[#FFFFFF] px-6 py-16 sm:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {accents.map((accent, index) => (
          <div
            key={index}
            className={`hero-burst-piece ${accent.className}`}
            style={accent.style}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl justify-center">
        <div className="flex max-w-[860px] flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 text-[18px] font-semibold text-[#F34E8E] sm:text-[20px]">
            <span
              aria-hidden="true"
              className="inline-block h-7 w-7 rounded-[10px]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0) 38%), linear-gradient(135deg, #4F7BFF 0%, #B658FF 52%, #FF4FB7 100%)",
                boxShadow: "0 10px 30px rgba(182,88,255,0.22)",
              }}
            />
            <span style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}>
              FinLounge
            </span>
          </div>

          <h1
            className="mt-10 max-w-[900px] text-center text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-[#1D1B34] sm:text-6xl lg:text-[92px]"
            style={{ fontFamily: 'Inter, "PingFang SC", sans-serif' }}
          >
            <span className="block">
              {"\u5c11\u4e00\u70b9\u566a\u97f3\uff0c"}
            </span>
            <span className="block">
              {"\u591a\u4e00\u70b9\u5224\u65ad"}
            </span>
          </h1>

          <p className="mt-8 max-w-[760px] text-lg leading-[1.9] text-[#6D7590] sm:text-[19px]">
            {
              "\u77e5\u8bc6\u3001\u95ee\u7b54\u4e0e\u5de5\u5177\uff0c\u5e2e\u52a9\u4f60\u5728\u957f\u671f\u51b3\u7b56\u91cc\uff0c\u5c11\u4e00\u70b9\u60c5\u7eea\uff0c\u591a\u4e00\u70b9\u7406\u89e3\u3002"
            }
          </p>

          <Button
            size="lg"
            className="mt-12 h-16 min-w-[280px] rounded-[999px] bg-[#1D1B34] px-10 text-[17px] font-semibold text-white shadow-none hover:bg-[#17152A]"
            asChild
          >
            <AuthGateLink href="/chat">
              {"\u8fdb\u5165\u52a9\u624b"}
              <ArrowRight strokeWidth={2.2} />
            </AuthGateLink>
          </Button>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium text-[#6D7590]">
            <Link className="transition-colors hover:text-[#1D1B34]" href="/knowledge">
              {"\u6d4f\u89c8\u767e\u79d1"}
            </Link>
            <span className="text-[#D5D9E4]">/</span>
            <AuthGateLink
              className="transition-colors hover:text-[#1D1B34]"
              href="/tools/paper"
            >
              {"\u6a21\u62df\u76d8"}
            </AuthGateLink>
            <span className="text-[#D5D9E4]">/</span>
            <AuthGateLink
              className="transition-colors hover:text-[#1D1B34]"
              href="/tools/backtest"
            >
              {"\u5386\u53f2\u56de\u6d4b"}
            </AuthGateLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
