"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle
} from "@/components/ui/item"
import { cn } from "@/lib/utils"

type StoreCardProps = {
  href: string
  name: string
  imageUrl: string | null
  imageAlt?: string
  categories: string
  location: string
  deliveryTime: string
  rating: number | string
  offerPercent?: number
  offerLabel?: string
  statusLabel?: string
  isFavourite?: boolean
  variant?: "default" | "featured"
}

export default function StoreCard({
  href,
  name,
  imageUrl,
  imageAlt,
  categories,
  location,
  statusLabel = "مفتوح الآن",
  variant = "default"
}: StoreCardProps) {
  return (
    <Link className="block" href={href}>
      <Item
        className={cn(
          variant === "featured" && "bg-secondary",
          "overflow-hidden rounded-4xl shadow-sm transition-transform duration-300 hover:-translate-y-1"
        )}
      >
        <ItemMedia>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt ?? name}
              width={150}
              height={150}
              sizes="150px"
              unoptimized
            />
          ) : (
            <div className="flex size-[150px] items-center justify-center rounded-2xl bg-muted text-center text-sm font-bold text-muted-foreground">
              {name}
            </div>
          )}
        </ItemMedia>
        <ItemContent>
          <ItemTitle
            className={cn(
              "line-clamp-2 text-lg font-black",
              variant === "featured" && "text-white"
            )}
          >
            {name}
          </ItemTitle>
          <ItemDescription
            className={cn(
              "line-clamp-2 text-xs font-medium text-foreground",
              variant === "featured" && "text-white"
            )}
          >
            {categories} - {location}
          </ItemDescription>
          <ItemFooter className="w-fit rounded-full border-2 border-foreground bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
            {statusLabel}
          </ItemFooter>
        </ItemContent>
      </Item>
    </Link>
  )
}
