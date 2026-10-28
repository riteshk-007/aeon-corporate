import type { Metadata } from "next"

// The admin panel is private: keep it out of search results.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Aeon Admin" },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
