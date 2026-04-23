"use client"

import type { Media } from "@/payload-types"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type FilterCategory = {
  id: number
  name: string
  icon: number | Media
  sub_categories?:
    | {
        name: string
        icon: number | Media
        id?: string | null
      }[]
    | null
}

type StoreSearchFilterProps = {
  categories: FilterCategory[]
  currentQuery?: string
  currentCategory?: number | null
  currentSub?: string
}

export default function StoreSearchFilter({
  categories,
  currentQuery = "",
  currentCategory = null,
  currentSub = ""
}: StoreSearchFilterProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState(currentQuery)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setInputValue(currentQuery)
  }, [currentQuery])

  const buildUrl = (q: string, category: number | null, sub: string) => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (category) params.set("category", String(category))
    if (sub) params.set("sub", sub)
    const qs = params.toString()
    return `/stores${qs ? `?${qs}` : ""}`
  }

  const navigate = (q: string, category: number | null, sub: string) => {
    startTransition(() => {
      router.push(buildUrl(q, category, sub))
    })
  }

  const handleSearchChange = (value: string) => {
    setInputValue(value)
    setIsSearchLoading(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setIsSearchLoading(false)
      navigate(value, currentCategory, "")
    }, 500)
  }

  const handleCategoryClick = (categoryId: number) => {
    navigate(inputValue, currentCategory === categoryId ? null : categoryId, "")
  }

  const handleSubClick = (subName: string) => {
    navigate(inputValue, currentCategory, currentSub === subName ? "" : subName)
  }

  const handleReset = () => {
    setInputValue("")
    setIsSearchLoading(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    startTransition(() => router.push("/stores"))
  }

  const isLoading = isSearchLoading || isPending
  const hasAnyFilter = !!(currentQuery || currentCategory || currentSub)
  const activeCategory = categories.find((c) => c.id === currentCategory)

  return (
    <div className="space-y-5">
      {/* On md+: search input and category buttons share one row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
        {/* ── Search input column ── */}
        <div className="flex shrink-0 flex-col gap-3 md:w-72 lg:w-80">
          <div className="relative">
            {/* Icon / spinner on the inline-end */}
            <div className="pointer-events-none absolute inset-y-0 inset-e-3.5 flex items-center">
              {isLoading ? (
                <div className="size-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              ) : (
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="size-4 text-muted-foreground"
                  strokeWidth={2}
                />
              )}
            </div>
            <Input
              type="search"
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث عن متجر..."
              dir="rtl"
              className="h-12 rounded-2xl border-transparent bg-secondary pe-10 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2"
            />
          </div>

          {/* Reset button — only when a filter is active */}
          {hasAnyFilter && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReset}
              className="w-fit rounded-full"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="size-3.5"
                data-icon="inline-start"
                strokeWidth={2.5}
              />
              إعادة الضبط
            </Button>
          )}
        </div>

        {/* ── Category buttons ── */}
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((category) => {
            const iconUrl =
              typeof category.icon === "object" && category.icon
                ? ((category.icon as Media).url ?? null)
                : null
            const isActive = currentCategory === category.id

            return (
              <Button
                key={category.id}
                size="lg"
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "h-14 gap-2 rounded-2xl bg-secondary text-lg font-bold text-secondary-foreground ring-2 ring-border hover:bg-secondary/80",
                  isActive && "bg-accent text-accent-foreground ring-accent"
                )}
              >
                <span>{category.name}</span>
                {iconUrl ? (
                  <Image
                    src={iconUrl}
                    alt={category.name}
                    width={56}
                    height={56}
                    loading="eager"
                    sizes="56px"
                    className="size-14 rounded-full object-cover"
                  />
                ) : null}
              </Button>
            )
          })}
        </div>
      </div>

      {/* ── Sub-category horizontal scroll ── */}
      {activeCategory?.sub_categories?.length ? (
        <ScrollArea orientation="horizontal" className="w-full">
          <div className="flex gap-4 pb-3">
            {activeCategory.sub_categories.map((sub) => {
              const iconUrl =
                typeof sub.icon === "object" && sub.icon
                  ? ((sub.icon as Media).url ?? null)
                  : null
              const isActive = currentSub === sub.name

              return (
                <button
                  key={sub.id ?? sub.name}
                  type="button"
                  onClick={() => handleSubClick(sub.name)}
                  className="flex shrink-0 flex-col items-center gap-2 p-2"
                >
                  <div
                    className={cn(
                      "rounded-full bg-muted p-0.5 ring-2 ring-border transition-colors",
                      isActive && "bg-accent ring-accent"
                    )}
                  >
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={sub.name}
                        width={56}
                        height={56}
                        loading="eager"
                        sizes="56px"
                        className="size-14 rounded-full object-cover"
                      />
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium text-muted-foreground",
                      isActive && "font-bold text-accent-foreground"
                    )}
                  >
                    {sub.name}
                  </span>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}
