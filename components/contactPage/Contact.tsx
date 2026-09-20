import Title from "../Title"
import ContactForm from "./ContactForm"
import Location from "./Location"
import SmoothSection from "../SmoothSection"

export default function Contact() {
  return (
    <SmoothSection>
      <Title name="get in touch" />
      <Location />

      <Title name="contact form" />
      <ContactForm />
    </SmoothSection>
  )
}
