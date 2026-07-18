import type { PostDoc } from "@x/shared-types";
import { Container } from "@/components/primitives";

/** Insights listing filtered by a tag (/insights/tag/<tag>). Site-scoped. */
export function PostList({ tag, posts }: { tag: string; posts: PostDoc[] }) {
  return (
    <section className="pt-32 pb-24 md:pt-40">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-cyan">Chủ đề</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {tag}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {posts.length} bài viết
          </p>

          {posts.length === 0 ? (
            <p className="mt-10 text-muted-foreground">
              Chưa có bài viết cho chủ đề này.
            </p>
          ) : (
            <ul className="mt-10 flex flex-col divide-y divide-border">
              {posts.map((p) => (
                <li key={p.id} className="py-6 first:pt-0">
                  <a href={`/insights/${p.slug}`} className="group block">
                    {p.category ? (
                      <p className="text-sm font-medium text-cyan">{p.category}</p>
                    ) : null}
                    <h2 className="mt-1 text-xl font-semibold tracking-tight transition-colors group-hover:text-cyan">
                      {p.title}
                    </h2>
                    {p.excerpt ? (
                      <p className="mt-2 leading-relaxed text-muted-foreground">
                        {p.excerpt}
                      </p>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
