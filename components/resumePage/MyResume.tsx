import IconTitle from "./IconTitle"
import ResumeItem from "./ResumeItem"
import { FaGraduationCap, FaNetworkWired } from "react-icons/fa"
import ResumeSkeleton from "./ResumeSkeleton"
import resumeOperations from "../../graphqlOperations/resume"
import { ExperienceData } from "../../types"
import { useQuery } from "@apollo/client"
import { useMemo } from "react"

interface ExperienceQuery {
  resumes: ExperienceData[]
}

export default function MyResume() {
  const { data, error } = useQuery<ExperienceQuery>(
    resumeOperations.Queries.getExperience
  )

  const filteredData = useMemo<[ExperienceData[], ExperienceData[]] | undefined>(() => {
    if (!data) return undefined;

    const experience: ExperienceData[] = [];
    const education: ExperienceData[] = [];

    data.resumes.forEach((r) => {
      if (r.experience) {
        experience.push(r);
      } else {
        education.push(r);
      }
    });

    const sortByBadge = (a: ExperienceData, b: ExperienceData) => {
      const aIsPresent = a.badge.includes("Present");
      const bIsPresent = b.badge.includes("Present");

      if (aIsPresent && !bIsPresent) return -1; // "Present" comes first
      if (!aIsPresent && bIsPresent) return 1;  // "Present" comes last

      const parseYear = (badge: string) => parseInt(badge.match(/(\d{4})/)?.[1] || "0", 10);
      return parseYear(b.badge) - parseYear(a.badge);
    };

    experience.sort(sortByBadge);
    education.sort(sortByBadge);

    return [experience, education];
  }, [data]);

  if (error) console.log(error)

  return (
    <ul className="grid sm:grid-cols-2 grid-cols-1">
      <li className="py-8 px-12">
        <IconTitle title="experience" Icon={FaNetworkWired} />

        {filteredData === undefined ? (
          <>
            <ResumeSkeleton border />
            <ResumeSkeleton border />
            <ResumeSkeleton />
          </>
        ) : (
          filteredData[0].map((r, idx) => (
            <ResumeItem
              key={r.id}
              resume={r}
              border={idx !== filteredData[0].length - 1}
            />
          ))
        )}
      </li>

      <li className="py-8 px-12 relative vCustomLine sm:before:block before:hidden before:left-0">
        <IconTitle title="education" Icon={FaGraduationCap} />

        {filteredData === undefined ? (
          <>
            <ResumeSkeleton border />
            <ResumeSkeleton border />
            <ResumeSkeleton />
          </>
        ) : (
          filteredData[1].map((r, idx) => (
            <ResumeItem
              key={r.id}
              resume={r}
              border={idx !== filteredData[1].length - 1}
            />
          ))
        )}
      </li>
    </ul>
  )
}
