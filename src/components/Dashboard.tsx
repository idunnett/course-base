import { useAtom, useAtomValue } from 'jotai'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { RiBuilding2Line } from 'react-icons/ri'
import { SlNotebook } from 'react-icons/sl'
import { activeTermAtom, myCoursesAtom } from '../atoms'
import { trpc } from '../utils/trpc'
import LoadingOrError from './common/LoadingOrError'
import CourseWidget from './course/CourseWidget'

const Dashboard = () => {
  const session = useSession()
  const activeTerm = useAtomValue(activeTermAtom)
  const [myCourses, setMyCourses] = useAtom(myCoursesAtom)
  const { error: coursesError } = trpc.course.getMyCourses.useQuery(
    activeTerm,
    {
      queryKey: ['course.getMyCourses', activeTerm],
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => setMyCourses(data),
    }
  )

  const { data: tasks, error: tasksError } = trpc.task.getMyTasks.useQuery(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )

  if (myCourses && tasks) {
    if (myCourses.length)
      return (
        <div className="relative flex w-full flex-wrap p-2">
          {myCourses.map((course) => (
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
