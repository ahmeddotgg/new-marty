import type { Metadata } from "next"
import "./globals.css"
import localFont from "next/font/local"
import { PropsWithChildren } from "react"
import Banner from "@/components/shared/banner"
import Navbar from "@/components/shared/navbar"
import { DirectionProvider } from "@/components/ui/direction"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Marty - مارتي",
  description: `تطبيق مارتي هو رفيقك اليومي لتوصيل الطلبات في بنها بسرعة وسهولة. سواء كنت تريد وجبات من مطاعمك المفضلة، مشروبات من الكافيهات، أو مستلزمات من البقالة، نوفر لك تجربة طلب سهلة وآمنة مع تتبع مباشر للطلب حتى باب منزلك. استمتع بعروض حصرية، طرق دفع متعددة، ودعم دائم لخدمتك على مدار الساعة.`
}

const graphik = localFont({
  src: [
    {
      path: "../fonts/graphik/GraphikArabic-Regular.woff2",
      weight: "400"
    },
    {
      path: "../fonts/graphik/GraphikArabic-Medium.woff2",
      weight: "500"
    },
    {
      path: "../fonts/graphik/GraphikArabic-Semibold.woff2",
      weight: "600"
    },
    {
      path: "../fonts/graphik/GraphikArabic-Bold.woff2",
      weight: "700"
    }
  ],
  variable: "--graphik",
  preload: false
})

const nohemi = localFont({
  src: [
    {
      path: "../fonts/nohemi/Nohemi-Regular.woff2",
      weight: "400"
    },
    {
      path: "../fonts/nohemi/Nohemi-Black.woff2",
      weight: "900"
    }
  ],
  variable: "--nohemi",
  preload: false
})

const inter = localFont({
  src: [
    {
      path: "../fonts/inter/Inter-Regular.woff2",
      weight: "400"
    },
    {
      path: "../fonts/inter/Inter-Black.woff2",
      weight: "900"
    }
  ],
  variable: "--inter",
  preload: false
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(graphik.variable, nohemi.variable, inter.variable)}
      suppressHydrationWarning
    >
      <body>
        <DirectionProvider direction="rtl">
          <Banner />
          <Navbar />
          {children}
        </DirectionProvider>
      </body>
    </html>
  )
}
