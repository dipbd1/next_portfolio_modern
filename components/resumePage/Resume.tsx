import Testimonial from "../Testimonial"
import Title from "../Title"
import MyResume from "./MyResume"
import Skills from "./Skills"
import { quoteData } from "../../data"
import SmoothSection from "../SmoothSection"

export default function Resume() {
  return (
    <SmoothSection>
      <Title name="resume" />
      <MyResume />

      <Title name="skills" />
      <Skills />

      <Title name="quote" />
      <Testimonial testimonial={quoteData} />
    </SmoothSection>
  )
}
