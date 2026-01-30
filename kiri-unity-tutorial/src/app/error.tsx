"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto my-12 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6">
      <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
        Что-то пошло не так
      </h2>
      <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
        {error.message || "Произошла ошибка при загрузке страницы."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium"
      >
        Попробовать снова
      </button>
    </div>
  );
}
