import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { RiBuilding2Line } from 'react-icons/ri'
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
        <div className="relative flex w-full flex-wrap overflow-auto p-2 pt-14">
          {courses.map((course) => (
            <CourseWidget key={course.id} course={course} tasks={tasks} />
          ))}
        </div>
      )
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
        <h2 className="text-xl font-semibold text-slate-600 dark:text-neutral-300">
          Welcome to GradeBase!
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
              <RiBuilding2Line />
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
