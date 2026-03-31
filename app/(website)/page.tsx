import Banner from "@/components/shared/banner"
import FuturedStores from "@/components/shared/futured-stores"
import Hero from "@/components/shared/hero"
import Navbar from "@/components/shared/navbar"

export default function Home() {
  return (
    <div>
      <Banner />
      <Navbar />
      <Hero />
      <FuturedStores />
    </div>
  )
}
