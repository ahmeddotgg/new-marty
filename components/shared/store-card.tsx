"use client"

import { DashboardSquare03Icon, Location01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemSeparator,
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
  statusLabel?: "مفتوح الآن" | "مغلق الأن"
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
  const isFeatured = variant === "featured"

  return (
    <Item
      render={<Link href={href} />}
      className={cn(
        "min-w-0 overflow-hidden rounded-4xl shadow-sm ring-3 transition-transform duration-300 hover:-translate-y-1",
        isFeatured ? "bg-secondary ring-border" : "bg-card ring-border"
      )}
    >
      <ItemMedia
        className={cn(
          "overflow-hidden rounded-4xl ring-3",
          isFeatured ? "ring-border" : "ring-border in-focus-visible:ring-accent"
        )}
      >
        <Image
          src={imageUrl as string}
          alt={imageAlt ?? name}
          width={1250}
          height={1250}
          loading="eager"
          className="h-auto w-auto object-cover"
        />
      </ItemMedia>

      <ItemContent className="px-2 py-4 sm:p-4">
        <ItemTitle
          className={cn(
            "mb-2 text-[15px] font-black sm:text-lg",
            isFeatured ? "text-secondary-foreground" : "text-card-foreground"
          )}
        >
          <span className="truncate">{name}</span>
        </ItemTitle>

        <ItemDescription
          className={cn(
            "space-y-1 text-[10px] font-medium",
            isFeatured ? "text-secondary-foreground/80" : "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={DashboardSquare03Icon}
              className="size-3 shrink-0"
              strokeWidth={2.4}
            />
            <span className="line-clamp-1">{categories}</span>
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Location01Icon}
              className="size-3 shrink-0"
              strokeWidth={2.4}
            />
            <span className="line-clamp-1">{location}</span>
          </span>
        </ItemDescription>

        <ItemSeparator className="h-0.5! rounded-lg bg-border" />

        <ItemFooter>
          <span
            className={cn(
              "rounded-full border border-border bg-primary px-2 text-xs font-bold text-primary-foreground shadow-sm",
              statusLabel === "مغلق الأن" && "bg-muted text-muted-foreground"
            )}
          >
            {statusLabel}
          </span>
        </ItemFooter>
      </ItemContent>
    </Item>
  )
}
