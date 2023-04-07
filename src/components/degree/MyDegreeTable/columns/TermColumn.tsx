import { Term } from '@prisma/client'
import type { CellContext } from '@tanstack/react-table'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useEffect, useRef, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import getTermName from '../../../../utils/termUtils'
import type { DegreeTableColumns, UserDegreeCourseUpdateInput } from '../types'

interface Props {
  info: CellContext<number | DegreeTableColumns, Term | undefined>
  updateData: (data: UserDegreeCourseUpdateInput) => void
  setData: Dispatch<SetStateAction<(number | DegreeTableColumns)[]>>
}

const TERMS = [Term.F, Term.W, Term.S]

const TermColumn: FC<Props> = ({ info, setData, updateData }) => {
  const { data: session } = useSession()
  const [term, setTerm] = useState<Term | null>(info.getValue() ?? null)
  const [open, setOpen] = useState(false)
  const selectButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleClick = (e: MouseEvent) => {
    if (selectButtonRef.current?.contains(e.target as HTMLElement)) return
    setOpen(false)
  }

  useEffect(() => {
    const val = info.getValue()
    if (val) setTerm(val)
  }, [info])

  function handleTermUpdate(newTerm: Term | null) {
    if (typeof info.row.original === 'number') return
    else if (!session?.user?.degreeId) return alert('No degree ID found')
    const courseInfoId: string | undefined =
      info.row.original.courseInfoId ??
      info.row.original.partialCourseId ??
      info.row.original.subjectRequirementId
    if (!courseInfoId)
      return alert(
        'No course info, partial course, or subject requirement ID found at row'
      )
    setData((prevData) => {
      const updatedData = _.cloneDeep(prevData)
      const courseRow = updatedData.find(
        (courseRow) =>
          typeof courseRow !== 'number' &&
          (courseRow.courseInfoId === courseInfoId ||
            courseRow.partialCourseId === courseInfoId ||
            courseRow.subjectRequirementId === courseInfoId)
      )
      if (typeof courseRow !== 'number' && courseRow)
        courseRow.term = newTerm ?? undefined
      return updatedData
    })
    updateData({
      degreeId: session.user.degreeId,
      courseInfoId,
      term: !newTerm ? null : newTerm,
    })
  }

  function getTermColor(term: Term | null) {
    let color = 'bg-gray-100'
    if (term === Term.F) color = 'bg-orange-300'
    if (term === Term.W) color = 'bg-blue-200'
    if (term === Term.S) color = 'bg-yellow-300'
    return color
  }

  if (typeof info.row.original !== 'number' && info.row.original.linkedCourseId)
    return (
      <div className="w-24">
        <span
          className={`block w-min rounded-md bg-opacity-75 px-2 text-base ${getTermColor(
            term
          )}`}
        >
          {term ? getTermName(term) : ''}
        </span>
      </div>
    )
  return (
    <div className="relative h-full w-24">
      <button
        ref={selectButtonRef}
        className={`flex h-6 items-center bg-opacity-75 ${
          term ? 'w-min justify-between' : 'w-full justify-end'
        } gap-1 rounded-md px-2 text-base ${getTermColor(term)}`}
        onClick={() => setOpen(!open)}
      >
        {term ? getTermName(term) : ''}
        <HiChevronDown
          className={
            'h-4 w-4 min-w-max text-inherit transition-transform duration-100 ease-linear ' +
            (open ? 'rotate-180' : 'rotate-0')
          }
        />
      </button>
      {open && (
        <div
          className={
            'absolute top-full left-0 z-50 mt-1.5 flex w-full origin-top flex-col items-start overflow-hidden rounded-lg border border-gray-50 bg-white shadow-lg transition-all duration-75 ease-linear dark:border-neutral-700 dark:bg-zinc-800 ' +
            (open ? 'scale-100' : 'scale-0')
          }
        >
          {term && (
            <button
              className={`link group flex w-full justify-start py-0.5 px-0 text-base`}
              onClick={() => {
                setTerm(null)
                handleTermUpdate(null)
              }}
            >
              <div
                className={`mx-1 flex h-6 w-full rounded-md bg-opacity-75 px-2 group-hover:bg-gray-200 ${getTermColor(
                  null
                )}`}
              ></div>
            </button>
          )}
          {TERMS.map(
            (t) =>
              t !== term && (
                <button
                  key={t}
                  className={`link flex w-full justify-start py-0.5 px-0 text-base`}
                  onClick={() => {
                    setTerm(t)
                    handleTermUpdate(t)
                  }}
                >
                  <span
                    className={`mx-1 h-6 w-min rounded-md bg-opacity-75 px-2 ${getTermColor(
                      t
                    )}`}
                  >
                    {getTermName(t)}
                  </span>
                </button>
              )
          )}
        </div>
      )}
    </div>
  )
}
export default TermColumn
