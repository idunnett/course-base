import type { Segment, Task } from '@prisma/client'
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useState,
} from 'react'
import Widget from '../common/Widget'
import type { ModalData } from '../task/TaskModal'

interface Props {
  segment: Segment
  setModalData: Dispatch<SetStateAction<ModalData | null>>
  tasks: Task[]
  courseColor: string
}

const SegmentGradeWidget: FC<Props> = ({
  segment,
  setModalData,
  tasks,
  courseColor,
}) => {
  const [segmentTask, setSegmentTask] = useState<Task | undefined>()

  useEffect(() => {
    setSegmentTask(tasks.find((task) => task.segmentId === segment.id))
  }, [tasks, segment])

  const openModal = () => {
    if (segmentTask)
      setModalData({
        segment,
        task: {
          id: segmentTask.id,
          grade: segmentTask.grade.toString(),
          title: segmentTask.title,
          index: segmentTask.index,
          segmentId: segmentTask.id,
        },
      })
    else
      setModalData({
        task: {
          id: undefined,
          grade: '',
          title: '',
          index: 0,
          segmentId: segment.id,
        },
        segment,
      })
  }

  return (
    <button onClick={openModal}>
      <Widget className="group flex h-24 w-24 min-w-fit cursor-pointer flex-col items-start justify-between">
        <h2
          className="truncate text-lg font-semibold"
          style={{
            color: courseColor,
          }}
        >
          {segment.name}
        </h2>
        {segmentTask?.grade ? (
          <p className="text-2xl font-semibold">{segmentTask.grade}%</p>
        ) : (
          <p className="text-3xl text-slate-500 opacity-0 group-hover:opacity-100 dark:text-zinc-400 ">
            +
          </p>
        )}
      </Widget>
    </button>
  )
}

export default SegmentGradeWidget
