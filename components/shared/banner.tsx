"use client"

import * as motion from "motion/react-client"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useBanner } from "@/store/banner"

export default function Banner() {
  const { open, setIsOpen, markSeen } = useBanner()

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setIsOpen(v)
        if (!v) markSeen()
      }}
    >
      <DialogContent className="flex max-w-[calc(95%-1rem)] flex-col items-center gap-4 overflow-hidden bg-secondary sm:max-w-[calc(95%-1rem)] md:max-w-fit md:flex-row">
        <div className="flex flex-col items-center gap-6 py-8 md:gap-12">
          <motion.img
            draggable="false"
            src="/nazl_elapp.png"
            alt="downlaod the app"
            className="max-w-62 md:max-w-75"
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, duration: 0.6 }}
          />
        </div>

        <div className="relative h-60 w-87.5">
          <div className="absolute top-1/2 left-1/2 -z-10 size-82 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-primary/50 blur-2xl" />
          <motion.img
            draggable="false"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              duration: 600
            }}
            src="/marty_hero.svg"
            alt="marty logo"
            className="mx-auto max-w-[16rem]"
          />
          <motion.img
            draggable="false"
            src="/icons/fried-chicken.png"
            className="absolute -top-2 left-8 -z-1 w-18"
            initial={{ y: 70, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 12, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 8, delay: 0.2 }}
          />
          <motion.img
            draggable="false"
            src="/icons/pizza-slice-1.png"
            className="absolute top-18 left-0 -z-1 w-18"
            initial={{ y: 60, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 12, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 8, delay: 0.22 }}
          />
          <motion.img
            draggable="false"
            src="/icons/shopping-cart-1.png"
            className="absolute top-36 left-6 -z-1 w-18"
            initial={{ y: 95, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: -10, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.24 }}
          />
          <motion.img
            draggable="false"
            src="/icons/medicine.png"
            className="absolute -top-5 left-60 -z-1 w-18"
            initial={{ y: 95, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: -10, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.26 }}
          />
          <motion.img
            draggable="false"
            src="/icons/burger-1.png"
            className="absolute top-20 left-64 -z-1 w-18"
            initial={{ y: 80, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 8, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 8, delay: 0.28 }}
          />
          <motion.img
            draggable="false"
            src="/icons/vegetables.png"
            className="absolute top-40 left-60 -z-1 w-18"
            initial={{ y: 80, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 8, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 8, delay: 0.3 }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
