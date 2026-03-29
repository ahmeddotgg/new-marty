"use client"
import Marquee from "react-fast-marquee"

const futured_stores = [
  {
    name: "حاتي ابو الخير",
    image: "/futured-stores/ابو-الخير.jpg"
  },
  {
    name: "بروستاكي",
    image: "/futured-stores/بروستاكي.jpg"
  },
  {
    name: "السيد الرفاعي",
    image: "/futured-stores/السيد-الرفاعي.jpg"
  },
  {
    name: "الونش",
    image: "/futured-stores/الونش.jpg"
  },
  {
    name: "انجوس برجر",
    image: "/futured-stores/انجوس.jpg"
  },
  {
    name: "فواز السوري",
    image: "/futured-stores/فواز.jpg"
  },
  {
    name: "تشكن هت",
    image: "/futured-stores/تشكن-هت.jpg"
  }
]

export default function FuturedStores() {
  return (
    <div className="wrapper py-14" dir="ltr">
      <Marquee
        className="mask-r-from-90% mask-l-from-90% py-8 select-none"
        pauseOnClick
        pauseOnHover
        autoFill
        speed={30}
      >
        {futured_stores.map((store) => (
          <div key={store.name} className="px-4">
            <img
              draggable="false"
              src={store.image}
              alt={store.name}
              className="inline-block size-22 rounded-full ring-2"
            />
          </div>
        ))}
      </Marquee>
    </div>
  )
}
