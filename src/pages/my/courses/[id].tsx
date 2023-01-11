import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import SegmentGradesListWidget from '../../../components/segment/SegmentGradesListWidget'
import GradesBarGraph from '../../../components/diagrams/GradesBarGraph'
import TotalGradeBar from '../../../components/diagrams/TotalGradeBar'
import SegmentGradeWidget from '../../../components/segment/SegmentGradeWidget'
import TaskModal, { type ModalData } from '../../../components/task/TaskModal'
import ScatterChart from '../../../components/diagrams/ScatterChart'
import { useRouter } from 'next/router'
import { trpc } from '../../../utils/trpc'

const Course = () => {
  const { id } = useRouter().query

  const [modalData, setModalData] = useState<ModalData | null>(null)

  const { data: course, isFetching: isFetchingCourse } =
    trpc.course.getMyCourse.useQuery(id as string, {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: false,
    })

  const {
    data: tasks,
    refetch: refetchTasks,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
  } = trpc.task.getMyCourseTasks.useQuery(id as string, {
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (!isFetchingCourse && !isLoadingTasks && course && tasks)
    return (
      <div className="relative h-full overflow-y-auto py-4 pt-16 xl:px-48">
        <h1
          className="px-4 text-4xl font-bold"
          style={{
            color: course.info.color,
          }}
        >
          {course.info.name}
        </h1>
        <div className="relative my-2 mx-4 flex flex-col gap-4 text-black dark:text-white">
          <TotalGradeBar course={course} tasks={tasks} />
          <div className="flex flex-wrap gap-2">
            {course.segments.map((segment) =>
              segment.quantity > 1 ? (
                <SegmentGradesListWidget
                  key={segment.name}
                  segment={segment}
                  setModalData={setModalData}
                  tasks={tasks}
                  course={course}
                  refetchTasks={refetchTasks}
                />
              ) : (
                <SegmentGradeWidget
                  key={segment.name}
                  segment={segment}
                  setModalData={setModalData}
                  tasks={tasks}
                  courseColor={course.info.color}
                />
              )
            )}
          </div>
          <div className="relative flex h-96 w-full flex-col">
            <GradesBarGraph course={course} tasks={tasks} />
          </div>
          <div className="relative flex h-96 w-full flex-col">
            <ScatterChart course={course} tasks={tasks} />
          </div>
          {modalData && (
            <TaskModal
              modalData={modalData}
              setModalData={setModalData}
              course={course}
              refetchTasks={refetchTasks}
              isFetchingTasks={isFetchingTasks}
            />
          )}
        </div>
      </div>
    )

  return (
    <div className="flex h-full w-full items-center justify-center">
      <FaSpinner className="animate-spin dark:text-white" />
    </div>
  )
}

export default Course
