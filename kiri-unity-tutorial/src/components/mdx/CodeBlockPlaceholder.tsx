"use client";

import { useState, useEffect, type ReactNode } from "react";

interface CodeBlockPlaceholderProps {
  language?: string;
  title?: string;
  copyable?: boolean;
  children?: ReactNode;
}

/**
 * Renders a simple code block on the server; on the client dynamically imports
 * the real CodeBlock (with Prism) to avoid loading prism-react-renderer on the
 * server and prevent "different React version" errors when using compileMDX.
 */
export function CodeBlockPlaceholder(props: CodeBlockPlaceholderProps) {
  const language = props?.language ?? "text";
  const title = props?.title;
  const copyable = props?.copyable !== false;
  const children = props?.children;
  const [ClientCodeBlock, setClientCodeBlock] = useState<React.ComponentType<CodeBlockPlaceholderProps> | null>(null);

  useEffect(() => {
    import("@/components/interactive/CodeBlock").then((m) =>
      setClientCodeBlock(m.CodeBlock as React.ComponentType<CodeBlockPlaceholderProps>)
    );
  }, []);

  if (!ClientCodeBlock) {
    const code = typeof children === "string" ? children : (children ? String(children) : "");
    return (
      <div className="my-4 rounded-lg border border-neutral-600 bg-[#1e1e1e] overflow-hidden">
        {(title ?? language) && (
          <div className="px-3 py-2 bg-neutral-800 border-b border-neutral-700 text-xs text-neutral-400">
            {title ?? language}
          </div>
        )}
        <pre className="p-4 overflow-x-auto text-sm text-neutral-100 m-0">
          <code>{code.trim()}</code>
        </pre>
      </div>
    );
  }

  return (
    <ClientCodeBlock
      language={language ?? "csharp"}
      title={title}
      copyable={copyable}
    >
      {typeof children === "string" ? children : (children != null ? String(children) : "")}
    </ClientCodeBlock>
  );
}
