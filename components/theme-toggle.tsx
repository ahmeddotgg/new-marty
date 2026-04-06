"use client"
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

type ThemeToggleProps = {
  className?: string
  variant?: "outline" | "ghost"
  size?: "icon-sm" | "icon-lg"
}
export function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon-lg"
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      aria-label="Toggle theme"
      className={cn(className)}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      size={size}
      variant={variant}
    >
      <HugeiconsIcon
        icon={Moon02Icon}
        className="absolute size-5 scale-100 rotate-0 transition-all! dark:scale-0 dark:rotate-90"
      />
      <HugeiconsIcon
        icon={Sun01Icon}
        className="size-5 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
      />
    </Button>
  )
}
