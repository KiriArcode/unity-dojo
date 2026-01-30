import { getAllSlugs, getLessonBySlug } from "@/lib/lessons";
import { notFound } from "next/navigation";
import { serialize } from "next-mdx-remote/serialize";
import { LessonBody } from "./LessonBody";

const LOG = process.env.NODE_ENV === "development";

export async function generateStaticParams() {
  const slugs = getAllSlugs("ru");
  return slugs.map((slug) => ({ slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (LOG) console.log("[LessonPage] params", { slug });
  const lesson = getLessonBySlug("ru", slug);
  if (!lesson) {
    if (LOG) console.warn("[LessonPage] lesson not found, calling notFound()", slug);
    notFound();
  }
  const contentLength = lesson.content?.length ?? 0;
  if (LOG) {
    console.log("[LessonPage] rendering", {
      slug: lesson.slug,
      title: lesson.title,
      contentLength,
    });
  }
  if (contentLength === 0) {
    console.warn("[LessonPage] WARNING: lesson content is empty", lesson.slug);
  }

  let mdxSource;
  try {
    mdxSource = await serialize(lesson.content, {
      parseFrontmatter: false,
    });
    if (LOG) console.log("[LessonPage] serialize OK", lesson.slug);
  } catch (err) {
    console.error("[LessonPage] serialize error", lesson.slug, err);
    return (
      <article className="max-w-3xl mx-auto prose dark:prose-invert prose-lg">
        <h1>{lesson.title}</h1>
        {lesson.description && (
          <p className="lead text-neutral-600 dark:text-neutral-400">
            {lesson.description}
          </p>
        )}
        <div className="rounded-lg border border-red-500/50 bg-red-50 dark:bg-red-950/30 p-4">
          <p className="font-semibold text-red-700 dark:text-red-400">
            Ошибка подготовки контента (см. консоль сервера)
          </p>
          <pre className="mt-3 overflow-auto text-xs text-neutral-600 dark:text-neutral-400 max-h-96 whitespace-pre-wrap">
            {String(err)}
          </pre>
        </div>
      </article>
    );
  }

  return (
    <article className="max-w-3xl mx-auto prose dark:prose-invert prose-lg">
      <h1>{lesson.title}</h1>
      {lesson.description && (
        <p className="lead text-neutral-600 dark:text-neutral-400">
          {lesson.description}
        </p>
      )}
      <LessonBody source={mdxSource} />
    </article>
  );
}
