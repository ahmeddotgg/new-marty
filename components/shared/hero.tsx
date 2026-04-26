"use client"

import { useInView, motion } from "motion/react"
import Image from "next/image"
import { useRef } from "react"
import Stores from "./stores"

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
          className="text-center text-2xl leading-11 font-bold text-balance text-foreground md:text-start md:text-4xl md:leading-16"
        >
          رفيقك اليومي لتوصيل الطلبات{" "}
          <span className="rounded-xl bg-accent px-2 whitespace-nowrap text-white">
            بسرعة وسهولة.
          </span>
          <br />
          بيتك التاني لتوصيل الطلبات.
        </motion.h2>
        <motion.div
          className="flex items-center justify-center gap-4 md:justify-start"
          ref={ref}
          initial="hidden"
          animate={isInView ? "show" : ""}
          variants={{
            show: { opacity: 1, y: 0, transition: { type: "spring", delay: 0.11 } },
            hidden: { opacity: 0, y: -18 }
          }}
        >
          <Stores />
        </motion.div>
      </div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "show" : ""}
        variants={{
          show: { opacity: 1, y: 0, transition: { type: "spring", delay: 0.1 } },
          hidden: { opacity: 0, y: -18 }
        }}
      >
        <Image
          src="/showcase.png"
          alt="app showcase"
          loading="eager"
          width={599}
          height={560}
          className="h-auto w-auto"
        />
      </motion.div>
    </div>
  )
}
