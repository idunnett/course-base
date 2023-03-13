import type { isNull } from 'lodash'
import { useSession } from 'next-auth/react'
import { trpc } from '../../../utils/trpc'
import LoadingOrError from '../../common/LoadingOrError'
import Modal from '../../common/Modal'
import FullCourseButton from '../../course/FullCourseButton'

interface Props {
  degreeId: string
  courseInfoIdToLinkTo: string
  setCourseInfoIdToLinkTo: (courseInfoId: string | null) => void
}

const DegreeCourseLinkModal: React.FC<Props> = ({
  degreeId,
  setCourseInfoIdToLinkTo,
}) => {
  const { data: session } = useSession()

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
      onSuccess: (data) => {
        console.log(data)
        setCourseInfoIdToLinkTo(null)
      },
    })

  return (
    <Modal
      title="Link My Course"
      handleClose={() => setCourseInfoIdToLinkTo(null)}
    >
      {myCourses && !isLoading ? (
        <div className="flex flex-col gap-4">
          {myCourses?.map((course) => (
            <FullCourseButton
              key={course.id}
              onClick={() =>
                linkCourseToDegree({
                  degreeId,
                  courseId: course.id,
                  courseInfoId: course.info.id,
                })
              }
              course={course}
            />
          ))}
        </div>
      ) : (
        <LoadingOrError error={error?.message} />
      )}
    </Modal>
  )
}
export default DegreeCourseLinkModal
