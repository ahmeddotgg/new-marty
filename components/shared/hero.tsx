"use client"

import { useInView, motion } from "motion/react"
import { useRef } from "react"

export default function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div className="wrapper grid grid-cols-1 justify-items-center gap-8 py-8 sm:py-12 md:grid-cols-2 md:items-center lg:py-16">
      <div className="space-y-6">
        <motion.h2
          ref={ref}
          initial="hidden"
          animate={isInView ? "show" : ""}
          variants={{
            show: { opacity: 1, y: 0, transition: { type: "spring" } },
            hidden: { opacity: 0, y: -18 }
          }}
          className="text-center text-2xl leading-11 font-bold text-balance text-primary-foreground md:text-start md:text-4xl md:leading-16"
        >
          رفيقك اليومي لتوصيل الطلبات{" "}
          <span className="rounded-xl bg-accent px-2 whitespace-nowrap text-white">
            بسرعة وسهولة.
          </span>
          <br />
          بيتك التاني لتوصيل الطلبات.
        </motion.h2>
        <motion.div
          className="mx-auto flex max-w-sm items-center gap-4 md:mx-0"
          ref={ref}
          initial="hidden"
          animate={isInView ? "show" : ""}
          variants={{
            show: { opacity: 1, y: 0, transition: { type: "spring", delay: 0.11 } },
            hidden: { opacity: 0, y: -18 }
          }}
        >
          {/* <AppStoreButton
            tabIndex={-1}
            href="https://play.google.com/store/apps/details?id=com.fourm.marty"
            lang="en-EN"
            store="google"
          />
          <AppStoreButton
            tabIndex={-1}
            href="https://apps.apple.com/eg/app/marty/id6759621448"
            lang="en-EN"
            store="apple"
          /> */}
        </motion.div>
      </div>
      <motion.img
        src="/showcase.png"
        alt="app showcase"
        className="inline-block w-full max-w-lg"
        ref={ref}
        initial="hidden"
        animate={isInView ? "show" : ""}
        variants={{
          show: { opacity: 1, y: 0, transition: { type: "spring", delay: 0.1 } },
          hidden: { opacity: 0, y: -18 }
        }}
      />
    </div>
  )
}
