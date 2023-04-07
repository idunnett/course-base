import { useSetAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import type { Dispatch, SetStateAction } from 'react'
import { alertAtom } from '../../../atoms'
import type { FullCourse } from '../../../types'
import { trpc } from '../../../utils/trpc'
import Modal from '../../common/Modal'
import FullCourseButton from '../../course/FullCourseButton'
import type { DegreeTableColumns } from './types'
import _ from 'lodash'
import { RiLoader5Line } from 'react-icons/ri'

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

  const { data: myLinkableCourses, isLoading } =
    trpc.course.getMyCoursesByInfoId.useQuery(courseInfoIdToLinkTo, {
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
      {myLinkableCourses && !isLoading ? (
        myLinkableCourses.length > 0 ? (
          <div className="flex flex-col gap-4">
            {myLinkableCourses?.map(
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
          <div className="flex h-32 w-full items-center justify-center">
            <p className="text-center dark:text-white">
              You have no courses that match this requirement.
            </p>
          </div>
        )
      ) : (
        <div className="flex h-32 w-full items-center justify-center">
          <RiLoader5Line className="animate-spin dark:text-white" />
        </div>
      )}
    </Modal>
  )
}
export default DegreeCourseLinkModal
