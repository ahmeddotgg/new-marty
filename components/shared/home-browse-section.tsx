import type { Media } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import Link from "next/link"
import { getPayload } from "payload"
import StoreCard from "./store-card"
import StoreSearchFilter from "./store-search-filter"
import { buttonVariants } from "@/components/ui/button-variants"
import { isStoreOpenNow } from "@/lib/store-utils"

export default async function HomeBrowseSection() {
  const payload = await getPayload({ config })

  const categories = await payload.find({
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

  const restaurantCategory = categories.docs.find(
    (c) => c.name.includes("مطعم") || c.name.includes("مطاعم")
  )
  const defaultCategoryId = restaurantCategory?.id ?? null

  const previewResult = await payload.find({
    collection: "stores",
    depth: 1,
    limit: 6,
    select: {
      name: true,
      slug: true,
      logo: true,
      sub_categories: true,
      branches: true,
      workingHours: true,
      isFutured: true,
      category: true
    },
    where: defaultCategoryId
      ? {
          and: [
            { isFutured: { equals: true } },
            { category: { equals: defaultCategoryId } }
          ]
        }
      : { isFutured: { equals: true } }
  })

  const previewStores = previewResult.docs.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    imageUrl:
      typeof s.logo === "object" && s.logo ? ((s.logo as Media).url ?? null) : null,
    subCategories: s.sub_categories ?? [],
    categoryName:
      typeof s.category === "object" && s.category ? s.category.name : "غير مصنف",
    location: s.branches?.[0]?.address ?? "يحتاج تحديث العنوان",
    isFutured: s.isFutured,
    isOpen: isStoreOpenNow(s.workingHours)
  }))

  return (
    <div className="wrapper py-20">
      <div className="mb-12 text-center">
        <Image
          src="/stores.png"
          alt="stores heading icon"
          width={1554}
          height={1342}
          loading="eager"
          className="mx-auto mb-6 max-w-50"
        />
        <h2 className="text-2xl font-black">تصفح الأقسام</h2>
      </div>

      <StoreSearchFilter
        categories={categories.docs}
        currentQuery=""
        currentCategory={defaultCategoryId}
        currentSub=""
      />

      {previewStores.length > 0 && (
        <div className="mt-10">
          <div className="grid gap-5 sm:grid-cols-2">
            {previewStores.map((s) => (
              <StoreCard
                key={s.id}
                href={`/stores/${s.slug}`}
                name={s.name}
                imageUrl={s.imageUrl}
                imageAlt={s.name}
                categories={s.subCategories.join(" · ") || s.categoryName}
                location={s.location}
                statusLabel={s.isOpen ? "مفتوح الآن" : "مغلق الأن"}
                variant={s.isFutured ? "featured" : "default"}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/stores"
              className={buttonVariants({
                size: "lg",
                className:
                  "cursor-pointer font-semibold dark:text-primary-foreground dark:ring-secondary"
              })}
            >
              تصفح المزيد
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
