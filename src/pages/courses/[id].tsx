import { useRouter } from 'next/router'
import LoadingOrError from '../../components/common/LoadingOrError'
import CourseDetails from '../../components/course/CourseDetails'
import { trpc } from '../../utils/trpc'

const CourseView = () => {
  const { id } = useRouter().query

  const { data: myCourseIds } = trpc.user.myCourseIds.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  const {
    data: course,
    isLoading,
    error,
  } = trpc.course.findById.useQuery(id as string, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })

  if (!isLoading && course)
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 pt-16">
        <CourseDetails course={course} />
        {myCourseIds && (
          <div className="flex flex-col items-center gap-2">
            <button
              disabled={myCourseIds.includes(course.id)}
              className={`primary-btn px-4 text-2xl ${
                myCourseIds.includes(course.id) &&
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
    )

  return <LoadingOrError error={error?.message} />
}

export default CourseView
