import { useEffect, useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import Link from 'next/link'
import { trpc } from '../../../utils/trpc'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { schoolAtom } from '../../../atoms'

const SchoolMenu = () => {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [school, setSchool] = useAtom(schoolAtom)
  const schoolButtonRef = useRef<HTMLDivElement>(null)

  trpc.school.getMySchool.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!!school && !!session?.user?.schoolId,
    onSuccess: (data) => setSchool(data),
  })

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleClick = (e: MouseEvent) => {
    if (schoolButtonRef.current?.contains(e.target as HTMLElement)) return
    setOpen(false)
  }

  if (school)
    return (
      <div className="relative" ref={schoolButtonRef}>
        <button
          className="primary-btn flex items-center gap-1 font-bold"
          onClick={() => setOpen(!open)}
          style={{
            backgroundColor: school?.color,
            color: school?.secondaryColor,
          }}
        >
          {school?.shortName ?? school?.name ?? 'My school'}{' '}
          <HiChevronDown
            className={
              'h-4 w-4 transition-transform duration-100 ease-linear ' +
              (open ? 'rotate-180' : 'rotate-0')
            }
          />
        </button>
        <div
          className={
            'absolute top-full right-0 z-50 mt-2.5 flex w-40 origin-top flex-col items-start overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-xl transition-all duration-75 ease-linear dark:border-neutral-700 dark:bg-zinc-800 ' +
            (open ? 'scale-100' : 'scale-0')
          }
        >
          <Link
            href={`/schools/${school?.id}`}
            onClick={() => setOpen(false)}
            className="link text-slate-500 dark:text-neutral-200"
          >
            View school
          </Link>
          <Link
            href={school ? `/schools/${school?.id}/degrees/new` : '/schools'}
            onClick={() => setOpen(false)}
            className="link text-slate-500 dark:text-neutral-200"
          >
            Add degree
          </Link>
          <Link
            href={school ? `/schools/${school?.id}/courses/new` : '/schools'}
            onClick={() => setOpen(false)}
            className="link text-slate-500 dark:text-neutral-200"
          >
            Add course
          </Link>
        </div>
      </div>
    )

  return (
    <Link
      href="/schools"
      className="primary-btn flex items-center gap-1 font-bold"
    >
      Add School
    </Link>
  )
}

export default SchoolMenu
