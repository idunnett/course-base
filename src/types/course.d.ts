import type { Course, CourseInfo, School, Segment } from '@prisma/client'

type FullCourseWithVariations = {
  school: School
  info: CourseInfo & {
    courses: Course[]
  }
}

type FullCourse = Course & {
  segments: Segment[]
  info: Omit<CourseInfo, 'schoolId'> & {
    school: School
  }
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
