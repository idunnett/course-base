import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useEffect,
  useState,
} from 'react'
import Modal from '../common/Modal'
import InputSegment from '../common/InputSegment'
import useDebounce from '../../hooks/useDebounce'
import type { Course, Segment } from '@prisma/client'
import { trpc } from '../../utils/trpc'
import { RiLoader5Line } from 'react-icons/ri'

export type ModalData = {
  segment: Segment
  task: ModalDataTask
}

export type ModalDataTask = {
  id: string | undefined
  title: string | null
  grade: string
  segmentId: string
  index: number
}

interface Props {
  course: Course
  modalData: ModalData
  setModalData: Dispatch<SetStateAction<ModalData | null>>
  isFetchingTasks: boolean
  refetchTasks: () => Promise<any>
}

const TaskModal: FC<Props> = ({
  course,
  modalData,
  setModalData,
  refetchTasks,
  isFetchingTasks,
}) => {
  const [gradeDivisionPreview, setGradeDivisionPreview] = useState<
    number | null
  >(null)

  const debouncedGradeInput = useDebounce(modalData?.task.grade, 2500)

  useEffect(() => {
    if (gradeDivisionPreview != null && modalData) {
      setModalData({
        ...modalData,
        task: {
          ...modalData?.task,
          grade: gradeDivisionPreview.toString(),
        },
      })
      setGradeDivisionPreview(null)
    }
  }, [debouncedGradeInput])

  useEffect(() => {
    if (modalData?.task.grade.toString().includes('/')) {
      const [numerator, denominator] = modalData?.task.grade
        .toString()
        .split('/')
      if (numerator && denominator) {
        const res = (parseFloat(numerator) / parseFloat(denominator)) * 100
        const roundedRes = Math.round(res * 100) / 100
        setGradeDivisionPreview(roundedRes)
        return
      }
    }
    setGradeDivisionPreview(null)
  }, [modalData?.task.grade])

  const { mutate: addTask, isLoading: isLoadingAddTask } =
    trpc.task.add.useMutation({
      onError: (error) => {
        alert(error.message)
      },
      onSuccess: () => {
        refetchTasks().then(() => setModalData(null))
      },
    })

  const { mutate: editTask, isLoading: isLoadingEditTask } =
    trpc.task.edit.useMutation({
      onError: (error) => {
        alert(error.message)
      },
      onSuccess: () => {
        refetchTasks().then(() => setModalData(null))
      },
    })

  const handleAddTask = () => {
    if (!modalData || !modalData.task.grade.length) return
    addTask({
      ...modalData.task,
      segmentId: modalData.segment.id,
      grade: getConfirmedGrade(modalData.task.grade.toString()),
      courseId: course.id,
    })
  }

  const handleEditTask = () => {
    if (!modalData?.task.id || !modalData.task.grade.length) return
    editTask({
      ...modalData.task,
      id: modalData.task.id,
      segmentId: modalData.segment.id,
      grade: getConfirmedGrade(modalData.task.grade.toString()),
      courseId: course.id,
    })
  }

  const getConfirmedGrade = (gradeString: string) => {
    let confirmedGrade = gradeString
    if (gradeString.includes('/')) {
      const [numerator, denominator] = gradeString.split('/')
      if (numerator && denominator) {
        const res = (parseFloat(numerator) / parseFloat(denominator)) * 100
        confirmedGrade = res.toFixed(2)
      }
    }
    return parseFloat(confirmedGrade)
  }

  return (
    <Modal
      handleClose={() => setModalData(null)}
      title={
        modalData?.task.id ? (
          <>
            <span
              className="font-bold"
              style={{
                color: course.color,
              }}
            >
              {modalData.segment.name}
            </span>{' '}
            task
          </>
        ) : (
          <>
            Add to{' '}
            <span
              className="font-bold"
              style={{
                color: course.color,
              }}
            >
              {modalData?.segment.name}
            </span>
          </>
        )
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          modalData?.task.id ? handleEditTask() : handleAddTask()
        }}
        className="flex w-full flex-col items-end"
      >
        <div className="flex w-full gap-8">
          <div className="relative">
            <InputSegment
              value={modalData?.task.grade.toString() ?? ''}
              onChange={(e) => {
                const input = e.target.value
                if (parseFloat(input) > 100) return
                // regex to allow decimals and slashes
                const regex = /^\d*\.?\d*$/
                const divisionRegex = /^(\d+\.?\d*|\d*\.?\d+)\/\d*\.?\d*$/
                if (input.match(regex) || input.match(divisionRegex)) {
                  setModalData({
                    ...modalData,
                    task: {
                      ...modalData.task,
                      grade: input,
                    },
                  })
                }
              }}
              label="Grade %"
              animate={false}
              placeholder="%"
              autoFocus={true}
              className="!w-32 text-right"
              maxLength={8}
            />
            {gradeDivisionPreview != null && (
              <span className="absolute top-3 right-1 text-xs text-slate-600 dark:text-neutral-300">
                {gradeDivisionPreview}
              </span>
            )}
          </div>
          {modalData.segment.quantity > 1 && (
            <InputSegment
              value={modalData.task.title ?? ''}
              onChange={(e) =>
                setModalData({
                  ...modalData,
                  task: {
                    ...modalData.task,
                    title: e.target.value,
                  },
                })
              }
              label="Title"
              animate={false}
              containerStyles={{
                width: '100%',
              }}
            />
          )}
        </div>
        <button
          type="submit"
          className="primary-btn mt-3"
          disabled={isFetchingTasks}
        >
          {isFetchingTasks || isLoadingAddTask || isLoadingEditTask ? (
            <RiLoader5Line className="h-7 animate-spin text-white" />
          ) : modalData?.task.id ? (
            'Save'
          ) : (
            'Add'
          )}
        </button>
      </form>
    </Modal>
  )
}

export default TaskModal
