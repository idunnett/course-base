import { useState, type FC } from 'react'
import { MdInsertChart } from 'react-icons/md'
import SegmentList from './SegmentList'
import SegmentPieChart from '../../diagrams/SegmentPieChart'
import type { FullCourse, FullCourseInfo } from '../../../types'
import { HiClock, HiUsers } from 'react-icons/hi'
import { BiBuildings } from 'react-icons/bi'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import getTermName from '../../../utils/termUtils'
import Members from '../../common/Members'

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
      <div className="flex w-full flex-col items-center gap-2">
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
        <div
          className="flex w-min items-center gap-1 whitespace-nowrap rounded-md px-1 text-sm font-normal text-slate-500  dark:text-neutral-300"
          style={{
            color: courseInfo.school.secondaryColor,
            backgroundColor: courseInfo.school.color,
          }}
        >
          <BiBuildings />
          {courseInfo.school.name}
        </div>
        {activeCourseDetails ? (
          <div className="flex flex-col items-center gap-4 pt-2">
            <div className="flex w-full">
              <button
                className="text-link flex items-center gap-0.5"
                onClick={() => setActiveCourseDetails(null)}
              >
                <IoIosArrowBack />
                All Variations
              </button>
            </div>
            <div className="flex w-full flex-col items-start gap-1 px-8">
              <p className="text-md whitespace-nowrap font-normal text-slate-500 dark:text-neutral-400">
                {getTermName(activeCourseDetails.term)}{' '}
                {activeCourseDetails.year}
              </p>
              <p className="text-md whitespace-nowrap font-normal text-slate-500 dark:text-neutral-400">
                {activeCourseDetails.instructor}
              </p>
              <div className="flex gap-4 text-slate-500 dark:text-neutral-400">
                <Members number={activeCourseDetails.members} />
                <div className="flex items-center gap-0.5">
                  <HiClock />
                  <span>{courseInfo.credits} credits</span>
                </div>
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
          <div className="bg flex w-full flex-col items-center gap-2 pt-2">
            <div className="flex w-full flex-col gap-2">
              <h2 className="text-slate-500 dark:text-neutral-400">
                Course Variations
              </h2>
              <button className="list-button flex items-center justify-center py-1 text-green-500 hover:text-green-500">
                +
              </button>
              {courseInfo.courses.map((course, index) => (
                <button
                  key={course.id}
                  className="list-button flex w-full items-center justify-between text-base font-normal"
                  onClick={() => setActiveCourseDetailsIndex(index)}
                >
                  {getTermName(course.term)} {course.year}
                  <IoIosArrowForward />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetails
