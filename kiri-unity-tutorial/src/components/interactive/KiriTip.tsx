"use client";

import { motion } from "framer-motion";

export type KiriMood = "happy" | "thinking" | "warning" | "excited" | "confused";

const moodConfig: Record<
  KiriMood,
  { emoji: string; bg: string; border: string }
> = {
  happy: {
    emoji: "😊",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800/50",
  },
  thinking: {
    emoji: "🤔",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800/50",
  },
  warning: {
    emoji: "⚠️",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/50",
  },
  excited: {
    emoji: "🎉",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800/50",
  },
  confused: {
    emoji: "😅",
    bg: "bg-neutral-100 dark:bg-neutral-800/50",
    border: "border-neutral-200 dark:border-neutral-700",
  },
};

interface KiriTipProps {
  mood: KiriMood;
  children: React.ReactNode;
}

export function KiriTip({ mood, children }: KiriTipProps) {
  const { emoji, bg, border } = moodConfig[mood];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`my-6 flex flex-col sm:flex-row gap-4 rounded-xl border ${border} ${bg} p-4 shadow-md shadow-black/5 dark:shadow-black/20`}
    >
      <div
        className="flex shrink-0 items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/80 dark:bg-black/20 text-2xl sm:text-3xl ring-2 ring-white/50 dark:ring-black/20"
        aria-hidden
      >
        {emoji}
      </div>
      <div className="min-w-0 flex-1 text-neutral-700 dark:text-neutral-300 [&>p]:mb-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </motion.div>
  );
}
