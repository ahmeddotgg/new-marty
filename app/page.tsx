import Banner from "@/components/client/banner"
import FuturedStores from "@/components/client/futured-stores"
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
