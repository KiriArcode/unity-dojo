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
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        Загрузка урока…
      </div>
    );
  }

  return <MDXRemote {...source} components={defaultMDXComponents} />;
}
