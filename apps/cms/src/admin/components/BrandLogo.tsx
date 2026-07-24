/**
 * graphics.Logo — logo XTECH đầy đủ, dùng ở màn login & branding admin.
 * Asset gốc (không vẽ lại, không đổi màu): /brand/xtech-logo-full.png
 */
export function BrandLogo() {
  return (
    <img
      src="/brand/xtech-logo-full.png"
      alt="XTECH"
      style={{ height: 40, width: 'auto', display: 'block' }}
    />
  )
}

export default BrandLogo
