"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface QuizProps {
  questions: QuizQuestion[];
  /** Optional ID for localStorage key (e.g. lesson slug). If not set, derived from questions. */
  quizId?: string;
}

const STORAGE_KEY_PREFIX = "quiz-progress-";

function getStorageKey(questions: QuizQuestion[], quizId?: string): string {
  if (quizId) return `${STORAGE_KEY_PREFIX}${quizId}`;
  const fingerprint = `${questions.length}-${questions[0]?.question?.slice(0, 30) ?? ""}`;
  return `${STORAGE_KEY_PREFIX}${fingerprint}`;
}

interface SavedProgress {
  currentIndex: number;
  results: boolean[];
}

function loadProgress(key: string): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedProgress;
    if (!Array.isArray(data.results) || typeof data.currentIndex !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

function saveProgress(key: string, currentIndex: number, results: boolean[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ currentIndex, results }));
  } catch {
    // ignore
  }
}

function Confetti({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1500);
    return () => clearTimeout(t);
  }, [onComplete]);

  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    color: ["#22c55e", "#eab308", "#3b82f6", "#ef4444", "#a855f7"][i % 5],
    delay: Math.random() * 0.2,
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 6,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            left: "50%",
            top: "50%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x + (Math.random() - 0.5) * 300,
            y: 200 + Math.random() * 200,
            opacity: 0,
            rotate: p.rotation + 360,
          }}
          transition={{
            duration: 1.2,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function Quiz({ questions, quizId }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  const storageKey = getStorageKey(questions, quizId);

  useEffect(() => {
    const saved = loadProgress(storageKey);
    if (saved && saved.results.length <= questions.length && Array.isArray(saved.results)) {
      setResults(saved.results);
      setCurrentIndex(saved.results.length);
    }
    setIsRestoring(false);
  }, [storageKey, questions.length]);

  useEffect(() => {
    if (isRestoring) return;
    saveProgress(storageKey, currentIndex, results);
  }, [storageKey, currentIndex, results, isRestoring]);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOptionIndex !== null;
  const isCorrect = currentQuestion && selectedOptionIndex !== null && currentQuestion.options[selectedOptionIndex]?.correct;
  const correctIndex = currentQuestion?.options.findIndex((o) => o.correct) ?? -1;

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion || isAnswered) return;
      const correct = currentQuestion.options[optionIndex]?.correct ?? false;
      setSelectedOptionIndex(optionIndex);
      setResults((prev) => [...prev, correct]);
      if (correct) setShowConfetti(true);
    },
    [currentQuestion, isAnswered]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionIndex(null);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setResults([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  if (!questions.length) {
    return (
      <div className="my-6 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 text-center text-sm text-neutral-500">
        Нет вопросов для квиза.
      </div>
    );
  }

  const isFinished = currentIndex >= questions.length;
  const correctCount = results.filter(Boolean).length;
  const totalAnswered = results.length;

  if (isRestoring) {
    return (
      <div className="my-6 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-8 flex items-center justify-center min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600 dark:border-t-blue-400" />
      </div>
    );
  }

  if (isFinished && totalAnswered >= questions.length) {
    return (
      <motion.div
        className="my-6 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 text-center space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">Результат</h3>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {correctCount} из {questions.length} правильных
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {correctCount === questions.length ? "Отлично!" : correctCount >= questions.length / 2 ? "Хорошо!" : "Попробуйте пройти квиз ещё раз."}
          </p>
          <motion.button
            type="button"
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Пройти заново
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {showConfetti && (
        <Confetti onComplete={() => setShowConfetti(false)} />
      )}

      <motion.div
        className="my-6 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 overflow-hidden shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Progress bar */}
        <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700">
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="px-4 py-2 text-xs text-neutral-500 dark:text-neutral-400">
          Вопрос {currentIndex + 1} из {questions.length}
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 leading-snug">
            {currentQuestion?.question}
          </h3>

          <div className="grid gap-3 sm:grid-cols-1">
            <AnimatePresence mode="wait">
              {currentQuestion?.options.map((option, optionIndex) => {
                const selected = selectedOptionIndex === optionIndex;
                const showAsCorrect = option.correct && (isAnswered && (selected || correctIndex === optionIndex));
                const showAsWrong = selected && !option.correct && isAnswered;

                return (
                  <motion.button
                    key={optionIndex}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(optionIndex)}
                    className={`
                      text-left p-4 rounded-xl border-2 transition-colors
                      ${!isAnswered ? "hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 cursor-pointer" : "cursor-default"}
                      ${!isAnswered ? "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" : ""}
                      ${showAsCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500" : ""}
                      ${showAsWrong ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500" : ""}
                      ${isAnswered && !selected && option.correct ? "border-green-400 dark:border-green-600 bg-green-50/80 dark:bg-green-900/10" : ""}
                    `}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: optionIndex * 0.05 }}
                    whileHover={!isAnswered ? { scale: 1.01 } : undefined}
                    whileTap={!isAnswered ? { scale: 0.99 } : undefined}
                  >
                    <span className={`text-sm font-medium ${showAsCorrect ? "text-green-800 dark:text-green-200" : showAsWrong ? "text-red-800 dark:text-red-200" : "text-neutral-700 dark:text-neutral-300"}`}>
                      {option.text}
                    </span>
                    {showAsCorrect && (
                      <span className="ml-2 text-green-600 dark:text-green-400 text-xs">✓</span>
                    )}
                    {showAsWrong && (
                      <span className="ml-2 text-red-600 dark:text-red-400 text-xs">✗</span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isAnswered && currentQuestion?.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 p-4"
              >
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                  Объяснение
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <motion.button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentIndex < questions.length - 1 ? "Следующий вопрос" : "К результатам"}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
