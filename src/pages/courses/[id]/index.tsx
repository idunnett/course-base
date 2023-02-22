import { useRouter } from 'next/router'
import { useState } from 'react'
import LoadingOrError from '../../../components/common/LoadingOrError'
import CourseDetails from '../../../components/course/CourseDetails'
import { trpc } from '../../../utils/trpc'

const CourseView = () => {
  const { id } = useRouter().query
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null)

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
      <div className="flex w-full items-center justify-center gap-6 py-16">
        <div className="flex flex-col items-center justify-center gap-6">
          <CourseDetails
            courseInfo={courseInfo}
            setActiveCourseId={setActiveCourseId}
          />
          {myCourseIds && activeCourseId && (
            <div className="flex flex-col items-center gap-2">
              <button
                disabled={myCourseIds.includes(activeCourseId)}
                className={`primary-btn px-4 text-2xl ${
                  myCourseIds.includes(activeCourseId) &&
                  'cursor-not-allowed opacity-50 hover:bg-slate-500'
                }`}
              >
                Join
              </button>
              {myCourseIds.includes(activeCourseId) && (
                <p className="text-sm text-slate-400 dark:text-white">
                  You are already in this course.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )

  return <LoadingOrError error={error?.message} />
}

export default CourseView
