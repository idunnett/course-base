import type { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react'
import { MdInsertChart } from 'react-icons/md'
import { RiBuilding2Line, RiTimeLine } from 'react-icons/ri'
import type { FullCourseInfo } from '../../types'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  courseInfo: FullCourseInfo
  onClick?: MouseEventHandler
  className?: string
  showSchool?: boolean
}

const courseInfoDegreeButton: FC<Props> = ({
  courseInfo,
  className,
  showSchool = true,
  ...props
}) => {
  return (
    <button
      key={courseInfo.id}
      type="button"
      className={`list-button flex-col justify-between ${className}`}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-1 whitespace-nowrap">
        <div className="flex items-center">
          <h2 className="flex items-center gap-1 text-base font-semibold text-slate-700 dark:text-white">
            <MdInsertChart
              style={{
                color: courseInfo.color,
              }}
            />
            {courseInfo.code}
          </h2>
          <p className="text-md text-base font-medium text-slate-500 dark:text-neutral-400">
            : {courseInfo.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showSchool && (
            <div
              className="flex items-center gap-1 rounded-md px-1 text-sm font-normal text-slate-500  dark:text-neutral-300"
              style={{
                color: courseInfo.school.secondaryColor,
                backgroundColor: courseInfo.school.color,
              }}
            >
              <RiBuilding2Line />
              {courseInfo.school.name}
            </div>
          )}
          <div className="flex items-center gap-0.5 text-sm font-light">
            <RiTimeLine />
            <span>{courseInfo.credits}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default courseInfoDegreeButton
