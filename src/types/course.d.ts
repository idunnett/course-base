import type { Course, School, Segment, PartialCourse } from '@prisma/client'

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
  credits: string
  segments: Omit<Segment, 'id' | 'courseId'>[]
}

type CreatePartialCourse = {
  code: string
  name: string
  credits: string
  degreeYear: number
}
