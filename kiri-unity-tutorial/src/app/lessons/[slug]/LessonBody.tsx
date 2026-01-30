"use client";

import { useState, useEffect } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { defaultMDXComponents } from "@/components/mdx/MDXComponents";

interface LessonBodyProps {
  source: MDXRemoteSerializeResult;
}

/**
 * Renders MDX only after mount so prerender/SSR does not run MDX components
 * (avoids "useState of null" / multiple React instances during static export).
 */
export function LessonBody({ source }: LessonBodyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("[LessonBody] Mounted, rendering MDX");
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        Загрузка урока…
      </div>
    );
  }

  try {
    return <MDXRemote {...source} components={defaultMDXComponents} />;
  } catch (error) {
    console.error("[LessonBody] Error rendering MDX:", error);
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
        <p className="text-red-700 dark:text-red-400 font-semibold">Ошибка рендеринга урока</p>
        <pre className="mt-2 text-xs text-red-600 dark:text-red-300 overflow-auto">
          {String(error)}
        </pre>
      </div>
    );
  }
}
