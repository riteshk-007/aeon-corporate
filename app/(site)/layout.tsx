import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { MenuLinksProvider } from "@/components/site/menu-links"
import { JsonLd } from "@/components/site/json-ld"
import { getMenu } from "@/lib/menu"
import { organizationLd, websiteLd } from "@/lib/seo"

/** Public website chrome: header, footer, scroll button and site-wide schema. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const menu = await getMenu()
  return (
    <MenuLinksProvider menu={menu}>
      <SiteHeader menu={menu} />
      {children}
      <SiteFooter menu={menu} />
      <ScrollToTop />
      <JsonLd data={[organizationLd, websiteLd]} />
    </MenuLinksProvider>
  )
}
