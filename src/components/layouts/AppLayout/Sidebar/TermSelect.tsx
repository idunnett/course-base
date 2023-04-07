import type { Term } from '@prisma/client'
import _ from 'lodash'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import getTermName from '../../../../utils/termUtils'

interface Props {
  sidebarOpen: boolean
  myCourseTerms?: {
    term: Term
    year: number
  }[]
  activeTerm: {
    term: Term
    year: number
  }
  setActiveTerm: Dispatch<
    SetStateAction<{
      term: Term
      year: number
    }>
  >
}

const TermSelect: React.FC<Props> = ({
  sidebarOpen,
  activeTerm,
  myCourseTerms,
  setActiveTerm,
}) => {
  const [open, setOpen] = useState(false)
  const termButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleClick = (e: MouseEvent) => {
    if (termButtonRef.current?.contains(e.target as HTMLElement)) return
    setOpen(false)
  }

  return (
    <div className="relative my-1 flex w-full items-center justify-between">
      {sidebarOpen && (
        <button
          className="secondary-btn px-2"
          onClick={() => {
            if (!myCourseTerms) return
            const indexOfActiveTerm = _.findIndex(myCourseTerms, activeTerm)
            if (indexOfActiveTerm === myCourseTerms.length - 1) return
            const nextTerm = myCourseTerms[indexOfActiveTerm + 1]
            if (!nextTerm) return
            setActiveTerm(nextTerm)
          }}
        >
          <RiArrowLeftSLine className="h-5 w-5" />
        </button>
      )}
      <div
        className={`relative ${!sidebarOpen && 'w-full'}`}
        ref={termButtonRef}
      >
        <button
          onClick={() => setOpen(!open)}
          className={`list-button flex items-center justify-center
          gap-1 whitespace-nowrap py-1 text-slate-500 hover:text-slate-600 dark:text-gray-300 dark:hover:text-gray-400 ${
            sidebarOpen ? 'h-full w-32' : 'h-7 w-full px-0 text-xs'
          }`}
        >
          {sidebarOpen ? (
            <span className="flex items-center gap-0.5 text-base">
              {getTermName(activeTerm.term) + ' ' + activeTerm.year}
              <HiChevronDown
                className={
                  'h-4 w-4 min-w-max text-inherit transition-transform duration-100 ease-linear ' +
                  (open ? 'rotate-180' : 'rotate-0')
                }
              />
            </span>
          ) : (
            activeTerm.term + activeTerm.year.toString().slice(-2)
          )}
        </button>
        <div
          className={
            'absolute z-50 flex flex-col items-start overflow-hidden rounded-lg border border-gray-50 bg-white shadow-lg transition-all duration-75 ease-linear dark:border-neutral-700 dark:bg-zinc-800 ' +
            (open ? 'scale-100' : 'scale-0') +
            ' ' +
            (sidebarOpen
              ? 'top-full left-0 mt-1.5 w-32 origin-top'
              : 'top-0 left-full ml-1.5 w-32 origin-top-left')
          }
        >
          {myCourseTerms?.map(({ term, year }) => (
            <button
              key={term + year}
              className="link flex justify-start whitespace-nowrap text-slate-500 dark:text-neutral-200 dark:hover:bg-zinc-700 dark:hover:bg-opacity-50"
              onClick={() => {
                setActiveTerm({ term, year })
                setOpen(false)
              }}
            >
              {getTermName(term) + ' ' + year}
            </button>
          ))}
        </div>
      </div>
      {sidebarOpen && (
        <button
          className="secondary-btn px-2"
          onClick={() => {
            if (!myCourseTerms) return
            const indexOfActiveTerm = _.findIndex(myCourseTerms, activeTerm)
            if (indexOfActiveTerm === 0) return
            const prevTerm = myCourseTerms[indexOfActiveTerm - 1]
            if (!prevTerm) return
            setActiveTerm(prevTerm)
          }}
        >
          <RiArrowRightSLine className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
export default TermSelect
