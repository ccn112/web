/* XTECH wordmark — white on dark surfaces, color on light. Original assets only. */
export function Logo({ mode }: { mode: "dark" | "light" }) {
  const src =
    mode === "dark"
      ? "/brand/xtech-logo-white-original.png"
      : "/brand/xtech-logo-color-original.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="XTECH" className="h-7 w-auto" />
  );
}
