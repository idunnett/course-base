import type { CellContext } from '@tanstack/react-table'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import {
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

interface Props {
  info: CellContext<number | DegreeTableColumns, number | undefined>
  updateData: (data: UserDegreeCourseUpdateInput) => void
  setData: Dispatch<SetStateAction<(number | DegreeTableColumns)[]>>
}

const GradeColumn: FC<Props> = ({ info, setData, updateData }) => {
  const { data: session } = useSession()
  const [grade, setGrade] = useState(
    info.getValue()?.toString() ? info.getValue()?.toString() + '%' : ''
  )

  useEffect(() => {
    const val = info.getValue()
    if (val) setGrade(val.toString() + '%')
  }, [info])

  function handleGradeUpdate(e: KeyboardEvent<HTMLInputElement>) {
    if (typeof info.row.original === 'number') return
    else if (!session?.user?.degreeId) return alert('No degree ID found')
    const courseInfoId: string | undefined =
      info.row.original.courseInfoId ?? info.row.original.partialCourseId
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
            courseRow.partialCourseId === courseInfoId)
      )
      if (typeof courseRow !== 'number' && courseRow) {
        courseRow.grade = grade === '' ? undefined : parseFloat(grade)
      }
      return updatedData
    })
    e.currentTarget.blur()
    updateData({
      degreeId: session.user.degreeId,
      courseInfoId,
      grade: grade === '' ? null : parseFloat(grade),
    })
  }

  if (typeof info.row.original !== 'number' && info.row.original.linkedCourseId)
    return <span className="w-14">{grade}</span>
  return (
    <input
      type="text"
      value={grade ?? ''}
      onChange={(e) => {
        const input = e.target.value
        if (parseFloat(input) > 100) return
        // regex to allow decimals and slashes
        const regex = /^\d*\.?\d*$/
        const divisionRegex = /^(\d+\.?\d*|\d*\.?\d+)\/\d*\.?\d*$/
        if (input.match(regex) || input.match(divisionRegex)) {
          setGrade(input)
        }
      }}
      onFocus={() => {
        setGrade(grade.replace('%', ''))
      }}
      onBlur={() => {
        if (grade === '') return
        setGrade(grade + '%')
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleGradeUpdate(e)
      }}
      className="w-14"
    />
  )
}
export default GradeColumn
