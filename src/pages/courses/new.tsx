import { useAtomValue } from 'jotai'
import { userSchoolAtom } from '../../atoms'
import NewCourseForm from '../../components/course/NewCourseForm'

const CourseCreate = () => {
  const school = useAtomValue(userSchoolAtom)

  return <NewCourseForm school={school} />
}

export default CourseCreate
