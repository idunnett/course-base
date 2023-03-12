import { Term } from '@prisma/client'
import type { CellContext } from '@tanstack/react-table'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import getTermName from '../../../../utils/termUtils'
import type { DegreeTableColumns, UserDegreeCourseUpdateInput } from '../types'

interface Props {
  info: CellContext<number | DegreeTableColumns, Term | undefined>
  updateData: (data: UserDegreeCourseUpdateInput) => void
  setData: Dispatch<SetStateAction<(number | DegreeTableColumns)[]>>
}

const TermColumn: FC<Props> = ({ info, setData, updateData }) => {
  const { data: session } = useSession()
  const [term, setTerm] = useState(info.getValue())

  useEffect(() => {
    const val = info.getValue()
    if (val) setTerm(val)
  }, [info])

  function handleGradeUpdate(
    e: ChangeEvent<HTMLSelectElement>,
    newTerm: Term | undefined
  ) {
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
      if (typeof courseRow !== 'number' && courseRow) {
        courseRow.term = newTerm
      }
      return updatedData
    })
    e.currentTarget.blur()
    console.log(newTerm)
    updateData({
      degreeId: session.user.degreeId,
      courseInfoId,
      term: !newTerm ? null : newTerm,
    })
  }

  if (typeof info.row.original !== 'number' && info.row.original.linkedCourseId)
    return <span>{term ? getTermName(term) : ''}</span>
  return (
    <select
      id="term-select"
      className="h-full w-min rounded-lg bg-white pr-1 text-lg text-black outline-none transition-all duration-200 ease-linear placeholder:text-gray-400 dark:bg-zinc-600 dark:text-white
      "
      value={term}
      onChange={(e) => {
        const newTerm = e.target.value as Term
        setTerm(newTerm)
        handleGradeUpdate(e, newTerm)
      }}
      required
    >
      <option value={undefined}></option>
      <option value={Term.F}>Fall</option>
      <option value={Term.W}>Winter</option>
      <option value={Term.S}>Summer</option>
    </select>
  )
}
export default TermColumn
