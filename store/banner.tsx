import { create } from "zustand"

const COOKIE_NAME = "banner-seen"
const WEEK = 60 * 60 * 24 * 7

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match?.[2]
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`
}

type BannerState = {
  open: boolean
  init: () => void
  setIsOpen: (open: boolean) => void
  markSeen: () => void
}

export const useBanner = create<BannerState>((set) => ({
  open: false,

  init: () => {
    const seen = getCookie(COOKIE_NAME)

    if (!seen) {
      setTimeout(() => {
        set({ open: true })
      }, 1200)
    }
  },

  setIsOpen: (open) => set({ open }),

  markSeen: () => {
    setCookie(COOKIE_NAME, "1", WEEK)
  }
}))
