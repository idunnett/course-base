import { FC, useState } from 'react'
import type { CourseInfoWithSchool, FullCourseInfo } from '../../types'
import { trpc } from '../../utils/trpc'
import Modal from '../common/Modal'
import CourseDetails from './CourseDetails'

interface Props {
  courseInfo: CourseInfoWithSchool
  handleClose: () => void
}

const CourseModal: FC<Props> = ({ courseInfo, handleClose }) => {
  const [fullCourseInfo, setFullCourseInfo] = useState<FullCourseInfo>({
    courses: [],
    ...courseInfo,
  })

  trpc.courseInfo.variations.useQuery(courseInfo.id, {
    retry: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setFullCourseInfo({
        ...courseInfo,
        courses: data,
      })
    },
  })

  return (
    <Modal handleClose={handleClose}>
      <CourseDetails courseInfo={fullCourseInfo} />
    </Modal>
  )
}

export default CourseModal
