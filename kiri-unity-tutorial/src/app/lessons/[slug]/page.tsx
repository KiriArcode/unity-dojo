import { getLessons, getLessonBySlug } from "@/lib/lessons";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { defaultMDXComponents } from "@/components/mdx/MDXComponents";

export async function generateStaticParams() {
  const lessons = getLessons("ru");
  return lessons.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug("ru", slug);
  if (!lesson) notFound();

  return (
    <article className="max-w-3xl mx-auto prose dark:prose-invert prose-lg">
      <h1>{lesson.title}</h1>
      {lesson.description && (
        <p className="lead text-neutral-600 dark:text-neutral-400">
          {lesson.description}
        </p>
      )}
      <MDXRemote source={lesson.content} components={defaultMDXComponents} />
    </article>
  );
}
