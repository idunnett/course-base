import type { CourseInfo } from '@prisma/client'
import { type FC, useEffect, useState } from 'react'
import { RiTimeLine } from 'react-icons/ri'
import type {
  CourseInfoWithSchool,
  CreateDegreeFormData,
  CreatePartialCourse,
  CreateSubjectRequirement,
} from '../../../../types'
import CourseRequirements from './CourseRequirements'
import SubjectRequirements from './SubjectRequirements'

interface Props {
  name: string
  degreeYears: string
  credits: string
  courseInfos: Array<CourseInfoWithSchool | CreatePartialCourse>
  subjectRequirements: Array<CreateSubjectRequirement>
  updateFields: (fields: Partial<CreateDegreeFormData>) => void
}

const RequirementsForm: FC<Props> = ({
  name,
  degreeYears,
  credits,
  courseInfos,
  subjectRequirements,
  updateFields,
}) => {
  const [currentTotalCredits, setCurrentTotalCredits] = useState(
    courseInfos
      .map((c) =>
        typeof c.credits === 'string' ? parseFloat(c.credits) : c.credits
      )
      .reduce((a, b) => a + b, 0)
  )

  useEffect(() => {
    setCurrentTotalCredits(
      courseInfos
        .map((c) =>
          typeof c.credits === 'string' ? parseFloat(c.credits) : c.credits
        )
        .reduce((a, b) => a + b, 0) +
        subjectRequirements
          .map((s) => parseFloat(s.credits))
          .reduce((a, b) => a + b, 0)
    )
  }, [courseInfos, subjectRequirements])

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-1 text-3xl font-bold text-slate-500 dark:text-neutral-200">
        {name}
      </h1>
      <div className="flex justify-between text-slate-500 dark:text-neutral-200">
        <h2 className="text-xl font-semibold">Course Requirements</h2>
        <div className="flex items-center gap-2 text-lg">
          <RiTimeLine />
          <p>
            <span
              className={`${
                currentTotalCredits < parseFloat(credits) && 'text-red-300'
              }`}
            >
              {currentTotalCredits}
            </span>
            /{credits || 0}
          </p>
        </div>
      </div>
      <CourseRequirements
        degreeYears={degreeYears}
        courseInfos={courseInfos}
        updateFields={updateFields}
      />
      <SubjectRequirements
        subjectRequirements={subjectRequirements}
        updateFields={updateFields}
      />
    </div>
  )
}

export default RequirementsForm
