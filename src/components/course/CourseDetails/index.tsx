import { useState, type FC } from 'react'
import { MdInsertChart } from 'react-icons/md'
import SegmentList from './SegmentList'
import SegmentPieChart from '../../diagrams/SegmentPieChart'
import type { FullCourse, FullCourseInfo } from '../../../types'
import { HiUsers } from 'react-icons/hi'
import { BiBuildings } from 'react-icons/bi'
import { IoIosArrowBack } from 'react-icons/io'
import getTermName from '../../../utils/termUtils'

interface Props {
  courseInfo: FullCourseInfo
}

const CourseDetails: FC<Props> = ({ courseInfo }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const [activeCourseDetails, setActiveCourseDetails] =
    useState<FullCourse | null>()

  function setActiveCourseDetailsIndex(index: number) {
    if (!courseInfo) return
    const courseDetails = courseInfo.courses[index]
    if (!courseDetails) return
    const { courses, ...info } = courseInfo
    setActiveCourseDetails({
      ...courseDetails,
      info,
    })
  }

  return (
    <div className="relative flex w-full flex-col items-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-start gap-1">
          <MdInsertChart
            className="mt-1 text-2xl"
            style={{
              color: courseInfo.color,
            }}
          />
          <h2 className="text-2xl font-bold text-slate-700 dark:text-white">
            {courseInfo.code}
            <span className="font-medium text-slate-500 dark:text-neutral-400">
              : {courseInfo.name}
            </span>
          </h2>
        </div>
        {activeCourseDetails ? (
          <div className="flex flex-col items-center gap-5">
            <div className="flex w-full">
              <button
                className="secondary-btn flex items-center py-0"
                onClick={() => setActiveCourseDetails(null)}
              >
                <IoIosArrowBack />
                Variations
              </button>
            </div>
            <div className="flex gap-4">
              <p className="text-md flex items-center gap-1 whitespace-nowrap font-normal text-slate-500 dark:text-neutral-400">
                <HiUsers />
                <span>
                  {activeCourseDetails.members} member
                  {activeCourseDetails.members !== 1 && 's'}
                </span>
              </p>
              <div
                className="text-md flex items-center gap-1 rounded-md px-1 font-normal text-slate-500  dark:text-neutral-300"
                style={{
                  color: courseInfo.school.secondaryColor,
                  backgroundColor: courseInfo.school.color,
                }}
              >
                <BiBuildings />
                {courseInfo.school.name}
              </div>
            </div>
            <div className="my-4">
              <SegmentPieChart
                segments={activeCourseDetails.segments.map((seg) => {
                  const dataEntry = {
                    ...seg,
                    color: courseInfo.color ?? '#64748b',
                    title: seg.name,
                  }
                  return dataEntry
                })}
                hoveredSegment={hoveredSegment}
                setHoveredSegment={setHoveredSegment}
              />
            </div>
            <SegmentList
              selectedCourse={activeCourseDetails}
              hoveredSegment={hoveredSegment}
              setHoveredSegment={setHoveredSegment}
            />
          </div>
        ) : (
          <div className="flex flex-col">
            {courseInfo.courses.map((course, index) => (
              <button
                key={course.id}
                className="list-button text-base font-normal"
                onClick={() => setActiveCourseDetailsIndex(index)}
              >
                {getTermName(course.term)} {course.year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetails
