import { createMarkdownRenderer } from "fumadocs-core/content/md";
import { rehypeCode } from "fumadocs-core/mdx-plugins/rehype-code";
import { remarkGfm } from "fumadocs-core/mdx-plugins/remark-gfm";
import { cacheLife } from "next/cache";
import rehypeSlug from "rehype-slug";

/**
 * Markdown, not MDX: README prose mentions `<img>` outside code spans, which an
 * MDX compiler reads as JSX and rejects.
 *
 * `rehype-slug` (not Fumadocs' heading plugin) because it slugs with
 * `github-slugger` — the same slugger the anchor index was built from. Any
 * other and the rewritten `#fragment` links point at ids that do not exist.
 */
const { MarkdownServer } = createMarkdownRenderer({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, rehypeCode],
});

/**
 * A Cache Component because Shiki reads the clock, which `cacheComponents`
 * forbids outside a cache scope. Sound here: the input is a pinned release tag.
 */
export const MarkdownBody = async ({ children }: { children: string }) => {
  "use cache";
  cacheLife("max");
  return <MarkdownServer>{children}</MarkdownServer>;
};
