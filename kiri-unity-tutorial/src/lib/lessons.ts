import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { GrayMatterFile } from "gray-matter";
import type { Lesson, LessonMeta } from "@/types/lesson";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "lessons");

const LOG = process.env.NODE_ENV === "development";

function getContentDir(lang: string): string {
  return path.join(CONTENT_DIR, lang);
}

interface ParsedMDX {
  file: string;
  fileSlug: string;
  fileNameSlug: string;
  data: GrayMatterFile<string>["data"];
  content: string;
}

/** Read and parse all MDX files in a language directory. */
function readMDXFiles(lang: string): ParsedMDX[] {
  const dir = getContentDir(lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const fileSlug = (data.slug as string) || path.basename(file, ".mdx");
    const fileNameSlug = path.basename(file, ".mdx");
    return { file, fileSlug, fileNameSlug, data, content };
  });
}

export function getLessons(lang: string): LessonMeta[] {
  const dir = getContentDir(lang);
  if (LOG) {
    console.log("[lessons] getLessons", { lang, dir, exists: fs.existsSync(dir) });
  }
  const parsed = readMDXFiles(lang);
  if (LOG) console.log("[lessons] files found", parsed.map((p) => p.file));
  const lessons: LessonMeta[] = parsed.map(({ fileSlug, data }) => ({
    title: (data.title as string) || fileSlug,
    slug: fileSlug,
    order: data.order,
    category: data.category,
    difficulty: data.difficulty,
    duration: data.duration,
    description: data.description,
    tags: data.tags,
  }));
  lessons.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  if (LOG) console.log("[lessons] getLessons result", lessons.map((l) => ({ slug: l.slug, title: l.title })));
  return lessons;
}

export function getLessonBySlug(lang: string, slug: string): Lesson | null {
  const dir = getContentDir(lang);
  if (LOG) console.log("[lessons] getLessonBySlug", { lang, slug, dir, exists: fs.existsSync(dir) });
  const parsed = readMDXFiles(lang);
  for (const { file, fileSlug, fileNameSlug, data, content } of parsed) {
    if (LOG) console.log("[lessons] check file", { file, fileSlug, fileNameSlug, contentLength: content?.length ?? 0 });
    if (fileSlug === slug || fileNameSlug === slug) {
      if (LOG) {
        console.log("[lessons] lesson found", {
          slug: fileSlug,
          title: (data.title as string) || fileSlug,
          contentLength: content.length,
          contentPreview: content.slice(0, 300).replace(/\n/g, " "),
        });
      }
      return {
        title: (data.title as string) || fileSlug,
        slug: fileSlug,
        order: data.order,
        category: data.category,
        difficulty: data.difficulty,
        duration: data.duration,
        description: data.description,
        tags: data.tags,
        content,
      };
    }
  }
  if (LOG) console.log("[lessons] no lesson found for slug", slug);
  return null;
}

/** All slug values for static export: frontmatter slug + filename slug per file. */
export function getAllSlugs(lang: string): string[] {
  const parsed = readMDXFiles(lang);
  const slugs = new Set<string>();
  for (const { fileSlug, fileNameSlug } of parsed) {
    slugs.add(fileSlug);
    slugs.add(fileNameSlug);
  }
  return Array.from(slugs);
}
