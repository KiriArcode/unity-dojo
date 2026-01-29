export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Источники</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Полезные ссылки, документация и материалы по Unity и гейм-дизайну.
      </p>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Официальная документация</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <a
              href="https://docs.unity3d.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Unity Documentation
            </a>
          </li>
          <li>
            <a
              href="https://learn.unity.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Unity Learn
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
