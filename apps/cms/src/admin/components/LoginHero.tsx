/**
 * beforeLogin — khối thương hiệu phía trên form đăng nhập.
 * Tiêu đề + mô tả theo IMPLEMENTATION_GUIDE.md (mục 4). Nền/glow ở brand.css
 * (body:has(.x-login-hero)). Logo dùng asset gốc.
 */
export function LoginHero() {
  return (
    <div className="x-login-hero">
      <img className="x-login-hero__logo" src="/brand/xtech-logo-full.png" alt="XTECH" />
      <h1 className="x-login-hero__title">Đăng nhập quản trị XTECH</h1>
      <p className="x-login-hero__desc">
        Quản trị nội dung, dữ liệu và hệ sinh thái số trên một giao diện thống nhất.
      </p>
    </div>
  )
}

export default LoginHero
