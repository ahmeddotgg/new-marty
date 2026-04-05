import type { Media } from "@/payload-types"
import config from "@payload-config"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getPayload } from "payload"
import StoreTabs from "@/components/shared/store-tabs"

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
        slug: {
          equals: slug
        }
      }
    })
    const [store] = stores.docs

    if (!store) {
      notFound()
    }

    const coverUrl =
      typeof store.cover === "object" && store.cover
        ? ((store.cover as Media).url ?? null)
        : null
    const logoUrl =
      typeof store.logo === "object" && store.logo
        ? ((store.logo as Media).url ?? null)
        : null
    const menuImages = (store.menu_imgs ?? []).reduce<StoreMenuImage[]>((images, image, index) => {
      if (typeof image !== "object" || !image) {
        return images
      }

      const media = image as Media

      if (!media.url) {
        return images
      }

      images.push({
        id: media.id ?? `menu-image-${index}`,
        url: media.url,
        alt: media.alt || `${store.name} menu ${index + 1}`
      })

      return images
    }, [])

    return (
      <div className="pb-12">
        <section className="wrapper pt-8">
          <div className="overflow-hidden rounded-[2rem] bg-secondary/60">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={store.name}
                width={1400}
                height={420}
                priority
                sizes="100vw"
                unoptimized
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
                    unoptimized
                    className="h-28 w-28 object-cover md:h-36 md:w-36"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center bg-secondary text-xl font-bold md:h-36 md:w-36">
                    {store.name.slice(0, 1)}
                  </div>
                )}
              </div>

              <div className="space-y-3 pb-2 text-center md:text-start">
                <h1 className="block text-3xl font-black text-primary-foreground md:text-4xl">
                  {store.name}
                </h1>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-primary-foreground/70 md:justify-start">
                  {typeof store.category === "object" && store.category ? (
                    <span className="rounded-full bg-secondary px-3 py-1">
                      {store.category.name}
                    </span>
                  ) : null}
                  {(store.sub_categories ?? []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-primary px-3 py-1 font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="wrapper pt-8">
          <StoreTabs
            branches={store.branches ?? []}
            menuImages={menuImages}
            workingHours={store.workingHours}
          />
        </section>
      </div>
    )
  } catch {
    notFound()
  }
}
