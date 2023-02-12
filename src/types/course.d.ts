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
  _count: { users: number }
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

type CourseInfoWithSchool = CourseInfo & {
  school: School
}

type FullCourseInfo = CourseInfo & {
  courses: (Course & {
    segments: Segment[]
    _count: { users: number }
  })[]
  school: School
}
