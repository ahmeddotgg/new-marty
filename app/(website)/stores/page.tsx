import type { Media } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import { getPayload } from "payload"
import StoreCard from "@/components/shared/store-card"

const STORE_TIMEZONE = "Africa/Cairo"

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

const getMinutesInTimezone = (value: Date | string, timeZone: string) => {
  const date = typeof value === "string" ? new Date(value) : value
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })
  const parts = formatter.formatToParts(date)
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0")
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0")

  return hour * 60 + minute
}

const isStoreOpenNow = (
  workingHours?: {
    opensAt?: string | null
    closesAt?: string | null
  } | null
) => {
  if (!workingHours?.opensAt || !workingHours?.closesAt) {
    return false
  }

  const openMinutes = getMinutesInTimezone(workingHours.opensAt, STORE_TIMEZONE)
  const closeMinutes = getMinutesInTimezone(workingHours.closesAt, STORE_TIMEZONE)
  const nowMinutes = getMinutesInTimezone(new Date(), STORE_TIMEZONE)

  if (openMinutes === closeMinutes) {
    return true
  }

  if (closeMinutes > openMinutes) {
    return nowMinutes >= openMinutes && nowMinutes < closeMinutes
  }

  return nowMinutes >= openMinutes || nowMinutes < closeMinutes
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
    imageUrl: string | null
    subCategories: string[]
    location: string
    workingHours?: {
      opensAt?: string | null
      closesAt?: string | null
    } | null
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
      imageUrl:
        typeof store.logo === "object" && store.logo
          ? ((store.logo as Media).url ?? null)
          : null,
      subCategories: store.sub_categories ?? [],
      location: store.branches?.[0]?.address ?? "يحتاج تحديث العنوان",
      workingHours: store.workingHours
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
      <header className="space-y-3">
        <h1 className="text-4xl font-black">المتاجر</h1>
        <p className="text-sm font-medium text-muted-foreground">
          تصفح جميع المتاجر المتاحة حسب التصنيف.
        </p>
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
              <h2 className="text-2xl font-bold">{group.categoryName}</h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {group.stores.map((store) => (
                <StoreCard
                  key={store.id}
                  categories={store.subCategories.join(" - ") || group.categoryName}
                  href={`/stores/${store.slug}`}
                  imageAlt={store.name}
                  imageUrl={store.imageUrl}
                  location={store.location}
                  name={store.name}
                  statusLabel={
                    isStoreOpenNow(store.workingHours) ? "مفتوح الآن" : "مغلق الأن"
                  }
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
