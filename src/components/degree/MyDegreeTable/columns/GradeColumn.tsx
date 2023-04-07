import type { CellContext } from '@tanstack/react-table'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import type { DegreeTableColumns, UserDegreeCourseUpdateInput } from '../types'

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
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const val = info.getValue()
    if (val) {
      let valString = val.toString()
      if (!isFocused) valString += '%'
      setGrade(valString)
    } else setGrade('')
  }, [info, isFocused])

  function handleGradeUpdate() {
    if (info.getValue() === parseFloat(grade)) return

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
        courseRow.grade = grade === '' ? undefined : parseFloat(grade)
      }
      return updatedData
    })
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
        if (input.match(regex) || input.match(divisionRegex)) setGrade(input)
      }}
      onFocus={() => {
        setIsFocused(true)
        setGrade(grade.replace('%', ''))
      }}
      onBlur={() => {
        setIsFocused(false)
        handleGradeUpdate()
        if (grade === '') return
        if (!grade.includes('%')) setGrade(grade + '%')
      }}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      className="w-14"
    />
  )
}
export default GradeColumn
