"use client"

import Image from "next/image"
import * as motion from "motion/react-client"
import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type StoreTabsProps = {
  workingHours?: {
    opensAt?: string | null
    closesAt?: string | null
  } | null
  menuImages: {
    id: number | string
    url: string
    alt: string
  }[]
  branches: {
    name: string
    address: string
    mapsUrl?: string | null
    phone: string
    id?: string | null
  }[]
}

const formatTime = (value?: string | null) => {
  if (!value) {
    return "غير محدد"
  }

  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value))
}

export default function StoreTabs({ workingHours, menuImages, branches }: StoreTabsProps) {
  const [activeTab, setActiveTab] = useState("menu")

  return (
    <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <TabsList className="w-full bg-border">
          <TabsTrigger className="py-4" value="menu">
            المنيو
          </TabsTrigger>
          <TabsTrigger className="py-4" value="offers">
            العروض
          </TabsTrigger>
          <TabsTrigger className="py-4" value="branches">
            الفروع
          </TabsTrigger>
        </TabsList>
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-6"
      >
        <TabsContent value="menu" className="rounded-4xl bg-accent p-6 text-white">
          {menuImages.length > 0 ? (
            <Carousel
              opts={{ align: "start", loop: menuImages.length > 1 }}
              className="mx-auto w-full max-w-4xl"
            >
              <CarouselContent>
                {menuImages.map((image) => (
                  <CarouselItem key={image.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="overflow-hidden rounded-[2rem] bg-secondary/40">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={1400}
                        height={1800}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                        className="h-80 w-full object-cover sm:h-96"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {menuImages.length > 1 ? (
                <>
                  <CarouselPrevious className="start-3 top-1/2 border-0 bg-background/90 text-foreground hover:bg-background md:start-4" />
                  <CarouselNext className="end-3 top-1/2 border-0 bg-background/90 text-foreground hover:bg-background md:end-4" />
                </>
              ) : null}
            </Carousel>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center text-white/80">
              سيتم اضافة المنيو قريباً.
            </div>
          )}
        </TabsContent>

        <TabsContent value="offers" className="rounded-4xl bg-accent p-6 text-white">
          لا توجد عروض معروضة حالياً.
        </TabsContent>

        <TabsContent value="branches" className="rounded-4xl text-white">
          <div className="space-y-4">
            <div className="rounded-4xl bg-accent p-6 text-white">
              <h2 className="text-lg font-bold">ساعات العمل</h2>
              <p className="mt-2">
                من {formatTime(workingHours?.opensAt)} إلى {formatTime(workingHours?.closesAt)}
              </p>
            </div>

            {branches.map((branch) => (
              <div
                key={branch.id ?? `${branch.name}-${branch.phone}`}
                className="rounded-4xl bg-accent p-6 text-white"
              >
                <h3 className="text-xl font-bold">{branch.name}</h3>
                <div className="mt-4 space-y-2">
                  <p>العنوان: {branch.address}</p>
                  <p>رقم الهاتف: {branch.phone}</p>
                  {branch.mapsUrl ? (
                    <p>
                      الموقع:{" "}
                      <a
                        href={branch.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold underline underline-offset-4"
                      >
                        افتح الخريطة
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </motion.div>
    </Tabs>
  )
}
