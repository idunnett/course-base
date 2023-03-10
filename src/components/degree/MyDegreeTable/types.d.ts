type DegreeTableColumns = {
  completed: boolean
  courseCode: string
  link?: string
  name: string
  term: string
  degreeYear: number
  grade?: number
  credits: number
  courseInfoId?: string
  partialCourseId?: string
  linkedCourseId?: string
  color?: string
}

type UserDegreeCourseUpdateInput = {
  degreeId: string
  courseInfoId: string
  term?: string
  grade?: number
  completed?: boolean
}
