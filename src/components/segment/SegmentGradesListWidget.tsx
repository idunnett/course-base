import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import Widget from '../common/Widget'
import { Course, Segment, Task } from '@prisma/client'
import { ModalData } from '../task/TaskModal'
import { trpc } from '../../utils/trpc'
import { useStrictDroppable } from '../../hooks/useStrictDroppable'
import { FaSpinner } from 'react-icons/fa'

interface Props {
  segment: Segment
  setModalData: Dispatch<SetStateAction<ModalData | null>>
  tasks: Task[]
  course: Course
  refetchTasks: () => Promise<any>
}

const SegmentGradesListWidget: FC<Props> = ({
  segment,
  setModalData,
  tasks,
  course,
  refetchTasks,
}) => {
  const [segmentTasks, setSegmentTasks] = useState<Task[]>([])

  useEffect(() => {
    setSegmentTasks(
      tasks
        .filter((task) => task.segmentId === segment.id)
        .sort((a, b) => a.index - b.index)
    )
  }, [tasks, segment])

  const { mutate: reorderTasks, isLoading } = trpc.task.reorder.useMutation({
    onError: (error) => {
      alert(error.message)
    },
    onSuccess: refetchTasks,
  })
  const [enabled] = useStrictDroppable(isLoading)

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return
    const n = source.index - destination.index
    setSegmentTasks((prevState) => {
      let updatedState = [...prevState]
      if (n > 0) {
        for (let i = destination.index; i < updatedState.length; i++) {
          const segmentTask = updatedState[i]
          if (segmentTask) {
            if (segmentTask.index === source.index) break
            segmentTask.index++
          }
        }
      } else {
        for (let i = destination.index; i > 0; i--) {
          const segmentTask = updatedState[i]
          if (segmentTask) {
            if (segmentTask.index === source.index) break
            segmentTask.index--
          }
        }
      }
      const segmentTask = updatedState[source.index]
      if (segmentTask) segmentTask.index = destination.index
      updatedState.sort((a, b) => a.index - b.index)
      return updatedState
    })
    reorderTasks({
      source: source.index,
      destination: destination.index,
      courseId: course.id,
      segmentId: segment.id,
    })
  }

  return (
    <Widget className="flex h-24 flex-col justify-between">
      <div className="flex items-center justify-between">
        <h2
          className="truncate text-lg font-semibold"
          style={{
            color: course.color,
          }}
        >
          {segment.name}
          <span className="pl-2 font-light text-slate-400 dark:text-neutral-500">
            ({segment.quantity})
          </span>
        </h2>
      </div>
      <div className="flex">
        <DragDropContext onDragEnd={onDragEnd}>
          {enabled ? (
            <Droppable droppableId={segment.id} direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex"
                >
                  {segmentTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex w-16 justify-center"
                        >
                          <div
                            onClick={() => {
                              setModalData({
                                task: {
                                  ...task,
                                  grade: task.grade.toString(),
                                },
                                segment,
                              })
                            }}
                            className={`flex w-14 cursor-pointer justify-center rounded-md bg-gray-100 py-1 px-2 text-lg transition-all duration-100 ease-linear dark:bg-zinc-800 ${
                              snapshot.isDragging &&
                              !snapshot.isDropAnimating &&
                              'rotate-12'
                            }`}
                          >
                            <div className="group relative font-medium">
                              {task.grade}%
                              {task.title && (
                                <span className="tooltip bottom-full left-1/2 mb-2 -translate-x-1/2">
                                  {task.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ) : (
            <div className="flex h-10 w-full items-center justify-center">
              <FaSpinner className="animate-spin text-slate-500 dark:text-white" />
            </div>
          )}
        </DragDropContext>
        {segmentTasks.length < segment.quantity && (
          <button
            onClick={() => {
              setModalData({
                task: {
                  id: null,
                  grade: '',
                  title: '',
                  index: 0,
                  segmentId: segment.id,
                },
                segment,
              })
            }}
            className="secondary-btn text-slate-500  hover:text-black dark:text-slate-200 dark:hover:text-white"
          >
            +
          </button>
        )}
      </div>
    </Widget>
  )
}

export default SegmentGradesListWidget
