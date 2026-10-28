import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Simplify the Complex`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: `${SITE_NAME} — Simplify the Complex`,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/illustrations/hero.jpg",
        width: 1400,
        height: 1032,
        alt: `${SITE_NAME} — business registration and compliance`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Simplify the Complex`,
    description: SITE_DESCRIPTION,
    images: ["/illustrations/hero.jpg"],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1b5fd9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth motion-reduce:scroll-auto ${jakarta.variable}`}
    >
      <body className="bg-white font-sans text-ink antialiased selection:bg-sun selection:text-ink">
        {children}
      </body>
    </html>
  )
}
