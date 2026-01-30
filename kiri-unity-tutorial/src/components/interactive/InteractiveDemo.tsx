"use client";

import { Suspense, lazy, Component, type ReactNode } from "react";
import { Play } from "lucide-react";

const DEMO_LAZY: Record<string, React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>> = {
  MatchSlider: lazy(() =>
    import("./demos/MatchSlider").catch((err) => {
      console.error("[InteractiveDemo] Failed to load MatchSlider:", err);
      throw err;
    })
  ),
  CanvasScalerModes: lazy(() =>
    import("./demos/CanvasScalerModes").catch((err) => {
      console.error("[InteractiveDemo] Failed to load CanvasScalerModes:", err);
      throw err;
    })
  ),
  AnchorsVisualizer: lazy(() =>
    import("./demos/AnchorsVisualizer").catch((err) => {
      console.error("[InteractiveDemo] Failed to load AnchorsVisualizer:", err);
      throw err;
    })
  ),
  Layout2048: lazy(() =>
    import("./demos/Layout2048").catch((err) => {
      console.error("[InteractiveDemo] Failed to load Layout2048:", err);
      throw err;
    })
  ),
  FullLayout2048: lazy(() =>
    import("./demos/FullLayout2048").catch((err) => {
      console.error("[InteractiveDemo] Failed to load FullLayout2048:", err);
      throw err;
    })
  ),
};

interface InteractiveDemoProps {
  component: string;
  props?: Record<string, unknown>;
  children?: ReactNode;
}

function LoadingSpinner() {
  return (
    <div className="flex min-h-[120px] items-center justify-center" aria-hidden>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600 dark:border-neutral-600 dark:border-t-blue-400" />
    </div>
  );
}

function DemoErrorFallback({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-center text-sm text-amber-800 dark:text-amber-200">
      {message}
    </div>
  );
}

class DemoErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    console.error("[InteractiveDemo] ErrorBoundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[InteractiveDemo] ErrorBoundary details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function DemoLoader({
  componentName,
  props = {},
}: {
  componentName: string;
  props: Record<string, unknown>;
}) {
  const LazyComponent = DEMO_LAZY[componentName];

  if (!LazyComponent) {
    return (
      <DemoErrorFallback
        message={`Демо «${componentName}» не найдено. Доступны: ${Object.keys(DEMO_LAZY).join(", ")}.`}
      />
    );
  }

  return <LazyComponent {...props} />;
}

export function InteractiveDemo({
  component,
  props: demoProps = {},
  children,
}: InteractiveDemoProps) {
  return (
    <div className="my-6 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/80 dark:bg-neutral-800/50 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/80 px-4 py-2.5">
        <Play className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Интерактивная демонстрация
        </span>
        <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">({component})</span>
      </div>
      <div className="p-4">
        <DemoErrorBoundary
          fallback={
            <DemoErrorFallback message="Не удалось загрузить демо. Проверьте консоль или попробуйте позже." />
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            {children ?? <DemoLoader componentName={component} props={demoProps} />}
          </Suspense>
        </DemoErrorBoundary>
      </div>
    </div>
  );
}
