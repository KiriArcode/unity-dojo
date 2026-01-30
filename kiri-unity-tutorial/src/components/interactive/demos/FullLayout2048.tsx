"use client";

import Layout2048 from "./Layout2048";

interface FullLayout2048Props {
  interactive?: boolean;
  showInspector?: boolean;
  showHierarchy?: boolean;
  highlightOnHover?: boolean;
  [key: string]: unknown;
}

/**
 * Полный макет UI 2048: Hierarchy, Visual Preview и Inspector в одном экране.
 * Обёртка над Layout2048 с layout="full".
 */
export default function FullLayout2048({
  interactive = true,
  showInspector = true,
  showHierarchy = true,
  highlightOnHover = true,
  ...rest
}: FullLayout2048Props) {
  return (
    <Layout2048
      layout="full"
      interactive={interactive}
      showInspector={showInspector}
      showHierarchy={showHierarchy}
      highlightOnHover={highlightOnHover}
      {...rest}
    />
  );
}
