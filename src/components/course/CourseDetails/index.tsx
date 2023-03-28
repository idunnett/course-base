import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState, type FC } from 'react'
import { MdInsertChart } from 'react-icons/md'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { RiBuilding2Line, RiTimeLine, RiUser6Line } from 'react-icons/ri'
import Link from 'next/link'
import SegmentList from './SegmentList'
import SegmentPieChart from '../../diagrams/SegmentPieChart'
import type { FullCourse, FullCourseInfo } from '../../../types'
import getTermName from '../../../utils/termUtils'
import Members from '../../common/Members'
import { trpc } from '../../../utils/trpc'
import LoadingOrError from '../../common/LoadingOrError'
import CourseLocation from './CourseLocation'

interface Props {
  courseInfo: FullCourseInfo
  setActiveCourseId?: Dispatch<SetStateAction<string | null>>
}

const CourseDetails: FC<Props> = ({ courseInfo, setActiveCourseId }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const [activeCourseDetails, setActiveCourseDetails] =
    useState<FullCourse | null>()

  const { isFetching, error } = trpc.course.details.useQuery(
    activeCourseDetails?.id as string,
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!activeCourseDetails?.id && !activeCourseDetails?.segments,
      onSuccess: (data) => {
        if (!activeCourseDetails) return
        const updatedCourse = {
          ...activeCourseDetails,
          ...data,
        }
        setActiveCourseDetails(updatedCourse)
      },
    }
  )

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

  useEffect(() => {
    if (setActiveCourseId) {
      if (activeCourseDetails) setActiveCourseId(activeCourseDetails?.id)
      else setActiveCourseId(null)
    }
  }, [activeCourseDetails, setActiveCourseId])

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
          <h2 className="text-xl font-bold text-slate-700 dark:text-white">
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
          <RiBuilding2Line />
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
              <p className="text-md flex items-center gap-1 whitespace-nowrap font-normal text-slate-500 dark:text-neutral-400">
                <RiUser6Line className="translate-y-[1px]" />{' '}
                {activeCourseDetails.instructor}
              </p>
              <div className="flex gap-4 text-slate-500 dark:text-neutral-400">
                <Members number={activeCourseDetails._count.users} />
                <div className="flex items-center gap-0.5">
                  <RiTimeLine />
                  <span>{courseInfo.credits} credits</span>
                </div>
              </div>
            </div>
            {!isFetching && activeCourseDetails.segments ? (
              <>
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
                {activeCourseDetails.location && (
                  <CourseLocation
                    lat={activeCourseDetails.location.lat}
                    lng={activeCourseDetails.location.lng}
                    address={activeCourseDetails.location.address}
                    color={activeCourseDetails.info.color}
                  />
                )}
              </>
            ) : (
              <LoadingOrError error={error?.message} />
            )}
          </div>
        ) : (
          <div className="bg flex w-full flex-col items-center gap-2 pt-2">
            <div className="flex w-full flex-col gap-2">
              <h2 className="text-slate-500 dark:text-neutral-400">
                Course Variations
              </h2>
              <Link
                href={`/courses/${courseInfo.id}/new`}
                className="list-button flex items-center justify-center py-1 text-green-500 hover:text-green-500"
              >
                +
              </Link>
              {courseInfo.courses.map((course, index) => (
                <button
                  key={course.id}
                  className="list-button flex w-full items-center justify-between pr-3 text-base font-normal"
                  onClick={() => setActiveCourseDetailsIndex(index)}
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex gap-3">
                      <span className="font-medium">
                        {getTermName(course.term)} {course.year}
                      </span>
                      <Members
                        number={course._count.users}
                        className="font-medium"
                      />
                    </div>
                    <span className="flex items-center gap-1 px-0 text-sm font-normal">
                      <RiUser6Line className="translate-y-[1px]" />{' '}
                      {course.instructor}
                    </span>
                  </div>
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
