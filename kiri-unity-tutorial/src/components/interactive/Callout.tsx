"use client";

import type { ReactNode } from "react";

export type CalloutType = "info" | "warning" | "success" | "error" | "unity";

interface CalloutConfig {
  icon: string;
  barClass: string;
  bgClass: string;
  borderClass: string;
  titleClass: string;
  contentClass: string;
}

const CONFIG: Record<CalloutType, CalloutConfig> = {
  info: {
    icon: "ℹ️",
    barClass: "bg-blue-500",
    bgClass: "bg-blue-50 dark:bg-blue-950/20",
    borderClass: "border-blue-200 dark:border-blue-800/60",
    titleClass: "text-blue-900 dark:text-blue-100",
    contentClass: "text-blue-800/90 dark:text-blue-200/90",
  },
  warning: {
    icon: "⚠️",
    barClass: "bg-amber-500",
    bgClass: "bg-amber-50 dark:bg-amber-950/20",
    borderClass: "border-amber-200 dark:border-amber-800/60",
    titleClass: "text-amber-900 dark:text-amber-100",
    contentClass: "text-amber-800/90 dark:text-amber-200/90",
  },
  success: {
    icon: "✅",
    barClass: "bg-green-500",
    bgClass: "bg-green-50 dark:bg-green-950/20",
    borderClass: "border-green-200 dark:border-green-800/60",
    titleClass: "text-green-900 dark:text-green-100",
    contentClass: "text-green-800/90 dark:text-green-200/90",
  },
  error: {
    icon: "❌",
    barClass: "bg-red-500",
    bgClass: "bg-red-50 dark:bg-red-950/20",
    borderClass: "border-red-200 dark:border-red-800/60",
    titleClass: "text-red-900 dark:text-red-100",
    contentClass: "text-red-800/90 dark:text-red-200/90",
  },
  unity: {
    icon: "⚙️",
    barClass: "bg-neutral-600 dark:bg-neutral-500",
    bgClass: "bg-neutral-800 dark:bg-neutral-900",
    borderClass: "border-neutral-600 dark:border-neutral-700",
    titleClass: "text-neutral-200 font-mono text-sm",
    contentClass: "text-neutral-300 font-mono text-sm",
  },
};

export interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

export function Callout({ type, title, children }: CalloutProps) {
  const config = CONFIG[type];

  return (
    <div
      className={`
        my-4 rounded-lg border overflow-hidden
        ${config.bgClass} ${config.borderClass}
      `}
    >
      <div className="flex">
        <div className={`w-1 flex-shrink-0 ${config.barClass}`} aria-hidden />
        <div className="flex-1 min-w-0 py-3 px-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base leading-none shrink-0" aria-hidden>
              {config.icon}
            </span>
            {title && (
              <span className={`font-semibold ${config.titleClass}`}>
                {title}
              </span>
            )}
          </div>
          <div
            className={`
              ${config.contentClass}
              [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
              [&_pre]:font-mono [&_pre]:text-xs [&_pre]:my-2 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto
              [&_pre]:bg-black/20 dark:[&_pre]:bg-black/40
              [&>p]:mb-2 [&>p:last-child]:mb-0
            `}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
