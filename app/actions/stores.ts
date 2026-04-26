"use server"

import type { Media } from "@/payload-types"
import config from "@payload-config"
import { getPayload, type Where } from "payload"
import { isStoreOpenNow } from "@/lib/store-utils"

export type NormalizedStore = {
  id: number
  slug: string
  name: string
  isFutured?: boolean | null
  imageUrl: string | null
  subCategories: string[]
  location: string
  isOpen: boolean
  categoryID: number | null
  categoryName: string
}

type FetchStoresParams = {
  page?: number
  limit?: number
  query?: string
  categoryId?: number
  subCategory?: string
}

export async function fetchStores({
  page = 1,
  limit = 12,
  query,
  categoryId,
  subCategory
}: FetchStoresParams): Promise<{
  stores: NormalizedStore[]
  hasMore: boolean
  totalDocs: number
  page: number
}> {
  const payload = await getPayload({ config })

  const where: Where = {}
  if (query?.trim()) {
    where.name = { like: query.trim() }
  }
  if (categoryId) {
    where.category = { equals: categoryId }
  }
  if (subCategory) {
    where.sub_categories = { contains: subCategory }
  }

  const result = await payload.find({
    collection: "stores",
    depth: 1,
    page,
    limit,
    sort: "name",
    where: Object.keys(where).length > 0 ? where : undefined
  })

  const stores: NormalizedStore[] = result.docs.map((store) => {
    const categoryID =
      typeof store.category === "object" && store.category
        ? store.category.id
        : typeof store.category === "number"
          ? store.category
          : null
    const categoryName =
      typeof store.category === "object" && store.category
        ? store.category.name
        : "غير مصنف"

    return {
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
      isOpen: isStoreOpenNow(store.workingHours),
      categoryID,
      categoryName
    }
  })

  return {
    stores,
    hasMore: result.hasNextPage,
    totalDocs: result.totalDocs,
    page: result.page ?? 1
  }
}
