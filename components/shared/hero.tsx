"use client"

import { useInView, motion } from "motion/react"
import { useRef } from "react"

export default function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div className="wrapper py-52">
      <div>
        <motion.h2
          ref={ref}
          initial="hidden"
          animate={isInView ? "show" : ""}
          variants={{
            show: { opacity: 1, y: 0, transition: { type: "spring" } },
            hidden: { opacity: 0, y: -18 }
          }}
          className="text-3xl leading-15 font-bold text-primary-foreground"
        >
          رفيقك اليومي لتوصيل الطلبات{" "}
          <span className="rounded-xl bg-accent px-2 whitespace-nowrap text-white">
            بسرعة وسهولة.
          </span>
          <br />
          بيتك التاني لتسوق المطاعم, <span className="whitespace-nowrap">ماركت</span>{" "}
          <br /> كافيهات, صيدليات.
        </motion.h2>
      </div>
    </div>
  )
}
