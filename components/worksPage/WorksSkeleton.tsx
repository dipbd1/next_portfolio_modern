import Title from "../Title"
import WorkSkeleton from "./WorkSkeleton"
import SmoothSection from "../SmoothSection"

export default function WorksSkeleton() {
  return (
    <SmoothSection className="bg-gray-900">
      <Title name="works" />
      <ul className="grid grid-cols-2">
        <li className="relative vCustomLine py-10 px-12">
          <WorkSkeleton margin />
          <WorkSkeleton margin />
          <WorkSkeleton />
        </li>

        <li className="py-10 px-12">
          <WorkSkeleton margin />
          <WorkSkeleton margin />
          <WorkSkeleton />
        </li>
      </ul>
    </SmoothSection>
  )
}
