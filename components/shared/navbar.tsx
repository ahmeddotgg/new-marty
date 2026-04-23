"use client"

import { PhoneArrowDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeToggle } from "../theme-toggle"
import { Button } from "../ui/button"
import MobileSheet from "./mobile-sheet"
import { cn } from "@/lib/utils"
import { useBanner } from "@/store/banner"

export const links = [
  { title: "الرئيسية", href: "/" },
  { title: "المتاجر", href: "/stores" },
  { title: "العروض", href: "/offers" }
]

export default function Navbar() {
  const pathname = usePathname()
  const setIsOpen = useBanner((state) => state.setIsOpen)
  const { resolvedTheme } = useTheme()
  const [logo, setLogo] = useState("/logo.svg")

  useEffect(() => {
    if (resolvedTheme === "dark") {
      setLogo("/logo_dark.svg")
    } else {
      setLogo("/logo.svg")
    }
  }, [resolvedTheme])
  return (
    <div className="wrapper py-6">
      <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-2 font-semibold shadow-2xl ring-1 ring-border sm:gap-6">
        <MobileSheet />

        <Image
          src={logo}
          alt="Logo"
          loading="eager"
          width={249.74}
          height={107.82}
          draggable="false"
          className="me-auto w-auto max-w-26 md:me-0 md:max-w-32"
        />

        <div className="hidden flex-1 items-center justify-center gap-4 text-xl md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/")
            return (
              <Link
                href={link.href}
                key={link.title}
                className={cn(
                  active && "text-secondary",
                  "transition-colors hover:text-secondary"
                )}
              >
                {link.title}
              </Link>
            )
          })}
          <a
            href="https://wa.me/201288249293"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-secondary"
          >
            أتصل بنا
          </a>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer font-semibold"
            size="lg"
          >
            <HugeiconsIcon
              icon={PhoneArrowDownIcon}
              strokeWidth={2.5}
              className="size-5"
            />
            حمل التطبيق
            <span className="hidden sm:block">الأن</span>
          </Button>
          <div className="ms-1 hidden md:block">
            <ThemeToggle size="icon-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
