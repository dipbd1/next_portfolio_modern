import {
  BsAwardFill,
  BsCodeSlash,
  BsFillSuitSpadeFill,
  BsJournalAlbum,
} from "react-icons/bs"
import Fact from "./Fact"

export default function Facts() {
  return (
    <ul className="grid grid-cols-2 mb-12 logos sm:grid-cols-4">
      <Fact Icon={BsJournalAlbum} desc="100+ Albums Listened" border />
      <Fact Icon={BsAwardFill} desc="11+ Awards Won" border />
      <Fact Icon={BsCodeSlash} desc="100,000+ Lines Written" border />
      <Fact Icon={BsFillSuitSpadeFill} desc="29 is most favorite game" />
    </ul>
  )
}
