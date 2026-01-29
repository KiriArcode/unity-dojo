import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lesson, LessonMeta } from "@/types/lesson";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "lessons");

function getContentDir(lang: string): string {
  return path.join(CONTENT_DIR, lang);
}

export function getLessons(lang: string): LessonMeta[] {
  const dir = getContentDir(lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
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
  return lessons;
}

export function getLessonBySlug(lang: string, slug: string): Lesson | null {
  const dir = getContentDir(lang);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const fileSlug = (data.slug as string) || path.basename(file, ".mdx");
    if (fileSlug === slug) {
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
  return null;
}
