"use client"

import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as motion from "motion/react-client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MenuImage = {
  id: number | string
  url: string
  alt: string
}

type Branch = {
  name: string
  address: string
  mapsUrl?: string | null
  phone: string
  id?: string | null
}

type StoreTabsProps = {
  workingHours?: {
    opensAt?: string | null
    closesAt?: string | null
  } | null
  menuImages: MenuImage[]
  branches: Branch[]
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

function PanelCard({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-4xl bg-accent p-6 text-white ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return <PanelCard className="text-center text-lg font-bold">{children}</PanelCard>
}

function MenuImageDialog({
  images,
  activeIndex,
  open,
  onOpenChange
}: {
  images: MenuImage[]
  activeIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!open || !api) {
      return
    }

    api.scrollTo(activeIndex, true)
  }, [activeIndex, api, open])

  const hasMany = images.length > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl bg-transparent p-0 ring-0 sm:max-w-3xl"
      >
        <Carousel dir="rtl" opts={{ direction: "rtl", loop: hasMany }} setApi={setApi}>
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="h-[40vh] sm:h-[65vh]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={1600}
                  height={1600}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="h-full w-full rounded-2xl object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <DialogClose
            tabIndex={-1}
            render={
              <Button
                variant="secondary"
                className="absolute inset-0 -top-5 rounded-full"
                size="icon-lg"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2.5} className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>

          {hasMany ? (
            <>
              <CarouselPrevious className="-inset-s-14 top-1/2 hidden size-11 hover:bg-background sm:flex xl:-inset-s-14" />
              <CarouselNext className="-inset-e-14 top-1/2 hidden size-11 hover:bg-background sm:flex xl:-inset-e-14" />
            </>
          ) : null}
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}

function MenuPanel({ menuImages }: { menuImages: MenuImage[] }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (menuImages.length === 0) {
    return <EmptyPanel>سيتم اضافة المنيو قريباً.</EmptyPanel>
  }

  return (
    <>
      <Carousel dir="rtl" opts={{ direction: "rtl", loop: menuImages.length > 4 }}>
        <CarouselContent>
          {menuImages.map((image, index) => (
            <CarouselItem key={image.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <button
                type="button"
                className="block w-full overflow-hidden rounded-3xl"
                onClick={() => {
                  setActiveImageIndex(index)
                  setDialogOpen(true)
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={900}
                  height={900}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="aspect-square w-full object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        {menuImages.length > 1 ? (
          <>
            <CarouselPrevious className="inset-s-3 top-1/2 border-0 bg-background/90 text-foreground hover:bg-background md:inset-s-4" />
            <CarouselNext className="inset-e-3 top-1/2 border-0 bg-background/90 text-foreground hover:bg-background md:inset-e-4" />
          </>
        ) : null}
      </Carousel>

      <MenuImageDialog
        images={menuImages}
        activeIndex={activeImageIndex}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}

function BranchesPanel({
  workingHours,
  branches
}: {
  workingHours?: StoreTabsProps["workingHours"]
  branches: Branch[]
}) {
  return (
    <div className="space-y-4">
      <PanelCard>
        <h2 className="text-lg font-bold">ساعات العمل</h2>
        <p className="mt-2">
          من {formatTime(workingHours?.opensAt)} إلى {formatTime(workingHours?.closesAt)}
        </p>
      </PanelCard>

      {branches.map((branch) => (
        <PanelCard key={branch.id ?? `${branch.name}-${branch.phone}`}>
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
        </PanelCard>
      ))}
    </div>
  )
}

export default function StoreTabs({
  workingHours,
  menuImages,
  branches
}: StoreTabsProps) {
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
        <TabsContent value="menu" className="rounded-4xl py-6">
          <MenuPanel menuImages={menuImages} />
        </TabsContent>

        <TabsContent value="offers" className="rounded-4xl py-6">
          <EmptyPanel>لا توجد عروض معروضة حالياً.</EmptyPanel>
        </TabsContent>

        <TabsContent value="branches" className="rounded-4xl py-6">
          <BranchesPanel branches={branches} workingHours={workingHours} />
        </TabsContent>
      </motion.div>
    </Tabs>
  )
}
