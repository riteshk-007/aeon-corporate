import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Aeon Corporate — Simplify the Complex",
  description:
    "Technology-enabled business registration, compliance, regulatory, tax, IP, and environmental guidance for ambitious companies.",
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
        <ScrollToTop />
      </body>
    </html>
  )
}
