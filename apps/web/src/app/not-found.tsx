import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="theme-dark flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <p className="font-mono text-sm tracking-[0.2em] text-accent uppercase">404</p>
      <h1 className="mt-3 text-3xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-3 text-muted">Trang bạn tìm không tồn tại hoặc chưa được xuất bản.</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  )
}
