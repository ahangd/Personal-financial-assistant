import path from "path";
import fs from "fs";
import { getChapterRange } from "@/data/course";

const SOURCE_FILENAME = "投资第一课.md";

function cutAtIdeasSection(raw: string): string {
  // 在去 HTML 之前先截断，避免“想法/评论区”以各种标签形态漏出
  const markers = [
    /<span[^>]+id="[^"]*_opinions"[^>]*>/i,
    /\n##\s*想法\s*\n/i,
    />\s*想法\s*</i,
  ];
  for (const re of markers) {
    const m = re.exec(raw);
    if (m && typeof m.index === "number" && m.index > 0) {
      return raw.slice(0, m.index);
    }
  }
  return raw;
}

/** 去掉 HTML 标签，保留文本与 markdown */
function stripHtml(html: string): string {
  const withoutIdeas = cutAtIdeasSection(html)
    // 兜底：如果仍残留“想法/发布想法/下载 App 查看全部想法”之类的字样，进一步删除
    .replace(/发布想法[\s\S]*?(下载\s*App\s*查看全部想法|查看全部想法)/g, "");

  return withoutIdeas
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

let cachedLines: string[] | null = null;

function getSourceLines(): string[] {
  if (cachedLines) return cachedLines;
  const filePath = path.join(process.cwd(), SOURCE_FILENAME);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedLines = raw.split(/\r?\n/);
  return cachedLines;
}

/**
 * 获取某一章的正文（仅服务端可用，用于 /course/[slug] 页面）
 */
export function getChapterContent(slug: string): string | null {
  const range = getChapterRange(slug);
  if (!range) return null;
  const lines = getSourceLines();
  if (lines.length === 0) return null;
  const start = Math.max(0, range.start - 1);
  const end = Math.min(lines.length, range.end);
  const slice = lines.slice(start, end).join("\n");
  return stripHtml(slice);
}
