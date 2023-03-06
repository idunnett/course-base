import type { ButtonHTMLAttributes, FC, MouseEventHandler } from 'react'
import { MdInsertChart } from 'react-icons/md'
import {
  RiBuilding2Line,
  RiGroupLine,
  RiTimeLine,
  RiUser6Line,
} from 'react-icons/ri'
import type { FullCourse } from '../../types'
import getTermName from '../../utils/termUtils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  course: FullCourse
  onClick?: MouseEventHandler
  className?: string
  showSchool?: boolean
}

const FullCourseButton: FC<Props> = ({
  course,
  className,
  showSchool = true,
  ...props
}) => {
  return (
    <button
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
        <span className="whitespace-nowrap text-base font-normal text-slate-500 dark:text-neutral-300">
          {getTermName(course.term)} {course.year}
        </span>
      </div>

      <div className="flex w-full justify-between">
        <div className="flex gap-3 whitespace-nowrap text-sm font-light text-slate-600 dark:text-neutral-400">
          <div className="flex items-center gap-0.5">
            <RiTimeLine />
            <span>{course.info.credits}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <RiGroupLine />
            <span>{course._count.users}</span>
          </div>
          <div className="flex items-center gap-1">
            <RiUser6Line className="translate-y-[1px]" />
            <span>{course.instructor}</span>
          </div>
        </div>
        {showSchool && (
          <div
            className="flex items-center gap-1 rounded-md px-1 text-sm font-normal text-slate-500  dark:text-neutral-300"
            style={{
              color: course.info.school.secondaryColor,
              backgroundColor: course.info.school.color,
            }}
          >
            <RiBuilding2Line />
            {course.info.school.name}
          </div>
        )}
      </div>
    </button>
  )
}

export default FullCourseButton
