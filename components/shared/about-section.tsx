"use client"

import { motion, useInView } from "motion/react"
import Image from "next/image"
import { useRef } from "react"
import { cn } from "@/lib/utils"

const features = [
  {
    tag: "تشكيلة واسعة",
    title: "+100 متجر ومطعم وكافيه",
    desc: "اطلب من أكبر تشكيلة متاجر في بنها — مطاعم، كافيهات، بقالة، وصيدليات. كل حاجة في مكان واحد.",
    screen: "/about/screen-home.png"
  },
  {
    tag: "تتبع مباشر",
    title: "تابع أوردرك لحظة بلحظة",
    desc: "تتبع مباشر من لحظة الطلب لحد ما الديليفري يدق بابك. شوف الطلب رايح فين على الخريطة في الوقت الحقيقي.",
    screen: "/about/screen-orders.png"
  },
  {
    tag: "وفر أكتر",
    title: "أقوي العروض والخصومات",
    desc: "عروض حصرية يومية من أفضل المطاعم والمتاجر في بنها. ما تفوتش أي فرصة توفير على كل طلب.",
    screen: "/about/screen-offers.png"
  },
  {
    tag: "منيو كامل",
    title: "منيو وخيارات لا تنتهي",
    desc: "تصفح المنيو كامل، اختار وخصص أوردرك زي ما تحب. كل التفاصيل والصور بضغطة واحدة.",
    screen: "/about/screen-menu.png"
  }
]

function FeatureCard({
  tag,
  title,
  desc,
  screen,
  index,
  isInView
}: (typeof features)[0] & { index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col items-center gap-5 overflow-hidden rounded-[2rem] p-6 text-center",
        "ring-2 ring-[#281707] transition-shadow duration-300 hover:shadow-xl",
        "odd:bg-secondary even:bg-primary"
      )}
    >
      {/* Tag pill — accent color, locked in both modes */}
      <span className="inline-block rounded-full bg-[#6351d4] px-3 py-1 text-xs font-bold text-[#fff6f5]">
        {tag}
      </span>

      {/* Phone screenshot — dark background frames the screen in both modes */}
      <div className="relative overflow-hidden rounded-[1.25rem] bg-[#281707] shadow-2xl ring-4 ring-[#281707]">
        <Image
          src={screen}
          alt={title}
          width={240}
          height={480}
          className="h-56 w-auto object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Text — hardcoded dark, readable on both secondary (#fe5b24) and primary (#ddff00) */}
      <div className="space-y-2">
        <h3 className="text-xl leading-snug font-black text-[#281707]">{title}</h3>
        <p className="text-sm leading-relaxed font-medium text-[#281707]">{desc}</p>
      </div>
    </motion.div>
  )
}

export default function AboutSection() {
  const headingRef = useRef(null)
  const gridRef = useRef(null)
  const ctaRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" })
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" })
  const ctaInView = useInView(ctaRef, { once: true, margin: "-40px" })

  return (
    <section className="wrapper space-y-16 py-24">
      {/* Heading */}
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="space-y-5 text-center"
      >
        <span className="inline-block rounded-full bg-[#6351d4] px-5 py-1.5 text-sm font-bold text-[#fff6f5]">
          ليه مارتي؟
        </span>
        <h2 className="text-3xl leading-tight font-black md:text-4xl lg:text-5xl">
          تجربة توصيل مختلفة تماماً
        </h2>
        <p className="mx-auto max-w-lg text-lg font-medium text-muted-foreground">
          مارتي مش بس تطبيق توصيل — هو رفيقك اليومي اللي بيجيبلك كل حاجة لحد باب بيتك.
        </p>
      </motion.div>

      {/* Features grid */}
      <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} index={i} isInView={gridInView} />
        ))}
      </div>

      {/* CTA row — accent background, locked */}
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0, y: 24 }}
        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="flex flex-col items-center justify-center gap-8 rounded-[2rem] bg-[#6351d4] p-10 ring-2 ring-[#281707] md:flex-row md:gap-16"
      >
        <Image
          draggable="false"
          src="/nazl_elapp.png"
          alt="downlaod the app"
          width={1272}
          height={572}
          priority
          className="h-auto w-auto max-w-72"
        />

        <div className="space-y-5 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-[#fff6f5] md:text-3xl">
              حمّل مارتي دلوقتي!
            </h3>
            <p className="font-medium text-[#fff6f5]">
              متاح على Android وiOS — مجاناً تماماً
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.fourm.marty"
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:-translate-y-1"
            >
              <img
                src="/g-play.png"
                alt="Get it on Google Play"
                className="h-auto w-40"
              />
            </a>
            <a
              href="https://apps.apple.com/eg/app/marty/id6759621448"
              target="_blank"
              rel="noreferrer"
              className="transition-transform hover:-translate-y-1"
            >
              <img
                src="/app-store.png"
                alt="Download on the App Store"
                className="h-auto w-40"
              />
            </a>
          </div>
        </div>

        <Image
          src="/about/mascot-map.png"
          alt="مارتي بالخريطة"
          width={160}
          height={220}
          className="h-36 w-auto drop-shadow-xl"
        />
      </motion.div>
    </section>
  )
}
