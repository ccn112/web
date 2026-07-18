import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://x.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "XTECH — Công nghệ cho toàn bộ vòng đời bất động sản",
    template: "%s · XTECH",
  },
  description:
    "XTECH — nền tảng công nghệ cho toàn bộ vòng đời bất động sản: XBooking, FinERP, XBuilding, X.AI, X.Space.",
  openGraph: {
    title: "XTECH — Công nghệ cho toàn bộ vòng đời bất động sản",
    description:
      "Nền tảng công nghệ cho toàn bộ vòng đời bất động sản: XBooking, FinERP, XBuilding, X.AI, X.Space.",
    url: SITE_URL,
    siteName: "XTECH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XTECH — Công nghệ cho toàn bộ vòng đời bất động sản",
    description:
      "Nền tảng công nghệ cho toàn bộ vòng đời bất động sản.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          // Site-wide Organization + WebSite structured data.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "XTECH",
                url: SITE_URL,
                description:
                  "Nền tảng công nghệ cho toàn bộ vòng đời bất động sản: XBooking, FinERP, XBuilding, X.AI, X.Space.",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "XTECH",
                url: SITE_URL,
                inLanguage: "vi",
              },
            ]),
          }}
        />
        {children}
      </body>
    </html>
  );
}
