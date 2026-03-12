/** 投资第一课章节（与 投资第一课.md 中的标题对应） */
export interface CourseChapter {
  slug: string;
  title: string;
  order: number;
}

/** 章节在源文件中的行范围 [start, end)，1-based，end 为下一章起始行 */
const CHAPTER_RANGES: { slug: string; start: number; end: number }[] = [
  { slug: "intro", start: 1, end: 632 },
  { slug: "01", start: 632, end: 1286 },
  { slug: "02", start: 1286, end: 1928 },
  { slug: "03", start: 1928, end: 2553 },
  { slug: "04", start: 2553, end: 3211 },
  { slug: "05", start: 3211, end: 3864 },
  { slug: "06", start: 3864, end: 4540 },
  { slug: "07", start: 4540, end: 5224 },
  { slug: "08", start: 5224, end: 5831 },
  { slug: "09", start: 5831, end: 6443 },
  { slug: "10", start: 6443, end: 7038 },
  { slug: "11", start: 7038, end: 7727 },
  { slug: "12", start: 7727, end: 8374 },
  { slug: "13", start: 8374, end: 9078 },
  { slug: "14", start: 9078, end: 9727 },
  { slug: "15", start: 9727, end: 10431 },
  { slug: "16", start: 10431, end: 11189 },
  { slug: "17", start: 11189, end: 12000 },
];

export const COURSE_CHAPTERS: CourseChapter[] = [
  { slug: "intro", title: "导读 | 这一回，从门外汉到 80 分投资者", order: 0 },
  { slug: "01", title: "01 | 钱是从哪儿来的？", order: 1 },
  { slug: "02", title: "02 | 哪种投资方式的回报最高？", order: 2 },
  { slug: "03", title: "03 | 为什么股市中多数人都赚不到钱？", order: 3 },
  { slug: "04", title: "04 | 股票的预期收益率应该是多少？", order: 4 },
  { slug: "05", title: "05 | 为什么市场会有周期？", order: 5 },
  { slug: "06", title: "06 | 股票的风险真的很大吗？", order: 6 },
  { slug: "07", title: "07 | 投资多久才算长期？", order: 7 },
  { slug: "08", title: "08 | 投资应该集中还是分散？", order: 8 },
  { slug: "09", title: "09 | 好公司等于好股票吗？", order: 9 },
  { slug: "10", title: "10 | 可以把股票当筹码吗？", order: 10 },
  { slug: "11", title: "11 | 为什么听了这么多道理，却依然做不好投资？", order: 11 },
  { slug: "12", title: "12 | 怎样做好资产配置？", order: 12 },
  { slug: "13", title: "13 | 怎样为自己制定一份长期资产配置方案？", order: 13 },
  { slug: "14", title: "14 | 如何选择好资产？", order: 14 },
  { slug: "15", title: "15 | 怎样买到好价格？", order: 15 },
  { slug: "16", title: "16 | 我们为什么需要一套投资系统？", order: 16 },
  { slug: "17", title: "17 | 投资成功，是我们变成一个更好的人之后自然的结果", order: 17 },
];

export function getChapterBySlug(slug: string): CourseChapter | undefined {
  return COURSE_CHAPTERS.find((c) => c.slug === slug);
}

export function getAllChapters(): CourseChapter[] {
  return [...COURSE_CHAPTERS];
}

export function getChapterRange(slug: string): { start: number; end: number } | undefined {
  return CHAPTER_RANGES.find((r) => r.slug === slug);
}
