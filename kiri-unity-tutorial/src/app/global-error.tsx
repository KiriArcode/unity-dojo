"use client";

import { BASE_PATH } from "@/lib/constants";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 p-6">
        <div className="max-w-lg w-full rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-6">
          <h1 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Ошибка приложения
          </h1>
          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
            На сервере произошла ошибка. Проверьте терминал, где запущен <code className="bg-red-100 dark:bg-red-900/50 px-1 rounded">npm run dev</code> — там должно быть полное сообщение об ошибке.
          </p>
          {error.message && (
            <pre className="text-xs bg-red-100 dark:bg-red-900/50 p-3 rounded overflow-auto mb-4 max-h-32">
              {error.message}
            </pre>
          )}
          {error.digest && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              Digest: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
            Попробовать снова
          </button>
        </div>
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400 text-center">
          Откройте приложение по адресу{" "}
          <a href={`${BASE_PATH}/`} className="underline">{BASE_PATH}/</a>
        </p>
      </body>
    </html>
  );
}
