import type { Media } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import { getPayload } from "payload"
import AboutSection from "@/components/shared/about-section"
import FuturedStores from "@/components/shared/futured-stores"
import Hero from "@/components/shared/hero"
import StoreSearchFilter from "@/components/shared/store-search-filter"

const MIN_FEATURED = 6

export default async function Home() {
  const payload = await getPayload({ config })

  const [featuredResult, categories] = await Promise.all([
    payload.find({
      collection: "stores",
      depth: 1,
      limit: 100,
      pagination: false,
      select: { name: true, slug: true, logo: true },
      where: { isFutured: { equals: true } }
    }),
    payload.find({
      collection: "categories",
      depth: 1,
      limit: 100,
      pagination: false,
      sort: "createdAt",
      select: {
        name: true,
        icon: true,
        sub_categories: { name: true, icon: true }
      }
    })
  ])

  // Pad to at least MIN_FEATURED if needed
  let featuredDocs = featuredResult.docs
  if (featuredDocs.length < MIN_FEATURED) {
    const extra = await payload.find({
      collection: "stores",
      depth: 1,
      limit: MIN_FEATURED - featuredDocs.length,
      pagination: false,
      select: { name: true, slug: true, logo: true },
      where: { isFutured: { not_equals: true } }
    })
    featuredDocs = [...featuredDocs, ...extra.docs]
  }

  const featuredStores = featuredDocs.map((store) => ({
    id: store.id,
    name: store.name,
    href: `/stores/${store.slug}`,
    logoUrl:
      typeof store.logo === "object" && store.logo
        ? ((store.logo as Media).url ?? null)
        : null
  }))

  return (
    <div>
      <Hero />

      {/* Featured stores carousel */}
      <FuturedStores stores={featuredStores} />

      {/* Browse sections */}
      <div className="wrapper py-20">
        {/* Centered image + heading — same position as original */}
        <div className="mb-12 text-center">
          <Image
            src="/stores.png"
            alt="stores heading icon"
            width={1554}
            height={1342}
            loading="eager"
            className="mx-auto mb-6 max-w-[200px]"
          />
          <h2 className="text-2xl font-black">تصفح الأقسام</h2>
        </div>

        {/* Search + filter — navigates to /stores on change */}
        <StoreSearchFilter
          categories={categories.docs}
          currentQuery=""
          currentCategory={null}
          currentSub=""
        />
      </div>

      {/* About the app infographic */}
      <AboutSection />
    </div>
  )
}
