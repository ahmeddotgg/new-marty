import config from "@payload-config"
import { notFound } from "next/navigation"
import { getPayload } from "payload"

type StorePageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  try {
    const stores = await payload.find({
      collection: "stores",
      depth: 0,
      limit: 1,
      select: {
        name: true,
        slug: true
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

    return (
      <div className="wrapper py-10">
        <h1 className="text-3xl font-bold text-primary-foreground">{store.name}</h1>
      </div>
    )
  } catch {
    notFound()
  }
}
