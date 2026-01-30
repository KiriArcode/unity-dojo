import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lesson, LessonMeta } from "@/types/lesson";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "lessons");

const LOG = process.env.NODE_ENV === "development";

function getContentDir(lang: string): string {
  return path.join(CONTENT_DIR, lang);
}

export function getLessons(lang: string): LessonMeta[] {
  const dir = getContentDir(lang);
  if (LOG) {
    console.log("[lessons] getLessons", { lang, dir, exists: fs.existsSync(dir) });
  }
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  if (LOG) console.log("[lessons] files found", files);
  const lessons: LessonMeta[] = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(raw);
    const slug = (data.slug as string) || path.basename(file, ".mdx");
    lessons.push({
      title: (data.title as string) || slug,
      slug,
      order: data.order,
      category: data.category,
      difficulty: data.difficulty,
      duration: data.duration,
      description: data.description,
      tags: data.tags,
    });
  }
  lessons.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  if (LOG) console.log("[lessons] getLessons result", lessons.map((l) => ({ slug: l.slug, title: l.title })));
  return lessons;
}

export function getLessonBySlug(lang: string, slug: string): Lesson | null {
  const dir = getContentDir(lang);
  if (LOG) console.log("[lessons] getLessonBySlug", { lang, slug, dir, exists: fs.existsSync(dir) });
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const fileSlug = (data.slug as string) || path.basename(file, ".mdx");
    const fileNameSlug = path.basename(file, ".mdx");
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
  const dir = getContentDir(lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const slugs = new Set<string>();
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data } = matter(raw);
    const fileSlug = (data.slug as string) || path.basename(file, ".mdx");
    const fileNameSlug = path.basename(file, ".mdx");
    slugs.add(fileSlug);
    slugs.add(fileNameSlug);
  }
  return Array.from(slugs);
}
