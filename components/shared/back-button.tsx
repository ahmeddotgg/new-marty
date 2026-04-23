"use client"

import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 rounded-full bg-secondary px-5 py-2 text-sm font-bold text-foreground transition-all hover:bg-secondary/70"
    >
      {/* Right-pointing chevron — correct "back" direction in RTL */}
      <svg
        className="size-4 transition-transform group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
      رجوع
    </button>
  )
}
