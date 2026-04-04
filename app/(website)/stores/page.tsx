import type { Media } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import { getPayload } from "payload"
import StoreCard from "@/components/shared/store-card"

const getRelationID = (value: unknown): number | null => {
  if (typeof value === "number") {
    return value
  }

  if (value && typeof value === "object" && "id" in value) {
    const relationID = (value as { id?: unknown }).id

    if (typeof relationID === "number") {
      return relationID
    }
  }

  return null
}

type GroupedStores = {
  categoryID: number
  categoryName: string
  categoryIconUrl: string | null
  stores: {
    id: number
    slug: string
    name: string
    isFutured?: boolean | null
    isAvaliable?: boolean | null
    imageUrl: string | null
    subCategories: string[]
    location: string
  }[]
}

export default async function Page() {
  const payload = await getPayload({ config })
  const [storesResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: "stores",
      depth: 1,
      limit: 200,
      pagination: false,
      sort: "name"
    }),
    payload.find({
      collection: "categories",
      depth: 1,
      limit: 100,
      pagination: false,
      select: {
        name: true,
        icon: true
      }
    })
  ])

  const categoriesMap = new Map(
    categoriesResult.docs.map((category) => [
      category.id,
      {
        name: category.name,
        iconUrl:
          typeof category.icon === "object" && category.icon
            ? ((category.icon as Media).url ?? null)
            : null
      }
    ])
  )

  const groupedStores = storesResult.docs.reduce<GroupedStores[]>((groups, store) => {
    const categoryID = getRelationID(store.category)

    if (!categoryID) {
      return groups
    }

    const currentGroup = groups.find((group) => group.categoryID === categoryID)
    const normalizedStore = {
      id: store.id,
      slug: store.slug,
      name: store.name,
      isFutured: store.isFutured,
      isAvaliable: store.isAvaliable,
      imageUrl:
        typeof store.logo === "object" && store.logo
          ? ((store.logo as Media).url ?? null)
          : null,
      subCategories: store.sub_categories ?? [],
      location: store.branches?.[0]?.address ?? "يحتاج تحديث العنوان"
    }

    if (currentGroup) {
      currentGroup.stores.push(normalizedStore)
      return groups
    }

    groups.push({
      categoryID,
      categoryName:
        (typeof store.category === "object" && store.category?.name) ||
        categoriesMap.get(categoryID)?.name ||
        "غير مصنف",
      categoryIconUrl:
        (typeof store.category === "object" &&
          store.category?.icon &&
          typeof store.category.icon === "object" &&
          ((store.category.icon as Media).url ?? null)) ||
        categoriesMap.get(categoryID)?.iconUrl ||
        null,
      stores: [normalizedStore]
    })

    return groups
  }, [])

  return (
    <div className="wrapper space-y-10 py-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-primary-foreground">المتاجر</h1>
        <p className="text-foreground/70">تصفح جميع المتاجر المتاحة حسب التصنيف.</p>
      </header>

      <div className="space-y-12">
        {groupedStores.map((group) => (
          <section key={group.categoryID} className="space-y-5">
            <div className="flex items-center gap-3">
              {group.categoryIconUrl ? (
                <Image
                  src={group.categoryIconUrl}
                  alt={group.categoryName}
                  width={44}
                  height={44}
                  sizes="44px"
                  unoptimized
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : null}
              <h2 className="text-2xl font-bold text-primary-foreground">
                {group.categoryName}
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {group.stores.map((store) => (
                <StoreCard
                  key={store.id}
                  categories={store.subCategories.join(" - ") || group.categoryName}
                  deliveryTime="45 - 60 min"
                  href={`/stores/${store.slug}`}
                  imageAlt={store.name}
                  imageUrl={store.imageUrl}
                  location={store.location}
                  name={store.name}
                  rating="4.9"
                  statusLabel={store.isAvaliable ? "مفتوح الآن" : "غير متاح حالياً"}
                  variant={store.isFutured ? "featured" : "default"}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
