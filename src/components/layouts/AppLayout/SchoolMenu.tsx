import { FC, useEffect, useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import Link from 'next/link'
import type { School } from '@prisma/client'
import { FaSpinner } from 'react-icons/fa'

interface Props {
  school?: Omit<School, 'name' | 'memberCount'> | null
  isFetching?: boolean
}

const SchoolMenu: FC<Props> = ({ school, isFetching }) => {
  const [open, setOpen] = useState(false)
  const schoolButtonRef = useRef<HTMLDivElement>(null)

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

  if (school || isFetching)
    return (
      <div className="relative" ref={schoolButtonRef}>
        <button
          className="primary-btn flex h-8 items-center gap-1 font-bold"
          onClick={() => setOpen(!open)}
          style={{
            backgroundColor: school?.color,
            color: school?.secondaryColor,
          }}
        >
          {!!school ? (
            <>
              {school.shortName ?? 'My school'}{' '}
              <HiChevronDown
                className={
                  'h-4 w-4 transition-transform duration-100 ease-linear ' +
                  (open ? 'rotate-180' : 'rotate-0')
                }
              />
            </>
          ) : (
            <FaSpinner className="h-4 w-20 animate-spin" />
          )}
        </button>
        {!!school && (
          <div
            className={
              'absolute top-full right-0 z-50 mt-2.5 flex w-40 origin-top flex-col items-start overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-xl transition-all duration-75 ease-linear dark:border-neutral-700 dark:bg-zinc-800 ' +
              (open ? 'scale-100' : 'scale-0')
            }
          >
            <Link
              href={`/schools/${school.id}`}
              onClick={() => setOpen(false)}
              className="link text-slate-500 dark:text-neutral-200"
            >
              View school
            </Link>
            <Link
              href={`/schools/${school.id}/degrees/new`}
              onClick={() => setOpen(false)}
              className="link text-slate-500 dark:text-neutral-200"
            >
              Add degree
            </Link>
            <Link
              href={`/schools/${school.id}/courses/new`}
              onClick={() => setOpen(false)}
              className="link text-slate-500 dark:text-neutral-200"
            >
              Add course
            </Link>
          </div>
        )}
      </div>
    )

  return (
    <Link
      href="/schools"
      className="primary-btn flex items-center gap-1 font-medium"
    >
      Add School
    </Link>
  )
}

export default SchoolMenu
