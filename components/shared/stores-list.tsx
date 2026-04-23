"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import StoreCard from "./store-card"
import { fetchStores, type NormalizedStore } from "@/app/actions/stores"

type StoresListProps = {
  initialStores: NormalizedStore[]
  hasMore: boolean
  query?: string
  categoryId?: number
  subCategory?: string
}

export default function StoresList({
  initialStores,
  hasMore: initialHasMore,
  query,
  categoryId,
  subCategory
}: StoresListProps) {
  const [stores, setStores] = useState<NormalizedStore[]>(initialStores)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  // Reset when server passes new initial stores (filter/search changed)
  useEffect(() => {
    setStores(initialStores)
    setHasMore(initialHasMore)
    setPage(1)
  }, [initialStores, initialHasMore])

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return
    isLoadingRef.current = true
    setIsLoading(true)
    try {
      const nextPage = page + 1
      const result = await fetchStores({ page: nextPage, query, categoryId, subCategory })
      setStores((prev) => [...prev, ...result.stores])
      setHasMore(result.hasMore)
      setPage(nextPage)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [hasMore, page, query, categoryId, subCategory])

  // Keep a stable ref to loadMore so the observer closure never goes stale
  const loadMoreRef = useRef(loadMore)
  useEffect(() => {
    loadMoreRef.current = loadMore
  })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreRef.current()
      },
      { rootMargin: "300px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, []) // mount once — ref stays fresh

  if (stores.length === 0 && !isLoading) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-black text-muted-foreground">لا توجد متاجر مطابقة</p>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          حاول كلمة بحث أخرى أو اختر تصنيف مختلف
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-2">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            href={`/stores/${store.slug}`}
            name={store.name}
            imageUrl={store.imageUrl}
            imageAlt={store.name}
            categories={store.subCategories.join(" · ") || store.categoryName}
            location={store.location}
            statusLabel={store.isOpen ? "مفتوح الآن" : "مغلق الأن"}
            variant={store.isFutured ? "featured" : "default"}
          />
        ))}
      </div>

      {/* Intersection sentinel — triggers next page load */}
      <div ref={sentinelRef} className="mt-2 h-2" aria-hidden />

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-foreground border-t-transparent" />
        </div>
      )}

      {!hasMore && stores.length > 0 && (
        <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
          · تم عرض جميع المتاجر ·
        </p>
      )}
    </div>
  )
}
