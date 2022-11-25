import { Course, School, Segment } from '@prisma/client'

type FullCourse = Course & {
  segments: Segment[]
  school: School
}

type CreateCourseFormData = {
  name: string
  color: string
  year: string
  term: string
  instructor: string
  code: string
  school: School | null
  degreeYear: string | undefined
  creditHours: string
  segments: Omit<Segment, 'id' | 'courseId'>[]
}

type PartialCourse = {
  code: string
  name: string
  creditHours: string
  degreeYear: number
}

type CreateDegreeFormData = {
  name: string
  degreeYears: string
  creditHours: string
  admissionYear: string
  school: School | null
  requiredCourses: Array<FullCourse | PartialCourse>
  subjectRequirements: Array
}
