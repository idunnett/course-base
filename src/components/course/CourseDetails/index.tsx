import { useState, FC } from 'react'
import { MdInsertChart } from 'react-icons/md'
import SegmentList from './SegmentList'
import SegmentPieChart from '../../diagrams/SegmentPieChart'
import { FullCourse } from '../../../types'
import { HiUsers } from 'react-icons/hi'
import { BiBuildings } from 'react-icons/bi'

interface Props {
  course: FullCourse
}

const CourseDetails: FC<Props> = ({ course }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  return (
    <div className="relative flex w-full flex-col items-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center">
          <h2 className="flex items-center gap-1 text-3xl font-bold text-slate-700 dark:text-white">
            <MdInsertChart
              style={{
                color: course.color,
              }}
            />
            {course.code}
          </h2>
          <p className="text-3xl font-medium text-slate-500 dark:text-neutral-400">
            : {course.name}
          </p>
        </div>
        <div className="flex gap-4">
          <p className="text-md flex items-center gap-1 whitespace-nowrap font-normal text-slate-500 dark:text-neutral-400">
            <HiUsers />
            <span>
              {course.memberCount} member
              {course.memberCount !== 1 && 's'}
            </span>
          </p>
          <div
            className="text-md flex items-center gap-1 rounded-md px-1 font-normal text-slate-500  dark:text-neutral-300"
            style={{
              color: course.school.secondaryColor,
              backgroundColor: course.school.color,
            }}
          >
            <BiBuildings />
            {course.school.name}
          </div>
        </div>
      </div>
      <SegmentPieChart
        segments={course.segments.map((seg) => {
          const dataEntry = {
            ...seg,
            color: course.color ?? '#64748b',
            title: seg.name,
          }
          return dataEntry
        })}
        hoveredSegment={hoveredSegment}
        setHoveredSegment={setHoveredSegment}
      />
      <SegmentList
        selectedCourse={course}
        hoveredSegment={hoveredSegment}
        setHoveredSegment={setHoveredSegment}
      />
    </div>
  )
}

export default CourseDetails
