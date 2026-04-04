"use client"

import * as motion from "motion/react-client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type StoreTabsProps = {
  workingHours?: {
    opensAt?: string | null
    closesAt?: string | null
  } | null
  branches: {
    name: string
    address: string
    mapsUrl?: string | null
    phone: string
    id?: string | null
  }[]
}

const formatTime = (value?: string | null) => {
  if (!value) {
    return "غير محدد"
  }

  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value))
}

export default function StoreTabs({ workingHours, branches }: StoreTabsProps) {
  const [activeTab, setActiveTab] = useState("menu")

  return (
    <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <TabsList className="w-full bg-border">
          <TabsTrigger className="py-4" value="menu">
            المنيو
          </TabsTrigger>
          <TabsTrigger className="py-4" value="offers">
            العروض
          </TabsTrigger>
          <TabsTrigger className="py-4" value="branches">
            الفروع
          </TabsTrigger>
        </TabsList>
      </motion.div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-6"
      >
        <TabsContent value="menu" className="rounded-4xl bg-accent p-6 text-white">
          سيتم اضافة المنيو قريباً.
        </TabsContent>

        <TabsContent value="offers" className="rounded-4xl bg-accent p-6 text-white">
          لا توجد عروض معروضة حالياً.
        </TabsContent>

        <TabsContent value="branches" className="rounded-4xl text-white">
          <div className="space-y-4">
            <div className="rounded-4xl bg-accent p-6 text-white">
              <h2 className="text-lg font-bold">ساعات العمل</h2>
              <p className="mt-2">
                من {formatTime(workingHours?.opensAt)} إلى{" "}
                {formatTime(workingHours?.closesAt)}
              </p>
            </div>

            {branches.map((branch) => (
              <div
                key={branch.id ?? `${branch.name}-${branch.phone}`}
                className="rounded-4xl bg-accent p-6 text-white"
              >
                <h3 className="text-xl font-bold">{branch.name}</h3>
                <div className="mt-4 space-y-2">
                  <p>العنوان: {branch.address}</p>
                  <p>رقم الهاتف: {branch.phone}</p>
                  {branch.mapsUrl ? (
                    <p>
                      الموقع:{" "}
                      <a
                        href={branch.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold underline underline-offset-4"
                      >
                        افتح الخريطة
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </motion.div>
    </Tabs>
  )
}
