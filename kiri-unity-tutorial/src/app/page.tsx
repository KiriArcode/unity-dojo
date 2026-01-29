import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Kiri Unity Tutorial</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
        Интерактивный учебник по Unity для 2D мобильных игр от Game Designer Kiri.
      </p>
      <nav className="flex flex-col gap-4">
        <Link
          href="/lessons"
          className="text-lg text-blue-600 dark:text-blue-400 hover:underline"
        >
          Уроки →
        </Link>
        <Link
          href="/resources"
          className="text-lg text-blue-600 dark:text-blue-400 hover:underline"
        >
          Источники →
        </Link>
        <Link
          href="/feedback"
          className="text-lg text-blue-600 dark:text-blue-400 hover:underline"
        >
          Обратная связь →
        </Link>
      </nav>
    </div>
  );
}
