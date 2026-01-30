"use client";

import { createContext, useContext, useCallback, useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const STORAGE_PREFIX = "kiri-lesson-";

type StepByStepContextValue = {
  storageKey: string | null;
  completedSteps: number[];
  toggleStep: (number: number) => void;
};

const StepByStepContext = createContext<StepByStepContextValue | null>(null);

function useStepByStep() {
  const ctx = useContext(StepByStepContext);
  return ctx;
}

// basePath для статики (совпадает с next.config.mjs)
const basePath = "/unity-dojo";

interface StepByStepProps {
  title: string;
  children: React.ReactNode;
  storageKey?: string;
}

export function StepByStep({ title, children, storageKey }: StepByStepProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as number[];
        if (Array.isArray(parsed)) setCompletedSteps(parsed);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const toggleStep = useCallback(
    (number: number) => {
      if (!storageKey) return;
      setCompletedSteps((prev) => {
        const next = prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number].sort((a, b) => a - b);
        try {
          localStorage.setItem(STORAGE_PREFIX + storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [storageKey]
  );

  const value: StepByStepContextValue = {
    storageKey: storageKey ?? null,
    completedSteps,
    toggleStep,
  };

  return (
    <StepByStepContext.Provider value={value}>
      <div className="my-8 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-900/50">
        <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </div>
        <ol className="list-none border-l-2 border-neutral-200 dark:border-neutral-600 pl-12 m-0 min-h-[2rem]">
          {children}
        </ol>
      </div>
    </StepByStepContext.Provider>
  );
}

interface StepProps {
  number: number;
  children: React.ReactNode;
  screenshot?: string;
  video?: string;
  completed?: boolean;
}

export function Step({ number, children, screenshot, video, completed: completedProp }: StepProps) {
  const ctx = useStepByStep();
  const completed = ctx ? ctx.completedSteps.includes(number) : completedProp ?? false;
  const toggle = ctx?.toggleStep;
  const [expanded, setExpanded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && overlayRef.current) overlayRef.current.focus();
  }, [expanded]);

  const screenshotSrc = screenshot?.startsWith("/") ? `${basePath}${screenshot}` : screenshot;

  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px -40px 0px" });

  return (
    <>
      <motion.li
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative flex gap-4 -ml-[calc(3rem+1px)] pr-4 py-4 group hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors"
      >
        {/* Круг с номером накладывается на вертикальную линию ol */}
        <button
          type="button"
          onClick={() => toggle?.(number)}
          className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
            completed
              ? "bg-emerald-500 text-white ring-2 ring-emerald-200 dark:ring-emerald-800"
              : "bg-blue-600 text-white ring-2 ring-blue-200 dark:ring-blue-900 group-hover:ring-blue-300 dark:group-hover:ring-blue-700"
          } ${toggle ? "cursor-pointer" : "cursor-default"}`}
          aria-pressed={completed}
          aria-label={completed ? `Шаг ${number} выполнен` : `Шаг ${number}`}
          title={toggle ? (completed ? "Отметить как не выполненный" : "Отметить как выполненный") : undefined}
        >
          {completed ? (
            <span aria-hidden>✓</span>
          ) : (
            <span aria-hidden>{number}</span>
          )}
        </button>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="[&>p]:mb-0 [&>p:last-child]:mb-0 text-neutral-700 dark:text-neutral-300">{children}</div>

          {screenshotSrc && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="block relative aspect-video max-w-md rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshotSrc}
                  alt=""
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors text-white text-sm font-medium opacity-0 hover:opacity-100">
                  Увеличить
                </span>
              </button>
            </div>
          )}

          {video && (
            <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Видео: {video}
            </div>
          )}
        </div>
      </motion.li>

      {/* Оверлей для увеличенного скриншота */}
      {expanded && screenshotSrc && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 outline-none"
          onClick={() => setExpanded(false)}
          onKeyDown={(e) => e.key === "Escape" && setExpanded(false)}
          role="button"
          tabIndex={-1}
          aria-label="Закрыть (Escape)"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshotSrc}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
