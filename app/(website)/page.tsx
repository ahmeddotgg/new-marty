import type { Media } from "@/payload-types"
import config from "@payload-config"
import { getPayload } from "payload"
import CategoriesSection from "@/components/shared/categories-section"
import FuturedStores from "@/components/shared/futured-stores"
import Hero from "@/components/shared/hero"

export default async function Home() {
  const payload = await getPayload({ config })
  const [featuredStores, categories] = await Promise.all([
    payload.find({
      collection: "stores",
      depth: 1,
      limit: 100,
      pagination: false,
      select: {
        name: true,
        slug: true,
        logo: true
      },
      where: {
        isFutured: {
          equals: true
        }
      }
    }),
    payload.find({
      collection: "categories",
      depth: 1,
      limit: 100,
      pagination: false,
      select: {
        name: true,
        icon: true,
        sub_categories: {
          name: true,
          icon: true
        }
      }
    })
  ])

  return (
    <div>
      <Hero />
      <FuturedStores
        stores={featuredStores.docs.map((store) => ({
          id: store.id,
          name: store.name,
          href: `/stores/${store.slug}`,
          logoUrl:
            typeof store.logo === "object" && store.logo
              ? ((store.logo as Media).url ?? null)
              : null
        }))}
      />
      <CategoriesSection
        categories={categories.docs.map((category) => ({
          id: category.id,
          name: category.name,
          iconUrl:
            typeof category.icon === "object" && category.icon
              ? ((category.icon as Media).url ?? null)
              : null,
          subCategories: (category.sub_categories ?? []).map((subCategory) => ({
            id: subCategory.id ?? subCategory.name,
            name: subCategory.name,
            iconUrl:
              typeof subCategory.icon === "object" && subCategory.icon
                ? ((subCategory.icon as Media).url ?? null)
                : null
          }))
        }))}
      />
    </div>
  )
}
