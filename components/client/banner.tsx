"use client"

import * as motion from "motion/react-client"
import { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useBanner } from "@/store/banner"

export default function Banner() {
  const open = useBanner((state) => state.open)
  const setIsOpen = useBanner((state) => state.setIsOpen)

  useEffect(() => {
    const lastSeen = localStorage.getItem("banner-last-seen")
    const now = Date.now()
    const week = 7 * 24 * 60 * 60 * 1000

    if (!lastSeen || now - parseInt(lastSeen) > week) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem("banner-last-seen", now.toString())
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="flex max-h-96 items-start justify-center gap-12 overflow-hidden bg-secondary sm:max-w-4xl">
        <div className="space-y-6 pt-6">
          <motion.img
            draggable="false"
            src="/nazl_elapp.png"
            alt="downlaod the app"
            className="max-w-96"
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, duration: 0.6 }}
          />
          <div className="flex items-center justify-center gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.fourm.marty"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              className="focus-visible:ring-2"
            >
              <img
                draggable="false"
                src="/google-play-badge.svg"
                alt="google play button"
                className="w-full max-w-36"
              />
            </a>
            <a
              href="https://apps.apple.com/eg/app/marty/id6759621448"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
            >
              <img
                draggable="false"
                src="/play-store-badge.svg"
                alt="google play button"
                className="w-full max-w-36"
              />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 size-72 rounded-full border-2 bg-primary/50 blur-2xl"></div>
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
            src="/marty_hero.png"
            alt="marty logo"
            className={cn("animate- max-w-72 -translate-y-12")}
          />
          <motion.img
            draggable="false"
            src="/icons/burger-1.png"
            className="absolute top-10 left-[6%] -z-1 w-22"
            initial={{ y: 80, rotate: -12, opacity: 0 }}
            animate={{ y: 0, rotate: 8, opacity: 1 }} // rotate target not zero
            transition={{ type: "spring", stiffness: 180, damping: 8, delay: 0.1 }}
          />
          <motion.img
            draggable="false"
            src="/icons/shopping-cart-1.png"
            className="absolute top-5/12 left-[60%] -z-1 w-22"
            initial={{ y: 95, rotate: 15, opacity: 0 }}
            animate={{ y: 0, rotate: -10, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.25 }}
          />
          <motion.img
            draggable="false"
            src="/icons/fried-chicken.png"
            className="absolute top-0 left-[65%] -z-1 w-22"
            initial={{ y: 70, rotate: -18, opacity: 0 }}
            animate={{ y: 0, rotate: 12, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 8, delay: 0.4 }}
          />
          <motion.img
            draggable="false"
            src="/icons/seafood-platter.png"
            className="absolute top-5/12 -left-[8%] -z-1 w-22"
            initial={{ y: 85, rotate: 10, opacity: 0 }}
            animate={{ y: 0, rotate: -6, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 9, delay: 0.55 }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
