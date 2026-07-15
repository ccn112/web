import type { PostDoc } from '@x/shared-types'

/** Shared insights/article template. Renders the structured post body (paragraph/heading). */
export function PostArticle({ post }: { post: PostDoc }) {
  const body = Array.isArray(post.body) ? post.body : []
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-6 lg:px-8">
      {post.category ? (
        <p className="mb-3 font-mono text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {post.category}
        </p>
      ) : null}
      <h1 className="text-3xl font-extrabold text-balance sm:text-4xl">{post.title}</h1>
      {post.excerpt ? <p className="mt-4 text-lg text-muted">{post.excerpt}</p> : null}
      <div className="mt-10 space-y-5">
        {body.map((node, i) =>
          node.type === 'heading' ? (
            <h2 key={i} className="mt-8 text-xl font-bold sm:text-2xl">
              {node.text}
            </h2>
          ) : (
            <p key={i} className="leading-relaxed text-muted">
              {node.text}
            </p>
          ),
        )}
      </div>
    </article>
  )
}
