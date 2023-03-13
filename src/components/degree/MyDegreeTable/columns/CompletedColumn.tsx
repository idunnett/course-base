import type { CellContext } from '@tanstack/react-table'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import type { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import type { DegreeTableColumns, UserDegreeCourseUpdateInput } from '../types'

interface Props {
  info: CellContext<number | DegreeTableColumns, boolean>
  updateData: (data: UserDegreeCourseUpdateInput) => void
  setData: Dispatch<SetStateAction<(number | DegreeTableColumns)[]>>
}

const CompletedColumn: FC<Props> = ({ info, updateData, setData }) => {
  const { data: session } = useSession()

  function handleCompletedChange(e: ChangeEvent<HTMLInputElement>) {
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
        courseRow.completed = e.target.checked
      }
      return updatedData
    })

    updateData({
      degreeId: session.user.degreeId,
      courseInfoId,
      completed: e.target.checked,
    })
  }

  return (
    <input
      type="checkbox"
      checked={info.getValue()}
      onChange={handleCompletedChange}
      className="cursor-pointer accent-slate-500"
    />
  )
}
export default CompletedColumn
