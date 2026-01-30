import type { MDXComponents } from "mdx/types";
import { KiriTip } from "@/components/interactive/KiriTip";
import { StepByStep, Step } from "@/components/interactive/StepByStep";
import { DevicePreview } from "@/components/interactive/DevicePreview";
import { Callout } from "@/components/interactive/Callout";
import { Quiz } from "@/components/interactive/Quiz";
import { UnityInterface } from "@/components/interactive/UnityInterface";
import { InteractiveDemo } from "@/components/interactive/InteractiveDemo";
import { CodeBlock } from "@/components/interactive/CodeBlock";
import { default as MatchSlider } from "@/components/interactive/demos/MatchSlider";
import { default as CanvasScalerModes } from "@/components/interactive/demos/CanvasScalerModes";
import { default as AnchorsVisualizer } from "@/components/interactive/demos/AnchorsVisualizer";
import { default as Layout2048 } from "@/components/interactive/demos/Layout2048";
import { default as FullLayout2048 } from "@/components/interactive/demos/FullLayout2048";

const defaultWrappers: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-10 mb-6 text-neutral-900 dark:text-neutral-100">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-8 mb-4 text-neutral-900 dark:text-neutral-100">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-6 mb-3 text-neutral-800 dark:text-neutral-200">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold mt-5 mb-2 text-neutral-800 dark:text-neutral-200">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base font-semibold mt-4 mb-2 text-neutral-700 dark:text-neutral-300">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-semibold mt-3 mb-2 text-neutral-700 dark:text-neutral-300">{children}</h6>
  ),
  p: ({ children }) => <p className="mb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-neutral-700 dark:text-neutral-300">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-neutral-700 dark:text-neutral-300">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 my-4 italic text-neutral-600 dark:text-neutral-400">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ""}
      className="my-6 rounded-lg border border-neutral-200 dark:border-neutral-700 max-w-full h-auto"
    />
  ),
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm font-mono text-neutral-800 dark:text-neutral-200">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-neutral-200 dark:border-neutral-700" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full border-collapse border border-neutral-300 dark:border-neutral-600">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-100 dark:bg-neutral-800">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="bg-white dark:bg-neutral-900">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-neutral-200 dark:border-neutral-700">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-600">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600">
      {children}
    </td>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-neutral-800 dark:text-neutral-200">{children}</em>
  ),
};

/**
 * MDX component map. CodeBlock is used directly (no Prism) to avoid .language null errors.
 */
const interactiveComponents: MDXComponents = {
  KiriTip,
  StepByStep,
  Step,
  DevicePreview,
  Callout,
  Quiz,
  UnityInterface,
  InteractiveDemo,
  CodeBlock,
  MatchSlider,
  CanvasScalerModes,
  AnchorsVisualizer,
  Layout2048,
  FullLayout2048,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultWrappers,
    ...interactiveComponents,
    ...components,
  };
}

export const defaultMDXComponents: MDXComponents = {
  ...defaultWrappers,
  ...interactiveComponents,
};
