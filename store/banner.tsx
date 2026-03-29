import { create } from "zustand"
type BannerState = {
  open: boolean
  setIsOpen: (open: boolean) => void
}

export const useBanner = create<BannerState>((set) => ({
  open: false,
  setIsOpen: (open: boolean) => set({ open })
}))
