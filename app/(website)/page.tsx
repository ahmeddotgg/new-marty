import AboutSection from "@/components/shared/about-section"
import Hero from "@/components/shared/hero"
import HomeBrowseSection from "@/components/shared/home-browse-section"
import HomeFeaturedStores from "@/components/shared/home-featured-stores"

export default function Home() {
  return (
    <div>
      <Hero />
      <HomeFeaturedStores />
      <HomeBrowseSection />
      <AboutSection />
    </div>
  )
}
