import { useSetAtom } from 'jotai'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import type { Dispatch, SetStateAction } from 'react'
import { alertAtom } from '../../../atoms'
import type { FullCourse } from '../../../types'
import { trpc } from '../../../utils/trpc'
import LoadingOrError from '../../common/LoadingOrError'
import Modal from '../../common/Modal'
import FullCourseButton from '../../course/FullCourseButton'
import type { DegreeTableColumns } from './types'

interface Props {
  degreeId: string
  courseInfoIdToLinkTo: string
  setCourseInfoIdToLinkTo: (courseInfoId: string | null) => void
  setData: Dispatch<SetStateAction<(number | DegreeTableColumns)[]>>
  refetchMyUserDegreeCourses: () => void
}

const DegreeCourseLinkModal: React.FC<Props> = ({
  degreeId,
  courseInfoIdToLinkTo,
  setCourseInfoIdToLinkTo,
  setData,
  refetchMyUserDegreeCourses,
}) => {
  const { data: session } = useSession()
  const setAlert = useSetAtom(alertAtom)

  const {
    data: myCourses,
    isLoading,
    error,
  } = trpc.course.getMyCourses.useQuery(undefined, {
    enabled: !!session?.user?.id,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const { mutate: linkCourseToDegree } =
    trpc.userDegreeCourse.linkCourse.useMutation({
      onSuccess: () => {
        setAlert({
          type: 'success',
          message: 'Successfully linked course',
        })
        setCourseInfoIdToLinkTo(null)
        refetchMyUserDegreeCourses()
      },
    })

  function handleLinkCourse(course: FullCourse) {
    linkCourseToDegree({
      degreeId,
      courseId: course.id,
      courseInfoId: course.info.id,
    })
    setData((prevData) => {
      const updatedData = _.cloneDeep(prevData)
      const courseRow = updatedData.find(
        (courseRow) =>
          typeof courseRow !== 'number' &&
          (courseRow.courseInfoId === courseInfoIdToLinkTo ||
            courseRow.partialCourseId === courseInfoIdToLinkTo ||
            courseRow.subjectRequirementId === courseInfoIdToLinkTo)
      )
      if (typeof courseRow !== 'number' && courseRow) {
        courseRow.linkedCourseId = course.id
        courseRow.term = course.term
        courseRow.year = course.year
      }
      return updatedData
    })
  }

  return (
    <Modal
      title="Link My Course"
      handleClose={() => setCourseInfoIdToLinkTo(null)}
    >
      {myCourses && !isLoading ? (
        <div className="flex flex-col gap-4">
          {myCourses?.map(
            (course) =>
              course.infoId === courseInfoIdToLinkTo && (
                <FullCourseButton
                  key={course.id}
                  onClick={() => handleLinkCourse(course)}
                  course={course}
                />
              )
          )}
        </div>
      ) : (
        <LoadingOrError error={error?.message} />
      )}
    </Modal>
  )
}
export default DegreeCourseLinkModal
