import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { BiBuildings } from 'react-icons/bi'
import { SlNotebook } from 'react-icons/sl'
import { trpc } from '../utils/trpc'
import LoadingOrError from './common/LoadingOrError'
import CourseWidget from './course/CourseWidget'

const Dashboard = () => {
  const session = useSession()
  const { data: courses, error: coursesError } =
    trpc.course.getMyCourses.useQuery(undefined, {
      retry: false,
      refetchOnWindowFocus: false,
    })

  const { data: tasks, error: tasksError } = trpc.task.getMyTasks.useQuery(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  if (courses && tasks) {
    if (courses.length)
      return (
        <div className="relative grid h-full w-full grid-cols-1 gap-4 overflow-auto p-4 pt-16 lg:grid-cols-2">
          {courses.map((course) => (
            <CourseWidget key={course.id} course={course} tasks={tasks} />
          ))}
        </div>
      )
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
        <h2 className="text-xl font-semibold text-slate-600 dark:text-neutral-300">
          Welcome to CourseBase!
        </h2>
        <p className="text-slate-500 dark:text-neutral-400">
          Get started by adding{' '}
          {!session.data?.user?.schoolId && 'your school and '}your courses.
        </p>
        <div className="my-6 flex gap-4">
          {!session.data?.user?.schoolId && (
            <Link
              href="/schools"
              className="secondary-btn flex items-center gap-1"
            >
              <BiBuildings />
              Schools
            </Link>
          )}
          <Link
            href="/courses"
            className="secondary-btn flex items-center gap-1"
          >
            <SlNotebook />
            Courses
          </Link>
        </div>
      </div>
    )
  }

  return <LoadingOrError error={coursesError?.message ?? tasksError?.message} />
}

export default Dashboard
