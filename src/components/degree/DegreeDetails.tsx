import type { Dispatch, SetStateAction, FC } from 'react'
import { HiClock } from 'react-icons/hi'
import type { FullCourse, FullDegree } from '../../types'
import { isCourseType } from '../../utils/courseUtils'
import Members from '../common/Members'
import CourseDegreeButton from '../course/CourseDegreeButton'
import SchoolTag from '../school/SchoolTag'
import SubjectRequirementButton from './NewDegreeForm/RequirementsForm/SubjectRequirements/SubjectRequirementButton'

interface Props {
  degree: FullDegree
  setCourseModalData: Dispatch<SetStateAction<FullCourse | null>>
}

const DegreeDetails: FC<Props> = ({ degree, setCourseModalData }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-slate-600 dark:text-neutral-100">
        {degree.name}
      </h1>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-sm font-light text-slate-500 dark:text-neutral-400">
          <div className="flex items-center gap-0.5">
            <HiClock />
            <span>{degree.credits} credits</span>
          </div>
          <Members number={degree.memberCount} />
          <p>For Admissions in {degree.admissionYear}</p>
        </div>
        <SchoolTag
          school={degree.school}
          className="px-1 py-0 text-sm font-normal"
        />
      </div>
      <h2 className="text-lg font-semibold text-slate-500">
        Course Requirements
      </h2>
      {[...Array(Number(degree.years))].map((_item, year) => (
        <div key={year} className="flex flex-col gap-1">
          <h3 className="text-md text-slate-400 dark:text-neutral-300">
            Year {year + 1} required courses
          </h3>
          <div className="flex flex-col gap-1">
            {degree.requiredCourses.map(
              (requiredCourse, index) =>
                requiredCourse.info.degreeYear === year + 1 && (
                  <div key={requiredCourse.id} className="flex items-center">
                    <CourseDegreeButton
                      course={requiredCourse}
                      onClick={() => setCourseModalData(requiredCourse)}
                    />
                  </div>
                )
            )}
            {degree.partialCourses.map(
              (partialCourse, index) =>
                partialCourse.degreeYear === year + 1 && (
                  <div
                    key={partialCourse.code + partialCourse.name + index}
                    className="list-button flex items-center justify-between gap-1"
                  >
                    <div className="flex items-center">
                      <h2 className="flex items-center gap-1 text-base font-semibold text-slate-700 dark:text-white">
                        {partialCourse.code}
                      </h2>
                      <p className="text-md text-base font-medium text-slate-500 dark:text-neutral-400">
                        : {partialCourse.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 text-sm font-light">
                      <HiClock />
                      <span>{partialCourse.credits}</span>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      ))}
      <h2 className="text-lg font-semibold text-slate-500 dark:text-neutral-200">
        Subject Requirements
      </h2>
      {degree.subjectRequirements.map((subjectRequirement, index) => (
        <div className="flex items-center gap-2" key={index}>
          <SubjectRequirementButton subjectRequirement={subjectRequirement} />
        </div>
      ))}
    </div>
  )
}

export default DegreeDetails
