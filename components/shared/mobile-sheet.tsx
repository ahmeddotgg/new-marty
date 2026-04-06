"use client"

import { Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeToggle } from "../theme-toggle"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"
import { links } from "./navbar"
import Stores from "./stores"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export default function MobileSheet() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const { resolvedTheme } = useTheme()
  const [logo, setLogo] = useState("/logo.svg")

  useEffect(() => {
    if (resolvedTheme === "dark") {
      setLogo("/logo_dark.svg")
    } else {
      setLogo("/logo.svg")
    }
  }, [resolvedTheme])

  useEffect(() => {
    if (!isMobile) {
      setOpen(false)
    }
  }, [isMobile])

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      <SheetTrigger
        render={
          <Button size="icon-lg" variant="outline" className="md:hidden">
            <HugeiconsIcon icon={Menu01Icon} className="size-5" />
          </Button>
        }
      />
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle className="gap-2 py-3">
            <Image
              src={logo}
              alt="Logo"
              loading="eager"
              width={249.74}
              height={107.82}
              draggable="false"
              className="me-auto w-auto max-w-32 md:me-0"
            />
            <ThemeToggle variant="outline" />
          </SheetTitle>
          <SheetDescription></SheetDescription>
          <SheetClose />
        </SheetHeader>
        <div className="flex flex-col gap-8 p-4">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.title}
              className="text-lg font-bold transition-colors hover:text-secondary"
              onClick={() => setOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          <a
            href="https://wa.me/201288249293"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold transition-colors hover:text-secondary"
          >
            أتصل بنا
          </a>
        </div>
        <div className="flex gap-2 p-4">
          <Stores />
        </div>
      </SheetContent>
    </Sheet>
  )
}
