import type { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react'
import { BiBuildings } from 'react-icons/bi'
import { HiClock, HiUsers } from 'react-icons/hi'
import { MdInsertChart } from 'react-icons/md'
import type { FullCourse } from '../../types'
import getTermName from '../../utils/termUtils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  course: FullCourse
  onClick?: MouseEventHandler
  className?: string
  showSchool?: boolean
}

const CourseDegreeButton: FC<Props> = ({
  course,
  className,
  showSchool = true,
  ...props
}) => {
  return (
    <button
      key={course.id}
      type="button"
      className={`list-button flex-col justify-between ${className}`}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-1 whitespace-nowrap">
        <div className="flex items-center">
          <h2 className="flex items-center gap-1 text-base font-semibold text-slate-700 dark:text-white">
            <MdInsertChart
              style={{
                color: course.info.color,
              }}
            />
            {course.info.code}
          </h2>
          <p className="text-md text-base font-medium text-slate-500 dark:text-neutral-400">
            : {course.info.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showSchool && (
            <div
              className="flex items-center gap-1 rounded-md px-1 text-sm font-normal text-slate-500  dark:text-neutral-300"
              style={{
                color: course.info.school?.secondaryColor,
                backgroundColor: course.info.school?.color,
              }}
            >
              <BiBuildings />
              {course.info.school?.name}
            </div>
          )}
          <div className="flex items-center gap-0.5 text-sm font-light">
            <HiClock />
            <span>{course.info.credits}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default CourseDegreeButton
