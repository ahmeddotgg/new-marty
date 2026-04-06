"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

type CategoriesSectionProps = {
  categories: {
    id: number
    name: string
    iconUrl: string | null
    subCategories: {
      id: string
      name: string
      iconUrl: string | null
    }[]
  }[]
}

function CategoryButton({
  name,
  iconUrl,
  eager = false
}: {
  name: string
  iconUrl: string | null
  eager?: boolean
}) {
  return (
    <Button
      className="h-auto min-h-28 w-full flex-col gap-3 rounded-2xl px-4 py-4 text-center"
      size="lg"
      type="button"
      variant="outline"
    >
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt={name}
          width={48}
          height={48}
          loading={eager ? "eager" : "lazy"}
          sizes="48px"
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : null}
      <span className="text-sm font-semibold">{name}</span>
    </Button>
  )
}

function SubCategoriesRow({
  items
}: {
  items: CategoriesSectionProps["categories"][number]["subCategories"]
}) {
  if (items.length > 5) {
    return (
      <Carousel
        className="w-full"
        dir="rtl"
        opts={{
          direction: "rtl",
          loop: true
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
              <CategoryButton iconUrl={item.iconUrl} name={item.name} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => (
        <CategoryButton key={item.id} iconUrl={item.iconUrl} name={item.name} />
      ))}
    </div>
  )
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className="wrapper space-y-10 py-8">
      {categories.map((category) => (
        <div key={category.id} className="space-y-5">
          <div className="flex items-center gap-3">
            {category.iconUrl ? (
              <Image
                src={category.iconUrl}
                alt={category.name}
                width={56}
                height={56}
                loading="eager"
                sizes="56px"
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : null}
            <h2 className="text-2xl font-bold">{category.name}</h2>
          </div>
          <SubCategoriesRow items={category.subCategories} />
        </div>
      ))}
    </section>
  )
}
