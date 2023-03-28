import { useRouter } from 'next/router'
import { trpc } from '../../../utils/trpc'
import { TbArrowBarLeft, TbArrowBarRight } from 'react-icons/tb'
import FullCourseButton from '../../course/FullCourseButton'
import { useEffect, useState } from 'react'
import { MdInsertChart } from 'react-icons/md'
import Link from 'next/link'
import { RiDashboardFill, RiDashboardLine } from 'react-icons/ri'

const Sidebar: React.FC = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [overflowHidden, setOverflowHidden] = useState(false)

  const { data: courses } = trpc.course.getMyCourses.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    setOverflowHidden(true)
    const handler = setTimeout(() => setOverflowHidden(false), 300)
    return () => {
      clearTimeout(handler)
    }
  }, [open])

  return (
    <div
      className={`relative z-50 flex flex-none grow-0 flex-col gap-2 px-1 py-4 shadow-even-lg transition-all duration-200 ease-in-out ${
        overflowHidden && 'overflow-hidden'
      } ${open ? 'w-96' : 'w-10'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="group relative mr-2 flex items-center gap-2 self-end text-slate-400 hover:text-slate-500"
      >
        {open ? (
          <>
            <span className="text-sm text-slate-400 opacity-0 transition-all duration-100 group-hover:opacity-100">
              Toggle Sidebar
            </span>
            <TbArrowBarLeft className="h-5 w-5" />
          </>
        ) : (
          <>
            <TbArrowBarRight className="h-5 w-5" />
            <span className="tooltip left-full top-1/2 ml-4 origin-left -translate-y-1/2">
              Toggle Sidebar
            </span>
          </>
        )}
      </button>
      <div className="my-1 flex w-full items-center">
        <Link
          href="/"
          className={`list-button group flex w-full max-w-none items-center justify-start gap-1 whitespace-nowrap text-slate-400 hover:text-slate-500 ${
            !open && 'justify-center px-0 py-1'
          }`}
        >
          {router.pathname === '/' ? (
            <RiDashboardFill className="h-5 w-5 min-w-max" />
          ) : (
            <RiDashboardLine className="h-5 w-5 min-w-max" />
          )}
          {open ? (
            'Dashboard'
          ) : (
            <span className="tooltip left-full ml-1 origin-left">
              Dashboard
            </span>
          )}
        </Link>
      </div>
      <h4
        className={`whitespace-nowrap pl-1 text-sm font-medium text-slate-400 transition-all duration-200 ${
          !open && 'opacity-0'
        }`}
      >
        My Courses
      </h4>
      <div className="flex flex-col gap-1">
        {courses &&
          courses.map((course) =>
            open ? (
              <FullCourseButton
                course={course}
                className="w-full"
                onClick={() => router.push(`/my/courses/${course.id}`)}
                key={course.id}
                showSchool={false}
                showTerm={false}
              />
            ) : (
              <div
                key={course.id}
                className="list-button group cursor-pointer items-center justify-center overflow-visible px-0 py-1"
                onClick={() => router.push(`/my/courses/${course.id}`)}
              >
                <MdInsertChart
                  className={'h-6 w-6'}
                  style={{
                    color: course.info.color,
                  }}
                />
                <FullCourseButton
                  className="tooltip left-full ml-1 origin-left bg-[#F7F8F9] shadow-lg"
                  course={course}
                  showSchool={false}
                  showTerm={false}
                />
              </div>
            )
          )}
      </div>
    </div>
  )
}
export default Sidebar
