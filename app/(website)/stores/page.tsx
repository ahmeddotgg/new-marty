import config from "@payload-config"
import { getPayload } from "payload"
import { fetchStores } from "@/app/actions/stores"
import StoreSearchFilter from "@/components/shared/store-search-filter"
import StoresList from "@/components/shared/stores-list"

type StoresPageProps = {
  searchParams: Promise<{
    q?: string
    category?: string
    sub?: string
  }>
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const { q, category, sub } = await searchParams
  const categoryId = category ? Number(category) : undefined

  const [storesResult, categoriesResult] = await Promise.all([
    fetchStores({
      page: 1,
      limit: 12,
      query: q,
      categoryId,
      subCategory: sub
    }),
    getPayload({ config }).then((payload) =>
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
    )
  ])

  // Build heading for active filter state
  const activeCategory =
    categoryId !== undefined
      ? categoriesResult.docs.find((c) => c.id === categoryId)
      : null

  const pageTitle = activeCategory ? activeCategory.name : q ? `نتائج "${q}"` : "المتاجر"

  return (
    <div className="wrapper space-y-10 py-10">
      {/* Page header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-black">{pageTitle}</h1>
        <p className="text-sm font-medium text-muted-foreground">
          {storesResult.totalDocs > 0
            ? `${storesResult.totalDocs} متجر متاح`
            : "تصفح جميع المتاجر المتاحة حسب التصنيف."}
        </p>
      </header>

      {/* Shared search + filter component */}
      <StoreSearchFilter
        categories={categoriesResult.docs}
        currentQuery={q ?? ""}
        currentCategory={categoryId ?? null}
        currentSub={sub ?? ""}
      />

      {/* Stores grid with infinite scroll
          key forces remount (state reset) when filters change */}
      <StoresList
        key={`${q ?? ""}-${category ?? ""}-${sub ?? ""}`}
        initialStores={storesResult.stores}
        hasMore={storesResult.hasMore}
        query={q}
        categoryId={categoryId}
        subCategory={sub}
      />
    </div>
  )
}
