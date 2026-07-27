import type { PostDoc } from '@x/shared-types'

/**
 * Read a string field off a body node.
 *
 * `PostDoc['body']` is a union — legacy `PostBodyNode[]` (paragraph/heading) or
 * the editorial `Array<Record<string, unknown>>` — so `node.type === 'heading'`
 * does not discriminate it and `node.text` lands as `unknown`. Narrowing here
 * keeps that honest without asserting a shape the type does not guarantee.
 */
function nodeText(node: unknown, key: 'type' | 'text'): string {
  if (!node || typeof node !== 'object') return ''
  const v = (node as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}

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
          nodeText(node, 'type') === 'heading' ? (
            <h2 key={i} className="mt-8 text-xl font-bold sm:text-2xl">
              {nodeText(node, 'text')}
            </h2>
          ) : (
            <p key={i} className="leading-relaxed text-muted">
              {nodeText(node, 'text')}
            </p>
          ),
        )}
      </div>
    </article>
  )
}
