import type { Media } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getPayload } from "payload"
import BackButton from "@/components/shared/back-button"
import StoreCard from "@/components/shared/store-card"
import StoreTabs from "@/components/shared/store-tabs"
import { isStoreOpenNow } from "@/lib/store-utils"

type StorePageProps = {
  params: Promise<{
    slug: string
  }>
}

type StoreMenuImage = {
  id: number | string
  url: string
  alt: string
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const stores = await payload.find({
      collection: "stores",
      depth: 1,
      limit: 1,
      select: {
        name: true,
        slug: true,
        cover: true,
        logo: true,
        menu_imgs: true,
        category: true,
        sub_categories: true,
        branches: true,
        workingHours: {
          opensAt: true,
          closesAt: true
        }
      },
      where: {
        slug: { equals: slug }
      }
    })

    const [store] = stores.docs
    if (!store) notFound()

    const coverUrl =
      typeof store.cover === "object" && store.cover
        ? ((store.cover as Media).url ?? null)
        : null
    const logoUrl =
      typeof store.logo === "object" && store.logo
        ? ((store.logo as Media).url ?? null)
        : null

    const menuImages = (store.menu_imgs ?? []).reduce<StoreMenuImage[]>(
      (imgs, image, index) => {
        if (typeof image !== "object" || !image) return imgs
        const media = image as Media
        if (!media.url) return imgs
        imgs.push({
          id: media.id ?? `menu-image-${index}`,
          url: media.url,
          alt: media.alt || `${store.name} menu ${index + 1}`
        })
        return imgs
      },
      []
    )

    // Fetch up to 3 similar stores in the same category
    const categoryId =
      typeof store.category === "object" && store.category
        ? store.category.id
        : typeof store.category === "number"
          ? store.category
          : null

    const similarStoresResult = categoryId
      ? await payload.find({
          collection: "stores",
          depth: 1,
          limit: 3,
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
          where: {
            and: [{ category: { equals: categoryId } }, { slug: { not_equals: slug } }]
          }
        })
      : null

    const similarStores = (similarStoresResult?.docs ?? []).map((s) => ({
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
      <div className="pb-16">
        {/* Back button */}
        <div className="wrapper pt-6">
          <BackButton />
        </div>

        {/* Cover + logo hero */}
        <section className="wrapper pt-5">
          <div className="overflow-hidden rounded-[2rem] bg-secondary/60">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={store.name}
                width={1400}
                height={420}
                priority
                sizes="100vw"
                className="h-56 w-full object-cover md:h-72"
              />
            ) : (
              <div className="h-56 w-full bg-secondary md:h-72" />
            )}
          </div>

          <div className="relative z-10 -mt-16 px-4 md:-mt-20">
            <div className="flex flex-col items-center gap-5 md:items-start">
              <div className="overflow-hidden rounded-full border-4 border-background bg-background shadow-lg">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={store.name}
                    width={144}
                    height={144}
                    priority
                    sizes="144px"
                    className="h-28 w-28 object-cover md:h-36 md:w-36"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center bg-secondary text-xl font-bold md:h-36 md:w-36">
                    {store.name.slice(0, 1)}
                  </div>
                )}
              </div>

              <div className="space-y-3 pb-2 text-center md:text-start">
                <h1 className="block text-3xl font-black md:text-4xl">{store.name}</h1>
                <div className="flex flex-wrap justify-center gap-2 text-sm md:justify-start">
                  {typeof store.category === "object" && store.category ? (
                    <span className="rounded-full bg-secondary px-3 py-1">
                      {store.category.name}
                    </span>
                  ) : null}
                  {(store.sub_categories ?? []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-primary px-3 font-medium text-foreground ring-2 ring-foreground dark:text-background dark:ring-background"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="wrapper pt-8">
          <StoreTabs
            branches={store.branches ?? []}
            menuImages={menuImages}
            workingHours={store.workingHours}
          />
        </section>

        {/* Similar stores */}
        {similarStores.length > 0 ? (
          <section className="wrapper pt-14">
            <h2 className="mb-6 text-2xl font-black">متاجر مشابهة</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarStores.map((s) => (
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
          </section>
        ) : null}
      </div>
    )
  } catch {
    notFound()
  }
}
