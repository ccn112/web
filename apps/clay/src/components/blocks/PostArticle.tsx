import type { PostDoc } from "@x/shared-types";
import { Container } from "@/components/primitives";

export function PostArticle({ post }: { post: PostDoc }) {
  return (
    <article className="pt-32 pb-24 md:pt-40">
      <Container>
        <div className="mx-auto max-w-3xl">
          {post.category ? (
            <p className="text-sm font-medium text-cyan">{post.category}</p>
          ) : null}
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          ) : null}
          <div className="mt-10 flex flex-col gap-5">
            {(post.body as Array<{ type?: string; text?: string }> | undefined)?.map((node, i) =>
              node.type === "heading" ? (
                <h2 key={i} className="text-2xl font-semibold tracking-tight">
                  {node.text}
                </h2>
              ) : (
                <p key={i} className="text-base leading-relaxed text-muted-foreground">
                  {node.text}
                </p>
              ),
            )}
          </div>

          {post.tags && post.tags.length > 0 ? (
            <div className="mt-12 border-t border-border pt-6">
              <p className="text-sm font-medium text-muted-foreground">Chủ đề liên quan</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/insights/tag/${encodeURIComponent(tag)}`}
                    className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-cyan hover:text-cyan"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
