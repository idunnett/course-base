import { trpc } from '../utils/trpc'
import LoadingOrError from './common/LoadingOrError'
import CourseWidget from './course/CourseWidget'

const Dashboard = () => {
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

  if (courses && tasks)
    return (
      <div className="relative grid h-full w-full grid-cols-1 gap-4 overflow-auto p-4 pt-16 lg:grid-cols-2">
        {courses.map((course) => (
          <CourseWidget key={course.id} course={course} tasks={tasks} />
        ))}
      </div>
    )

  return <LoadingOrError error={coursesError?.message ?? tasksError?.message} />
}

export default Dashboard
