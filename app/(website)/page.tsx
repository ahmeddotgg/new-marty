import type { Media } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import { getPayload } from "payload"
import CategorieFilter from "@/components/shared/categorie-filter"
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
      sort: "createdAt",
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
      <div className="wrapper py-32">
        <Image
          src="/stores.png"
          alt="stores heading icon"
          width={1554}
          height={1342}
          loading="eager"
          className="mx-auto max-w-50"
        />
        <h2 className="py-12 text-2xl font-bold">الاقسام</h2>
        <CategorieFilter categories={categories.docs} />
      </div>
    </div>
  )
}
