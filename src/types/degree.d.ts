import type {
  Degree,
  PartialCourse,
  School,
  SubjectRequirement,
} from '@prisma/client'
import type { subjects } from '../constants'
import type { FullCourse, FullCourseInfo } from './course'

type FullDegree = Omit<Degree, 'requiredCourseIds' | 'schoolId'> & {
  requiredCourses: FullCourseInfo[]
  partialCourses: PartialCourse[]
  subjectRequirements: SubjectRequirement[]
  school: School
}

type CreateDegreeFormData = {
  name: string
  degreeYears: string
  credits: string
  admissionYear: string
  school: School | null
  requiredCourses: Array<FullCourse | PartialCourse>
  subjectRequirements: Array<PartialSubjectRequirement>
}

type CreateSubjectRequirement = {
  subject: string[]
  year: string
  credits: string
  orHigher: boolean = false
}

type Subject = typeof subjects[keyof typeof subjects]
