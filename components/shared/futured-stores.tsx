"use client"

import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"

type FuturedStoresProps = {
  stores: {
    id: number
    name: string
    href: string
    logoUrl: string | null
  }[]
}

export default function FuturedStores({ stores }: FuturedStoresProps) {
  if (stores.length === 0) {
    return null
  }

  return (
    <section className="wrapper py-8">
      <Carousel
        className="mx-auto w-full max-w-6xl"
        dir="rtl"
        opts={{
          direction: "rtl",
          loop: true
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
            playOnInit: true
          })
        ]}
      >
        <div className="mask-x-from-94% mask-x-to-99%">
          <CarouselContent>
            {stores.map((store, index) => (
              <CarouselItem
                key={store.id}
                className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <Link
                  href={store.href}
                  className="flex h-full min-h-40 items-center justify-center transition-transform duration-300 hover:-translate-y-1"
                >
                  {store.logoUrl ? (
                    <Image
                      src={store.logoUrl}
                      alt={store.name}
                      width={180}
                      height={180}
                      priority={index < 6}
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                      loading="eager"
                      className="h-28 w-28 rounded-full border-3 border-secondary object-cover"
                    />
                  ) : (
                    <span className="text-center text-lg font-semibold text-primary-foreground">
                      {store.name}
                    </span>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <CarouselPrevious className="hidden sm:inline-flex" />
        <CarouselNext className="hidden sm:inline-flex" />
      </Carousel>
    </section>
  )
}
