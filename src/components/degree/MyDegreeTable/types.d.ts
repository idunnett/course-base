import type { Term } from '@prisma/client'

export type DegreeTableColumns = {
  completed: boolean
  courseCode: string
  link?: string
  name: string
  degreeYear: number
  term?: Term
  year?: number
  grade?: number
  credits: number
  courseInfoId?: string
  partialCourseId?: string
  subjectRequirementId?: string
  linkedCourseId?: string
  color?: string
}

export type UserDegreeCourseUpdateInput = {
  degreeId: string
  courseInfoId: string
  term?: Term | null
  grade?: number | null
  year?: number | null
  completed?: boolean
}
