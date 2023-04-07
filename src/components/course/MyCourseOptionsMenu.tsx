import { useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { RiLoader5Line, RiMore2Fill } from 'react-icons/ri'
import { alertAtom } from '../../atoms'
import { trpc } from '../../utils/trpc'

interface Props {
  courseId: string
}

const MyCourseOptionsMenu: React.FC<Props> = ({ courseId }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const setAlert = useSetAtom(alertAtom)
  const menuButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleClick = (e: MouseEvent) => {
    if (menuButtonRef.current?.contains(e.target as HTMLElement)) return
    setOpen(false)
  }

  const { mutate: leaveCourse, isLoading } = trpc.course.leave.useMutation({
    onSuccess: () => {
      setAlert({
        type: 'success',
        message: 'Successfully left course',
      })
      router.replace('/')
    },
    onError: (err) =>
      setAlert({
        type: 'error',
        message: err.message,
      }),
  })

  return (
    <div className="relative h-full" ref={menuButtonRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-full w-full items-center justify-center gap-1 text-slate-500 hover:text-slate-600 dark:text-gray-300 dark:hover:text-gray-400"
        disabled={isLoading}
      >
        <RiMore2Fill className="h-5 w-5" />
      </button>
      <div
        className={
          'absolute top-full right-0 z-50 mt-1.5 flex w-40 origin-top flex-col items-start overflow-hidden rounded-lg border border-gray-50 bg-white shadow-lg transition-all duration-75 ease-linear dark:border-neutral-700 dark:bg-zinc-800 ' +
          (open ? 'scale-100' : 'scale-0')
        }
      >
        <button
          onClick={() =>
            confirm(
              'Leaving this course will remove all its associated data. Are you sure?'
            ) && leaveCourse(courseId)
          }
          className="link text-red-500 dark:hover:bg-zinc-700 dark:hover:bg-opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex w-full items-center justify-center">
              <RiLoader5Line className="animate-spin text-slate-500 dark:text-white" />
            </div>
          ) : (
            'Leave Course'
          )}
        </button>
      </div>
    </div>
  )
}
export default MyCourseOptionsMenu
