import type { CellContext } from '@tanstack/react-table'
import { useSetAtom } from 'jotai'
import _ from 'lodash'
import Link from 'next/link'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { RiExternalLinkLine, RiLink, RiLinkUnlink } from 'react-icons/ri'
import { alertAtom } from '../../../../atoms'
import { trpc } from '../../../../utils/trpc'
import DegreeCourseLinkModal from '../DegreeCourseLinkModal'
import type { DegreeTableColumns } from '../types'

interface Props {
  info: CellContext<number | DegreeTableColumns, string | undefined>
  degreeId: string
  refetchMyUserDegreeCourses: () => void
  setData: Dispatch<SetStateAction<(number | DegreeTableColumns)[]>>
}

const LinkColumn: React.FC<Props> = ({
  info,
  degreeId,
  refetchMyUserDegreeCourses,
  setData,
}) => {
  const row = info.row.original
  const setAlert = useSetAtom(alertAtom)
  const [courseInfoIdToLinkTo, setCourseInfoIdToLinkTo] = useState<
    string | null
  >(null)

  const { mutate: unlinkCourse } =
    trpc.userDegreeCourse.unlinkCourse.useMutation({
      onSuccess: () => {
        setAlert({
          type: 'success',
          message: 'Successfully unlinked course',
        })
        refetchMyUserDegreeCourses()
      },
    })

  function handleUnlinkCourse() {
    if (typeof row === 'number') return
    if (!row.courseInfoId) return alert('No course info id found')
    unlinkCourse({ degreeId, courseInfoId: row.courseInfoId })
    setData((prevData) => {
      const updatedData = _.cloneDeep(prevData)
      const courseRow = updatedData.find(
        (courseRow) =>
          typeof courseRow !== 'number' &&
          (courseRow.courseInfoId === row.courseInfoId ||
            courseRow.partialCourseId === row.courseInfoId ||
            courseRow.subjectRequirementId === row.courseInfoId)
      )
      if (typeof courseRow !== 'number' && courseRow) {
        courseRow.linkedCourseId = undefined
        courseRow.grade = undefined
        courseRow.term = undefined
        courseRow.year = undefined
      }
      return updatedData
    })
  }

  if (typeof row === 'number') return null
  return (
    <>
      {row.courseInfoId && row.linkedCourseId ? (
        <div className="flex gap-1">
          <Link
            href={`/my/courses/${row.linkedCourseId}`}
            className="pointer-cursor group relative flex w-full items-center justify-center"
          >
            <RiExternalLinkLine />
            <span className="tooltip bottom-full left-1/2 mb-1 origin-bottom -translate-x-1/2">
              Go to course
            </span>
          </Link>
          <button className="group relative" onClick={handleUnlinkCourse}>
            <RiLinkUnlink />
            <span className="tooltip bottom-full left-1/2 mb-1 origin-bottom -translate-x-1/2">
              Unlink
            </span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCourseInfoIdToLinkTo(row.courseInfoId || null)}
          className="pointer-cursor flex w-full items-center justify-center"
        >
          <RiLink />
        </button>
      )}
      {courseInfoIdToLinkTo && (
        <DegreeCourseLinkModal
          degreeId={degreeId}
          courseInfoIdToLinkTo={courseInfoIdToLinkTo}
          setCourseInfoIdToLinkTo={setCourseInfoIdToLinkTo}
          setData={setData}
          refetchMyUserDegreeCourses={refetchMyUserDegreeCourses}
        />
      )}
    </>
  )
}
export default LinkColumn
