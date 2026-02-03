import createMDX from '@next/mdx';
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/unity-dojo',
  assetPrefix: '/unity-dojo',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  turbopack: {},
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
