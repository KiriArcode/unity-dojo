"use client";

import { useState } from "react";

const LANGUAGE_ICONS: Record<string, string> = {
  csharp: "C#",
  typescript: "TS",
  ts: "TS",
  json: "{}",
  bash: "$",
  shell: "$",
};

export interface CodeBlockProps {
  language?: string;
  title?: string;
  copyable?: boolean;
  children: React.ReactNode;
}

function normalizeLanguage(lang: string): string {
  const m = String(lang).toLowerCase();
  if (["csharp", "c#", "cs"].includes(m)) return "csharp";
  if (["typescript", "ts"].includes(m)) return "typescript";
  if (["json"].includes(m)) return "json";
  if (["bash", "shell", "sh"].includes(m)) return "bash";
  return m || "text";
}

export function CodeBlock(innerProps: CodeBlockProps) {
  const props = (innerProps != null && typeof innerProps === "object"
    ? innerProps
    : {}) as CodeBlockProps;
  const language = props.language ?? "csharp";
  const title = props.title;
  const copyable = props.copyable !== false;
  const children = props.children;

  const lang = normalizeLanguage(
    typeof language === "string" ? language : "csharp"
  );
  const code = (
    typeof children === "string"
      ? children
      : children != null
        ? String(children)
        : ""
  ).trim();
  const displayTitle = title ?? lang;
  const icon = LANGUAGE_ICONS[lang] ?? lang;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const lines = code ? code.split("\n") : [""];

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-neutral-600 dark:border-neutral-600 bg-[#1e1e1e] shadow-lg">
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-neutral-800/80 dark:bg-neutral-900 border-b border-neutral-700">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 w-6 h-6 rounded bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-300">
            {icon}
          </span>
          <span className="text-xs text-neutral-400 truncate">
            {displayTitle}
          </span>
        </div>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors"
            aria-label={copied ? "Скопировано" : "Копировать"}
          >
            {copied ? (
              <span className="text-green-400">Скопировано!</span>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-8 0H6"
                  />
                </svg>
                <span>Копировать</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <pre className="m-0 p-4 text-sm leading-relaxed overflow-x-auto text-neutral-100 font-mono">
          <code className="block min-w-max">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span
                  className="pr-4 text-right select-none text-neutral-500 w-8 flex-shrink-0"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="flex-1 min-w-0">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
