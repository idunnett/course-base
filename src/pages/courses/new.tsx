import type { School } from '@prisma/client'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { userSchoolAtom } from '../../atoms'
import NewCourseForm from '../../components/course/NewCourseForm'

const CourseCreate = () => {
  const userSchool = useAtomValue(userSchoolAtom)
  console.log(userSchool)
  const [school, setSchool] = useState<School | null>(null)

  useEffect(() => {
    if (!userSchool) return
    // To avoid hydration issues
    setSchool(userSchool)
  }, [])

  return <NewCourseForm school={school} />
}

export default CourseCreate
