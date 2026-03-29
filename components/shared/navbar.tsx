"use client"

import { PhoneArrowDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
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

  return (
    <div className="wrapper px-2 py-6 lg:px-0">
      <div className="flex items-center gap-3 font-semibold sm:gap-6">
        <img
          src="/logo.png"
          alt="Logo"
          draggable="false"
          className="me-auto w-auto max-w-28 md:me-0"
        />
        <div className="hidden flex-1 gap-4 text-xl md:flex">
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
        </div>
      </div>
    </div>
  )
}
