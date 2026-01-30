import type { MDXComponents } from "mdx/types";
import * as Interactive from "@/components/interactive";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...Interactive,
  };
}
