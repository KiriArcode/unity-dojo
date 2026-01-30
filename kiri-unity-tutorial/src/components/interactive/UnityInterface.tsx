"use client";

interface UnityInterfaceProps {
  component?: string;
  interactive?: boolean;
  highlightPath?: string[];
  children?: React.ReactNode;
}

export function UnityInterface({
  component,
  highlightPath,
  children,
}: UnityInterfaceProps) {
  return (
    <div className="my-6 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 p-4">
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
        [UnityInterface]
        {component && <span className="ml-2">component={component}</span>}
        {highlightPath?.length ? <span className="ml-2">→ {highlightPath.join(" → ")}</span> : null}
      </p>
      {children ?? (
        <div className="min-h-[80px] flex items-center justify-center text-neutral-500 text-sm">Placeholder</div>
      )}
    </div>
  );
}
