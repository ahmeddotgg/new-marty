"use client"

import * as motion from "motion/react-client"
import Image from "next/image"
import Stores from "./stores"
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
      <DialogContent className="flex max-w-[calc(95%-1rem)] flex-col items-center gap-22 overflow-hidden bg-secondary sm:max-w-[calc(95%-1rem)] md:max-w-3xl md:flex-row md:justify-between md:gap-0">
        <div className="flex flex-col items-center gap-8 py-8">
          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, duration: 0.6 }}
          >
            <Image
              draggable="false"
              src="/nazl_elapp.png"
              alt="downlaod the app"
              width={256}
              height={459}
              priority
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.div
            className="flex flex-col gap-4"
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 18,
              duration: 0.6,
              delay: 0.1
            }}
          >
            <Stores />
          </motion.div>
        </div>

        <div className="relative h-60 w-87.5">
          <div className="absolute top-1/2 left-1/2 -z-10 size-82 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-primary/50 blur-2xl" />
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              duration: 600
            }}
            className="mx-auto max-w-56 -translate-y-14"
          >
            <Image
              draggable="false"
              src="/marty_hero.png"
              alt="marty logo"
              width={250}
              height={108}
              priority
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.div
            className="absolute -top-2 left-8 -z-1 w-18"
            initial={{ y: 70, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 12, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 8, delay: 0.2 }}
          >
            <Image
              draggable="false"
              src="/icons/fried-chicken.png"
              alt=""
              width={72}
              height={72}
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.div
            className="absolute top-18 left-0 -z-1 w-18"
            initial={{ y: 60, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 12, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 8, delay: 0.22 }}
          >
            <Image
              draggable="false"
              src="/icons/pizza-slice-1.png"
              alt=""
              width={72}
              height={72}
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.div
            className="absolute top-36 left-6 -z-1 w-18"
            initial={{ y: 95, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: -10, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.24 }}
          >
            <Image
              draggable="false"
              src="/icons/shopping-cart-1.png"
              alt=""
              width={72}
              height={72}
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.div
            className="absolute -top-5 left-60 -z-1 w-18"
            initial={{ y: 95, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: -10, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.26 }}
          >
            <Image
              draggable="false"
              src="/icons/medicine.png"
              alt=""
              width={72}
              height={72}
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.div
            className="absolute top-20 left-64 -z-1 w-18"
            initial={{ y: 80, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 8, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 8, delay: 0.28 }}
          >
            <Image
              draggable="false"
              src="/icons/burger-1.png"
              alt=""
              width={72}
              height={72}
              className="h-auto w-auto"
            />
          </motion.div>
          <motion.div
            className="absolute top-40 left-60 -z-1 w-18"
            initial={{ y: 80, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 8, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 8, delay: 0.3 }}
          >
            <Image
              draggable="false"
              src="/icons/vegetables.png"
              alt=""
              width={72}
              height={72}
              className="h-auto w-auto"
            />
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
