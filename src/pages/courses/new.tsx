import { School } from '@prisma/client'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { schoolAtom } from '../../atoms'
import NewCourseForm from '../../components/course/NewCourseForm'

const CourseCreate = () => {
  const currentSchool = useAtomValue(schoolAtom)
  const [school, setSchool] = useState<School | null>(null)

  useEffect(() => {
    // To avoid hydration issues
    setSchool(currentSchool)
  }, [])

  return <NewCourseForm school={school} />
}

export default CourseCreate
