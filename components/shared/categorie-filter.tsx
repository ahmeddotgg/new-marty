"use client"

import type { Media } from "@/payload-types"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
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

export default function CategorieFilter({
  categories
}: {
  categories: FilterCategory[]
}) {
  const [activeCategory, setActiveCategory] = useState(5)
  const activeCategoryId = categories.filter((category) => category.id === activeCategory)

  const [activeSubCategory, setActiveSubCategory] = useState("")

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        {categories.map((category) => {
          const iconUrl =
            typeof category.icon === "object" && category.icon
              ? ((category.icon as Media).url ?? null)
              : null
          return (
            <Button
              key={category.name}
              className={cn(
                "h-14 bg-secondary text-lg font-bold text-background ring-2 ring-foreground dark:bg-primary dark:ring-secondary",
                category.id === activeCategory &&
                  "bg-accent dark:bg-accent dark:text-foreground"
              )}
              size="lg"
              onClick={() => {
                setActiveCategory(category.id)
                setActiveSubCategory("")
              }}
            >
              <span>{category.name}</span>
              <Image
                src={iconUrl as string}
                alt={category.name}
                width={56}
                height={56}
                loading="eager"
                sizes="56px"
                className="h-14 w-14 rounded-full object-cover"
              />
            </Button>
          )
        })}
      </div>

      <div className="flex flex-nowrap gap-4 overflow-x-scroll overflow-y-clip">
        {activeCategoryId[0].sub_categories?.map((sub_category) => {
          const iconUrl =
            typeof sub_category.icon === "object" && sub_category.icon
              ? ((sub_category.icon as Media).url ?? null)
              : null
          return (
            <Button
              key={sub_category.id}
              size="lg"
              className="flex h-auto flex-col p-4"
              variant="ghost"
              onClick={() => setActiveSubCategory(sub_category.id as string)}
            >
              <div
                className={cn(
                  "rounded-full bg-secondary ring-2 dark:bg-primary dark:ring-secondary",
                  sub_category.id === activeSubCategory && "bg-accent dark:bg-accent"
                )}
              >
                <Image
                  src={iconUrl as string}
                  alt={sub_category.name}
                  width={56}
                  height={56}
                  loading="eager"
                  sizes="56px"
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">{sub_category.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
