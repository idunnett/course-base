import type {
  Degree,
  PartialCourse,
  School,
  SubjectRequirement,
} from '@prisma/client'
import type { subjects } from '../constants'
import type { FullCourse } from './course'

type FullDegree = Omit<Degree, 'requiredCourseIds' | 'schoolId'> & {
  requiredCourses: FullCourse[]
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
