import { FaSpinner } from 'react-icons/fa'
import CourseWidget from '../../components/course/CourseWidget'
import { trpc } from '../../utils/trpc'

const Dashboard = () => {
  const courses = trpc.course.getMyCourses.useQuery()
  const tasks = trpc.task.getMyTasks.useQuery()
  if (courses.data && tasks.data)
    return (
      <div className="relative grid h-full w-full grid-cols-1 gap-4 overflow-auto p-4 pt-16 lg:grid-cols-2">
        {courses?.data.map((course) => (
          <CourseWidget key={course.id} course={course} tasks={tasks.data} />
        ))}
      </div>
    )

  return (
    <div className="flex h-full w-full items-center justify-center">
      <FaSpinner className="animate-spin dark:text-white" />
    </div>
  )
}

export default Dashboard
