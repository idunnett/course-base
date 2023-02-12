import type { Course, Segment } from '@prisma/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import LoadingOrError from '../../components/common/LoadingOrError'
import CourseDetails from '../../components/course/CourseDetails'
import getTermName from '../../utils/termUtils'
import { trpc } from '../../utils/trpc'

const CourseView = () => {
  const { id } = useRouter().query
  const [activeCourse, setActiveCourse] = useState<
    | (Course & {
        segments: Segment[]
        members: number
      })
    | null
  >(null)

  const { data: myCourseIds } = trpc.course.myCourseIds.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  const {
    data: courseInfo,
    isLoading,
    error,
  } = trpc.courseInfo.findById.useQuery(id as string, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })

  if (!isLoading && courseInfo)
    return (
      <div className="flex w-full items-center justify-center gap-6 pt-16">
        <div className="flex flex-col items-center justify-center gap-6">
          <CourseDetails courseInfo={courseInfo} />
          {myCourseIds && activeCourse && (
            <div className="flex flex-col items-center gap-2">
              <button
                disabled={myCourseIds.includes(activeCourse.id)}
                className={`primary-btn px-4 text-2xl ${
                  myCourseIds.includes(activeCourse.id) &&
                  'cursor-not-allowed opacity-50 hover:bg-slate-500'
                }`}
              >
                Join
              </button>
              <p className="text-sm text-slate-400 dark:text-white">
                You are already in this course.
              </p>
            </div>
          )}
        </div>
      </div>
    )

  return <LoadingOrError error={error?.message} />
}

export default CourseView
