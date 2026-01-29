import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">
          Kiri Unity Tutorial
        </Link>
        <nav className="flex gap-6">
          <Link href="/lessons" className="hover:underline">
            Уроки
          </Link>
          <Link href="/resources" className="hover:underline">
            Источники
          </Link>
          <Link href="/feedback" className="hover:underline">
            Обратная связь
          </Link>
        </nav>
      </div>
    </header>
  );
}
