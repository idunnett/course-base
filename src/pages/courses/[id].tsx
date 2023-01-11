import { useRouter } from 'next/router'
import { useState } from 'react'
import LoadingOrError from '../../components/common/LoadingOrError'
import CourseDetails from '../../components/course/CourseDetails'
import type { FullCourse } from '../../types'
import getTermName from '../../utils/termUtils'
import { trpc } from '../../utils/trpc'

const CourseView = () => {
  const { id } = useRouter().query
  const [activeCourse, setActiveCourse] = useState<FullCourse>()

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
    onSuccess: (data) => {
      const firstCourse = data.courses[0]
      if (firstCourse) {
        const { courses, schoolId, ...info } = data
        const c = { info, ...firstCourse }
        setActiveCourse(c)
      }
    },
  })

  if (!isLoading && courseInfo && activeCourse)
    return (
      <div className="flex w-full items-center justify-center gap-6 pt-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg text-slate-500 dark:text-neutral-400">
            Course Variations
          </h2>
          <button className="list-button flex items-center justify-center py-1 text-green-500 hover:text-green-500">
            +
          </button>
          {courseInfo.courses.map((course) => (
            <button
              key={course.id}
              className={`list-button text-base font-normal ${
                course.id === activeCourse?.id && 'active'
              }`}
            >
              {getTermName(course.term)} {course.year}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <CourseDetails course={activeCourse} />
          {myCourseIds && (
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
