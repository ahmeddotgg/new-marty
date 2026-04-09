"use client"

import { Location01Icon } from "@hugeicons/core-free-icons"
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
  return (
    <Item
      render={<Link href={href} />}
      className={cn(
        "min-w-0 overflow-hidden rounded-4xl bg-background shadow-sm ring-3 ring-secondary transition-transform duration-300 hover:-translate-y-1 dark:bg-foreground",
        variant === "featured" &&
          "bg-secondary ring-foreground dark:bg-secondary dark:ring-foreground"
      )}
    >
      <ItemMedia
        className={cn(
          "overflow-hidden rounded-4xl bg-foreground ring-3 ring-secondary in-focus-visible:ring-accent",
          variant === "featured" && "ring-foreground"
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
      <ItemContent className="p-4">
        <ItemTitle
          className={cn(
            "text-lg font-black text-secondary",
            variant === "featured" && "text-background dark:text-foreground"
          )}
        >
          {name}
        </ItemTitle>
        <ItemDescription
          className={cn(
            "text-xs font-medium text-foreground dark:text-background",
            variant === "featured" && "text-background dark:text-foreground"
          )}
        >
          <span className="inline-block">{categories}</span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Location01Icon}
              className="inline size-3.5"
              strokeWidth={2.4}
            />{" "}
            {location}
          </span>
        </ItemDescription>
        <ItemSeparator className="h-0.5! rounded-lg bg-foreground dark:bg-background" />
        <ItemFooter>
          <span
            className={cn(
              "rounded-full border-2 border-foreground bg-primary px-2 text-xs font-bold text-primary-foreground shadow-sm dark:border-background",
              statusLabel === "مغلق الأن" && "bg-gray-300"
            )}
          >
            {statusLabel}
          </span>
        </ItemFooter>
      </ItemContent>
    </Item>
  )
}
