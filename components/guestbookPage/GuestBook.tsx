import Title from "../Title"
import GuestComments from "./GuestComments"
import GuestForm from "./GuestForm"
import SmoothSection from "../SmoothSection"

export default function GuestBook() {
  return (
    <SmoothSection id="guestComments">
      <Title name="guest book" />
      <section className="px-12 py-8">
        <GuestForm />
        <GuestComments />
      </section>
    </SmoothSection>
  )
}
