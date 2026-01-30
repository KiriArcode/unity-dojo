"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { defaultMDXComponents } from "@/components/mdx/MDXComponents";

interface LessonBodyProps {
  source: MDXRemoteSerializeResult;
}

export function LessonBody({ source }: LessonBodyProps) {
  return <MDXRemote {...source} components={defaultMDXComponents} />;
}
