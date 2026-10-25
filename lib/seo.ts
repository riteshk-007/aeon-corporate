import type { Metadata } from "next"

export const SITE_NAME = "Aeon Corporate"
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aeoncorporate.com"
).replace(/\/$/, "")
export const SITE_DESCRIPTION =
  "Technology-enabled business registration, compliance, regulatory, tax, IP and environmental guidance for ambitious companies."

type PageMeta = {
  title: string
  description: string
  path: string
  /** Illustration used for social sharing (path inside /public) */
  image?: string
  keywords?: string[]
}

/** One place for per-page SEO: title, canonical, Open Graph and Twitter cards. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/illustrations/hero.jpg",
  keywords,
}: PageMeta): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      images: [{ url: image, width: 1400, height: 1032, alt: title }],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  }
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/aeon-logo.png`,
  description: SITE_DESCRIPTION,
  email: "hello@aeoncorporate.com",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@aeoncorporate.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
}

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
}

/** Pages that appear in sitemap.xml */
export const sitePages = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  {
    path: "/partner-with-us",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  { path: "/work-at-aeon", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/career", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/reviews", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/contact-us", priority: 0.8, changeFrequency: "monthly" as const },
]
