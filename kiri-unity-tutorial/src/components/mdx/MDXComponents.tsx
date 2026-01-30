import type { MDXComponents } from "mdx/types";
import { KiriTip } from "@/components/interactive/KiriTip";
import { StepByStep, Step } from "@/components/interactive/StepByStep";
import { DevicePreview } from "@/components/interactive/DevicePreview";
import { Callout } from "@/components/interactive/Callout";
import { Quiz } from "@/components/interactive/Quiz";
import { UnityInterface } from "@/components/interactive/UnityInterface";
import { InteractiveDemo } from "@/components/interactive/InteractiveDemo";
import { CodeBlockPlaceholder } from "@/components/mdx/CodeBlockPlaceholder";
import { default as MatchSlider } from "@/components/interactive/demos/MatchSlider";
import { default as CanvasScalerModes } from "@/components/interactive/demos/CanvasScalerModes";
import { default as AnchorsVisualizer } from "@/components/interactive/demos/AnchorsVisualizer";
import { default as Layout2048 } from "@/components/interactive/demos/Layout2048";
import { default as FullLayout2048 } from "@/components/interactive/demos/FullLayout2048";

const defaultWrappers: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
};

/**
 * MDX component map that avoids loading prism-react-renderer on the server
 * (CodeBlock is replaced by CodeBlockPlaceholder which dynamic-imports it on the client).
 * This prevents "A React Element from an older version of React" when using compileMDX.
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
  CodeBlock: CodeBlockPlaceholder,
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
