import type { Media } from "@/payload-types"
import config from "@payload-config"
import { getPayload } from "payload"
import FuturedStores from "./futured-stores"

const MIN_FEATURED = 6

export default async function HomeFeaturedStores() {
  const payload = await getPayload({ config })

  const featuredResult = await payload.find({
    collection: "stores",
    depth: 1,
    limit: 100,
    pagination: false,
    select: { name: true, slug: true, logo: true },
    where: { isFutured: { equals: true } }
  })

  let docs = featuredResult.docs
  if (docs.length < MIN_FEATURED) {
    const extra = await payload.find({
      collection: "stores",
      depth: 1,
      limit: MIN_FEATURED - docs.length,
      pagination: false,
      select: { name: true, slug: true, logo: true },
      where: { isFutured: { not_equals: true } }
    })
    docs = [...docs, ...extra.docs]
  }

  const stores = docs.map((store) => ({
    id: store.id,
    name: store.name,
    href: `/stores/${store.slug}`,
    logoUrl:
      typeof store.logo === "object" && store.logo
        ? ((store.logo as Media).url ?? null)
        : null
  }))

  return <FuturedStores stores={stores} />
}
