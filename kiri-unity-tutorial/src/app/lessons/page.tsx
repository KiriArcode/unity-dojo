import Link from "next/link";
import { getLessons } from "@/lib/lessons";

export default function LessonsPage() {
  const lessons = getLessons("ru");
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Уроки</h1>
      <ul className="space-y-3">
        {lessons.map((lesson) => (
          <li key={lesson.slug}>
            <Link
              href={`/lessons/${lesson.slug}`}
              className="block p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <span className="font-medium">{lesson.title}</span>
              {lesson.description && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {lesson.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
