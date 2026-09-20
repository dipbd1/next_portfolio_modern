import AboutMe from "./AboutMe"
import BrandLogos from "./BrandLogos"
import Facts from "./Facts"
import MyServices from "./MyServices"
import Prices from "./Prices"
import Testimonials from "./Testimonials"
import Title from "../Title"
import SmoothSection from "../SmoothSection"

export default function About() {
  return (
    <SmoothSection>
      <Title name="about me" />
      <AboutMe />

      <Title name="my services" />
      <MyServices />

      <Title name="pricing" />
      <Prices />

      <Title name="clients" />
      <BrandLogos />

      <Title name="testimonials" />
      <Testimonials />

      <Title name="fun facts" />
      <Facts />
    </SmoothSection>
  )
}
